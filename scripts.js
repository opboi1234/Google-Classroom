// Page management
let currentPage = 'login';

// Store reference to any popup windows
let popupWindows = [];

// Intercept ALL window.open calls globally
(function() {
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
        console.log('🔒 window.open intercepted:', url, 'Target:', target);
        
        // If we're on CloudMoon page, prevent popup and load in iframe
        if (currentPage === 'cloudmoon' && url) {
            const cloudmoonFrame = document.getElementById('cloudmoonFrame');
            if (cloudmoonFrame) {
                console.log('✅ Redirecting to iframe instead of popup:', url);
                cloudmoonFrame.src = url;
                return {
                    closed: false,
                    close: function() { console.log('Fake popup closed'); },
                    focus: function() { console.log('Fake popup focused'); }
                }; // Return fake window object
            }
        }
        
        // For other cases, allow popup but track it
        const popup = originalWindowOpen.call(window, url, target, features);
        if (popup && currentPage === 'cloudmoon') {
            popupWindows.push(popup);
            console.log('⚠️ Popup opened, attempting to capture URL...');
            
            // Try to get URL and close popup immediately
            setTimeout(() => {
                try {
                    if (popup && !popup.closed) {
                        const popupUrl = popup.location.href;
                        console.log('📍 Captured popup URL:', popupUrl);
                        popup.close();
                        
                        const cloudmoonFrame = document.getElementById('cloudmoonFrame');
                        if (cloudmoonFrame && popupUrl && popupUrl !== 'about:blank') {
                            cloudmoonFrame.src = popupUrl;
                        }
                    }
                } catch (e) {
                    console.log('❌ Could not access popup URL (CORS):', e.message);
                    // Popup is cross-origin, we can't get the URL
                    // Try to close it anyway
                    if (popup && !popup.closed) {
                        popup.close();
                        console.log('🔒 Closed popup without capturing URL');
                    }
                }
            }, 100);
        }
        
        return popup;
    };
})();

// Monitor for popup windows and close them
setInterval(() => {
    if (currentPage === 'cloudmoon') {
        popupWindows.forEach((popup, index) => {
            try {
                if (popup && !popup.closed) {
                    console.log('🔍 Checking popup window...');
                    try {
                        const url = popup.location.href;
                        if (url && url !== 'about:blank') {
                            console.log('✅ Found URL in popup:', url);
                            popup.close();
                            const cloudmoonFrame = document.getElementById('cloudmoonFrame');
                            if (cloudmoonFrame) {
                                cloudmoonFrame.src = url;
                            }
                        }
                    } catch (e) {
                        // CORS - can't access URL, just close it
                        popup.close();
                        console.log('⚠️ Closed cross-origin popup');
                    }
                }
            } catch (e) {
                console.log('Error checking popup:', e.message);
            }
        });
        // Clean up closed popups
        popupWindows = popupWindows.filter(p => p && !p.closed);
    }
}, 500);

// Listen for messages from iframe
window.addEventListener('message', function(event) {
    console.log('📨 Message received:', event.data, 'from:', event.origin);
    
    // Check for URLs in messages
    if (typeof event.data === 'string') {
        // Check if it's a URL
        if (event.data.startsWith('http://') || event.data.startsWith('https://')) {
            const cloudmoonFrame = document.getElementById('cloudmoonFrame');
            if (cloudmoonFrame && currentPage === 'cloudmoon') {
                console.log('✅ Loading URL from message:', event.data);
                cloudmoonFrame.src = event.data;
            }
        }
    }
    
    // Check for object with URL property
    if (typeof event.data === 'object' && event.data !== null) {
        if (event.data.url) {
            const cloudmoonFrame = document.getElementById('cloudmoonFrame');
            if (cloudmoonFrame && currentPage === 'cloudmoon') {
                console.log('✅ Loading URL from message object:', event.data.url);
                cloudmoonFrame.src = event.data.url;
            }
        }
    }
});

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
        case '919':
            showPage('cloudmoon');
            errorMessage.textContent = '';
            break;
        default:
            errorMessage.textContent = '❌ Invalid code. Please try again.';
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
    document.getElementById('cloudmoonPage').style.display = 'none';
   
    // Show requested page
    switch(page) {
        case 'login':
            document.getElementById('loginPage').style.display = 'block';
            document.getElementById('accessCode').value = '';
            document.getElementById('accessCode').focus();
            // Close any open popups when returning to login
            popupWindows.forEach(p => {
                try { if (p && !p.closed) p.close(); } catch(e) {}
            });
            popupWindows = [];
            break;
        case 'launcher':
            document.getElementById('launcherPage').style.display = 'block';
            document.getElementById('gameName').focus();
            break;
        case 'growden':
            document.getElementById('growdenPage').style.display = 'block';
            const growdenFrame = document.getElementById('growdenFrame');
            growdenFrame.src = growdenFrame.src;
            break;
        case 'roblox':
            document.getElementById('robloxPage').style.display = 'block';
            const robloxFrame = document.getElementById('robloxFrame');
            robloxFrame.src = robloxFrame.src;
            break;
        case 'cloudmoon':
            document.getElementById('cloudmoonPage').style.display = 'block';
            const cloudmoonFrame = document.getElementById('cloudmoonFrame');
            
            // Load CloudMoon
            cloudmoonFrame.src = 'https://web.cloudmoonapp.com/';
            
            console.log('🎮 CloudMoon loaded. Popup interception active.');
            console.log('⚠️ Note: Due to CORS, capturing cross-origin popup URLs may not work.');
            console.log('💡 Popups will be automatically closed if detected.');
            break;
    }
}

