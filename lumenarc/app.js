const navButtons = [...document.querySelectorAll('[data-nav]')];
const pages = [...document.querySelectorAll('.page')];
const toast = document.querySelector('#toast');
const dialog = document.querySelector('#detail-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogKicker = document.querySelector('#dialog-kicker');
let toastTimer;

const details = {
  ora: ['LUMENARC PREMIERE', 'ORA: The Last Garden', 'A quiet sci-fi mystery about the final green place on a moon-sized station.'],
  glassline: ['SERIES · 42% MATCH', 'Glassline: Heat Index', 'A city made of mirrors, and the people learning where the heat gets trapped.'],
  fieldnotes: ['DOCU-SERIES · 18% MATCH', 'Field Notes: Wild Coast', 'A slow, salt-air journey along the edge of the map.'],
  minute: ['DOCUMENTARY · 63% MATCH', 'The One Minute Story', 'Twelve tiny films about people who changed one small thing.'],
  loop: ['SERIES · 88% MATCH', 'Loop: Back Home', 'Sometimes the long way round is the way that gets you there.'],
  salt: ['98% MATCH', 'Salt / Signal', 'A cool mystery for a long night, with a little static in the walls.'],
  slow: ['94% MATCH', 'Slow Bloom', 'A soft, patient film about finding color in an ordinary week.'],
  north: ['91% MATCH', 'North of Here', 'Take the scenic route. There is more weather that way.']
};

function showPage(name) {
  pages.forEach(page => page.classList.toggle('is-visible', page.id === `${name}-page`));
  navButtons.forEach(button => button.classList.toggle('is-active', button.dataset.nav === name));
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function openDetail(key) {
  const detail = details[key];
  if (!detail) return;
  dialogKicker.textContent = detail[0];
  dialogTitle.textContent = detail[1];
  dialogDescription.textContent = detail[2];
  document.querySelector('#dialog-play').dataset.play = detail[1];
  dialog.showModal();
}

navButtons.forEach(button => button.addEventListener('click', () => showPage(button.dataset.nav)));
document.querySelectorAll('[data-modal]').forEach(item => {
  item.addEventListener('click', event => {
    if (event.target.closest('button[data-play]')) return;
    openDetail(item.dataset.modal);
  });
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDetail(item.dataset.modal); }
  });
});
document.querySelectorAll('[data-play]').forEach(button => button.addEventListener('click', event => {
  event.stopPropagation();
  showToast(`Opening ${button.dataset.play}…`);
  if (dialog.open) dialog.close();
}));
document.querySelectorAll('[data-app]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.app === 'Privacy') {
    showToast('Private Mode: no ads, analytics, or network calls');
    return;
  }
  showToast(`${button.dataset.app} is ready to open`);
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

function updateClock() {
  const now = new Date();
  document.querySelector('#clock').textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false});
}
updateClock();
setInterval(updateClock, 30000);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog.open) dialog.close();
  if (dialog.open) return;
  const focusables = [...document.querySelectorAll('.page.is-visible [data-focusable], .page.is-visible [tabindex="0"], .page.is-visible button')];
  const current = document.activeElement;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    const index = focusables.indexOf(current);
    if (index >= 0 && focusables[index + 1]) { focusables[index + 1].focus(); event.preventDefault(); }
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    const index = focusables.indexOf(current);
    if (index > 0) { focusables[index - 1].focus(); event.preventDefault(); }
  }
});
