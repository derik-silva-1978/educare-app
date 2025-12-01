
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// ==================== APP STATE ====================
class AppState {
    profile;
    progress;
    anamnesisState;

    constructor() {
        this.loadState();
    }

    loadState() {
        const savedState = localStorage.getItem('titiNautaState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            this.profile = parsed.profile;
            this.progress = parsed.progress;
            this.anamnesisState = parsed.anamnesisState || { checklist: {} };
        } else {
            this.profile = { babyName: null, babyDob: null, babySex: null, startDate: null };
            this.progress = { 
                completedThemes: [], 
                earnedBadges: [], 
                babyTrailProgress: 0, 
                motherTrailProgress: 0, 
                journeyCompleteProgress: 0,
                completedQuizzes: [],
                quizAnswers: {}
            };
            this.anamnesisState = { checklist: {} };
        }
    }

    saveState() {
        localStorage.setItem('titiNautaState', JSON.stringify({
            profile: this.profile,
            progress: this.progress,
            anamnesisState: this.anamnesisState
        }));
    }
    
    getBabyAgeInDays() {
        if (!this.profile.babyDob) return null;
        const dob = new Date(this.profile.babyDob);
        const today = new Date();
        dob.setMinutes(dob.getMinutes() + dob.getTimezoneOffset());
        today.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - dob.getTime();
        return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    }

    getBabyAgeInWeeks() {
        const days = this.getBabyAgeInDays();
        if (days === null) return null;
        return Math.floor(days / 7);
    }
    
    getBabyAgeInMonths() {
        const days = this.getBabyAgeInDays();
        if (days === null) return null;
        return Math.floor(days / 30.44); // Average days in a month
    }

    completeTheme(themeName) {
        if (!this.progress.completedThemes.includes(themeName)) {
            this.progress.completedThemes.push(themeName);
            this.saveState();
        }
    }

    addBadge(badgeId) {
        if (!this.progress.earnedBadges.includes(badgeId)) {
            this.progress.earnedBadges.push(badgeId);
            this.saveState();
            return true;
        }
        return false;
    }
    
    completeQuiz(quizId) {
        if (!this.progress.completedQuizzes.includes(quizId)) {
            this.progress.completedQuizzes.push(quizId);
            this.saveState();
        }
    }
    
    saveQuizAnswers(quizId, answers) {
        this.progress.quizAnswers[quizId] = answers;
        this.saveState();
    }

    updateProgress(journeyData) {
        if (!journeyData || !journeyData.baby || !journeyData.mother) return;

        const calculateTrailProgress = (trailData) => {
            let totalItems = 0;
            let completedItems = 0;
            const uniqueQuizzes = new Set();
    
            trailData.forEach(month => {
                month.journey.forEach(week => {
                    totalItems += week.topics.length;
                    if (week.interactive_flow?.quiz_ref) {
                        uniqueQuizzes.add(week.interactive_flow.quiz_ref);
                    }
                });
            });
            totalItems += uniqueQuizzes.size;
    
            const allTopics = trailData.flatMap(month => month.journey.flatMap(week => week.topics));
            completedItems += allTopics.filter(topic => this.progress.completedThemes.includes(topic.title)).length;
            
            completedItems += Array.from(uniqueQuizzes).filter(quizId => this.progress.completedQuizzes.includes(quizId)).length;
            
            return {
                total: totalItems,
                completed: completedItems,
                percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
            };
        };
    
        const babyProgress = calculateTrailProgress(journeyData.baby);
        const motherProgress = calculateTrailProgress(journeyData.mother);
    
        this.progress.babyTrailProgress = babyProgress.percentage;
        this.progress.motherTrailProgress = motherProgress.percentage;
    
        const totalJourneyItems = babyProgress.total + motherProgress.total;
        const completedJourneyItems = babyProgress.completed + motherProgress.completed;
    
        this.progress.journeyCompleteProgress = totalJourneyItems > 0 ? Math.round((completedJourneyItems / totalJourneyItems) * 100) : 0;
    
        this.saveState();
    }
    
    updateAnamnesis(itemId, data) {
        this.anamnesisState.checklist[itemId] = { ...this.anamnesisState.checklist[itemId], ...data };
        this.saveState();
    }
    
    getAnamnesisItem(itemId) {
        return this.anamnesisState.checklist[itemId] || { done: false, result: null, notes: '', selectedOption: null };
    }

    resetState() {
        this.profile = { babyName: null, babyDob: null, babySex: null, startDate: null };
        this.progress = { 
            completedThemes: [], 
            earnedBadges: [], 
            babyTrailProgress: 0, 
            motherTrailProgress: 0,
            journeyCompleteProgress: 0,
            completedQuizzes: [],
            quizAnswers: {}
        };
        this.anamnesisState = { checklist: {} };
        localStorage.removeItem('titiNautaState');
    }
}


// ==================== MAIN APP CLASS ====================
class TitiNautaApp {
    
    constructor() {
        this.appState = new AppState();
        this.domElements = this._getDomElements();
        this.currentScreen = null;
        this.activeTrail = 'baby';
        this.activeTheme = null;
        this.currentQuiz = { id: null, trail: null, step: 0, answers: {}, data: null };
        this.activeAnamnesisTab = null;
        
        this.speechSynthesis = 'speechSynthesis' in window ? window.speechSynthesis : null;
        this.speechUtterance = null;
        this.voices = [];
        this.activeAudioButton = null;
    }

    async init() {
        await this._loadAllData();
        this._initSpeechSynthesis();
        this._initEventListeners();
        
        if (this.appState.profile && this.appState.profile.babyName) {
            this._showScreen('journeyScreen');
            this.renderJourneyScreen();
        } else {
            this._showScreen('welcomeScreen');
            this.renderWelcomeScreen();
        }
    }
    
