        (function() {
            // --- Configuration & Selectors ---
            const wrapperId = 'englezztrkdon-wrapper';
            const playerClass = 'etd-float-player';
            const trackCardClass = 'etd-track-card';
            const btnPreviewClass = 'etd-btn-preview';
            
            // Elements
            const wrapper = document.getElementById(wrapperId);
            const player = document.getElementById('etd-player');
            const playPauseBtn = document.getElementById('etd-play-pause');
            const closeBtn = document.getElementById('etd-close-player');
            const iconPlay = document.getElementById('icon-play');
            const iconPause = document.getElementById('icon-pause');
            const trackLabel = document.getElementById('etd-track-label');
            const progressFill = document.getElementById('etd-progress-fill');
            const progressWrapper = document.getElementById('etd-progress-wrapper');
            const currentTimeEl = document.getElementById('etd-current-time');
            const durationEl = document.getElementById('etd-duration');
            
            // State
            const audio = new Audio();
            let currentTrackCard = null;
            let isDragging = false; // For seeking

            // --- Functions ---

            // Format seconds to MM:SS
            function formatTime(seconds) {
                if (isNaN(seconds)) return "0:00";
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }

            // Update Play/Pause Icons
            function updateIcons(playing) {
                if (playing) {
                    iconPlay.style.display = 'none';
                    iconPause.style.display = 'block';
                } else {
                    iconPlay.style.display = 'block';
                    iconPause.style.display = 'none';
                }
            }

            // Play a specific track
            function playTrack(card, url, title) {
                // Reset previous card styling
                if (currentTrackCard && currentTrackCard !== card) {
                    currentTrackCard.classList.remove('is-playing');
                }

                currentTrackCard = card;
                audio.src = url;
                audio.play();
                
                // UI Updates
                player.classList.add('etd-active');
                card.classList.add('is-playing');
                trackLabel.textContent = title;
                updateIcons(true);
            }

            // Toggle Play/Pause
            function togglePlay() {
                if (audio.paused) {
                    audio.play();
                    updateIcons(true);
                } else {
                    audio.pause();
                    updateIcons(false);
                }
            }

            // Close Player
            function closePlayer() {
                audio.pause();
                audio.currentTime = 0;
                player.classList.remove('etd-active');
                updateIcons(false);
                if (currentTrackCard) {
                    currentTrackCard.classList.remove('is-playing');
                }
                currentTrackCard = null;
            }

            // --- Event Listeners ---

            // 1. Delegate clicks on Preview buttons
            wrapper.addEventListener('click', function(e) {
                const btn = e.target.closest('.' + btnPreviewClass);
                if (btn) {
                    e.preventDefault();
                    const card = btn.closest('.' + trackCardClass);
                    const trackUrl = card.getAttribute('data-src');
                    const trackTitle = card.querySelector('.etd-track-name').textContent;
                    
                    // If clicking the same track that is already playing
                    if (audio.src === trackUrl && !audio.paused) {
                        // Optional: Focus player or pause
                        return; 
                    }
                    
                    playTrack(card, trackUrl, trackTitle);
                }
            });

            // 2. Player Controls
            playPauseBtn.addEventListener('click', togglePlay);
            closeBtn.addEventListener('click', closePlayer);

            // 3. Audio Events
            audio.addEventListener('timeupdate', function() {
                if (!isDragging) {
                    const percent = (audio.currentTime / audio.duration) * 100;
                    progressFill.style.width = `${percent}%`;
                    currentTimeEl.textContent = formatTime(audio.currentTime);
                }
            });

            audio.addEventListener('loadedmetadata', function() {
                durationEl.textContent = formatTime(audio.duration);
            });

            audio.addEventListener('ended', function() {
                updateIcons(false);
                progressFill.style.width = '0%';
                audio.currentTime = 0;
            });

            // 4. Progress Bar Seek functionality
            progressWrapper.addEventListener('click', function(e) {
                const rect = progressWrapper.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pos * audio.duration;
            });

            // Optional: Dragging support for progress bar (simple implementation)
            progressWrapper.addEventListener('mousedown', () => isDragging = true);
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    // Update audio time on release based on visual position
                    const rect = progressWrapper.getBoundingClientRect();
                    // Need mouse position relative to wrapper
                    // This is a simplified version, usually requires mousemove tracking
                    // For this snippet, click-to-seek is sufficient and robust.
                }
            });
        })();    
