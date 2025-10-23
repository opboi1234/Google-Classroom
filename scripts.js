// Page management
let currentPage = 'login';

// Intercept popup attempts from CloudMoon iframe
window.addEventListener('message', function(event) {
    // Check if message is from CloudMoon iframe trying to open a new window
    console.log('Message received:', event.data);
    
    // If the message contains a URL that should be loaded in the iframe
    if (typeof event.data === 'string' && event.data.includes('http')) {
        const cloudmoonFrame = document.getElementById('cloudmoonFrame');
        if (cloudmoonFrame && currentPage === 'cloudmoon') {
            console.log('Redirecting popup URL to iframe:', event.data);
            cloudmoonFrame.src = event.data;
        }
    }
});

// Override window.open for CloudMoon iframe (inject this into iframe if possible)
const originalWindowOpen = window.open;
window.open = function(url, target, features) {
    console.log('window.open intercepted:', url);
    
    // If we're on CloudMoon page, redirect to iframe instead
    if (currentPage === 'cloudmoon' && url) {
        const cloudmoonFrame = document.getElementById('cloudmoonFrame');
        if (cloudmoonFrame) {
            cloudmoonFrame.src = url;
            return null; // Prevent actual popup
        }
    }
    
    // Otherwise use original window.open
    return originalWindowOpen.call(window, url, target, features);
};

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
    document.getElementById('cloudmoonPage').style.display = 'none';
   
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
        case 'cloudmoon':
            document.getElementById('cloudmoonPage').style.display = 'block';
            // Load CloudMoon iframe
            const cloudmoonFrame = document.getElementById('cloudmoonFrame');
            if (!cloudmoonFrame.src || cloudmoonFrame.src === 'about:blank') {
                cloudmoonFrame.src = 'https://web.cloudmoonapp.com/';
            }
            
            // Try to inject popup interceptor into iframe (may be blocked by CORS)
            cloudmoonFrame.onload = function() {
                try {
                    const iframeWindow = cloudmoonFrame.contentWindow;
                    
                    // Inject script to intercept window.open in iframe
                    const script = iframeWindow.document.createElement('script');
                    script.textContent = `
                        (function() {
                            const originalOpen = window.open;
                            window.open = function(url, target, features) {
                                console.log('Intercepted popup in iframe:', url);
                                // Send message to parent window
                                window.parent.postMessage(url, '*');
                                return null; // Prevent popup
                            };
                        })();
                    `;
                    iframeWindow.document.head.appendChild(script);
                    console.log('Successfully injected popup interceptor into CloudMoon iframe');
                } catch (e) {
                    console.log('Could not inject script into iframe (CORS restriction):', e.message);
                    console.log('Popup interception may not work for cross-origin iframes');
                }
            };
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
    // Check if input is a games.crazygames.com URL
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
    // Treat as game name
    else {
        const formattedGameName = input.replace(/\s+/g, '-').toLowerCase();
        newSrc = `https://games.crazygames.com/en_US/${formattedGameName}/index.html`;
        gameTitle = input;
    }
   
    // Update the iframe source
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.src = newSrc;
   
    // Update the game title display
    document.getElementById('currentGame').textContent = gameTitle;
   
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
    
    // Add loading detection for CloudMoon iframe
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
console.log('%c919 - CloudMoon Gaming', 'color: #4fc3f7; font-size: 12px;');
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