    _getDomElements() {
        const ids = [
            'welcomeScreen', 'journeyScreen', 'checkInScreen', 'weeklyQuizScreen', 'themeScreen', 'contentScreen', 'badgeGalleryScreen',
            'welcomeForm', 'babyName', 'babyDob', 'babySex', 'calculatedAge',
            'welcomeText', 'badgeCounter', 'badgeCounterText', 'babyTrailProgress', 'motherTrailProgress', 'journeyCompleteProgress',
            'babyTrailProgressBar', 'motherTrailProgressBar', 'journeyCompleteProgressBar', 'journeyTabs', 'babyJourneyMap',
            'motherJourneyMap', 'anamnesisJourneyMap', 'continueJourneyBtn',
            'checkInStep', 'checkInQuestion',
            'weeklyQuizTitle', 'weeklyQuizDescription', 'weeklyQuizDomainsContainer', 'weeklyQuizNotes', 'weeklyQuizProgress',
            'weeklyQuizBackBtn', 'weeklyQuizNextBtn', 'weeklyQuizCompleteBtn', 'backFromQuizBtn',
            'themeSelectionTitle', 'themeSelectionDescription', 'themeOptions', 'backFromThemeBtn',
            'contentIcon', 'contentTitle', 'microcard', 'action-tabs', 'textTab', 'audioTab', 'textContent', 'audioContent',
            'audioIllustration', 'soundWaves', 'audioStatus', 'playAudioBtn', 'audioIcon', 'audioLabel', 'extraLinks',
            'completeBtn', 'backFromContentBtn',
            'closeGalleryBtn', 'badgeGalleryTabs', 'babyBadgeCount', 'motherBadgeCount', 'babyBadgeGallery', 'motherBadgeGallery',
            'samuBtn', 'cvvBtn', 'ligue180Btn', 'resetAppBtn',
            'badgeEarned', 'badgeIcon', 'badgeName',
            'modal', 'modalTitle', 'modalText', 'modalButtons',
            'anamnesisModal', 'anamnesisModalTitle', 'anamnesisModalCloseBtn', 'anamnesisModalContent'
        ];
        return ids.reduce((acc, id) => {
            const el = document.getElementById(id);
            if (!el) console.warn(`DOM element with id "${id}" not found.`);
            acc[id] = el;
            return acc;
        }, {});
    }

    async _loadAllData() {
        try {
            const [
                babyJourney,
                motherJourney,
                quizzes,
                badgesData, 
                anamnesisData
            ] = await Promise.all([
                fetch('./journeys/baby-journey.json').then(res => res.json()),
                fetch('./journeys/mother-journey.json').then(res => res.json()),
                fetch('./quizzes/quizzes.json').then(res => res.json()),
                fetch('./data/badges.json').then(res => res.json()),
                fetch('./anamnese/anamnese-consolidada.json').then(res => res.json()),
            ]);

            this.journeyData = {
                baby: babyJourney.map((m, i) => ({ ...m, month: i + 1, icon: ['1️⃣', '2️⃣', '3️⃣'][i] })),
                mother: motherJourney.map((m, i) => ({ ...m, month: i + 1, icon: ['1️⃣', '2️⃣', '3️⃣'][i] }))
            };
            this.quizData = quizzes;
            this.badges = badgesData.badges;
            this.anamnesisData = anamnesisData;
            this.activeAnamnesisTab = this.anamnesisData?.timeline[0]?.key || 'firstVisit';


        } catch (error) {
            console.error('Failed to load app data:', error);
            document.body.innerHTML = '<div style="color:red; text-align:center; padding: 20px;">Error loading application data. Please try again later.</div>';
        }
    }

    _initEventListeners() {
        this.domElements.welcomeForm.addEventListener('submit', this._handleWelcomeFormSubmit.bind(this));
        this.domElements.babyDob.addEventListener('input', this._updateCalculatedAge.bind(this));
        this.domElements.resetAppBtn.addEventListener('click', this._handleResetApp.bind(this));
        this.domElements.samuBtn.addEventListener('click', () => window.open('tel:192'));
        this.domElements.cvvBtn.addEventListener('click', () => window.open('tel:188'));
        this.domElements.ligue180Btn.addEventListener('click', () => window.open('tel:180'));
        this.domElements.continueJourneyBtn.addEventListener('click', this._handleContinueJourney.bind(this));
        
        document.body.addEventListener('click', this._handleDelegatedClick.bind(this));
        document.body.addEventListener('change', this._handleDelegatedChange.bind(this));
        document.body.addEventListener('input', this._handleDelegatedInput.bind(this));
    }

    _initSpeechSynthesis() {
        if (!this.speechSynthesis) return;
        
        const loadVoices = () => {
            this.voices = this.speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
        };

        loadVoices();
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    _showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
        this.domElements[screenId].classList.remove('hidden');
        this.currentScreen = screenId;
        window.scrollTo(0, 0);
    }
    
    // ==================== EVENT HANDLERS ====================

    _handleWelcomeFormSubmit(e) {
        e.preventDefault();
        this.appState.profile.babyName = this.domElements.babyName.value;
        this.appState.profile.babyDob = this.domElements.babyDob.value;
        this.appState.profile.babySex = this.domElements.babySex.value;
        this.appState.profile.startDate = new Date().toISOString();
        this.appState.saveState();

        this._showScreen('journeyScreen');
        this.renderJourneyScreen();
    }
    
    _handleResetApp(e) {
        e.preventDefault();
        this.showModal({
            title: "Apagar Dados",
            text: "Você tem certeza que quer apagar todos os seus dados e recomeçar a jornada? Esta ação não pode ser desfeita.",
            buttons: [
                { text: "Cancelar", class: "btn-secondary" },
                { text: "Apagar e Recomeçar", class: "btn-primary", action: () => {
                    this.appState.resetState();
                    window.location.reload();
                }}
            ]
        });
    }

