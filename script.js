const stations = [
    { id: 1, title: "Flood of 1896", audio: "audio1.mp3" },
    { id: 2, title: "Pontoon Bridge", audio: "audio2.mp3" },
    { id: 3, title: "Milwaukee Road", audio: "audio3.mp3" },
    { id: 4, title: "North McGregor/Marquette", audio: "audio4.mp3" },
    { id: 5, title: "Businesses Through Time", audio: "audio5.mp3" },
    { id: 6, title: "Did You Know?", audio: "audio6.mp3" }
];

const board = document.getElementById('puzzle-board');
const audioPlayer = document.getElementById('station-audio');
const stationTitle = document.getElementById('station-title');
const warningArea = document.getElementById('private-browser-warning');
const nextLink = document.getElementById('next-station-link');
const resetBtn = document.getElementById('reset-btn');

// Array to hold unlocked state in case localStorage is blocked entirely
let temporaryMemory = [false, false, false, false, false, false];

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.id = `piece-${i}`;

        const img = document.createElement('img');
        img.src = `piece-${i}.jpg`; 
        img.alt = `Puzzle piece ${i + 1}`;

        piece.appendChild(img);
        board.appendChild(piece);
    }
}

function loadProgress() {
    // 1. First, check if the URL itself contains past progress (The URL Backup Method)
    const urlParams = new URLSearchParams(window.location.search);
    const backupData = urlParams.get('unlocked'); // looks like "0,1,2"
    
    if (backupData) {
        const piecesToUnlock = backupData.split(',');
        piecesToUnlock.forEach(indexStr => {
            const idx = parseInt(indexStr);
            if (!isNaN(idx) && idx >= 0 && idx < 6) {
                temporaryMemory[idx] = true;
                try { localStorage.setItem(`unlocked-${idx}`, 'true'); } catch(e){}
            }
        });
    }

    // 2. Next, check standard localStorage as a secondary fallback
    for (let i = 0; i < 6; i++) {
        try {
            if (localStorage.getItem(`unlocked-${i}`) === 'true') {
                temporaryMemory[i] = true;
            }
        } catch(e) {}
        
        // Physically light up the pieces that are true in our combined tracking memory
        if (temporaryMemory[i] === true) {
            const el = document.getElementById(`piece-${i}`);
            if(el) el.classList.add('piece-revealed');
        }
    }
}

function initStation() {
    const urlParams = new URLSearchParams(window.location.search);
    const stationId = parseInt(urlParams.get('station'));

    if (stationId >= 1 && stationId <= 6) {
        const station = stations[stationId - 1];
        stationTitle.innerText = station.title;
        audioPlayer.src = station.audio;
        
        audioPlayer.onplay = () => {
            const pieceIndex = stationId - 1;
            temporaryMemory[pieceIndex] = true;
            
            try {
                localStorage.setItem(`unlocked-${pieceIndex}`, 'true');
            } catch (e) {
                console.log("Private browsing tracking backup engaged.");
            }
            
            const el = document.getElementById(`piece-${pieceIndex}`);
            if(el) el.classList.add('piece-revealed');
            
            loadProgress();
            updateMagicLink(stationId);
            checkVictory();
        };
    }
}

// Generates the secret link containing history strings
function updateMagicLink(currentStationId) {
    if (currentStationId >= 6) {
        warningArea.style.display = 'none'; // No next station after 6
        return;
    }
    
    // Find all currently unlocked indices
    let unlockedList = [];
    for (let i = 0; i < 6; i++) {
        if (temporaryMemory[i] === true) unlockedList.push(i);
    }
    
    const nextStationId = currentStationId + 1;
    const baseURl = window.location.origin + window.location.pathname;
    
    // Create the magic text string
    nextLink.href = `${baseURl}?station=${nextStationId}&unlocked=${unlockedList.join(',')}`;
    warningArea.style.display = 'block'; // Reveal the button to the user
}

function checkVictory() {
    let count = 0;
    for (let i = 0; i < 6; i++) {
        if (temporaryMemory[i] === true) count++;
    }
    if (count === 6) {
        warningArea.style.display = 'none';
        setTimeout(() => {
            alert("Congratulations! You found all 6 puzzle pieces and completed the museum quest! 🎉");
        }, 1200);
    }
}

// Reset everything back to start
resetBtn.onclick = () => {
    if(confirm("Are you sure you want to clear your puzzle progress and start over?")) {
        try { localStorage.clear(); } catch(e){}
        temporaryMemory = [false, false, false, false, false, false];
        window.location.href = window.location.origin + window.location.pathname + "?station=1";
    }
};

createBoard();
loadProgress();
initStation();

