    // --- Utility Functions ---
    function shuffleArray(array) {
        const newArray = [...array]; 
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // --- Core Logic ---
    function englezzreadingquizSelectDifficulty(difficulty) {
      selectedDifficulty = difficulty;
      ['easy', 'medium', 'hard'].forEach(d => {
        document.getElementById(`englezzreadingquiz-${d}-btn`).classList.remove('englezzreadingquiz-selected');
      });
      document.getElementById(`englezzreadingquiz-${difficulty}-btn`).classList.add('englezzreadingquiz-selected');
      document.getElementById('englezzreadingquiz-start-btn').disabled = false;
    }

    function initializeQuestions() {
        // Deep copy
        currentQuestions = JSON.parse(JSON.stringify(questionsData[selectedDifficulty]));
        
        // Shuffle Questions Order
        currentQuestions.activity1 = shuffleArray(currentQuestions.activity1);
        currentQuestions.activity2 = shuffleArray(currentQuestions.activity2);
        currentQuestions.activity3 = shuffleArray(currentQuestions.activity3);
        currentQuestions.activity4 = shuffleArray(currentQuestions.activity4);

        // Shuffle Options Order for MCQ (Activity 3)
        currentQuestions.activity3.forEach(q => {
            const correctAnswerText = q.options[q.answer];
            q.options = shuffleArray(q.options);
            q.answer = q.options.indexOf(correctAnswerText);
        });

        // Shuffle Options Order for Fill in Blanks (Activity 4)
        currentQuestions.activity4.forEach(q => {
            q.options = shuffleArray(q.options);
        });
    }

    function englezzreadingquizStartQuiz() {
      if (!selectedDifficulty) return;
      initializeQuestions(); 
      document.getElementById('englezzreadingquiz-difficulty-screen').classList.add('hidden');
      document.getElementById('englezzreadingquiz-quiz-screen').classList.remove('hidden');
      document.getElementById('englezzreadingquiz-reading-content').innerHTML = readingPassages[selectedDifficulty];
      englezzreadingquizRenderAllActivities();
      window.scrollTo(0, 0);
    }

    function englezzreadingquizRenderAllActivities() {
      englezzreadingquizRenderActivity1();
      englezzreadingquizRenderActivity2();
      englezzreadingquizRenderActivity3();
      englezzreadingquizRenderActivity4();
    }

    // --- Render Functions ---
    function englezzreadingquizRenderActivity1() {
      const container = document.getElementById('englezzreadingquiz-activity1-questions');
      container.innerHTML = currentQuestions.activity1.map((q, index) => `
        <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div class="flex items-start gap-3 mb-3">
            <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
            <p class="text-gray-800 font-semibold">${q.question}</p>
          </div>
          <textarea id="englezzreadingquiz-a1-q${q.id}" class="englezzreadingquiz-textarea w-full p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none" rows="3" placeholder="Write your answer here..." oninput="englezzreadingquizUpdateAnswer('activity1', ${q.id}, this.value)">${answers.activity1[q.id] || ''}</textarea>
          <button onclick="englezzreadingquizCheckActivity1Answer(${q.id})" class="englezzreadingquiz-btn englezzreadingquiz-ripple mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg">Check Answer</button>
          <div id="englezzreadingquiz-feedback-a1-${q.id}" class="mt-3"></div>
        </div>
      `).join('');
    }

    function englezzreadingquizRenderActivity2() {
      const container = document.getElementById('englezzreadingquiz-activity2-questions');
      container.innerHTML = currentQuestions.activity2.map((q, index) => `
        <div class="mb-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div class="flex items-start gap-3 mb-4">
            <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
            <p class="text-gray-800">${q.statement}</p>
          </div>
          <div class="flex gap-3">
            <button onclick="englezzreadingquizSelectTrueFalse(${q.id}, true)" class="englezzreadingquiz-option englezzreadingquiz-ripple flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-green-50" id="englezzreadingquiz-a2-true-${q.id}">✓ True</button>
            <button onclick="englezzreadingquizSelectTrueFalse(${q.id}, false)" class="englezzreadingquiz-option englezzreadingquiz-ripple flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-red-50" id="englezzreadingquiz-a2-false-${q.id}">✗ False</button>
          </div>
          <div id="englezzreadingquiz-feedback-a2-${q.id}" class="mt-3"></div>
        </div>
      `).join('');
    }

    function englezzreadingquizRenderActivity3() {
      const container = document.getElementById('englezzreadingquiz-activity3-questions');
      container.innerHTML = currentQuestions.activity3.map((q, index) => `
        <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div class="flex items-start gap-3 mb-4">
            <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
            <p class="text-gray-800 font-semibold">${q.question}</p>
          </div>
          <div class="space-y-2">
            ${q.options.map((opt, optIndex) => `
              <button onclick="englezzreadingquizSelectMCQ(${q.id}, ${optIndex})" class="englezzreadingquiz-option englezzreadingquiz-ripple w-full text-left py-3 px-4 border-2 border-gray-300 rounded-xl bg-white" id="englezzreadingquiz-a3-opt-${q.id}-${optIndex}">
                <span class="font-semibold text-orange-500 mr-2">${String.fromCharCode(65 + optIndex)}.</span> ${opt}
              </button>
            `).join('')}
          </div>
          <div id="englezzreadingquiz-feedback-a3-${q.id}" class="mt-3"></div>
        </div>
      `).join('');
    }

    function englezzreadingquizRenderActivity4() {
      const container = document.getElementById('englezzreadingquiz-activity4-questions');
      container.innerHTML = currentQuestions.activity4.map((q, index) => `
        <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div class="flex items-start gap-3 mb-4">
            <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
            <p class="text-gray-800 font-semibold">${q.text}</p>
          </div>
          <select id="englezzreadingquiz-a4-q${q.id}" class="englezzreadingquiz-textarea w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none bg-white" onchange="englezzreadingquizUpdateAnswer('activity4', ${q.id}, this.value)">
            <option value="">-- Select an answer --</option>
            ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <button onclick="englezzreadingquizCheckActivity4Answer(${q.id})" class="englezzreadingquiz-btn englezzreadingquiz-ripple mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg">Check</button>
          <div id="englezzreadingquiz-feedback-a4-${q.id}" class="mt-3"></div>
        </div>
      `).join('');
    }

    // --- Interaction Logic ---
    function englezzreadingquizUpdateAnswer(activity, questionId, value) { answers[activity][questionId] = value; }

    function englezzreadingquizCheckActivity1Answer(questionId) {
      const question = currentQuestions.activity1.find(q => q.id === questionId);
      const userAnswer = answers.activity1[questionId] || '';
      const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a1-${questionId}`);
      if (!userAnswer.trim()) { feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg"><p class="font-semibold text-yellow-800">⚠️ Please write your answer first!</p></div>`; return; }
      feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-4 rounded-r-lg"><p class="font-semibold text-green-800">✅ Model Answer: ${question.answer}</p></div>`;
    }

    function englezzreadingquizSelectTrueFalse(questionId, selected) {
      const question = currentQuestions.activity2.find(q => q.id === questionId);
      const isCorrect = selected === question.answer;
      answers.activity2[questionId] = { selected, isCorrect };
      const trueBtn = document.getElementById(`englezzreadingquiz-a2-true-${questionId}`);
      const falseBtn = document.getElementById(`englezzreadingquiz-a2-false-${questionId}`);
      trueBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect');
      falseBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect');
      if (selected === true) { trueBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect'); if (!isCorrect) falseBtn.classList.add('englezzreadingquiz-correct'); } 
      else { falseBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect'); if (!isCorrect) trueBtn.classList.add('englezzreadingquiz-correct'); }
      const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a2-${questionId}`);
      feedbackEl.innerHTML = isCorrect ? `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">🎉 Correct!</p></div>` : `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect.</p></div>`;
    }

    function englezzreadingquizSelectMCQ(questionId, selectedIndex) {
      const question = currentQuestions.activity3.find(q => q.id === questionId);
      const isCorrect = selectedIndex === question.answer;
      answers.activity3[questionId] = { selected: selectedIndex, isCorrect };
      question.options.forEach((_, idx) => { const optBtn = document.getElementById(`englezzreadingquiz-a3-opt-${questionId}-${idx}`); if(optBtn) optBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect'); });
      const selectedBtn = document.getElementById(`englezzreadingquiz-a3-opt-${questionId}-${selectedIndex}`);
      const correctBtn = document.getElementById(`englezzreadingquiz-a3-opt-${questionId}-${question.answer}`);
      if (selectedBtn) selectedBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect');
      if (!isCorrect && correctBtn) correctBtn.classList.add('englezzreadingquiz-correct');
      const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a3-${questionId}`);
      feedbackEl.innerHTML = isCorrect ? `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">🎯 Correct!</p></div>` : `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect. Correct: ${question.options[question.answer]}</p></div>`;
    }
    
    function englezzreadingquizCheckActivity4Answer(questionId) {
      const question = currentQuestions.activity4.find(q => q.id === questionId);
      const userAnswer = answers.activity4[questionId] || '';
      const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a4-${questionId}`);
      if (!userAnswer) { feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg"><p class="font-semibold text-yellow-800">⚠️ Select an answer!</p></div>`; return; }
      const isCorrect = userAnswer === question.answer;
      feedbackEl.innerHTML = isCorrect ? `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">✅ Correct!</p></div>` : `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect. Answer: ${question.answer}</p></div>`;
    }

    function englezzreadingquizProgressToActivity() {
      if (currentActivity === 'activity1') {
        currentActivity = 'activity2';
        document.getElementById('englezzreadingquiz-section-activity1').classList.add('hidden');
        document.getElementById('englezzreadingquiz-section-activity2').classList.remove('hidden');
        document.querySelector('.englezzreadingquiz-step-indicator.englezzreadingquiz-active').classList.remove('englezzreadingquiz-active');
        document.querySelector('.englezzreadingquiz-step-indicator.englezzreadingquiz-active')?.classList.add('englezzreadingquiz-completed');
        document.getElementById('englezzreadingquiz-progress-a1').classList.add('englezzreadingquiz-active');
      } else if (currentActivity === 'activity2') {
        currentActivity = 'activity3';
        document.getElementById('englezzreadingquiz-section-activity2').classList.add('hidden');
        document.getElementById('englezzreadingquiz-section-activity3').classList.remove('hidden');
        document.getElementById('englezzreadingquiz-progress-a1').classList.remove('englezzreadingquiz-active');
        document.getElementById('englezzreadingquiz-progress-a1').classList.add('englezzreadingquiz-completed');
        document.getElementById('englezzreadingquiz-progress-a2').classList.add('englezzreadingquiz-active');
      } else if (currentActivity === 'activity3') {
        currentActivity = 'activity4';
        document.getElementById('englezzreadingquiz-section-activity3').classList.add('hidden');
        document.getElementById('englezzreadingquiz-section-activity4').classList.remove('hidden');
        document.getElementById('englezzreadingquiz-progress-a2').classList.remove('englezzreadingquiz-active');
        document.getElementById('englezzreadingquiz-progress-a2').classList.add('englezzreadingquiz-completed');
        document.getElementById('englezzreadingquiz-progress-a3').classList.add('englezzreadingquiz-active');
      }
      window.scrollTo(0, 0);
    }

    function englezzreadingquizViewResults() {
      document.getElementById('englezzreadingquiz-quiz-screen').classList.add('hidden');
      document.getElementById('englezzreadingquiz-results-screen').classList.remove('hidden');
      let correct = 0, incorrect = 0, unanswered = 0;
      currentQuestions.activity2.forEach(q => { if (answers.activity2[q.id]) { answers.activity2[q.id].isCorrect ? correct++ : incorrect++; } else { unanswered++; } });
      currentQuestions.activity3.forEach(q => { if (answers.activity3[q.id]) { answers.activity3[q.id].isCorrect ? correct++ : incorrect++; } else { unanswered++; } });
      currentQuestions.activity4.forEach(q => { if (answers.activity4[q.id]) { answers.activity4[q.id] === q.answer ? correct++ : incorrect++; } else { unanswered++; } });
      const totalAnswerable = currentQuestions.activity2.length + currentQuestions.activity3.length + currentQuestions.activity4.length;
      const percentage = Math.round((correct / totalAnswerable) * 100);
      document.getElementById('englezzreadingquiz-correct-count').textContent = correct;
      document.getElementById('englezzreadingquiz-incorrect-count').textContent = incorrect;
      document.getElementById('englezzreadingquiz-unanswered-count').textContent = unanswered;
      document.getElementById('englezzreadingquiz-final-score').textContent = `${percentage}%`;
      const circle = document.getElementById('englezzreadingquiz-score-circle');
      const circumference = 2 * Math.PI * 65;
      const offset = circumference - (percentage / 100) * circumference;
      setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
      let message = percentage >= 70 ? "Great job!" : percentage >= 50 ? "Good effort!" : "Keep practicing!";
      document.getElementById('englezzreadingquiz-results-message').innerHTML = `<div class="text-4xl mb-3">${percentage >= 70 ? '🎉' : '📖'}</div><p class="text-gray-700 text-lg">${message}</p><p class="text-sm text-gray-500 mt-2">Difficulty: <span class="font-semibold capitalize">${selectedDifficulty}</span></p>`;
      window.scrollTo(0, 0);
    }

    function englezzreadingquizRetry() {
      answers = { activity1: {}, activity2: {}, activity3: {}, activity4: {} };
      currentActivity = 'activity1';
      initializeQuestions(); // Re-shuffle
      document.getElementById('englezzreadingquiz-score-circle').style.strokeDashoffset = 283;
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
      englezzreadingquizRenderAllActivities();
      window.scrollTo(0, 0);
    }

    function englezzreadingquizRestart() {
      selectedDifficulty = null;
      answers = { activity1: {}, activity2: {}, activity3: {}, activity4: {} };
      currentActivity = 'activity1';
      ['easy', 'medium', 'hard'].forEach(d => { document.getElementById(`englezzreadingquiz-${d}-btn`).classList.remove('englezzreadingquiz-selected'); });
      document.getElementById('englezzreadingquiz-start-btn').disabled = true;
      document.getElementById('englezzreadingquiz-results-screen').classList.add('hidden');
      document.getElementById('englezzreadingquiz-quiz-screen').classList.add('hidden');
      document.getElementById('englezzreadingquiz-difficulty-screen').classList.remove('hidden');
      document.getElementById('englezzreadingquiz-section-activity1').classList.remove('hidden');
      document.getElementById('englezzreadingquiz-section-activity2').classList.add('hidden');
      document.getElementById('englezzreadingquiz-section-activity3').classList.add('hidden');
      document.getElementById('englezzreadingquiz-section-activity4').classList.add('hidden');
      document.querySelectorAll('.englezzreadingquiz-step-indicator').forEach((ind, index) => {
          ind.classList.remove('englezzreadingquiz-active', 'englezzreadingquiz-completed');
          if(index === 0) ind.classList.add('englezzreadingquiz-active');
      });
      window.scrollTo(0, 0);
    }
