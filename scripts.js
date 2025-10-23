// Page management
let currentPage = 'login';

// Check access code and show appropriate page
function checkCode() {
    const code = document.getElementById('accessCode').value.trim();
    const errorMessage = document.getElementById('errorMessage');
   
    switch(code) {
        case '918':
            showPage('launcher');
            errorMessage.textContent = '';
            break;
        case '819':
            showPage('growden');
            errorMessage.textContent = '';
            break;
        case '818':
            showPage('roblox');
            errorMessage.textContent = '';
            break;
        default:
            errorMessage.textContent = '❌ Invalid code. Please try again.';
            // Shake animation for error
            document.getElementById('accessCode').style.animation = 'shake 0.5s';
            setTimeout(() => {
                errorMessage.textContent = '';
                document.getElementById('accessCode').style.animation = '';
            }, 3000);
    }
}

// Show specific page
function showPage(page) {
    currentPage = page;
   
    // Hide all pages
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('launcherPage').style.display = 'none';
    document.getElementById('growdenPage').style.display = 'none';
    document.getElementById('robloxPage').style.display = 'none';
   
    // Show requested page
    switch(page) {
        case 'login':
            document.getElementById('loginPage').style.display = 'block';
            document.getElementById('accessCode').value = '';
            document.getElementById('accessCode').focus();
            break;
        case 'launcher':
            document.getElementById('launcherPage').style.display = 'block';
            document.getElementById('gameName').focus();
            break;
        case 'growden':
            document.getElementById('growdenPage').style.display = 'block';
            // Reload Growden iframe when page is shown
            const growdenFrame = document.getElementById('growdenFrame');
            growdenFrame.src = growdenFrame.src;
            break;
        case 'roblox':
            document.getElementById('robloxPage').style.display = 'block';
            // Reload Roblox iframe when page is shown
            const robloxFrame = document.getElementById('robloxFrame');
            robloxFrame.src = robloxFrame.src;
            break;
    }
}

// Show login page
function showLogin() {
    showPage('login');
}

