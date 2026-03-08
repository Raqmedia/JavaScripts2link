            
            // Initialize the quiz
            init: function() {
                // Difficulty selection handlers
                document.querySelectorAll('[data-difficulty]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.currentDifficulty = e.target.dataset.difficulty;
                        document.getElementById('englezzreadingquiz-current-difficulty').textContent = 
                            this.currentDifficulty.charAt(0).toUpperCase() + this.currentDifficulty.slice(1);
                        document.getElementById('englezzreadingquiz-current-difficulty').className = 
                            `englezzreadingquiz-difficulty-badge ${this.currentDifficulty}`;
                        
                        // Display appropriate passage
                        document.getElementById('englezzreadingquiz-passage-content').innerHTML = this.passages[this.currentDifficulty];
                        document.getElementById('englezzreadingquiz-passage-meta').textContent = this.passageMeta[this.currentDifficulty];
                        
                        // Show header, passage and first activity
                        document.getElementById('englezzreadingquiz-header').classList.remove('englezzreadingquiz-hidden');
                        document.getElementById('englezzreadingquiz-difficulty-screen').classList.add('englezzreadingquiz-hidden');
                        document.getElementById('englezzreadingquiz-passage-section').classList.remove('englezzreadingquiz-hidden');
                        
                        // Start Timer
                        this.startTimer();
                        
                        this.showActivity(1);
                        
                        // Render questions for all activities
                        this.renderActivity1();
                        this.renderActivity2();
                        this.renderActivity3();
                    });
                });
                
                // Navigation handlers
                document.getElementById('englezzreadingquiz-act1-next').addEventListener('click', () => this.showActivity(2));
                document.getElementById('englezzreadingquiz-act2-prev').addEventListener('click', () => this.showActivity(1));
                document.getElementById('englezzreadingquiz-act2-next').addEventListener('click', () => this.showActivity(3));
                document.getElementById('englezzreadingquiz-act3-prev').addEventListener('click', () => this.showActivity(2));
                document.getElementById('englezzreadingquiz-act3-finish').addEventListener('click', () => this.showCompletion());
                document.getElementById('englezzreadingquiz-restart').addEventListener('click', () => this.restartQuiz());
                
                // Activity 1 previous button (returns to passage)
                document.getElementById('englezzreadingquiz-act1-prev').addEventListener('click', () => {
                    document.getElementById('englezzreadingquiz-activity1').classList.remove('active');
                    document.getElementById('englezzreadingquiz-passage-section').scrollIntoView({behavior: 'smooth'});
                });
            },
            
            // Start Timer
            startTimer: function() {
                this.secondsElapsed = 0;
                this.timerInterval = setInterval(() => {
                    this.secondsElapsed++;
                    this.updateTimerDisplay();
                }, 1000);
            },
            
            // Stop Timer
            stopTimer: function() {
                clearInterval(this.timerInterval);
            },
            
            // Update Timer Display
            updateTimerDisplay: function() {
                const minutes = Math.floor(this.secondsElapsed / 60);
                const seconds = this.secondsElapsed % 60;
                const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                const timerEl = document.getElementById('englezzreadingquiz-timer');
                timerEl.textContent = display;
                
                // Warning color if over 20 minutes
                if (this.secondsElapsed > 1200) {
                    timerEl.classList.add('englezzreadingquiz-timer-warning');
                } else {
                    timerEl.classList.remove('englezzreadingquiz-timer-warning');
                }
            },
            
            // Update Score Display
            updateScoreDisplay: function() {
                document.getElementById('englezzreadingquiz-score').textContent = this.score;
                document.getElementById('englezzreadingquiz-progress-text').textContent = `${this.answeredCount}/${this.totalQuestions}`;
            },
            
            // Show specific activity
            showActivity: function(activityNum) {
                // Hide all activities
                document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => {
                    el.classList.remove('active');
                });
                // Show target activity
                document.getElementById(`englezzreadingquiz-activity${activityNum}`).classList.add('active');
                this.currentActivity = activityNum;
                // Scroll to activity
                document.getElementById(`englezzreadingquiz-activity${activityNum}`).scrollIntoView({behavior: 'smooth'});
            },
            
            // Render Activity 1 questions
            renderActivity1: function() {
                const container = document.getElementById('englezzreadingquiz-activity1-questions');
                container.innerHTML = '';
                const questions = this.questions.activity1[this.currentDifficulty];
                
                questions.forEach((q, index) => {
                    const qDiv = document.createElement('div');
                    qDiv.className = 'englezzreadingquiz-question';
                    qDiv.id = `question-container-${q.id}`;
                    qDiv.innerHTML = `
                        <div class="englezzreadingquiz-question-counter">Question ${index + 1} of 10</div>
                        <div class="englezzreadingquiz-question-text">${index + 1}. ${q.question}</div>
                        <textarea class="englezzreadingquiz-input englezzreadingquiz-textarea" 
                                  id="answer-${q.id}" 
                                  placeholder="Type your detailed answer here..."
                                  aria-label="Answer for question ${index + 1}"></textarea>
                        <button class="englezzreadingquiz-btn" id="btn-${q.id}" onclick="englezzreadingquiz.checkDetailedAnswer('${q.id}')">
                            Submit Answer
                        </button>
                        <div id="feedback-${q.id}" class="englezzreadingquiz-feedback" role="status"></div>
                    `;
                    container.appendChild(qDiv);
                });
            },
            
            // Check detailed answer (simplified keyword matching)
            checkDetailedAnswer: function(questionId) {
                if (this.questionState[questionId]) return; // Prevent re-answering

                const userAnswer = document.getElementById(`answer-${questionId}`).value.toLowerCase().trim();
                const question = this.findQuestion(questionId);
                if (!question || !userAnswer) {
                    this.showFeedback(questionId, "Please write your answer first! ✍️", "incorrect");
                    return;
                }
                
                // Simple keyword matching for demonstration
                const hasKeywords = question.keywords.some(keyword => 
                    userAnswer.includes(keyword.toLowerCase())
                );
                
                const btn = document.getElementById(`btn-${questionId}`);
                const container = document.getElementById(`question-container-${questionId}`);
                
                if (hasKeywords) {
                    this.showFeedback(questionId, question.feedback.correct, "correct");
                    this.announceFeedback(question.feedback.correct);
                    this.incrementScore();
                    btn.textContent = "Answered Correctly ✅";
                    btn.disabled = true;
                    btn.classList.add('englezzreadingquiz-btn-success');
                } else {
                    this.showFeedback(questionId, question.feedback.incorrect, "incorrect");
                    this.announceFeedback(question.feedback.incorrect);
                    btn.textContent = "Try Again later 🔁";
                    btn.disabled = true;
                    btn.classList.add('englezzreadingquiz-btn-secondary');
                }
                
                container.classList.add('englezzreadingquiz-answer');
                this.questionState[questionId] = true;
                this.answeredCount++;
                this.updateScoreDisplay();
                this.showMotivation();
            },
            
            // Render Activity 2 questions
            renderActivity2: function() {
                const container = document.getElementById('englezzreadingquiz-activity2-questions');
                container.innerHTML = '';
                const questions = this.questions.activity2[this.currentDifficulty];
                
                questions.forEach((q, index) => {
                    const qDiv = document.createElement('div');
                    qDiv.className = 'englezzreadingquiz-question';
                    qDiv.id = `question-container-${q.id}`;
                    qDiv.innerHTML = `
                        <div class="englezzreadingquiz-question-counter">Question ${index + 1} of 10</div>
                        <div class="englezzreadingquiz-question-text">${index + 1}. ${q.question}</div>
                        <div class="englezzreadingquiz-options">
                            <label class="englezzreadingquiz-option">
                                <input type="radio" name="${q.id}" value="true"> True
                            </label>
                            <label class="englezzreadingquiz-option">
                                <input type="radio" name="${q.id}" value="false"> False
                            </label>
                        </div>
                        <button class="englezzreadingquiz-btn" id="btn-${q.id}" onclick="englezzreadingquiz.checkTrueFalse('${q.id}', ${q.answer})">
                            Submit Answer
                        </button>
                        <div id="feedback-${q.id}" class="englezzreadingquiz-feedback" role="status"></div>
                    `;
                    container.appendChild(qDiv);
                });
            },
            
            // Check True/False answer
            checkTrueFalse: function(questionId, correctAnswer) {
                if (this.questionState[questionId]) return;

                const selected = document.querySelector(`input[name="${questionId}"]:checked`);
                const question = this.findQuestion(questionId);
                
                if (!selected) {
                    this.showFeedback(questionId, "Please select True or False first! ✅❌", "incorrect");
                    return;
                }
                
                const userAnswer = selected.value === 'true';
                const btn = document.getElementById(`btn-${questionId}`);
                const container = document.getElementById(`question-container-${q.id}`);

                if (userAnswer === correctAnswer) {
                    this.showFeedback(questionId, question.feedback.correct, "correct");
                    this.announceFeedback(question.feedback.correct);
                    this.incrementScore();
                    btn.textContent = "Correct! ✅";
                    btn.disabled = true;
                    btn.classList.add('englezzreadingquiz-btn-success');
                } else {
                    this.showFeedback(questionId, question.feedback.incorrect, "incorrect");
                    this.announceFeedback(question.feedback.incorrect);
                    btn.textContent = "Incorrect ❌";
                    btn.disabled = true;
                    btn.classList.add('englezzreadingquiz-btn-secondary');
                }
                
                container.classList.add('englezzreadingquiz-answer');
                this.questionState[questionId] = true;
                this.answeredCount++;
                this.updateScoreDisplay();
                this.showMotivation();
            },
            
            // Render Activity 3 questions
            renderActivity3: function() {
                const container = document.getElementById('englezzreadingquiz-activity3-questions');
                container.innerHTML = '';
                const questions = this.questions.activity3[this.currentDifficulty];
                
                questions.forEach((q, index) => {
                    const qDiv = document.createElement('div');
                    qDiv.className = 'englezzreadingquiz-question';
                    qDiv.id = `question-container-${q.id}`;
                    let optionsHTML = '';
                    q.options.forEach((opt, optIndex) => {
                        optionsHTML += `
                            <label class="englezzreadingquiz-option">
                                <input type="radio" name="${q.id}" value="${optIndex}"> ${opt}
                            </label>
                        `;
                    });
                    
                    qDiv.innerHTML = `
                        <div class="englezzreadingquiz-question-counter">Question ${index + 1} of 10</div>
                        <div class="englezzreadingquiz-question-text">${index + 1}. ${q.question}</div>
                        <div class="englezzreadingquiz-options">
                            ${optionsHTML}
                        </div>
                        <button class="englezzreadingquiz-btn" id="btn-${q.id}" onclick="englezzreadingquiz.checkMCQ('${q.id}', ${q.correct})">
                            Submit Answer
                        </button>
                        <div id="feedback-${q.id}" class="englezzreadingquiz-feedback" role="status"></div>
                    `;
                    container.appendChild(qDiv);
                });
            },
            
            // Check MCQ answer
            checkMCQ: function(questionId, correctIndex) {
                if (this.questionState[questionId]) return;

                const selected = document.querySelector(`input[name="${questionId}"]:checked`);
                const question = this.findQuestion(questionId);
                
                if (!selected) {
                    this.showFeedback(questionId, "Please select an option first! 🔍", "incorrect");
                    return;
                }
                
                const userAnswer = parseInt(selected.value);
                const btn = document.getElementById(`btn-${questionId}`);
                const container = document.getElementById(`question-container-${q.id}`);

                if (userAnswer === correctIndex) {
                    this.showFeedback(questionId, question.feedback.correct, "correct");
                    this.announceFeedback(question.feedback.correct);
                    this.incrementScore();
                    btn.textContent = "Correct! ✅";
                    btn.disabled = true;
                    btn.classList.add('englezzreadingquiz-btn-success');
                } else {
                    this.showFeedback(questionId, question.feedback.incorrect, "incorrect");
                    this.announceFeedback(question.feedback.incorrect);
                    btn.textContent = "Incorrect ❌";
                    btn.disabled = true;
                    btn.classList.add('englezzreadingquiz-btn-secondary');
                }
                
                container.classList.add('englezzreadingquiz-answer');
                this.questionState[questionId] = true;
                this.answeredCount++;
                this.updateScoreDisplay();
                this.showMotivation();
            },
            
            // Helper: Find question by ID across all activities
            findQuestion: function(questionId) {
                for (let activity in this.questions) {
                    for (let difficulty in this.questions[activity]) {
                        const found = this.questions[activity][difficulty].find(q => q.id === questionId);
                        if (found) return found;
                    }
                }
                return null;
            },
            
            // Increment Score
            incrementScore: function() {
                this.score++;
                this.updateScoreDisplay();
            },
            
            // Show feedback message
            showFeedback: function(questionId, message, type) {
                const feedbackEl = document.getElementById(`feedback-${questionId}`);
                feedbackEl.textContent = message;
                feedbackEl.className = `englezzreadingquiz-feedback ${type}`;
            },
            
            // Announce feedback for screen readers
            announceFeedback: function(message) {
                const announcer = document.getElementById('englezzreadingquiz-aria-feedback');
                announcer.textContent = message;
                // Clear after announcement
                setTimeout(() => { announcer.textContent = ''; }, 1000);
            },
            
            // Show random motivational message
            showMotivation: function() {
                const messages = this.motivationalMessages;
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                console.log("Motivation:", randomMsg);
            },
            
            // Show completion screen
            showCompletion: function() {
                this.stopTimer();
                document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => {
                    el.classList.remove('active');
                });
                document.getElementById('englezzreadingquiz-completion').classList.add('active');
                
                // Display Final Score
                document.getElementById('englezzreadingquiz-final-score').textContent = this.score;
                
                // Display Time Taken
                const minutes = Math.floor(this.secondsElapsed / 60);
                const seconds = this.secondsElapsed % 60;
                document.getElementById('englezzreadingquiz-final-time').textContent = 
                    `${minutes}m ${seconds}s`;
                
                // Personalize completion message based on score
                let message = "";
                const percentage = (this.score / this.totalQuestions) * 100;
                
                if (percentage >= 90) {
                    message = "Outstanding Performance! 🌟 You've mastered the text with exceptional comprehension. Your analytical skills are top-tier!";
                } else if (percentage >= 70) {
                    message = "Great Job! 🎬 You've demonstrated strong understanding of the material. Keep refining your skills!";
                } else if (percentage >= 50) {
                    message = "Good Effort! 📚 You've completed the quiz. Reviewing the passage again might help clarify some concepts.";
                } else {
                    message = "Keep Learning! 💡 Reading comprehension takes practice. Try reviewing the passage and attempting the quiz again.";
                }
                
                document.getElementById('englezzreadingquiz-completion-message').textContent = message;
                
                document.getElementById('englezzreadingquiz-completion').scrollIntoView({behavior: 'smooth'});
            },
            
            // Reset Quiz (Full Reset)
            resetQuiz: function() {
                if(confirm("Are you sure you want to reset the quiz? All progress will be lost.")) {
                    this.stopTimer();
                    this.score = 0;
                    this.answeredCount = 0;
                    this.secondsElapsed = 0;
                    this.questionState = {};
                    this.currentDifficulty = null;
                    this.currentActivity = 1;
                    
                    // Reset UI
                    document.getElementById('englezzreadingquiz-score').textContent = '0';
                    document.getElementById('englezzreadingquiz-progress-text').textContent = '0/30';
                    document.getElementById('englezzreadingquiz-timer').textContent = '00:00';
                    document.getElementById('englezzreadingquiz-timer').classList.remove('englezzreadingquiz-timer-warning');
                    
                    // Hide all sections except difficulty selector
                    document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => el.classList.remove('active'));
                    document.getElementById('englezzreadingquiz-passage-section').classList.add('englezzreadingquiz-hidden');
                    document.getElementById('englezzreadingquiz-header').classList.add('englezzreadingquiz-hidden');
                    document.getElementById('englezzreadingquiz-difficulty-screen').classList.remove('englezzreadingquiz-hidden');
                    
                    // Clear inputs
                    document.querySelectorAll('.englezzreadingquiz-input, .englezzreadingquiz-textarea').forEach(el => el.value = '');
                    document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
                    document.querySelectorAll('.englezzreadingquiz-feedback').forEach(el => {
                        el.textContent = '';
                        el.className = 'englezzreadingquiz-feedback';
                        el.style.display = 'none';
                    });
                    document.querySelectorAll('.englezzreadingquiz-btn').forEach(btn => {
                        if(btn.id.startsWith('btn-')) {
                            btn.disabled = false;
                            btn.textContent = 'Submit Answer';
                            btn.classList.remove('englezzreadingquiz-btn-success', 'englezzreadingquiz-btn-secondary');
                        }
                    });
                    document.querySelectorAll('.englezzreadingquiz-question').forEach(q => q.classList.remove('englezzreadingquiz-answer'));
                    
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            },
            
            // Restart Quiz (Keep difficulty, reset state)
            restartQuiz: function() {
                this.stopTimer();
                this.score = 0;
                this.answeredCount = 0;
                this.secondsElapsed = 0;
                this.questionState = {};
                this.currentActivity = 1;
                
                // Reset UI
                document.getElementById('englezzreadingquiz-score').textContent = '0';
                document.getElementById('englezzreadingquiz-progress-text').textContent = '0/30';
                document.getElementById('englezzreadingquiz-timer').textContent = '00:00';
                document.getElementById('englezzreadingquiz-timer').classList.remove('englezzreadingquiz-timer-warning');
                
                // Hide completion, show passage
                document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => el.classList.remove('active'));
                document.getElementById('englezzreadingquiz-passage-section').classList.remove('englezzreadingquiz-hidden');
                
                // Clear inputs
                document.querySelectorAll('.englezzreadingquiz-input, .englezzreadingquiz-textarea').forEach(el => el.value = '');
                document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
                document.querySelectorAll('.englezzreadingquiz-feedback').forEach(el => {
                    el.textContent = '';
                    el.className = 'englezzreadingquiz-feedback';
                    el.style.display = 'none';
                });
                document.querySelectorAll('.englezzreadingquiz-btn').forEach(btn => {
                    if(btn.id.startsWith('btn-')) {
                        btn.disabled = false;
                        btn.textContent = 'Submit Answer';
                        btn.classList.remove('englezzreadingquiz-btn-success', 'englezzreadingquiz-btn-secondary');
                    }
                });
                document.querySelectorAll('.englezzreadingquiz-question').forEach(q => q.classList.remove('englezzreadingquiz-answer'));
                
                this.startTimer();
                this.showActivity(1);
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        };
        
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            englezzreadingquiz.init();
        });