    _handleContinueJourney() {
        const currentWeekNumber = this.appState.getBabyAgeInWeeks() + 1;
        
        const trailData = this.activeTrail === 'baby' ? this.journeyData.baby : this.journeyData.mother;
        const currentMonthData = trailData.find(month => month.journey.some(week => week.week === currentWeekNumber));
        
        if (currentMonthData) {
            const currentWeekData = currentMonthData.journey.find(week => week.week === currentWeekNumber);
            if (currentWeekData && currentWeekData.interactive_flow?.quiz_ref) {
                this.startQuiz(currentWeekData.interactive_flow.quiz_ref, this.activeTrail);
            } else {
                 this._startThemeSelection(currentWeekNumber, this.activeTrail);
            }
        } else {
             this._startThemeSelection(currentWeekNumber, this.activeTrail);
        }
    }
    
    _handleDelegatedClick(e) {
        const target = e.target;
        
        // Tab navigation handler
        const journeyTab = target.closest('.journey-tab');
        if (journeyTab) {
            // Checklist's internal tabs
            if (target.closest('#anamnesisTabsContainer')) {
                this.activeAnamnesisTab = journeyTab.dataset.tab;
                this._renderAnamnesisTabContent();
                return;
            }
            // Badge gallery tabs
            if (target.closest('#badgeGalleryTabs')) {
                this._setActiveBadgeTab(journeyTab.dataset.badgeTab);
                return;
            }
            // Main journey tabs
            if (target.closest('#journeyTabs')) {
                this.activeTrail = journeyTab.dataset.tab;
                this.renderJourneyScreen();
                return;
            }
        }
        
        if (target.closest('.avatar-section')) {
            this._showScreen('badgeGalleryScreen');
            this._renderBadgeGallery();
        }
        
        if (target.id === 'closeGalleryBtn') {
            this._showScreen('journeyScreen');
        }
        
        if (target.closest('.month-header:not(.locked)')) {
            target.closest('.journey-month-card').classList.toggle('expanded');
        }

        const weekCard = target.closest('.journey-week:not(.locked)');
        if (weekCard) {
            const quizButton = target.closest('.btn-week-quiz');
            if (quizButton) {
                this.startQuiz(quizButton.dataset.weekQuizId, weekCard.dataset.trail);
            } else {
                 const week = parseInt(weekCard.dataset.week);
                 const trail = weekCard.dataset.trail;
                 this._startThemeSelection(week, trail);
            }
        }
        
        if (target.id === 'backFromThemeBtn') {
            this._showScreen('journeyScreen');
        }
        
        if (target.closest('.theme-pill:not(.completed)')) {
            const themePill = target.closest('.theme-pill');
            const themeTitle = themePill.dataset.themeTitle;
            const week = parseInt(themePill.dataset.week);
            const trail = themePill.dataset.trail;
            this._startContent(themeTitle, week, trail);
        }
        
        if (target.id === 'backFromContentBtn' || target.id === 'backFromQuizBtn') {
            this._showScreen('journeyScreen');
            this.renderJourneyScreen();
        }
        
        if (target.closest('.action-tab')) {
            this._handleContentTabClick(target.closest('.action-tab'));
        }

        if (target.closest('#playAudioBtn')) {
            this._toggleAudioPlayback(this.activeTheme.content.acaoAudio, target.closest('#playAudioBtn'));
        }
        
        if (target.id === 'completeBtn') {
            this._completeContent();
        }
        
        if (target.id === 'weeklyQuizNextBtn') {
            this._handleQuizNavigation(1);
        }
        
        if (target.id === 'weeklyQuizBackBtn') {
            this._handleQuizNavigation(-1);
        }
        
        if (target.closest('.progress-dot') && !target.closest('.progress-dot.active')) {
            const step = parseInt(target.closest('.progress-dot').dataset.step);
            this._goToQuizStep(step);
        }
        
        if (target.id === 'weeklyQuizCompleteBtn') {
            this._completeQuiz();
        }

        if (target.closest('.modal-buttons .btn')) {
            const button = target.closest('.modal-buttons .btn');
            if (button.action) button.action();
            this.hideModal();
        }
        
        if(target.closest('.btn-close')) {
            const modalId = target.closest('.modal-overlay')?.id;
            if (modalId) this.hideModal(modalId);
        }
        
        // Anamnesis Handlers
        if (target.closest('.anamnesis-item-card .item-card-header')) {
            if (target.closest('.btn-audio-detail')) {
                e.stopPropagation();
                const button = target.closest('.btn-audio-detail');
                const text = button.dataset.audioText;
                this._toggleAudioPlayback(text, button);
            } else {
                target.closest('.anamnesis-item-card').classList.toggle('expanded');
            }
        }
        
        if(target.closest('.btn-clear-result')) {
            e.stopPropagation();
            const button = target.closest('.btn-clear-result');
            const itemId = button.dataset.itemId;
            const inputName = button.dataset.inputName;
            
            document.querySelectorAll(`input[name="${inputName}"]`).forEach(radio => radio.checked = false);
            
            if (this.activeAnamnesisTab === 'newborn') {
                 this.appState.updateAnamnesis(itemId, { selectedOption: null });
            } else {
                 this.appState.updateAnamnesis(itemId, { result: null });
            }
           
            this._renderAnamnesisTabContent();
        }
        
        if (target.closest('.week-badge-icon')) {
            const badgeId = target.closest('.week-badge-icon').dataset.badgeId;
            const badge = this.badges.find(b => b.id === badgeId);
            if(badge) {
                this.showModal({
                    title: `${badge.icone} ${badge.nome}`,
                    text: badge.description,
                    buttons: [{ text: "Fechar", class: "btn-secondary" }],
                });
            }
        }
    }
    
    _handleDelegatedChange(e) {
        const target = e.target;
        
        if (target.closest('.anamnesis-item-card')) {
             e.stopPropagation(); // Stop propagation for all changes within the card
        }

        if(target.matches('input[type="checkbox"][data-toggle]')) {
            const itemId = target.dataset.itemId;
            this.appState.updateAnamnesis(itemId, { done: target.checked });
            this._renderAnamnesisTabContent();
        }

        if(target.matches('input[type="radio"][name^="result-"]')) {
            const itemId = target.dataset.itemId;
            this.appState.updateAnamnesis(itemId, { result: target.value });
            this._renderAnamnesisTabContent();
        }
        
        if(target.matches('input[type="radio"][name^="anamnesis-option-"]')) {
            const itemId = target.dataset.itemId;
            this.appState.updateAnamnesis(itemId, { selectedOption: target.value });
            this._renderAnamnesisTabContent();
        }
    }
    
