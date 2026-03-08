<!-- ENGLEZZ QUIZ SYSTEM - THEME CODE START -->
window.EnglezzQuiz = {
    config: {},
    data: {},
    answers: {},
    currentActivity: 'activity1',
    currentQuestions: {},
    selectedDifficulty: null,

    init: function(quizData) {
        this.data = quizData;
        this.config = quizData.config || { primary_color: '#f97316' };
        this.answers = { activity1: {}, activity2: {}, activity3: {}, activity4: {} };
        this.currentActivity = 'activity1';
        
        // Render Initial Structure
        const appContainer = document.getElementById('englezzreadingquiz-app');
        if(!appContainer) return;
        
        appContainer.innerHTML = `
         <div class="englezzreadingquiz-container h-full overflow-auto">
           <div class="max-w-4xl mx-auto px-4 py-8">
            <div class="text-center mb-8">
             <div class="englezzreadingquiz-film-icon text-6xl mb-4">🎬</div>
             <h1 id="englezzreadingquiz-main-title" class="englezzreadingquiz-title text-4xl md:text-5xl font-bold text-white mb-3">${this.data.title}</h1>
             <p class="text-orange-200 text-lg">${this.data.subtitle || 'Reading Comprehension Quiz'}</p>
            </div>
            <div class="englezzreadingquiz-card p-6 md:p-8 mb-6">
             <div class="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border-l-4 border-purple-400">
              <h4 class="text-xl font-bold text-gray-800 mb-3">🎯 Welcome to the Quest!</h4>
              <div class="englezzreadingquiz-reading-text text-gray-700" id="englezzreadingquiz-intro"></div>
             </div>
            </div>
            <div class="englezzreadingquiz-card p-6 md:p-8 mb-6">
             <div class="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-l-4 border-orange-400">
              <h4 class="text-lg font-bold text-gray-800 mb-3">📝 Main Reading Passage</h4>
              <div id="englezzreadingquiz-reading-content"></div>
             </div>
            </div>
            <div id="englezzreadingquiz-quiz-root"></div>
            <footer class="text-center mt-8 pb-4">
             <p class="text-orange-200">Made with 🧡 By <a href="https://www.englezz.com" target="_blank" class="text-orange-300 hover:text-white underline">EnglEzz.com</a></p>
            </footer>
           </div>
          </div>`;
        
        document.getElementById('englezzreadingquiz-intro').innerHTML = this.data.intro;
        this.renderDifficultyScreen();
    },

    shuffleArray: function(array) {
        const newArray = [...array]; 
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    renderDifficultyScreen: function() {
        const root = document.getElementById('englezzreadingquiz-quiz-root');
        root.innerHTML = `
         <div class="englezzreadingquiz-card p-6 md:p-8">
          <div id="englezzreadingquiz-difficulty-screen">
           <h2 class="englezzreadingquiz-title text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">Select Difficulty</h2>
           <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button onclick="EnglezzQuiz.selectDifficulty('easy')" class="englezzreadingquiz-difficulty-btn englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl" id="englezzreadingquiz-easy-btn"><div class="text-4xl mb-3">🌱</div><div class="font-bold text-xl mb-2">Easy</div></button>
            <button onclick="EnglezzQuiz.selectDifficulty('medium')" class="englezzreadingquiz-difficulty-btn englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-br from-amber-400 to-orange-500 text-white p-6 rounded-xl" id="englezzreadingquiz-medium-btn"><div class="text-4xl mb-3">🔥</div><div class="font-bold text-xl mb-2">Medium</div></button>
            <button onclick="EnglezzQuiz.selectDifficulty('hard')" class="englezzreadingquiz-difficulty-btn englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-xl" id="englezzreadingquiz-hard-btn"><div class="text-4xl mb-3">💎</div><div class="font-bold text-xl mb-2">Hard</div></button>
           </div>
           <button id="englezzreadingquiz-start-btn" onclick="EnglezzQuiz.startQuiz()" class="englezzreadingquiz-btn englezzreadingquiz-ripple w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"> Start Quiz 📚 </button>
          </div>
          <div id="englezzreadingquiz-quiz-screen" class="hidden"></div>
          <div id="englezzreadingquiz-results-screen" class="hidden"></div>
        </div>`;
    },

    selectDifficulty: function(difficulty) {
        this.selectedDifficulty = difficulty;
        ['easy', 'medium', 'hard'].forEach(d => {
            const btn = document.getElementById(`englezzreadingquiz-${d}-btn`);
            if(btn) btn.classList.remove('englezzreadingquiz-selected');
        });
        const selectedBtn = document.getElementById(`englezzreadingquiz-${difficulty}-btn`);
        if(selectedBtn) selectedBtn.classList.add('englezzreadingquiz-selected');
        document.getElementById('englezzreadingquiz-start-btn').disabled = false;
    },

    initializeQuestions: function() {
        // Deep copy
        this.currentQuestions = JSON.parse(JSON.stringify(this.data.questions[this.selectedDifficulty]));
        
        // Shuffle Questions Order
        this.currentQuestions.activity1 = this.shuffleArray(this.currentQuestions.activity1);
        this.currentQuestions.activity2 = this.shuffleArray(this.currentQuestions.activity2);
        this.currentQuestions.activity3 = this.shuffleArray(this.currentQuestions.activity3);
        this.currentQuestions.activity4 = this.shuffleArray(this.currentQuestions.activity4);

        // Shuffle Options Order for MCQ (Activity 3)
        this.currentQuestions.activity3.forEach(q => {
            const correctAnswerText = q.options[q.answer];
            q.options = this.shuffleArray(q.options);
            q.answer = q.options.indexOf(correctAnswerText);
        });

        // Shuffle Options Order for Fill in Blanks (Activity 4)
        this.currentQuestions.activity4.forEach(q => {
            q.options = this.shuffleArray(q.options);
        });
    },

    startQuiz: function() {
        if (!this.selectedDifficulty) return;
        this.initializeQuestions();
        
        document.getElementById('englezzreadingquiz-difficulty-screen').classList.add('hidden');
        document.getElementById('englezzreadingquiz-quiz-screen').classList.remove('hidden');
        document.getElementById('englezzreadingquiz-reading-content').innerHTML = this.data.passages[this.selectedDifficulty];
        
        this.renderQuizScreens();
        window.scrollTo(0, 0);
    },

    renderQuizScreens: function() {
        const quizScreen = document.getElementById('englezzreadingquiz-quiz-screen');
        quizScreen.innerHTML = `
          <!-- Progress Indicators -->
          <div class="mb-8 flex justify-between items-start md:items-center gap-2">
           <div class="text-center flex-1"><div class="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold englezzreadingquiz-step-indicator englezzreadingquiz-active">1</div><span class="text-xs font-semibold text-gray-600">Activity 1</span></div>
           <div class="flex-shrink-0 h-1 w-4 md:w-12 bg-gray-300 mb-7"></div>
           <div class="text-center flex-1"><div class="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold englezzreadingquiz-step-indicator" id="englezzreadingquiz-progress-a1">2</div><span class="text-xs font-semibold text-gray-600">Activity 2</span></div>
           <div class="flex-shrink-0 h-1 w-4 md:w-12 bg-gray-300 mb-7"></div>
           <div class="text-center flex-1"><div class="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold englezzreadingquiz-step-indicator" id="englezzreadingquiz-progress-a2">3</div><span class="text-xs font-semibold text-gray-600">Activity 3</span></div>
           <div class="flex-shrink-0 h-1 w-4 md:w-12 bg-gray-300 mb-7"></div>
           <div class="text-center flex-1"><div class="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold englezzreadingquiz-step-indicator" id="englezzreadingquiz-progress-a3">4</div><span class="text-xs font-semibold text-gray-600">Activity 4</span></div>
          </div>

          <div id="englezzreadingquiz-section-activity1"></div>
          <div id="englezzreadingquiz-section-activity2" class="hidden"></div>
          <div id="englezzreadingquiz-section-activity3" class="hidden"></div>
          <div id="englezzreadingquiz-section-activity4" class="hidden"></div>
        `;
        
        this.renderActivity1();
        this.renderActivity2();
        this.renderActivity3();
        this.renderActivity4();
    },

    renderActivity1: function() {
        const container = document.getElementById('englezzreadingquiz-section-activity1');
        container.innerHTML = `<h3 class="englezzreadingquiz-title text-2xl font-bold text-gray-800 mb-4">✍️ Activity 1: Written Answers</h3><div id="englezzreadingquiz-activity1-questions"></div><div class="mt-6 text-center"><button onclick="EnglezzQuiz.progressToActivity()" class="englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-xl"> Continue → </button></div>`;
        
        const qContainer = document.getElementById('englezzreadingquiz-activity1-questions');
        qContainer.innerHTML = this.currentQuestions.activity1.map((q, index) => `
            <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div class="flex items-start gap-3 mb-3">
                <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
                <p class="text-gray-800 font-semibold">${q.question}</p>
              </div>
              <textarea id="englezzreadingquiz-a1-q${q.id}" class="englezzreadingquiz-textarea w-full p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none" rows="3" placeholder="Write your answer here..."></textarea>
              <button onclick="EnglezzQuiz.checkActivity1(${q.id})" class="englezzreadingquiz-btn englezzreadingquiz-ripple mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg">Check Answer</button>
              <div id="englezzreadingquiz-feedback-a1-${q.id}" class="mt-3"></div>
            </div>
        `).join('');
    },
    
    checkActivity1: function(qId) {
        const question = this.currentQuestions.activity1.find(q => q.id === qId);
        const val = document.getElementById(`englezzreadingquiz-a1-q${qId}`).value;
        const el = document.getElementById(`englezzreadingquiz-feedback-a1-${qId}`);
        if(!val.trim()) { el.innerHTML = `<div class="englezzreadingquiz-feedback bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg"><p class="font-semibold text-yellow-800">⚠️ Please write your answer first!</p></div>`; return; }
        el.innerHTML = `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-4 rounded-r-lg"><p class="font-semibold text-green-800">✅ Model Answer: ${question.answer}</p></div>`;
    },

    renderActivity2: function() {
        const container = document.getElementById('englezzreadingquiz-section-activity2');
        container.innerHTML = `<h3 class="englezzreadingquiz-title text-2xl font-bold text-gray-800 mb-4">✓✗ Activity 2: True or False</h3><div id="englezzreadingquiz-activity2-questions"></div><div class="mt-6 text-center"><button onclick="EnglezzQuiz.progressToActivity()" class="englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-xl"> Continue → </button></div>`;
        
        const qContainer = document.getElementById('englezzreadingquiz-activity2-questions');
        qContainer.innerHTML = this.currentQuestions.activity2.map((q, index) => `
            <div class="mb-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div class="flex items-start gap-3 mb-4">
                <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
                <p class="text-gray-800">${q.statement}</p>
              </div>
              <div class="flex gap-3">
                <button onclick="EnglezzQuiz.selectTF(${q.id}, true)" class="englezzreadingquiz-option englezzreadingquiz-ripple flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-green-50" id="englezzreadingquiz-a2-true-${q.id}">✓ True</button>
                <button onclick="EnglezzQuiz.selectTF(${q.id}, false)" class="englezzreadingquiz-option englezzreadingquiz-ripple flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-red-50" id="englezzreadingquiz-a2-false-${q.id}">✗ False</button>
              </div>
              <div id="englezzreadingquiz-feedback-a2-${q.id}" class="mt-3"></div>
            </div>
        `).join('');
    },

    selectTF: function(qId, selected) {
        const question = this.currentQuestions.activity2.find(q => q.id === qId);
        const isCorrect = selected === question.answer;
        this.answers.activity2[qId] = { selected, isCorrect };
        
        const trueBtn = document.getElementById(`englezzreadingquiz-a2-true-${qId}`);
        const falseBtn = document.getElementById(`englezzreadingquiz-a2-false-${qId}`);
        
        trueBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect');
        falseBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect');
        
        if (selected === true) {
            trueBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect');
            if (!isCorrect) falseBtn.classList.add('englezzreadingquiz-correct');
        } else {
            falseBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect');
            if (!isCorrect) trueBtn.classList.add('englezzreadingquiz-correct');
        }
        
        const el = document.getElementById(`englezzreadingquiz-feedback-a2-${qId}`);
        el.innerHTML = isCorrect 
            ? `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">🎉 Correct!</p></div>`
            : `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect.</p></div>`;
    },

    renderActivity3: function() {
        const container = document.getElementById('englezzreadingquiz-section-activity3');
        container.innerHTML = `<h3 class="englezzreadingquiz-title text-2xl font-bold text-gray-800 mb-4">🔘 Activity 3: Multiple Choice</h3><div id="englezzreadingquiz-activity3-questions"></div><div class="mt-6 text-center"><button onclick="EnglezzQuiz.progressToActivity()" class="englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-xl"> Continue → </button></div>`;
        
        const qContainer = document.getElementById('englezzreadingquiz-activity3-questions');
        qContainer.innerHTML = this.currentQuestions.activity3.map((q, index) => `
            <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div class="flex items-start gap-3 mb-4">
                <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
                <p class="text-gray-800 font-semibold">${q.question}</p>
              </div>
              <div class="space-y-2">
                ${q.options.map((opt, optIndex) => `
                  <button onclick="EnglezzQuiz.selectMCQ(${q.id}, ${optIndex})" class="englezzreadingquiz-option englezzreadingquiz-ripple w-full text-left py-3 px-4 border-2 border-gray-300 rounded-xl bg-white" id="englezzreadingquiz-a3-opt-${q.id}-${optIndex}">
                    <span class="font-semibold text-orange-500 mr-2">${String.fromCharCode(65 + optIndex)}.</span> ${opt}
                  </button>
                `).join('')}
              </div>
              <div id="englezzreadingquiz-feedback-a3-${q.id}" class="mt-3"></div>
            </div>
        `).join('');
    },

    selectMCQ: function(qId, selectedIndex) {
        const question = this.currentQuestions.activity3.find(q => q.id === qId);
        const isCorrect = selectedIndex === question.answer;
        this.answers.activity3[qId] = { selected: selectedIndex, isCorrect };
        
        question.options.forEach((_, idx) => { 
            const btn = document.getElementById(`englezzreadingquiz-a3-opt-${qId}-${idx}`);
            if(btn) btn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect'); 
        });
        
        const selectedBtn = document.getElementById(`englezzreadingquiz-a3-opt-${qId}-${selectedIndex}`);
        const correctBtn = document.getElementById(`englezzreadingquiz-a3-opt-${qId}-${question.answer}`);
        
        if (selectedBtn) selectedBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect');
        if (!isCorrect && correctBtn) correctBtn.classList.add('englezzreadingquiz-correct');
        
        const el = document.getElementById(`englezzreadingquiz-feedback-a3-${qId}`);
        el.innerHTML = isCorrect 
            ? `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">🎯 Correct!</p></div>` 
            : `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect. Correct: ${question.options[question.answer]}</p></div>`;
    },

    renderActivity4: function() {
        const container = document.getElementById('englezzreadingquiz-section-activity4');
        container.innerHTML = `<h3 class="englezzreadingquiz-title text-2xl font-bold text-gray-800 mb-4">📝 Activity 4: Fill in Blanks</h3><div id="englezzreadingquiz-activity4-questions"></div><div class="mt-6 text-center"><button onclick="EnglezzQuiz.viewResults()" class="englezzreadingquiz-btn englezzreadingquiz-ripple bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl"> View Results 🏆 </button></div>`;
        
        const qContainer = document.getElementById('englezzreadingquiz-activity4-questions');
        qContainer.innerHTML = this.currentQuestions.activity4.map((q, index) => `
            <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div class="flex items-start gap-3 mb-4">
                <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
                <p class="text-gray-800 font-semibold">${q.text}</p>
              </div>
              <select id="englezzreadingquiz-a4-q${q.id}" class="englezzreadingquiz-textarea w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none bg-white" onchange="EnglezzQuiz.updateAnswer('activity4', ${q.id}, this.value)">
                <option value="">-- Select an answer --</option>
                ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
              </select>
              <button onclick="EnglezzQuiz.checkActivity4(${q.id})" class="englezzreadingquiz-btn englezzreadingquiz-ripple mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg">Check</button>
              <div id="englezzreadingquiz-feedback-a4-${q.id}" class="mt-3"></div>
            </div>
        `).join('');
    },

    updateAnswer: function(act, id, val) { this.answers[act][id] = val; },

    checkActivity4: function(qId) {
        const question = this.currentQuestions.activity4.find(q => q.id === qId);
        const val = this.answers.activity4[qId] || '';
        const el = document.getElementById(`englezzreadingquiz-feedback-a4-${qId}`);
        if (!val) { el.innerHTML = `<div class="englezzreadingquiz-feedback bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg"><p class="font-semibold text-yellow-800">⚠️ Select an answer!</p></div>`; return; }
        const isCorrect = val === question.answer;
        el.innerHTML = isCorrect 
            ? `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">✅ Correct!</p></div>` 
            : `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect. Answer: ${question.answer}</p></div>`;
    },

    progressToActivity: function() {
        const map = { activity1: 'activity2', activity2: 'activity3', activity3: 'activity4' };
        const progMap = { activity1: 'englezzreadingquiz-progress-a1', activity2: 'englezzreadingquiz-progress-a2' };
        
        if (this.currentActivity !== 'activity4') {
            document.getElementById(`englezzreadingquiz-section-${this.currentActivity}`).classList.add('hidden');
            const next = map[this.currentActivity];
            document.getElementById(`englezzreadingquiz-section-${next}`).classList.remove('hidden');
            
            // Update indicators
            const activeIndicators = document.querySelectorAll('.englezzreadingquiz-step-indicator.englezzreadingquiz-active');
            if(activeIndicators.length > 0) {
                activeIndicators[0].classList.remove('englezzreadingquiz-active');
                activeIndicators[0].classList.add('englezzreadingquiz-completed');
            }
            
            const nextProg = document.getElementById(progMap[this.currentActivity]);
            if(nextProg) nextProg.classList.add('englezzreadingquiz-active');

            this.currentActivity = next;
            window.scrollTo(0, 0);
        }
    },

    viewResults: function() {
        document.getElementById('englezzreadingquiz-quiz-screen').classList.add('hidden');
        document.getElementById('englezzreadingquiz-results-screen').classList.remove('hidden');
        
        let correct = 0, incorrect = 0, unanswered = 0;
        
        this.currentQuestions.activity2.forEach(q => { if (this.answers.activity2[q.id]) { this.answers.activity2[q.id].isCorrect ? correct++ : incorrect++; } else { unanswered++; } });
        this.currentQuestions.activity3.forEach(q => { if (this.answers.activity3[q.id]) { this.answers.activity3[q.id].isCorrect ? correct++ : incorrect++; } else { unanswered++; } });
        this.currentQuestions.activity4.forEach(q => { if (this.answers.activity4[q.id]) { this.answers.activity4[q.id] === q.answer ? correct++ : incorrect++; } else { unanswered++; } });

        const total = this.currentQuestions.activity2.length + this.currentQuestions.activity3.length + this.currentQuestions.activity4.length;
        const percentage = Math.round((correct / total) * 100);

        const resScreen = document.getElementById('englezzreadingquiz-results-screen');
        resScreen.innerHTML = `
          <div class="text-center">
              <div class="text-6xl mb-4">🏆</div>
              <h2 class="englezzreadingquiz-title text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
              <div class="flex justify-center mb-6 relative h-40">
               <svg width="150" height="150" class="transform -rotate-90 absolute left-1/2 -translate-x-1/2">
                <circle cx="75" cy="75" r="65" stroke="#e5e7eb" stroke-width="12" fill="none" />
                <circle id="englezzreadingquiz-score-circle" class="englezzreadingquiz-score-circle" cx="75" cy="75" r="65" stroke="#f97316" stroke-width="12" fill="none" stroke-linecap="round" />
               </svg>
               <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <div id="englezzreadingquiz-final-score" class="text-4xl font-bold text-orange-500">${percentage}%</div>
                <div class="text-gray-500 text-sm">Score</div>
               </div>
              </div>
              <div class="grid grid-cols-3 gap-4 mb-6">
               <div class="bg-green-50 p-4 rounded-xl"><div class="text-2xl font-bold text-green-600">${correct}</div><div class="text-sm text-gray-600">Correct</div></div>
               <div class="bg-red-50 p-4 rounded-xl"><div class="text-2xl font-bold text-red-500">${incorrect}</div><div class="text-sm text-gray-600">Incorrect</div></div>
               <div class="bg-gray-50 p-4 rounded-xl"><div class="text-2xl font-bold text-gray-600">${unanswered}</div><div class="text-sm text-gray-600">Empty</div></div>
              </div>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="EnglezzQuiz.retry()" class="englezzreadingquiz-btn bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl text-lg"> Try Again 🔄 </button>
                <button onclick="EnglezzQuiz.restart()" class="englezzreadingquiz-btn bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-8 rounded-xl text-lg"> Reset Menu 🏠 </button>
              </div>
          </div>`;

        const circle = document.getElementById('englezzreadingquiz-score-circle');
        const circumference = 2 * Math.PI * 65;
        const offset = circumference - (percentage / 100) * circumference;
        setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
        window.scrollTo(0, 0);
    },

    retry: function() {
        this.answers = { activity1: {}, activity2: {}, activity3: {}, activity4: {} };
        this.currentActivity = 'activity1';
        this.initializeQuestions(); // Re-shuffle
        
        document.getElementById('englezzreadingquiz-results-screen').classList.add('hidden');
        document.getElementById('englezzreadingquiz-quiz-screen').classList.remove('hidden');
        document.getElementById('englezzreadingquiz-section-activity1').classList.remove('hidden');
        document.getElementById('englezzreadingquiz-section-activity2').classList.add('hidden');
        document.getElementById('englezzreadingquiz-section-activity3').classList.add('hidden');
        document.getElementById('englezzreadingquiz-section-activity4').classList.add('hidden');
        
        document.querySelectorAll('.englezzreadingquiz-step-indicator').forEach((ind, index) => {
            ind.classList.remove('englezzreadingquiz-active', 'englezzreadingquiz-completed');
            if(index === 0) ind.classList.add('englezzreadingquiz-active');
        });
        
        this.renderActivity1(); this.renderActivity2(); this.renderActivity3(); this.renderActivity4();
        window.scrollTo(0, 0);
    },

    restart: function() {
        this.selectedDifficulty = null;
        this.answers = { activity1: {}, activity2: {}, activity3: {}, activity4: {} };
        this.currentActivity = 'activity1';
        
        document.getElementById('englezzreadingquiz-results-screen').classList.add('hidden');
        document.getElementById('englezzreadingquiz-quiz-screen').classList.add('hidden');
        document.getElementById('englezzreadingquiz-difficulty-screen').classList.remove('hidden');
        
        ['easy', 'medium', 'hard'].forEach(d => { 
            const btn = document.getElementById(`englezzreadingquiz-${d}-btn`);
            if(btn) btn.classList.remove('englezzreadingquiz-selected'); 
        });
        document.getElementById('englezzreadingquiz-start-btn').disabled = true;
        window.scrollTo(0, 0);
    }
};
<!-- ENGLEZZ QUIZ SYSTEM - THEME CODE END -->
