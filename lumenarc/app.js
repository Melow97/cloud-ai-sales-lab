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
  ,stillwater: ['MIRA PREMIERE · 98% MATCH', 'Still / Water', 'A cartographer returns to the coast she left behind and finds a map that should not exist.']
  ,relay: ['SERIES · 61% WATCHED', 'The Relay', 'A message moves through seven hands before anyone realizes it was meant for them.']
  ,opal: ['FILM · 94% MATCH', 'Opal House', 'A luminous family story set in a house that remembers every room.']
  ,terra: ['DOCUMENTARY · 84% WATCHED', 'Terra Incognita', 'A patient field study of the places we only find when we stop looking for them.']
  ,after: ['SERIES · 92% MATCH', 'After Night', 'The city stays awake long after its lights go out.']
  ,night: ['91% MATCH', 'Night Archive', 'Soft sci-fi for a late hour.']
  ,bluehour: ['89% MATCH', 'Blue Hour', 'A little mystery, a lot of sky.']
  ,signal: ['87% MATCH', 'Signal Loss', 'Do not adjust the picture.']
};

function showPage(name) {
  pages.forEach(page => page.classList.toggle('is-visible', page.id === `${name}-page`));
  navButtons.forEach(button => button.classList.toggle('is-active', button.dataset.nav === name || (name === 'mira' && button.dataset.nav === 'apps')));
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
  if (button.dataset.app === 'Mira') {
    showPage('mira');
    window.setTimeout(() => document.querySelector('#mira-search')?.focus(), 120);
    return;
  }
  if (button.dataset.app === 'Privacy') {
    showToast('Private Mode: no ads, analytics, or network calls');
    return;
  }
  showToast(`${button.dataset.app} is ready to open`);
}));
document.querySelectorAll('.mira-filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.mira-filter').forEach(filter => filter.classList.toggle('is-active', filter === button));
  const filter = button.dataset.filter;
  document.querySelectorAll('.mira-card').forEach(card => { card.hidden = filter !== 'all' && card.dataset.genre !== filter; });
}));
document.querySelector('#mira-search')?.addEventListener('input', event => {
  const query = event.target.value.toLowerCase().trim();
  document.querySelectorAll('.mira-card').forEach(card => { card.hidden = query && !card.dataset.title.toLowerCase().includes(query); });
});
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
