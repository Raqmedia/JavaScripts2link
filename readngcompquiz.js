<!-- ============================================ -->
<!-- ENGLEZZ READING QUIZ - CORE JAVASCRIPT (DO NOT EDIT) -->
<!-- ============================================ -->
const englezzreadingquiz = {
    currentDifficulty: null,
    currentActivity: 1,
    score: 0,
    totalQuestions: 30,
    answeredCount: 0,
    timerInterval: null,
    secondsElapsed: 0,
    questionState: {},
    
    init: function() {
        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentDifficulty = e.target.dataset.difficulty;
                document.getElementById('englezzreadingquiz-current-difficulty').textContent = 
                    this.currentDifficulty.charAt(0).toUpperCase() + this.currentDifficulty.slice(1);
                document.getElementById('englezzreadingquiz-current-difficulty').className = 
                    `englezzreadingquiz-difficulty-badge ${this.currentDifficulty}`;
                
                document.getElementById('englezzreadingquiz-passage-content').innerHTML = this.passages[this.currentDifficulty];
                document.getElementById('englezzreadingquiz-passage-meta').textContent = this.passageMeta[this.currentDifficulty];
                
                document.getElementById('englezzreadingquiz-header').classList.remove('englezzreadingquiz-hidden');
                document.getElementById('englezzreadingquiz-difficulty-screen').classList.add('englezzreadingquiz-hidden');
                document.getElementById('englezzreadingquiz-passage-section').classList.remove('englezzreadingquiz-hidden');
                
                this.startTimer();
                this.showActivity(1);
                this.renderActivity1();
                this.renderActivity2();
                this.renderActivity3();
            });
        });
        
        document.getElementById('englezzreadingquiz-act1-next').addEventListener('click', () => this.showActivity(2));
        document.getElementById('englezzreadingquiz-act2-prev').addEventListener('click', () => this.showActivity(1));
        document.getElementById('englezzreadingquiz-act2-next').addEventListener('click', () => this.showActivity(3));
        document.getElementById('englezzreadingquiz-act3-prev').addEventListener('click', () => this.showActivity(2));
        document.getElementById('englezzreadingquiz-act3-finish').addEventListener('click', () => this.showCompletion());
        
        document.getElementById('englezzreadingquiz-act1-prev').addEventListener('click', () => {
            document.getElementById('englezzreadingquiz-activity1').classList.remove('active');
            document.getElementById('englezzreadingquiz-passage-section').scrollIntoView({behavior: 'smooth'});
        });
    },
    
    startTimer: function() {
        this.secondsElapsed = 0;
        this.timerInterval = setInterval(() => {
            this.secondsElapsed++;
            this.updateTimerDisplay();
        }, 1000);
    },
    
    stopTimer: function() {
        clearInterval(this.timerInterval);
    },
    
    updateTimerDisplay: function() {
        const minutes = Math.floor(this.secondsElapsed / 60);
        const seconds = this.secondsElapsed % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const timerEl = document.getElementById('englezzreadingquiz-timer');
        timerEl.textContent = display;
        
        if (this.secondsElapsed > 1200) {
            timerEl.classList.add('englezzreadingquiz-timer-warning');
        } else {
            timerEl.classList.remove('englezzreadingquiz-timer-warning');
        }
    },
    
    updateScoreDisplay: function() {
        document.getElementById('englezzreadingquiz-score').textContent = this.score;
        document.getElementById('englezzreadingquiz-progress-text').textContent = `${this.answeredCount}/${this.totalQuestions}`;
    },
    
    showActivity: function(activityNum) {
        document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => {
            el.classList.remove('active');
        });
        document.getElementById(`englezzreadingquiz-activity${activityNum}`).classList.add('active');
        this.currentActivity = activityNum;
        document.getElementById(`englezzreadingquiz-activity${activityNum}`).scrollIntoView({behavior: 'smooth'});
    },
    
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
    
    checkDetailedAnswer: function(questionId) {
        if (this.questionState[questionId]) return;

        const userAnswer = document.getElementById(`answer-${questionId}`).value.toLowerCase().trim();
        const question = this.findQuestion(questionId);
        if (!question || !userAnswer) {
            this.showFeedback(questionId, "Please write your answer first! ✍️", "incorrect");
            return;
        }
        
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
        const container = document.getElementById(`question-container-${questionId}`);

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
        const container = document.getElementById(`question-container-${questionId}`);

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
    
    findQuestion: function(questionId) {
        for (let activity in this.questions) {
            for (let difficulty in this.questions[activity]) {
                const found = this.questions[activity][difficulty].find(q => q.id === questionId);
                if (found) return found;
            }
        }
        return null;
    },
    
    incrementScore: function() {
        this.score++;
        this.updateScoreDisplay();
    },
    
    showFeedback: function(questionId, message, type) {
        const feedbackEl = document.getElementById(`feedback-${questionId}`);
        feedbackEl.textContent = message;
        feedbackEl.className = `englezzreadingquiz-feedback ${type}`;
    },
    
    announceFeedback: function(message) {
        const announcer = document.getElementById('englezzreadingquiz-aria-feedback');
        announcer.textContent = message;
        setTimeout(() => { announcer.textContent = ''; }, 1000);
    },
    
    showMotivation: function() {
        const messages = this.motivationalMessages;
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        console.log("Motivation:", randomMsg);
    },
    
    showCompletion: function() {
        this.stopTimer();
        document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => {
            el.classList.remove('active');
        });
        document.getElementById('englezzreadingquiz-completion').classList.add('active');
        
        document.getElementById('englezzreadingquiz-final-score').textContent = this.score;
        
        const minutes = Math.floor(this.secondsElapsed / 60);
        const seconds = this.secondsElapsed % 60;
        document.getElementById('englezzreadingquiz-final-time').textContent = 
            `${minutes}m ${seconds}s`;
        
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
    
    resetQuiz: function() {
        if(confirm("Are you sure you want to reset the quiz? All progress will be lost.")) {
            this.stopTimer();
            this.score = 0;
            this.answeredCount = 0;
            this.secondsElapsed = 0;
            this.questionState = {};
            this.currentDifficulty = null;
            this.currentActivity = 1;
            
            document.getElementById('englezzreadingquiz-score').textContent = '0';
            document.getElementById('englezzreadingquiz-progress-text').textContent = '0/30';
            document.getElementById('englezzreadingquiz-timer').textContent = '00:00';
            document.getElementById('englezzreadingquiz-timer').classList.remove('englezzreadingquiz-timer-warning');
            
            document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => el.classList.remove('active'));
            document.getElementById('englezzreadingquiz-passage-section').classList.add('englezzreadingquiz-hidden');
            document.getElementById('englezzreadingquiz-header').classList.add('englezzreadingquiz-hidden');
            document.getElementById('englezzreadingquiz-difficulty-screen').classList.remove('englezzreadingquiz-hidden');
            
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
    
    restartQuiz: function() {
        this.stopTimer();
        this.score = 0;
        this.answeredCount = 0;
        this.secondsElapsed = 0;
        this.questionState = {};
        this.currentActivity = 1;
        
        document.getElementById('englezzreadingquiz-score').textContent = '0';
        document.getElementById('englezzreadingquiz-progress-text').textContent = '0/30';
        document.getElementById('englezzreadingquiz-timer').textContent = '00:00';
        document.getElementById('englezzreadingquiz-timer').classList.remove('englezzreadingquiz-timer-warning');
        
        document.querySelectorAll('.englezzreadingquiz-activity').forEach(el => el.classList.remove('active'));
        document.getElementById('englezzreadingquiz-passage-section').classList.remove('englezzreadingquiz-hidden');
        
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

document.addEventListener('DOMContentLoaded', () => {
    englezzreadingquiz.init();
});
