(function() {
    'use strict';

    // Podcast Player Class
    class PodcastPlayer {
        constructor(audioUrl, elementId) {
            this.audioUrl = audioUrl;
            this.elementId = elementId;
            this.audio = new Audio(audioUrl);
            this.currentTime = 0;

            // Load saved playback position
            this.loadPlaybackPosition();

            // Setup the player UI
            this.setupPlayerUI();
            this.addEventListeners();
            this.trackPageViews();
        }

        setupPlayerUI() {
            const playerContainer = document.getElementById(this.elementId);
            playerContainer.innerHTML = `
                <button id=\"playBtn\">Play</button>
                <button id=\"pauseBtn\">Pause</button>
                <button id=\"stopBtn\">Stop</button>
                <span id=\"currentTime\">00:00</span>
                <span id=\"duration\">00:00</span>
            `;
        }

        addEventListeners() {
            document.getElementById('playBtn').addEventListener('click', () => this.play());
            document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
            document.getElementById('stopBtn').addEventListener('click', () => this.stop());
            this.audio.addEventListener('timeupdate', () => this.updateCurrentTime());
            this.audio.addEventListener('ended', () => this.stop());
        }

        play() {
            this.audio.play().catch(error => this.handleError(error));
            this.savePlaybackPosition();
        }

        pause() {
            this.audio.pause();
            this.savePlaybackPosition();
        }

        stop() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.updateCurrentTime();
            this.savePlaybackPosition();
        }

        updateCurrentTime() {
            this.currentTime = this.audio.currentTime;
            document.getElementById('currentTime').textContent = this.formatTime(this.currentTime);
            this.savePlaybackPosition();
        }

        loadPlaybackPosition() {
            const savedTime = localStorage.getItem(`podcastPlayer_${this.audioUrl}`);
            if (savedTime) {
                this.audio.currentTime = parseFloat(savedTime);
            }
        }

        savePlaybackPosition() {
            localStorage.setItem(`podcastPlayer_${this.audioUrl}`, this.audio.currentTime);
        }

        trackPageViews() {
            // Use analytics service to track the page view
            console.log('Tracking page view for Podcast Player');
        }

        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }

        handleError(error) {
            console.error('An error occurred:', error);
            alert('An error occurred while trying to play the podcast. Please try again later.');
        }
    }

    // Example usage: Initialize the podcast player
    window.onload = function() {
        new PodcastPlayer('https://your-podcast-url.com/podcast.mp3', 'podcast-player');
    };
})();
