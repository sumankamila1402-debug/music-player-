const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');

// Song list
const songs = [
    {
        name: 'song1',
        displayName: 'Chill Abstract Future Beat',
        artist: 'Scott Buckley',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder MP3
        cover: 'https://placehold.co/180x180/718096/e2e8f0?text=Chill'
    },
    {
        name: 'song2',
        displayName: 'Relaxing Piano Music',
        artist: 'Podington Bear',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder MP3
        cover: 'https://placehold.co/180x180/a0aec0/2d3748?text=Piano'
    },
    {
        name: 'song3',
        displayName: 'Upbeat Corporate',
        artist: 'Bensound',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder MP3
        cover: 'https://placehold.co/180x180/4a5568/a0aec0?text=Upbeat'
    }
];

let songIndex = 0;
let isPlaying = false;

// Load a song
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    updatePlaylistActiveItem();
}

// Play song
function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
}

// Pause song
function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

// Previous song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Update progress bar & time
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Calculate display for time
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Set duration
    if (duration) {
        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60);
        durationEl.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    } else {
        durationEl.textContent = '0:00'; // Show 0:00 if duration is not available yet
    }
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Set volume
function setVolume() {
    audio.volume = volumeSlider.value;
}

// Create playlist items
function createPlaylist() {
    playlistEl.innerHTML = ''; // Clear existing list
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item', 'flex', 'justify-between', 'items-center', 'py-3', 'cursor-pointer', 'transition', 'duration-200', 'ease-in-out', 'rounded-lg', 'px-3');
        item.setAttribute('data-index', index);
        item.innerHTML = `
            <div>
                <div class="playlist-title">${song.displayName}</div>
                <div class="playlist-artist">${song.artist}</div>
            </div>
            <div class="playlist-duration"></div> <!-- Placeholder for duration -->
        `;
        item.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistEl.appendChild(item);

        // Load duration for each song (can be slow if many songs)
        const tempAudio = new Audio(song.src);
        tempAudio.addEventListener('loadedmetadata', () => {
            const minutes = Math.floor(tempAudio.duration / 60);
            const seconds = Math.floor(tempAudio.duration % 60);
            item.querySelector('.playlist-duration').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        });
    });
}

// Update active playlist item
function updatePlaylistActiveItem() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong); // Play next song when current ends
volumeSlider.addEventListener('input', setVolume);

// Initial load
loadSong(songs[songIndex]);
createPlaylist(); // Populate playlist on load

// Ensure duration is updated when audio metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60);
    durationEl.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
});