// Show login page
function showLogin() {
    showPage('login');
}

// Function to launch a game based on user input
function launchGame() {
    const gameInput = document.getElementById('gameName');
    const input = gameInput.value.trim();
   
    if (!input) {
        alert('⚠️ Please enter a game name or URL');
        gameInput.focus();
        return;
    }
   
    let newSrc;
    let gameTitle;
   
    if (input.includes('crazygames.com/game/')) {
        try {
            const url = new URL(input);
            const pathParts = url.pathname.split('/');
            const gameIdentifier = pathParts[pathParts.length - 1];
           
            const gameNameForTitle = gameIdentifier.split('---')[0].replace(/-/g, ' ');
            gameTitle = gameNameForTitle.replace(/\b\w/g, l => l.toUpperCase());
           
            const gameNameForUrl = gameNameForTitle.replace(/\s+/g, '-');
            newSrc = `https://games.crazygames.com/en_US/${gameNameForUrl}/index.html`;
        } catch (e) {
            alert('❌ Invalid URL format. Please check the URL and try again.');
            return;
        }
    }
    else if (input.includes('games.crazygames.com')) {
        newSrc = input;
        try {
            const urlParts = new URL(input).pathname.split('/');
            gameTitle = urlParts[urlParts.length - 2] || 'Unknown Game';
            gameTitle = gameTitle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        } catch (e) {
            gameTitle = 'Custom URL';
        }
    }
    else {
        const formattedGameName = input.replace(/\s+/g, '-').toLowerCase();
        newSrc = `https://games.crazygames.com/en_US/${formattedGameName}/index.html`;
        gameTitle = input;
    }
   
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.src = newSrc;
    document.getElementById('currentGame').textContent = gameTitle;
   
    console.log(`🎮 Loading game: ${gameTitle}`);
    console.log(`📍 URL: ${newSrc}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('accessCode').focus();
    document.getElementById('currentGame').textContent = 'Ragdoll Archers';
   
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.addEventListener('load', function() {
        console.log('✅ Game loaded successfully');
    });
   
    gameFrame.addEventListener('error', function() {
        console.error('❌ Failed to load game');
        alert('Failed to load the game. Please check the game name and try again.');
    });
   
    const robloxFrame = document.getElementById('robloxFrame');
    robloxFrame.addEventListener('load', function() {
        console.log('✅ Roblox cloud gaming loaded');
    });
   
    robloxFrame.addEventListener('error', function() {
        console.error('❌ Failed to load Roblox');
    });
   
    const growdenFrame = document.getElementById('growdenFrame');
    growdenFrame.addEventListener('load', function() {
        console.log('✅ Growden.io loaded');
    });
   
    growdenFrame.addEventListener('error', function() {
        console.error('❌ Failed to load Growden.io');
    });
    
    const cloudmoonFrame = document.getElementById('cloudmoonFrame');
    cloudmoonFrame.addEventListener('load', function() {
        console.log('✅ CloudMoon loaded');
    });
   
    cloudmoonFrame.addEventListener('error', function() {
        console.error('❌ Failed to load CloudMoon');
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
    if (event.key === 'Escape' && 
        event.target.tagName !== 'INPUT' && 
        currentPage !== 'login') {
        if (confirm('Return to login page?')) {
            showLogin();
        }
    }
   
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
console.log('%c919 - CloudMoon Gaming (Popup Interception Active)', 'color: #4fc3f7; font-size: 12px;');
console.log('%c\nPress ESC to return to login', 'color: #888; font-size: 10px;');

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
