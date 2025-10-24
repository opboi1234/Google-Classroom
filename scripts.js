// ============================
// CONFIG: CloudMoon behavior
// 'capture' => load the URL that tries to open in a new tab into the iframe
// 'blank'   => force popups to open about:blank (prevents leaving the page)
// ============================
const CLOUDMOON_MODE = 'capture'; // change to 'blank' if you prefer

// Access Codes
const CODES = {
  LAUNCHER: '918',
  GROWDEN:  '819',
  ROBLOX:   '818',
  CLOUDMOON:'919',
};

// State
let currentPage = 'login';

// Helper
const $ = (id) => document.getElementById(id);

// ---- Intercept window.open only on CloudMoon page ----
(function interceptWindowOpen() {
  const originalOpen = window.open;

  window.open = function(url = '', target = '_blank', features = '') {
    if (currentPage === 'cloudmoon') {
      if (CLOUDMOON_MODE === 'capture') {
        console.log('🌙 Intercepted popup (capture):', url);
        const frame = $('cloudmoonFrame');
        if (frame && url) frame.src = url;
        return { closed:false, close(){}, focus(){}, blur(){}, postMessage(){} };
      }
      if (CLOUDMOON_MODE === 'blank') {
        console.log('🌙 Intercepted popup (blank) → about:blank');
        return originalOpen.call(window, 'about:blank', target, features);
      }
    }
    return originalOpen.call(window, url, target, features);
  };
})();

// ---- Page switching ----
function showPage(page) {
  currentPage = page;

  // Hide all
  ['loginPage','launcherPage','growdenPage','robloxPage','cloudmoonPage']
    .forEach(id => { const el = $(id); if (el) el.style.display = 'none'; });

  switch (page) {
    case 'login':
      $('loginPage').style.display = 'block';
      $('accessCode').value = '';
      $('accessCode').focus();
      break;

    case 'launcher':
      $('launcherPage').style.display = 'block';
      $('currentGame').textContent = 'Ragdoll Archers';
      $('gameFrame').src = 'https://games.crazygames.com/en_US/ragdoll-archers/index.html';
      $('gameName').focus();
      break;

    case 'growden':
      $('growdenPage').style.display = 'block';
      $('growdenFrame').src = 'https://growden.io/';
      break;

    case 'roblox':
      $('robloxPage').style.display = 'block';
      $('robloxFrame').src = 'https://www.myandroid.org/playonline/androidemulator.php';
      break;

    case 'cloudmoon':
      $('cloudmoonPage').style.display = 'block';
      $('cloudmoonFrame').src = 'https://web.cloudmoonapp.com/';
      console.log('🎮 CloudMoon ready. Interceptor mode:', CLOUDMOON_MODE);
      break;
  }
}

function showLogin() { showPage('login'); }

// ---- Login logic ----
function checkCode() {
  const code = $('accessCode').value.trim();
  const error = $('errorMessage');

  if (code === CODES.LAUNCHER) {
    error.textContent = '';
    showPage('launcher');
  } else if (code === CODES.GROWDEN) {
    error.textContent = '';
    showPage('growden');
  } else if (code === CODES.ROBLOX) {
    error.textContent = '';
    showPage('roblox');
  } else if (code === CODES.CLOUDMOON) {
    error.textContent = '';
    showPage('cloudmoon');
  } else {
    error.textContent = '❌ Invalid code. Please try again.';
    $('accessCode').style.animation = 'shake 0.5s';
    setTimeout(() => { $('accessCode').style.animation = ''; error.textContent = ''; }, 1600);
  }
}

// ---- CrazyGames launcher ----
function launchGame() {
  const inputEl = $('gameName');
  const input = (inputEl.value || '').trim();
  if (!input) {
    alert('⚠️ Please enter a game name or URL.');
    inputEl.focus();
    return;
  }

  let url = '';
  let title = '';

  // Case 1: crazygames.com/game/<slug>
  if (input.includes('crazygames.com/game/')) {
    try {
      const u = new URL(input);
      const slug = u.pathname.split('/').pop();                 // e.g. grow-a-garden---growden-io
      const base = slug.split('---')[0].replace(/-/g, ' ');     // grow a garden
      title = base.replace(/\b\w/g, c => c.toUpperCase());      // Grow A Garden
      const dashed = base.trim().replace(/\s+/g, '-');          // grow-a-garden
      url = `https://games.crazygames.com/en_US/${dashed}/index.html`;
    } catch {
      alert('❌ Invalid CrazyGames URL.');
      return;
    }
  }
  // Case 2: direct games.crazygames.com link
  else if (input.includes('games.crazygames.com')) {
    url = input;
    try {
      const parts = new URL(input).pathname.split('/');
      title = (parts[parts.length - 2] || 'Custom Game')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    } catch {
      title = 'Custom Game';
    }
  }
  // Case 3: plain name
  else {
    const slug = input.toLowerCase().replace(/\s+/g, '-');
    url = `https://games.crazygames.com/en_US/${slug}/index.html`;
    title = input.replace(/\b\w/g, c => c.toUpperCase());
  }

  $('gameFrame').src = url;
  $('currentGame').textContent = title;
  console.log('🎮 Loading:', title, '→', url);
}

// ---- Events ----
document.addEventListener('DOMContentLoaded', () => {
  $('accessCode').focus();

  // Buttons/keys
  $('enterBtn').addEventListener('click', checkCode);
  $('accessCode').addEventListener('keydown', (e) => { if (e.key === 'Enter') checkCode(); });
  $('launchButton').addEventListener('click', launchGame);
  $('gameName').addEventListener('keydown', (e) => { if (e.key === 'Enter') launchGame(); });

  // Back buttons
  document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', showLogin));

  // Initial page
  showLogin();

  // Log helpful info
  console.log('%c🎮 Game Launcher Initialized', 'color:#4fc3f7;font-size:18px;font-weight:bold;');
  console.log('Access Codes → 918: CrazyGames • 919: CloudMoon • 819: Growden • 818: Roblox');
});

// Optional: warn if leaving
window.addEventListener('beforeunload', (e) => {
  if (currentPage !== 'login') { e.preventDefault(); e.returnValue = ''; }
});
