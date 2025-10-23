<script>
document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------
    // ✅ Utility functions
    // ---------------------------

    function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.fullscreen-container, .page').forEach(el => el.style.display = 'none');
        const target = document.getElementById(pageId);
        if (target) target.style.display = 'block';

        // Refresh iframes when showing a page
        const growdenFrame = document.getElementById('growdenFrame');
        const robloxFrame = document.getElementById('robloxFrame');

        switch (pageId) {
            case 'growdenPage':
                if (growdenFrame) growdenFrame.src = growdenFrame.src;
                break;
            case 'robloxPage':
                if (robloxFrame) robloxFrame.src = robloxFrame.src;
                break;
        }
    }

    function showLogin() {
        showPage('loginPage');
    }

    // ---------------------------
    // ✅ Access Codes
    // ---------------------------

    function checkCode() {
        const code = document.getElementById('accessCode').value.trim();
        const loginError = document.getElementById('loginError');

        if (!code) {
            loginError.textContent = 'Please enter a code.';
            loginError.style.display = 'block';
            shakeElement(document.getElementById('accessCode'));
            return;
        }

        switch (code) {
            case '918': // Roblox
                console.log('%c918 - Roblox', 'color: #f6b26b; font-size: 12px;');
                showPage('robloxPage');
                break;
            case '819': // Growden
                console.log('%c819 - 🌱 Growden.io', 'color: #4fc3f7; font-size: 12px;');
                showPage('growdenPage');
                break;
            case '818': // Game
                console.log('%c818 - Game Page', 'color: #93c47d; font-size: 12px;');
                showPage('gamePage');
                break;
            default:
                loginError.textContent = 'Invalid code. Try again.';
                loginError.style.display = 'block';
                shakeElement(document.getElementById('accessCode'));
        }
    }

    // ---------------------------
    // ✅ Launch Games
    // ---------------------------

    function launchGame() {
        const gameName = document.getElementById('gameName').value.trim();
        const frame = document.getElementById('gameFrame');

        if (!gameName) {
            alert('Please enter a game name first.');
            return;
        }

        const base = 'https://games.crazygames.com/en_US/';
        frame.src = base + encodeURIComponent(gameName) + '/index.html';
        frame.parentElement.style.display = 'block';
        showPage('gamePage');
    }

    // ---------------------------
    // ✅ Effects
    // ---------------------------

    function shakeElement(el) {
        if (!el) return;
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
    }

    // ---------------------------
    // ✅ Event Listeners
    // ---------------------------

    const accessInput = document.getElementById('accessCode');
    const gameInput = document.getElementById('gameName');

    if (accessInput) {
        accessInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') checkCode();
        });
        accessInput.addEventListener('focus', function() { this.select(); });
    }

    if (gameInput) {
        gameInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') launchGame();
        });
        gameInput.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        gameInput.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // ---------------------------
    // ✅ Iframe Load Logging
    // ---------------------------

    function addIframeEvents(id, name) {
        const frame = document.getElementById(id);
        if (!frame) return;
        frame.addEventListener('load', () => console.log(`✅ ${name} loaded`));
        frame.addEventListener('error', () => console.error(`❌ Failed to load ${name}`));
    }

    addIframeEvents('gameFrame', 'Game');
    addIframeEvents('robloxFrame', 'Roblox');
    addIframeEvents('growdenFrame', 'Growden.io');

    // ---------------------------
    // ✅ Keyboard Shortcuts
    // ---------------------------

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') showLogin();
    });

    // ---------------------------
    // ✅ Add shake animation CSS dynamically
    // ---------------------------

    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.3s;
        }
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
});
</script>