    _handleDelegatedInput(e) {
        const target = e.target;
        if(target.matches('textarea[data-anamnesis-notes]')) {
            e.stopPropagation();
            const itemId = target.dataset.itemId;
            this.appState.updateAnamnesis(itemId, { notes: target.value });
        }
    }

    _handleContentTabClick(tab) {
        if (tab.classList.contains('active')) return;
        this._stopAudio();
        
        const tabs = this.domElements['action-tabs'].querySelectorAll('.action-tab');
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const isTextTab = tab.id === 'textTab';
        this.domElements.textContent.classList.toggle('hidden', !isTextTab);
        this.domElements.audioContent.classList.toggle('hidden', isTextTab);
    }
    
    // ==================== RENDER METHODS ====================

    renderWelcomeScreen() {
        this._updateCalculatedAge();
    }
    
    renderJourneyScreen() {
        this.appState.updateProgress(this.journeyData);
        
        this.domElements.welcomeText.textContent = `Jornada de ${this.appState.profile.babyName}`;
        const earnedBadgesCount = this.appState.progress.earnedBadges.length;
        this.domElements.badgeCounterText.textContent = `${earnedBadgesCount} Conquista${earnedBadgesCount !== 1 ? 's' : ''} Desbloqueada${earnedBadgesCount !== 1 ? 's' : ''} 🏆`;
        
        this.domElements.babyTrailProgress.textContent = `${this.appState.progress.babyTrailProgress}%`;
        this.domElements.babyTrailProgressBar.style.width = `${this.appState.progress.babyTrailProgress}%`;
        
        this.domElements.motherTrailProgress.textContent = `${this.appState.progress.motherTrailProgress}%`;
        this.domElements.motherTrailProgressBar.style.width = `${this.appState.progress.motherTrailProgress}%`;
        
        this.domElements.journeyCompleteProgress.textContent = `${this.appState.progress.journeyCompleteProgress}%`;
        this.domElements.journeyCompleteProgressBar.style.width = `${this.appState.progress.journeyCompleteProgress}%`;
        
        this.renderJourneyTabs();
        this.renderJourneyMap();
    }

    renderJourneyTabs() {
        const tabs = [
            { id: 'baby', label: 'Bebê 👶' },
            { id: 'mother', label: 'Mãe 💜' },
            { id: 'anamnesis', label: 'Checklist ✅' }
        ];
        
        this.domElements.journeyTabs.innerHTML = tabs.map(tab => `
            <button 
                class="journey-tab ${this.activeTrail === tab.id ? 'active' : ''}" 
                data-tab="${tab.id}" 
                role="tab" 
                aria-controls="${tab.id}JourneyMap" 
                aria-selected="${this.activeTrail === tab.id}">
                ${tab.label}
            </button>
        `).join('');
    }

    renderJourneyMap() {
        const isBabyActive = this.activeTrail === 'baby';
        const isMotherActive = this.activeTrail === 'mother';
        const isAnamnesisActive = this.activeTrail === 'anamnesis';
        
        this.domElements.babyJourneyMap.classList.toggle('hidden', !isBabyActive);
        this.domElements.motherJourneyMap.classList.toggle('hidden', !isMotherActive);
        this.domElements.anamnesisJourneyMap.classList.toggle('hidden', !isAnamnesisActive);

        if (isBabyActive) {
            this.domElements.babyJourneyMap.innerHTML = this._renderTrail(this.journeyData.baby, 'baby');
        } else if (isMotherActive) {
            this.domElements.motherJourneyMap.innerHTML = this._renderTrail(this.journeyData.mother, 'mother');
        } else if (isAnamnesisActive) {
            this.renderAnamnesisScreen();
        }
        
        this.domElements.continueJourneyBtn.classList.toggle('hidden', isAnamnesisActive);
    }
    
    _renderTrail(trailData, trailName) {
        const babyAgeInWeeks = this.appState.getBabyAgeInWeeks();
        const babyAgeInMonths = this.appState.getBabyAgeInMonths();

        return trailData.map(monthData => {
            const isMonthLocked = (monthData.month - 1) > babyAgeInMonths;
            const isExpanded = false; // All months start closed
            
            return `
            <div class="journey-month-card ${isExpanded ? 'expanded' : ''}" data-month="${monthData.month}">
                <div class="month-header ${isMonthLocked ? 'locked' : ''}" role="button" aria-expanded="${isExpanded}" aria-controls="month-content-${monthData.month}-${trailName}">
                    <span class="month-status">${isMonthLocked ? '🔒' : monthData.icon}</span>
                    <div class="month-info">
                        <h3>${monthData.title}</h3>
                        <p>${monthData.journey.length} semanas de conteúdo</p>
                    </div>
                    <span class="month-chevron">❯</span>
                </div>
                <div class="month-weeks-container" id="month-content-${monthData.month}-${trailName}">
                    ${monthData.journey.map(week => this._renderWeek(week, babyAgeInWeeks, trailName)).join('')}
                </div>
            </div>
            `;
        }).join('');
    }