// Function to launch a game based on user input
function launchGame() {
    // Get the input value
    const gameInput = document.getElementById('gameName');
    const input = gameInput.value.trim();
   
    // Validate input
    if (!input) {
        alert('⚠️ Please enter a game name or URL');
        gameInput.focus();
        return;
    }
   
    let newSrc;
    let gameTitle;
   
    // Check if input is a CrazyGames URL
    if (input.includes('crazygames.com/game/')) {
        try {
            // Extract game identifier from URL
            const url = new URL(input);
            const pathParts = url.pathname.split('/');
            const gameIdentifier = pathParts[pathParts.length - 1]; // e.g., "grow-a-garden---growden-io"
           
            // Convert to iframe format:
            // 1. Remove everything after --- if it exists
            // 2. Replace hyphens with spaces for title
            // 3. Replace spaces with hyphens for iframe URL
            const gameNameForTitle = gameIdentifier.split('---')[0].replace(/-/g, ' ');
            gameTitle = gameNameForTitle.replace(/\b\w/g, l => l.toUpperCase());
           
            const gameNameForUrl = gameNameForTitle.replace(/\s+/g, '-');
            newSrc = `https://games.crazygames.com/en_US/${gameNameForUrl}/index.html`;
        } catch (e) {
            alert('❌ Invalid URL format. Please check the URL and try again.');
            return;
        }
    }
    // Check if input is a games.crazygames.com URL
    else if (input.includes('games.crazygames.com')) {
        newSrc = input;
        // Extract game name from URL for display
        try {
            const urlParts = new URL(input).pathname.split('/');
            gameTitle = urlParts[urlParts.length - 2] || 'Unknown Game';
            // Format game title: replace hyphens with spaces and capitalize words
            gameTitle = gameTitle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        } catch (e) {
            gameTitle = 'Custom URL';
        }
    }
    // Treat as game name
    else {
        // Format the game name: replace spaces with hyphens and make lowercase
        const formattedGameName = input.replace(/\s+/g, '-').toLowerCase();
       
        // Construct the new iframe source URL
        newSrc = `https://games.crazygames.com/en_US/${formattedGameName}/index.html`;
        gameTitle = input;
    }
   
    // Update the iframe source
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.src = newSrc;
   
    // Update the game title display
    document.getElementById('currentGame').textContent = gameTitle;
   
    // Show loading message
    console.log(`🎮 Loading game: ${gameTitle}`);
    console.log(`📍 URL: ${newSrc}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Focus on access code input
    document.getElementById('accessCode').focus();
   
    // Set initial game title
    document.getElementById('currentGame').textContent = 'Ragdoll Archers';
   
    // Add loading detection for game iframe
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.addEventListener('load', function() {
        console.log('✅ Game loaded successfully');
    });
   
    gameFrame.addEventListener('error', function() {
        console.error('❌ Failed to load game');
        alert('Failed to load the game. Please check the game name and try again.');
    });
   
    // Add loading detection for Roblox iframe
    const robloxFrame = document.getElementById('robloxFrame');
    robloxFrame.addEventListener('load', function() {
        console.log('✅ Roblox cloud gaming loaded');
    });
   
    robloxFrame.addEventListener('error', function() {
        console.error('❌ Failed to load Roblox');
    });
   
    // Add loading detection for Growden iframe
    const growdenFrame = document.getElementById('growdenFrame');
    growdenFrame.addEventListener('load', function() {
        console.log('✅ Growden.io loaded');
    });
   
    growdenFrame.addEventListener('error', function() {
        console.error('❌ Failed to load Growden.io');
    });
});

// Allow Enter key for login
document.getElementById('accessCode').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkCode();
    }
});

// Allow Enter key for game launch
document.getElementById('gameName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        launchGame();
    }
});

// Prevent accidental page navigation
window.addEventListener('beforeunload', function(e) {
    if (currentPage !== 'login') {
        e.preventDefault();
        e.returnValue = '';
        return 'Are you sure you want to leave? Your game progress may be lost.';
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC key to return to login (except when typing in input fields)
    if (event.key === 'Escape' && 
        event.target.tagName !== 'INPUT' && 
        currentPage !== 'login') {
        if (confirm('Return to login page?')) {
            showLogin();
        }
    }
   
    // F11 for fullscreen toggle (info message)
    if (event.key === 'F11') {
        console.log('💡 Tip: Press F11 to toggle fullscreen mode');
    }
});

// Console welcome message
console.log('%c🎮 Game Launcher Initialized', 'color: #4fc3f7; font-size: 20px; font-weight: bold;');
console.log('%cAccess Codes:', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
console.log('%c918 - CrazyGames Launcher', 'color: #4fc3f7; font-size: 12px;');
console.log('%c819 - Growden.io', 'color: #4fc3f7; font-size: 12px;');
console.log('%c818 - Roblox Cloud Gaming', 'color: #4fc3f7; font-size: 12px;');
console.log('%c\nPress ESC to return to login', 'color: #888; font-size: 10px;');

// Helper function to check if iframe is accessible (for debugging)
function checkIframeStatus(iframeId) {
    const iframe = document.getElementById(iframeId);
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
            console.log(`✅ ${iframeId} is accessible`);
            return true;
        }
    } catch (e) {
        console.log(`⚠️ ${iframeId} is blocked by CORS (this is normal for external sites)`);
        return false;
    }
}

// Auto-clear access code on focus
document.getElementById('accessCode').addEventListener('focus', function() {
    this.select();
});

// Add visual feedback for game input
document.getElementById('gameName').addEventListener('focus', function() {
    this.style.transform = 'scale(1.02)';
    this.style.transition = 'transform 0.2s ease';
});

document.getElementById('gameName').addEventListener('blur', function() {
    this.style.transform = 'scale(1)';
});

// Add shake animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

