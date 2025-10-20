// Page management
let currentPage = 'login';

// Check access code and show appropriate page
function checkCode() {
    const code = document.getElementById('accessCode').value.trim();
    const errorMessage = document.getElementById('errorMessage');
   
    switch(code) {
        case '918':
            showPage('launcher');
            break;
        case '819':
            showPage('growden');
            break;
        case '818':
            showPage('roblox');
            break;
        default:
            errorMessage.textContent = 'Invalid code. Please try again.';
            setTimeout(() => {
                errorMessage.textContent = '';
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
            document.getElementById('accessCode').focus();
            break;
        case 'launcher':
            document.getElementById('launcherPage').style.display = 'block';
            break;
        case 'growden':
            document.getElementById('growdenPage').style.display = 'block';
            break;
        case 'roblox':
            document.getElementById('robloxPage').style.display = 'block';
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
        alert('Please enter a game name or URL');
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
            alert('Invalid URL format. Please check the URL and try again.');
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
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Focus on access code input
    document.getElementById('accessCode').focus();
   
    // Set initial game title
    document.getElementById('currentGame').textContent = 'Ragdoll Archers';
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