    _renderWeek(week, currentWeek, trailName) {
        const isWeekLocked = week.week > (currentWeek + 1);
        const isWeekCompleted = week.topics.every(topic => this.appState.progress.completedThemes.includes(topic.title));
        const isWeekActive = week.week === (currentWeek + 1);
        
        let markerClass = '';
        if (isWeekLocked) markerClass = 'locked';
        else if (isWeekCompleted) markerClass = 'completed';
        else if (isWeekActive) markerClass = 'active';

        const hasQuiz = !!week.interactive_flow?.quiz_ref;
        const isQuizCompleted = hasQuiz && this.appState.progress.completedQuizzes.includes(week.interactive_flow.quiz_ref);
        
        const earnedBadgesForWeek = week.topics
            .filter(topic => this.appState.progress.completedThemes.includes(topic.title))
            .map(topic => topic.content.badge.id)
            .concat(isQuizCompleted ? [
                this.quizData[week.interactive_flow.quiz_ref]?.badge_on_complete?.[trailName]?.id,
                this.quizData[week.interactive_flow.quiz_ref]?.badge_on_complete?.id
            ].filter(Boolean) : []);
        
        const uniqueBadges = [...new Set(earnedBadgesForWeek)];

        return `
            <div class="journey-week ${isWeekLocked ? 'locked' : ''}" data-week="${week.week}" data-trail="${trailName}">
                <div class="week-marker ${markerClass}">
                     ${isWeekLocked ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>` : week.week}
                </div>
                <div class="week-content">
                    <div class="week-title">${week.title}</div>
                    <div class="week-topics">${week.description}</div>
                     ${uniqueBadges.length > 0 ? `
                        <div class="week-badges">
                            ${uniqueBadges.map(badgeId => {
                                const badge = this.badges.find(b => b.id === badgeId);
                                return badge ? `<div class="week-badge-icon" data-badge-id="${badgeId}" title="${badge.nome}">${badge.icone}</div>` : '';
                            }).join('')}
                        </div>
                    ` : ''}
                    ${hasQuiz && !isWeekLocked ? this._renderWeekQuizButtons(week.interactive_flow.quiz_ref, isQuizCompleted) : ''}
                </div>
            </div>
        `;
    }

    _renderWeekQuizButtons(quizRef, isCompleted) {
        const quizData = this.quizData[quizRef];
        if (!quizData) return '';
        
        return `
        <div class="week-quiz-buttons">
            <button class="btn btn-secondary btn-week-quiz ${isCompleted ? 'completed' : ''}" data-week-quiz-id="${quizRef}">
                <span class="quiz-btn-icon">${quizData.icon}</span>
                <span>${isCompleted ? 'Quiz Concluído' : quizData.title}</span>
            </button>
        </div>
        `;
    }
    
    _renderBadgeGallery() {
        this.domElements.badgeGalleryTabs.innerHTML = `
             <button class="journey-tab ${this.activeTrail === 'baby' ? 'active' : ''}" data-badge-tab="baby" role="tab" aria-controls="babyBadgeGallery" aria-selected="true">Bebê 👶 <span id="babyBadgeCount" class="badge-tab-counter"></span></button>
             <button class="journey-tab ${this.activeTrail === 'mother' ? 'active' : ''}" data-badge-tab="mother" role="tab" aria-controls="motherBadgeGallery" aria-selected="false">Mãe 💜 <span id="motherBadgeCount" class="badge-tab-counter"></span></button>
        `;

        const babyBadges = this.badges.filter(b => this.journeyData.baby.some(m => m.journey.some(w => w.topics.some(t => t.content.badge.id === b.id) || this.quizData[w.interactive_flow?.quiz_ref]?.badge_on_complete?.baby?.id === b.id || this.quizData[w.interactive_flow?.quiz_ref]?.badge_on_complete?.id === b.id)));
        const motherBadges = this.badges.filter(b => this.journeyData.mother.some(m => m.journey.some(w => w.topics.some(t => t.content.badge.id === b.id) || this.quizData[w.interactive_flow?.quiz_ref]?.badge_on_complete?.mother?.id === b.id || this.quizData[w.interactive_flow?.quiz_ref]?.badge_on_complete?.id === b.id)));
        
        const renderBadgeList = (list) => {
            return list.map(badge => {
                const isEarned = this.appState.progress.earnedBadges.includes(badge.id);
                return `
                <div class="badge-item ${isEarned ? 'earned' : ''}">
                    <div class="badge-item-icon">${badge.icone}</div>
                    <div class="badge-item-name">${badge.nome}</div>
                </div>
                `;
            }).join('');
        };
        
        this.domElements.babyBadgeGallery.innerHTML = renderBadgeList(babyBadges);
        this.domElements.motherBadgeGallery.innerHTML = renderBadgeList(motherBadges);
        
        this.domElements.babyBadgeCount.textContent = `(${this.appState.progress.earnedBadges.filter(b => babyBadges.some(bb => bb.id === b)).length}/${babyBadges.length})`;
        this.domElements.motherBadgeCount.textContent = `(${this.appState.progress.earnedBadges.filter(b => motherBadges.some(mb => mb.id === b)).length}/${motherBadges.length})`;
        
        this._setActiveBadgeTab(this.activeTrail);
    }
    
    _setActiveBadgeTab(tabName) {
        this.domElements.badgeGalleryTabs.querySelectorAll('.journey-tab').forEach(tab => {
            const isSelected = tab.dataset.badgeTab === tabName;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected);
        });
        this.domElements.babyBadgeGallery.classList.toggle('hidden', tabName !== 'baby');
        this.domElements.motherBadgeGallery.classList.toggle('hidden', tabName !== 'mother');
    }

    // ==================== UTILITY & HELPER METHODS ====================

    _updateCalculatedAge() {
        const dob = this.domElements.babyDob.value;
        if (dob) {
            const dobDate = new Date(dob);
            dobDate.setMinutes(dobDate.getMinutes() + dobDate.getTimezoneOffset());
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffTime = today.getTime() - dobDate.getTime();
            const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
            this.domElements.calculatedAge.textContent = `Idade: ${diffDays} dia(s)`;
        } else {
            this.domElements.calculatedAge.textContent = '';
        }
    }

    _personalizeText(text) {
        if (!text) return '';
        const babyName = this.appState.profile.babyName || 'o bebê';
        const isFeminine = this.appState.profile.babySex === 'F';
        return text
            .replace(/{nome}/g, babyName)
            .replace(/{pronome}/g, isFeminine ? 'ela' : 'ele')
            .replace(/{preposicao}/g, isFeminine ? 'da' : 'do');
    }
    
    // ... Audio logic, Theme logic, Quiz logic, Anamnesis logic, Modal logic ...
    
    // Placeholder for other logic for brevity
    
    _startThemeSelection(week, trail) {
        const trailData = trail === 'baby' ? this.journeyData.baby : this.journeyData.mother;
        const monthData = trailData.find(m => m.journey.some(w => w.week === week));
        if (!monthData) return;
        const weekData = monthData.journey.find(w => w.week === week);
        if (!weekData) return;

        this._showScreen('themeScreen');
        this.domElements.themeSelectionTitle.innerHTML = `Semana ${week}: ${weekData.title}`;
        this.domElements.themeSelectionDescription.innerHTML = this._personalizeText(weekData.description);
        
        this.domElements.themeOptions.innerHTML = weekData.topics.map(topic => {
            const isCompleted = this.appState.progress.completedThemes.includes(topic.title);
            return `
            <div class="theme-pill ${isCompleted ? 'completed' : ''}" data-theme-title="${topic.title}" data-week="${week}" data-trail="${trail}" role="button" tabindex="0">
                <span class="theme-pill-icon">${topic.content.badge.icone}</span>
                <div class="theme-pill-info">
                    <div class="theme-pill-title">${topic.title}</div>
                    <div class="theme-pill-desc">${topic.content.microcard.titulo}</div>
                </div>
            </div>
            `;
        }).join('');
    }

    _startContent(themeTitle, week, trail) {
        const trailData = trail === 'baby' ? this.journeyData.baby : this.journeyData.mother;
        const monthData = trailData.find(m => m.journey.some(w => w.week === week));
        const weekData = monthData.journey.find(w => w.week === week);
        this.activeTheme = weekData.topics.find(t => t.title === themeTitle);

        if (!this.activeTheme) return;

        this._showScreen('contentScreen');
        
        this.domElements.contentIcon.textContent = this.activeTheme.content.badge.icone;
        this.domElements.contentTitle.textContent = this.activeTheme.title;
        
        const microcard = this.activeTheme.content.microcard;
        this.domElements.microcard.innerHTML = `
            <h3>${this._personalizeText(microcard.titulo)}</h3>
            <ul>${microcard.itens.map(item => `<li>${this._personalizeText(item)}</li>`).join('')}</ul>
        `;
        
        const personalizedText = this._personalizeText(this.activeTheme.content.acaoTexto)
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        this.domElements.textContent.innerHTML = `<p>${personalizedText.replace(/\n/g, '</p><p>')}</p>`;

        this.domElements.audioIllustration.textContent = this.activeTheme.content.audioIllustration;
        
        this.domElements.extraLinks.innerHTML = this.activeTheme.content.extraContent.map(link => `
            <a href="${link.url}" target="_blank" class="extra-link">${link.titulo} ↗️</a>
        `).join('');

        this.domElements.completeBtn.textContent = `Aprendi! Concluir "${this.activeTheme.title}"`;
        
        this._handleContentTabClick(this.domElements.textTab);
    }
    
    _completeContent() {
        this.appState.completeTheme(this.activeTheme.title);
        const newBadgeId = this.activeTheme.content.badge.id;
        const wasBadgeAdded = this.appState.addBadge(newBadgeId);

        if (wasBadgeAdded) {
            this._showBadgeEarnedAnimation(newBadgeId);
        } else {
            this._showScreen('journeyScreen');
            this.renderJourneyScreen();
        }
    }
    
    _showBadgeEarnedAnimation(badgeId) {
        const badge = this.badges.find(b => b.id === badgeId);
        if (!badge) return;

        this.domElements.badgeIcon.textContent = badge.icone;
        this.domElements.badgeName.textContent = badge.nome;
        this.domElements.badgeEarned.classList.remove('hidden');

        setTimeout(() => {
            this.domElements.badgeEarned.classList.add('hidden');
            this._showScreen('journeyScreen');
            this.renderJourneyScreen();
        }, 3000);
    }
    
    startQuiz(quizId, trail) {
        this.currentQuiz.id = quizId;
        this.currentQuiz.trail = trail;
        this.currentQuiz.step = 0;
        this.currentQuiz.data = this.quizData[quizId];
        this.currentQuiz.answers = this.appState.progress.quizAnswers[quizId] || {};
        
        if(!this.currentQuiz.data) return;

        this._showScreen('weeklyQuizScreen');
        this._renderQuizStep();
    }
    
    _renderQuizStep() {
        const quizData = this.currentQuiz.data;
        this.domElements.weeklyQuizTitle.textContent = quizData.title;
        this.domElements.weeklyQuizDescription.innerHTML = this._personalizeText(quizData.description);
        
        const domains = quizData.baby_domains.concat(quizData.mother_domains || []);
        
        const currentDomain = domains[this.currentQuiz.step];
        this._renderQuizDomain(currentDomain);
        this._updateQuizNavigation(domains.length);
    }

    _renderQuizDomain(domain) {
        const answer = this.currentQuiz.answers[domain.id];
        const showFeedback = !!answer;
        const feedback = showFeedback ? (answer === domain.options[0] ? domain.feedback.positivo : domain.feedback.negativo) : '';

        this.domElements.weeklyQuizDomainsContainer.innerHTML = `
        <div class="quiz-domain" id="domain-${domain.id}">
            <div class="item-card-header">
                <span class="label">${domain.title}</span>
            </div>
            <div class="quiz-domain-question"><p>${this._personalizeText(domain.question)}</p></div>
            <div class="quiz-domain-options">
                ${domain.options.map(option => `
                <label>
                    <input type="radio" name="${domain.id}" value="${option}" ${answer === option ? 'checked' : ''}>
                    <span>${this._personalizeText(option)}</span>
                </label>
                `).join('')}
            </div>
            ${showFeedback ? `
                <div class="quiz-feedback ${answer === domain.options[0] ? 'feedback-positivo' : 'feedback-negativo'}">
                    <p>${this._personalizeText(feedback)}</p>
                </div>
            ` : ''}
             ${this._renderQuizKnowledge(domain.knowledge, domain.id)}
        </div>
        `;
        
        const radios = this.domElements.weeklyQuizDomainsContainer.querySelectorAll(`input[name="${domain.id}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentQuiz.answers[domain.id] = e.target.value;
                this._renderQuizDomain(domain);
            });
        });

        const slider = this.domElements.weeklyQuizDomainsContainer.querySelector('.quiz-image-slider-container');
        if (slider) this._initQuizSlider(slider);
    }
    
    _renderQuizKnowledge(knowledge, domainId) {
        if (!knowledge) return '';
        return `
            <div class="quiz-knowledge-section" data-domain-id="${domainId}">
                <div class="item-card-header">
                     <span class="label">${this._personalizeText(knowledge.title)}</span>
                     <button class="btn-audio-detail" data-audio-text="${knowledge.audio}" aria-label="Ouvir explicação">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                     </button>
                     <span class="chevron">❯</span>
                </div>
                <div class="item-details-content">
                    <div class="item-details-inner">
                        ${knowledge.image_urls && knowledge.image_urls.length > 0 ? this._renderQuizImageSlider(knowledge.image_urls, domainId) : ''}
                        <div class="knowledge-text-audio-container">
                             <div class="knowledge-text">
                                <p>${this._personalizeText(knowledge.text)}</p>
                             </div>
                        </div>
                        ${knowledge.links && knowledge.links.length > 0 ? `
                        <div class="quiz-knowledge-links">
                            ${knowledge.links.map(link => `<a href="${link.url}" target="_blank" class="extra-link">${link.titulo} ↗️</a>`).join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    _renderQuizImageSlider(images, domainId) {
        if (!images || images.length === 0) return '';
        const hasMultiple = images.length > 1;

        return `
            <div class="quiz-image-slider-container" data-domain-id="${domainId}">
                <div class="slider-wrapper">
                    ${images.map(url => `<img src="${url}" class="slider-image" alt="Ilustração do tema">`).join('')}
                </div>
                ${hasMultiple ? `
                    <button class="slider-btn prev">❮</button>
                    <button class="slider-btn next">❯</button>
                    <div class="slider-dots">
                        ${images.map((_, i) => `<div class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    _initQuizSlider(sliderContainer) {
        let currentIndex = 0;
        const wrapper = sliderContainer.querySelector('.slider-wrapper');
        const images = sliderContainer.querySelectorAll('.slider-image');
        const dots = sliderContainer.querySelectorAll('.slider-dot');
        const prevBtn = sliderContainer.querySelector('.slider-btn.prev');
        const nextBtn = sliderContainer.querySelector('.slider-btn.next');

        if (images.length <= 1) return;

        function updateSlider() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });

        dots.forEach(dot => dot.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.dataset.index);
            updateSlider();
        }));
    }

    _updateQuizNavigation(totalSteps) {
        const isLastStep = this.currentQuiz.step === totalSteps - 1;
        this.domElements.weeklyQuizBackBtn.classList.toggle('hidden', this.currentQuiz.step === 0);
        this.domElements.weeklyQuizNextBtn.classList.toggle('hidden', isLastStep);
        this.domElements.weeklyQuizCompleteBtn.classList.toggle('hidden', !isLastStep);

        this.domElements.weeklyQuizProgress.innerHTML = Array.from({ length: totalSteps }, (_, i) => {
             const domain = this.currentQuiz.data.baby_domains.concat(this.currentQuiz.data.mother_domains || [])[i];
             const isAnswered = !!this.currentQuiz.answers[domain.id];
             return `<div class="progress-dot ${i === this.currentQuiz.step ? 'active' : ''} ${isAnswered ? 'answered' : ''}" data-step="${i}"></div>`
        }).join('');
    }
    
    _handleQuizNavigation(direction) {
        this.currentQuiz.step += direction;
        this._renderQuizStep();
    }
    
    _goToQuizStep(step) {
        this.currentQuiz.step = step;
        this._renderQuizStep();
    }
    
    _completeQuiz() {
        this.appState.saveQuizAnswers(this.currentQuiz.id, this.currentQuiz.answers);
        this.appState.completeQuiz(this.currentQuiz.id);
        
        const quizData = this.currentQuiz.data;
        if(quizData.badge_on_complete) {
            if(quizData.badge_on_complete.baby) this.appState.addBadge(quizData.badge_on_complete.baby.id);
            if(quizData.badge_on_complete.mother) this.appState.addBadge(quizData.badge_on_complete.mother.id);
        }
        
        this.showModal({
            title: `🏆 Quiz Concluído!`,
            text: "Você adquiriu novos superpoderes de cuidado! Suas respostas nos ajudam a te guiar melhor.",
            buttons: [{ text: "Voltar para a Jornada", class: "btn-primary", action: () => {
                this._showScreen('journeyScreen');
                this.renderJourneyScreen();
            }}]
        });
    }
    
    renderAnamnesisScreen() {
        const tabs = this.anamnesisData.timeline;
    
        this.domElements.anamnesisJourneyMap.innerHTML = `
            <div id="anamnesisTabsContainer" class="journey-tabs" role="tablist" aria-label="Fases do Checklist">
                ${tabs.map(phase => `
                <button 
                    class="journey-tab ${this.activeAnamnesisTab === phase.key ? 'active' : ''}" 
                    data-tab="${phase.key}" 
                    role="tab">
                    ${phase.title}
                </button>
            `).join('')}
            </div>
            <div id="anamnesisContentContainer"></div>
        `;
    
        this._renderAnamnesisTabContent();
    }
    
    _renderAnamnesisTabContent() {
        const container = this.domElements.anamnesisJourneyMap.querySelector('#anamnesisContentContainer');
        const activeTabs = this.domElements.anamnesisJourneyMap.querySelectorAll('#anamnesisTabsContainer .journey-tab');
        
        activeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === this.activeAnamnesisTab);
        });
        
        const phaseData = this.anamnesisData[this.activeAnamnesisTab];
        if (!phaseData) {
            container.innerHTML = `<p>Conteúdo não encontrado para a aba: ${this.activeAnamnesisTab}</p>`;
            return;
        }

        container.innerHTML = `
            <div class="anamnesis-section">
                <h2>${phaseData.title}</h2>
                <div class="anamnesis-grid-container">
                    ${phaseData.blocks.map(block => `
                        <div>
                           ${block.h ? `<h4>${block.h}</h4>` : ''}
                           ${block.items.map(item => this._renderAnamnesisItem(item)).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    _renderAnamnesisItem(item) {
        const itemState = this.appState.getAnamnesisItem(item.id);
        const hasOptions = item.options && item.options.length > 0;

        return `
            <div class="anamnesis-item-card ${itemState.done ? 'done' : ''}" id="anamnesis-item-${item.id}">
                <div class="item-card-header">
                    <span class="label">${item.title}</span>
                    <div class="item-header-actions">
                        ${item.audio ? `<button class="btn-audio-detail" data-audio-text="${this._personalizeText(item.audio)}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg></button>` : ''}
                        <span class="chevron">❯</span>
                    </div>
                </div>
                <div class="item-details-content">
                    <div class="item-details-inner">
                        <div class="detail-block">
                             <strong>Quando fazer?</strong>
                             <p>${item.when || 'Conforme orientação médica.'}</p>
                        </div>
                         <div class="detail-block">
                             <strong>Por que é importante?</strong>
                             <p>${this._personalizeText(item.why)}</p>
                        </div>
                        
                        ${!hasOptions ? `
                        <div class="item-card-toggle">
                            <div class="switch-container ${itemState.done ? 'done' : ''}">
                                <span class="status-badge">${itemState.done ? 'Realizado' : 'Pendente'}</span>
                                <label>
                                    <input type="checkbox" data-toggle data-item-id="${item.id}" ${itemState.done ? 'checked' : ''}>
                                    <div class="switch-track"><div class="switch-thumb"></div></div>
                                </label>
                            </div>
                        </div>
                        <div class="item-actions-form">
                             <div class="result-group ${itemState.result ? 'has-result' : ''}">
                                <label><input type="radio" name="result-${item.id}" value="normal" data-item-id="${item.id}" ${itemState.result === 'normal' ? 'checked' : ''}> Normal</label>
                                <label><input type="radio" name="result-${item.id}" value="altered" data-item-id="${item.id}" ${itemState.result === 'altered' ? 'checked' : ''}> Alterado</label>
                                <button class="btn-clear-result" data-item-id="${item.id}" data-input-name="result-${item.id}" title="Limpar seleção">&times;</button>
                             </div>
                             <textarea data-anamnesis-notes data-item-id="${item.id}" placeholder="Suas anotações...">${itemState.notes || ''}</textarea>
                        </div>
                        ` : ''}
                        
                        ${hasOptions ? `
                            <div class="item-actions-form">
                                <div class="anamnesis-options-group ${itemState.selectedOption ? 'has-result' : ''}">
                                    <div class="options-wrapper">
                                        ${item.options.map(opt => `
                                            <label>
                                                <input type="radio" name="anamnesis-option-${item.id}" value="${opt}" data-item-id="${item.id}" ${itemState.selectedOption === opt ? 'checked' : ''}>
                                                <span>${opt}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                    <button class="btn-clear-result" data-item-id="${item.id}" data-input-name="anamnesis-option-${item.id}" title="Limpar seleção">&times;</button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    showModal({ title, text, buttons = [] }) {
        this.domElements.modalTitle.textContent = title;
        this.domElements.modalText.innerHTML = text.replace(/\n/g, '<br>');
        this.domElements.modalButtons.innerHTML = '';
        buttons.forEach(btnInfo => {
            const button = document.createElement('button');
            button.className = `btn ${btnInfo.class || 'btn-primary'}`;
            button.textContent = btnInfo.text;
            button.action = btnInfo.action;
            this.domElements.modalButtons.appendChild(button);
        });
        this.domElements.modal.classList.remove('hidden');
    }

    hideModal(modalId = 'modal') {
        this.domElements[modalId].classList.add('hidden');
    }
    
    _toggleAudioPlayback(text, buttonElement) {
        if (!this.speechSynthesis || !text) return;
    
        if (this.speechSynthesis.speaking && this.activeAudioButton === buttonElement) {
            this.speechSynthesis.cancel(); // This will trigger 'onend'
            return;
        }
    
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
    
        this.activeAudioButton = buttonElement;
        
        this.speechUtterance = new SpeechSynthesisUtterance(this._personalizeText(text));
        
        const ptVoice = this.voices.find(v => v.name.includes('Google') && v.lang.startsWith('pt')) || this.voices[0];
        if (ptVoice) this.speechUtterance.voice = ptVoice;
    
        this.speechUtterance.onstart = () => this._updateAudioUI(buttonElement, 'playing');
        this.speechUtterance.onend = () => this._stopAudio();
        this.speechUtterance.onerror = (e) => {
            console.error('Speech synthesis error:', e.error);
            this._stopAudio();
        };
    
        this.speechSynthesis.speak(this.speechUtterance);
    }
    
    _stopAudio() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        if (this.activeAudioButton) {
            this._updateAudioUI(this.activeAudioButton, 'stopped');
            this.activeAudioButton = null;
        }
    }
    
    _updateAudioUI(buttonElement, state) {
        if (!buttonElement) return;
        const allAudioButtons = document.querySelectorAll('.btn-audio-detail');
        allAudioButtons.forEach(btn => {
            if (btn !== buttonElement) {
                btn.classList.remove('playing');
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>`;
            }
        });

        const icons = {
            play: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>`,
            pause: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>`
        };

        if (state === 'playing') {
            buttonElement.classList.add('playing');
            buttonElement.innerHTML = icons.pause;
        } else {
            buttonElement.classList.remove('playing');
            buttonElement.innerHTML = icons.play;
        }
    }
}

// ==================== APP INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const app = new TitiNautaApp();
    app.init();
});
