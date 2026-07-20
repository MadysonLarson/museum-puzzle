const stations = [
    { id: 1, title: "The Main Exhibit", audio: "assets/audio1.mp3" },
    { id: 2, title: "Ancient Relics", audio: "assets/audio2.mp3" },
    { id: 3, title: "The Fossil Hall", audio: "assets/audio3.mp3" },
    { id: 4, title: "Renaissance Art", audio: "assets/audio4.mp3" },
    { id: 5, title: "The Telescope Wing", audio: "assets/audio5.mp3" },
    { id: 6, title: "The Grand Finale", audio: "assets/audio6.mp3" }
];

const board = document.getElementById('puzzle-board');
const audioPlayer = document.getElementById('station-audio');
const stationTitle = document.getElementById('station-title');

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.id = `piece-${i}`;

        const img = document.createElement('img');
        img.src = `assets/piece-${i}.jpg`; 
        img.alt = `Puzzle piece ${i + 1}`;

        piece.appendChild(img);
        board.appendChild(piece);
    }
}

function loadProgress() {
    for (let i = 0; i < 6; i++) {
        if (localStorage.getItem(`unlocked-${i}`) === 'true') {
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
            localStorage.setItem(`unlocked-${pieceIndex}`, 'true');
            const el = document.getElementById(`piece-${pieceIndex}`);
            if(el) el.classList.add('piece-revealed');
        };
    }
}

createBoard();
loadProgress();
initStation();
