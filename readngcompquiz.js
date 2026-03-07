<!-- ENGLEZZ QUIZ SYSTEM - START THEME CODE -->
<script>
  // Global State
  let selectedDifficulty = null;
  let answers = { activity1: {}, activity2: {}, activity3: {} };
  let currentActivity = 'reading';
  
  // Configuration Variables (Will be set by Post Code)
  let englezz_config = { title: 'Quiz', adClient: '', adSlot1: '', adSlot2: '', adSlot3: '' };
  let questionsData = {}; 
  let readingPassageHtml = '';

  // Core Functions
  function englezzreadingquizSelectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    ['easy', 'medium', 'hard'].forEach(d => {
      const btn = document.getElementById(`englezzreadingquiz-${d}-btn`);
      if(btn) btn.classList.remove('englezzreadingquiz-selected');
    });
    const selectedBtn = document.getElementById(`englezzreadingquiz-${difficulty}-btn`);
    if(selectedBtn) selectedBtn.classList.add('englezzreadingquiz-selected');
    const startBtn = document.getElementById('englezzreadingquiz-start-btn');
    if(startBtn) startBtn.disabled = false;
  }

  function englezzreadingquizStartQuiz() {
    if (!selectedDifficulty) return;
    document.getElementById('englezzreadingquiz-difficulty-screen').classList.add('hidden');
    document.getElementById('englezzreadingquiz-quiz-screen').classList.remove('hidden');
    englezzreadingquizRenderActivity1();
    englezzreadingquizRenderActivity2();
    englezzreadingquizRenderActivity3();
    englezzreadingquizShowSection('reading');
  }

  function englezzreadingquizShowSection(section) {
    const sections = ['reading', 'activity1', 'activity2', 'activity3'];
    sections.forEach(s => {
      const el = document.getElementById(`englezzreadingquiz-section-${s}`);
      if(el) el.classList.add('hidden');
    });
    
    const target = document.getElementById(`englezzreadingquiz-section-${section}`);
    if(target) target.classList.remove('hidden');
    currentActivity = section;

    if (section === 'activity1') englezzreadingquizLoadAdsense('slot1');
    else if (section === 'activity2') englezzreadingquizLoadAdsense('slot2');
    else if (section === 'activity3') englezzreadingquizLoadAdsense('slot3');
  }

  function englezzreadingquizProgressToActivity() {
    if (currentActivity === 'reading') {
      englezzreadingquizShowSection('activity1');
      document.getElementById('englezzreadingquiz-progress-a1').classList.add('englezzreadingquiz-active');
    } else if (currentActivity === 'activity1') {
      englezzreadingquizShowSection('activity2');
      document.getElementById('englezzreadingquiz-progress-a1').classList.remove('englezzreadingquiz-active');
      document.getElementById('englezzreadingquiz-progress-a1').classList.add('englezzreadingquiz-completed');
      document.getElementById('englezzreadingquiz-progress-a2').classList.add('englezzreadingquiz-active');
    } else if (currentActivity === 'activity2') {
      englezzreadingquizShowSection('activity3');
      document.getElementById('englezzreadingquiz-progress-a2').classList.remove('englezzreadingquiz-active');
      document.getElementById('englezzreadingquiz-progress-a2').classList.add('englezzreadingquiz-completed');
      document.getElementById('englezzreadingquiz-progress-a3').classList.add('englezzreadingquiz-active');
    }
  }

  function englezzreadingquizLoadAdsense(slotName) {
    const slotMap = { 'slot1': englezz_config.adSlot1, 'slot2': englezz_config.adSlot2, 'slot3': englezz_config.adSlot3 };
    const slotId = slotMap[slotName];
    const clientId = englezz_config.adClient;
    const container = document.getElementById(`englezzreadingquiz-adsense-${slotName}`);
    if (!slotId || !clientId || !container) return;
    container.innerHTML = ''; // Clear placeholder
    // Note: Actual AdSense injection logic can be complex in dynamic apps. 
    // This is a basic implementation.
    const adIns = document.createElement('ins');
    adIns.className = 'adsbygoogle';
    adIns.style.display = 'block';
    adIns.setAttribute('data-ad-client', clientId);
    adIns.setAttribute('data-ad-slot', slotId);
    adIns.setAttribute('data-ad-format', 'auto');
    adIns.setAttribute('data-full-width-responsive', 'true');
    container.appendChild(adIns);
    try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) { console.error("AdSense error", e); }
  }

  function englezzreadingquizRenderActivity1() {
    const container = document.getElementById('englezzreadingquiz-activity1-questions');
    if(!container || !questionsData[selectedDifficulty]) return;
    const questions = questionsData[selectedDifficulty].activity1;
    container.innerHTML = questions.map((q, index) => `
      <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
        <div class="flex items-start gap-3 mb-3">
          <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
          <p class="text-gray-800 font-semibold">${q.question}</p>
        </div>
        <textarea id="englezzreadingquiz-a1-q${q.id}" class="englezzreadingquiz-textarea w-full p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none" rows="3" placeholder="Write your answer here..." oninput="englezzreadingquizUpdateAnswer('activity1', ${q.id}, this.value)">${answers.activity1[q.id] || ''}</textarea>
        <button onclick="englezzreadingquizCheckActivity1Answer(${q.id})" class="englezzreadingquiz-btn mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg"> Check Answer 🔍 </button>
        <div id="englezzreadingquiz-feedback-a1-${q.id}" class="mt-3"></div>
      </div>
    `).join('');
  }

  function englezzreadingquizRenderActivity2() {
    const container = document.getElementById('englezzreadingquiz-activity2-questions');
    if(!container || !questionsData[selectedDifficulty]) return;
    const questions = questionsData[selectedDifficulty].activity2;
    container.innerHTML = questions.map((q, index) => `
      <div class="mb-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
        <div class="flex items-start gap-3 mb-4">
          <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
          <p class="text-gray-800">${q.statement}</p>
        </div>
        <div class="flex gap-3">
          <button onclick="englezzreadingquizSelectTrueFalse(${q.id}, true)" class="englezzreadingquiz-option flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-green-50" id="englezzreadingquiz-a2-true-${q.id}"> ✓ True </button>
          <button onclick="englezzreadingquizSelectTrueFalse(${q.id}, false)" class="englezzreadingquiz-option flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold bg-white hover:bg-red-50" id="englezzreadingquiz-a2-false-${q.id}"> ✗ False </button>
        </div>
        <div id="englezzreadingquiz-feedback-a2-${q.id}" class="mt-3"></div>
      </div>
    `).join('');
  }

  function englezzreadingquizRenderActivity3() {
    const container = document.getElementById('englezzreadingquiz-activity3-questions');
    if(!container || !questionsData[selectedDifficulty]) return;
    const questions = questionsData[selectedDifficulty].activity3;
    container.innerHTML = questions.map((q, index) => `
      <div class="mb-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
        <div class="flex items-start gap-3 mb-4">
          <span class="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">${index + 1}</span>
          <p class="text-gray-800 font-semibold">${q.question}</p>
        </div>
        <div class="space-y-2">
          ${q.options.map((opt, optIndex) => `
            <button onclick="englezzreadingquizSelectMCQ(${q.id}, ${optIndex})" class="englezzreadingquiz-option w-full text-left py-3 px-4 border-2 border-gray-300 rounded-xl bg-white" id="englezzreadingquiz-a3-opt-${q.id}-${optIndex}">
              <span class="font-semibold text-orange-500 mr-2">${String.fromCharCode(65 + optIndex)}.</span> ${opt}
            </button>
          `).join('')}
        </div>
        <div id="englezzreadingquiz-feedback-a3-${q.id}" class="mt-3"></div>
      </div>
    `).join('');
  }

  function englezzreadingquizUpdateAnswer(activity, questionId, value) { answers[activity][questionId] = value; }

  function englezzreadingquizCheckActivity1Answer(questionId) {
    const question = questionsData[selectedDifficulty].activity1.find(q => q.id === questionId);
    const userAnswer = answers.activity1[questionId] || '';
    const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a1-${questionId}`);
    if (!userAnswer.trim()) { feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg"><p class="font-semibold text-yellow-800">⚠️ Please write your answer first!</p></div>`; return; }
    
    const keywords = question.answer.toLowerCase().split(' ').filter(w => w.length > 4);
    const userWords = userAnswer.toLowerCase().split(' ');
    const matchCount = keywords.filter(k => userWords.some(w => w.includes(k))).length;
    const matchPercent = keywords.length > 0 ? (matchCount / keywords.length) * 100 : 0;
    let feedback, bgColor, borderColor, icon;
    if (matchPercent >= 50 || userAnswer.length > 30) { feedback = "Great effort! 🌟 Here's the model answer:"; bgColor = 'bg-green-100'; borderColor = 'border-green-500'; icon = '✅'; }
    else { feedback = "Good try! 💪 Review the model answer:"; bgColor = 'bg-blue-100'; borderColor = 'border-blue-500'; icon = '📚'; }
    feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback ${bgColor} border-l-4 ${borderColor} p-4 rounded-r-lg"><p class="font-semibold text-gray-800 mb-2">${icon} ${feedback}</p><p class="text-gray-700 bg-white p-3 rounded-lg"><strong>Model Answer:</strong> ${question.answer}</p></div>`;
  }

  function englezzreadingquizSelectTrueFalse(questionId, selected) {
    const question = questionsData[selectedDifficulty].activity2.find(q => q.id === questionId);
    const isCorrect = selected === question.answer;
    answers.activity2[questionId] = { selected, isCorrect };
    const trueBtn = document.getElementById(`englezzreadingquiz-a2-true-${questionId}`);
    const falseBtn = document.getElementById(`englezzreadingquiz-a2-false-${questionId}`);
    trueBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect');
    falseBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect');
    if (selected === true) { trueBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect'); if (!isCorrect) falseBtn.classList.add('englezzreadingquiz-correct'); }
    else { falseBtn.classList.add(isCorrect ? 'englezzreadingquiz-correct' : 'englezzreadingquiz-incorrect'); if (!isCorrect) trueBtn.classList.add('englezzreadingquiz-correct'); }
    const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a2-${questionId}`);
    if (isCorrect) feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">🎉 Correct!</p></div>`;
    else feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect. Answer: <strong>${question.answer ? 'True' : 'False'}</strong></p></div>`;
  }

  function englezzreadingquizSelectMCQ(questionId, selectedIndex) {
    const question = questionsData[selectedDifficulty].activity3.find(q => q.id === questionId);
    const isCorrect = selectedIndex === question.answer;
    answers.activity3[questionId] = { selected: selectedIndex, isCorrect };
    question.options.forEach((_, idx) => { const optBtn = document.getElementById(`englezzreadingquiz-a3-opt-${questionId}-${idx}`); optBtn.classList.remove('englezzreadingquiz-correct', 'englezzreadingquiz-incorrect'); });
    const selectedBtn = document.getElementById(`englezzreadingquiz-a3-opt-${questionId}-${selectedIndex}`);
    const correctBtn = document.getElementById(`englezzreadingquiz-a3-opt-${questionId}-${question.answer}`);
    if (isCorrect) selectedBtn.classList.add('englezzreadingquiz-correct');
    else { selectedBtn.classList.add('englezzreadingquiz-incorrect'); correctBtn.classList.add('englezzreadingquiz-correct'); }
    const feedbackEl = document.getElementById(`englezzreadingquiz-feedback-a3-${questionId}`);
    if (isCorrect) feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-green-100 border-l-4 border-green-500 p-3 rounded-r-lg"><p class="font-semibold text-green-800">🎯 Correct!</p></div>`;
    else feedbackEl.innerHTML = `<div class="englezzreadingquiz-feedback bg-red-100 border-l-4 border-red-500 p-3 rounded-r-lg"><p class="font-semibold text-red-800">❌ Incorrect. Answer: <strong>${String.fromCharCode(65 + question.answer)}</strong></p></div>`;
  }

  function englezzreadingquizViewResults() {
    document.getElementById('englezzreadingquiz-quiz-screen').classList.add('hidden');
    document.getElementById('englezzreadingquiz-results-screen').classList.remove('hidden');
    let correct = 0, incorrect = 0, unanswered = 0;
    const a1Questions = questionsData[selectedDifficulty].activity1.length;
    let a1Checked = 0; Object.keys(answers.activity1).forEach(key => { if (answers.activity1[key]) a1Checked++; });
    correct += Math.round(a1Checked * 0.5); unanswered += (a1Questions - a1Checked);
    questionsData[selectedDifficulty].activity2.forEach(q => { if (answers.activity2[q.id]) { if (answers.activity2[q.id].isCorrect) correct++; else incorrect++; } else unanswered++; });
    questionsData[selectedDifficulty].activity3.forEach(q => { if (answers.activity3[q.id]) { if (answers.activity3[q.id].isCorrect) correct++; else incorrect++; } else unanswered++; });
    const totalAnswerable = 12;
    const percentage = Math.round((correct / totalAnswerable) * 100);
    document.getElementById('englezzreadingquiz-correct-count').textContent = correct;
    document.getElementById('englezzreadingquiz-incorrect-count').textContent = incorrect;
    document.getElementById('englezzreadingquiz-unanswered-count').textContent = unanswered;
    document.getElementById('englezzreadingquiz-final-score').textContent = `${percentage}%`;
    const circle = document.getElementById('englezzreadingquiz-score-circle');
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (percentage / 100) * circumference;
    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
    let message, emoji;
    if (percentage >= 90) { message = "Outstanding performance!"; emoji = "🏆"; }
    else if (percentage >= 70) { message = "Great job!"; emoji = "🎉"; }
    else if (percentage >= 50) { message = "Good effort!"; emoji = "📖"; }
    else { message = "Keep practicing!"; emoji = "💡"; }
    document.getElementById('englezzreadingquiz-results-message').innerHTML = `<div class="text-4xl mb-3">${emoji}</div><p class="text-gray-700 text-lg">${message}</p>`;
  }

  function englezzreadingquizRestart() {
    selectedDifficulty = null; answers = { activity1: {}, activity2: {}, activity3: {} };
    ['easy', 'medium', 'hard'].forEach(d => { const btn = document.getElementById(`englezzreadingquiz-${d}-btn`); if(btn) btn.classList.remove('englezzreadingquiz-selected'); });
    document.getElementById('englezzreadingquiz-start-btn').disabled = true;
    document.getElementById('englezzreadingquiz-score-circle').style.strokeDashoffset = 283;
    document.getElementById('englezzreadingquiz-progress-a1').classList.remove('englezzreadingquiz-active', 'englezzreadingquiz-completed');
    document.getElementById('englezzreadingquiz-progress-a2').classList.remove('englezzreadingquiz-active', 'englezzreadingquiz-completed');
    document.getElementById('englezzreadingquiz-progress-a3').classList.remove('englezzreadingquiz-active', 'englezzreadingquiz-completed');
    document.getElementById('englezzreadingquiz-results-screen').classList.add('hidden');
    document.getElementById('englezzreadingquiz-quiz-screen').classList.add('hidden');
    document.getElementById('englezzreadingquiz-difficulty-screen').classList.remove('hidden');
  }
</script>
<!-- ENGLEZZ QUIZ SYSTEM - END THEME CODE -->
