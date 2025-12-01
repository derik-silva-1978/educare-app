
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// ==================== APP STATE ====================
class AppState {
    profile;
    progress;
    anamnesisState;
    #synth;
    #voice;
    #acknowledgedWeeks;

    constructor() {
        this.loadState();
        this.#acknowledgedWeeks = new Set();
    }
    
    acknowledgeWeek(weekNumber, trailName) {
        const key = `${trailName}-${weekNumber}`;
        this.#acknowledgedWeeks.add(key);
    }
    
    isWeekAcknowledged(weekNumber, trailName) {
        const key = `${trailName}-${weekNumber}`;
        return this.#acknowledgedWeeks.has(key);
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
        this.acknowledgedWeeks = new Set();
        
        this.speechSynthesis = 'speechSynthesis' in window ? window.speechSynthesis : null;
        this.speechUtterance = null;
        this.voices = [];
        this.preferredVoice = null;
        this.voicesLoaded = false;
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
    
    _showWeekCompletionOverlay(week, trailName) {
        const weekElement = document.querySelector(`.journey-week[data-week="${week.week}"][data-trail="${trailName}"]`);
        if (!weekElement) return;

        const overlay = weekElement.querySelector('.week-completion-overlay');
        if (!overlay) return;
        
        // Adiciona o botão de revisão quando a semana é completada
        const reviewButton = document.createElement('button');
        reviewButton.className = 'btn btn-review';
        reviewButton.dataset.week = week.week;
        reviewButton.dataset.trail = trailName;
        reviewButton.setAttribute('aria-label', `Revisar conteúdo da semana ${week.week}`);
        reviewButton.innerHTML = `<span class="btn-review-icon">📖</span> Revisar`;
        reviewButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this._handleReviewWeek(e);
        });

        weekElement.querySelector('.week-content').appendChild(reviewButton);

        // Mostra o overlay com animação
        requestAnimationFrame(() => {
            overlay.classList.add('show');
            
            // Remove o overlay após 3 segundos
            setTimeout(() => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }, 3000);
        });
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

    _handleReviewWeek(event) {
        const weekNumber = event.currentTarget.dataset.week;
        const trailName = event.currentTarget.dataset.trail;
        const trailData = this.journeyData[trailName];
        
        if (!trailData) return;
        
        // Encontra os dados da semana
        const weekData = trailData
            .flatMap(month => month.journey)
            .find(week => week.week.toString() === weekNumber);
            
        if (!weekData) return;
        
        // Mostra um modal com o conteúdo da semana para revisão
        const completedTopics = weekData.topics.filter(topic => 
            this.appState.progress.completedThemes.includes(topic.title)
        );
        
        // Verifica se há quiz completado
        const hasQuiz = !!weekData.interactive_flow?.quiz_ref;
        const isQuizCompleted = hasQuiz && this.appState.progress.completedQuizzes.includes(weekData.interactive_flow.quiz_ref);
        
        const modalContent = `
            <div class="review-modal-content">
                <div class="review-modal-header">
                    <span class="review-modal-icon">📚</span>
                    <h3>Revisão da Semana ${weekNumber}</h3>
                    <p class="review-modal-description">Conteúdo já estudado e disponível para revisão</p>
                </div>
                
                <div class="review-content-sections">
                    ${completedTopics.length > 0 ? `
                        <div class="review-topics-section">
                            <h4><span class="section-icon">📖</span>Temas Concluídos (${completedTopics.length})</h4>
                            <div class="review-topics">
                                ${completedTopics.map(topic => `
                                    <div class="review-topic" data-topic-title="${topic.title}" data-trail="${trailName}">
                                        <div class="review-topic-header">
                                            <span class="review-topic-badge">${topic.content.badge.icone}</span>
                                            <div class="review-topic-info">
                                                <h5>${topic.title}</h5>
                                                <span class="review-topic-status">✅ Concluído</span>
                                            </div>
                                        </div>
                                        <button class="btn btn-secondary btn-review-topic" onclick="event.stopPropagation(); this._reviewTopic('${topic.title}', '${trailName}')">
                                            <span class="btn-icon">🔄</span>
                                            Revisar Conteúdo
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${hasQuiz ? `
                        <div class="review-quiz-section">
                            <h4><span class="section-icon">🧠</span>Quiz da Semana</h4>
                            <div class="review-quiz">
                                <div class="quiz-review-card ${isQuizCompleted ? 'completed' : 'not-completed'}">
                                    <div class="quiz-review-info">
                                        <span class="quiz-icon">${this.quizData[weekData.interactive_flow.quiz_ref]?.icon || '🧠'}</span>
                                        <div class="quiz-details">
                                            <h5>${this.quizData[weekData.interactive_flow.quiz_ref]?.title || 'Quiz da Semana'}</h5>
                                            <span class="quiz-status">
                                                ${isQuizCompleted ? '✅ Quiz Concluído' : '⏳ Quiz Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                    <button class="btn ${isQuizCompleted ? 'btn-primary' : 'btn-secondary'} btn-review-quiz" 
                                            data-quiz-ref="${weekData.interactive_flow.quiz_ref}"
                                            onclick="event.stopPropagation(); this._reviewQuiz('${weekData.interactive_flow.quiz_ref}')">
                                        <span class="btn-icon">${isQuizCompleted ? '🔄' : '▶️'}</span>
                                        ${isQuizCompleted ? 'Refazer Quiz' : 'Fazer Quiz'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${completedTopics.length === 0 && !hasQuiz ? `
                    <div class="no-review-content">
                        <span class="empty-icon">📝</span>
                        <p>Nenhum conteúdo disponível para revisão nesta semana.</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        this._showModal('Revisão de Conteúdo', modalContent);
    }
    
    _reviewTopic(topicTitle, trailName) {
        const monthData = this.journeyData[trailName].find(month => 
            month.journey.some(week => 
                week.topics.some(topic => topic.title === topicTitle)
            )
        );
        
        if (!monthData) return;
        
        const weekData = monthData.journey.find(week => 
            week.topics.some(topic => topic.title === topicTitle)
        );
        
        const topic = weekData.topics.find(t => t.title === topicTitle);
        
        // Atualiza o tema ativo e mostra a tela de conteúdo
        this.activeTheme = topic;
        this._showScreen('contentScreen');
        this._renderContent();
    }
    
    _reviewQuiz(quizRef) {
        // Confirma se o usuário quer refazer o quiz completado
        const quizData = this.quizData[quizRef];
        const isCompleted = this.appState.progress.completedQuizzes.includes(quizRef);
        
        if (isCompleted) {
            this.showModal({
                title: `🔄 Refazer Quiz`,
                text: `Você está prestes a refazer o "${quizData.title}". Suas respostas anteriores serão perdidas. Deseja continuar?`,
                buttons: [
                    { 
                        text: "Cancelar", 
                        class: "btn-secondary", 
                        action: () => {} 
                    },
                    { 
                        text: "Refazer Quiz", 
                        class: "btn-primary", 
                        action: () => {
                            // Reseta as respostas do quiz para permitir refazer
                            if (this.appState.progress.quizAnswers[quizRef]) {
                                delete this.appState.progress.quizAnswers[quizRef];
                            }
                            
                            // Remove da lista de quizzes completados para poder refazer
                            const completedIndex = this.appState.progress.completedQuizzes.indexOf(quizRef);
                            if (completedIndex > -1) {
                                this.appState.progress.completedQuizzes.splice(completedIndex, 1);
                            }
                            
                            this.appState.saveState();
                            
                            this.currentQuiz = { 
                                id: quizRef, 
                                step: 0, 
                                answers: {}, 
                                data: this.quizData[quizRef],
                                isReview: true // Marca como revisão
                            };
                            
                            this._showScreen('weeklyQuizScreen');
                            this.renderWeeklyQuizScreen();
                        }
                    }
                ]
            });
        } else {
            // Quiz não completado, vai direto para fazer
            this.currentQuiz = { 
                id: quizRef, 
                step: 0, 
                answers: {}, 
                data: this.quizData[quizRef] 
            };
            
            this._showScreen('weeklyQuizScreen');
            this.renderWeeklyQuizScreen();
        }
    }

    getBasePath() {
        const scriptPath = document.querySelector('script[src$="index.js"]').getAttribute('src');
        return scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
    }

    async _loadAllData() {
        try {
            const fetchWithValidation = async (url, defaultValue) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    return data;
                } catch (err) {
                    console.error(`Error loading ${url}:`, err);
                    this._showModal('Erro de Carregamento', 
                        `Não foi possível carregar alguns dados necessários. Por favor, recarregue a página.`);
                    return defaultValue;
                }
            };

            const [
                babyJourney,
                motherJourney,
                quizzes,
                badgesData,
                anamnesisData
            ] = await Promise.all([
                fetchWithValidation('./journeys/baby-journey.json', []),
                fetchWithValidation('./journeys/mother-journey.json', []),
                fetchWithValidation('./quizzes/quizzes.json', {}),
                fetchWithValidation('./data/badges.json', { badges: [] }),
                fetchWithValidation('./anamnese/anamnese-consolidada.json', {}),
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
            const voices = this.speechSynthesis.getVoices();
            
            // Lista de indicadores para vozes femininas com maior especificidade
            const femaleVoicePatterns = [
                // Vozes premium brasileiras
                { pattern: /helena|luciana|vitória|leticia/i, priority: 10, lang: 'pt-BR' },
                { pattern: /maria|ines|catarina|joana/i, priority: 9, lang: 'pt-PT' },
                // Vozes do Google
                { pattern: /google.*pt.*female|google.*brasil.*feminino/i, priority: 8, lang: 'pt-BR' },
                // Vozes Microsoft mais naturais
                { pattern: /microsoft.*helena|microsoft.*maria/i, priority: 7, lang: 'pt-BR' },
                // Indicadores genéricos femininos
                { pattern: /female|feminina|mulher|\(f\)/i, priority: 5, lang: 'any' },
                // Vozes que terminam com 'a' (mais provável ser feminina)
                { pattern: /[aã]$/i, priority: 3, lang: 'any' }
            ];
            
            let bestVoice = null;
            let bestScore = 0;
            
            voices.forEach(voice => {
                // Prioriza vozes em português
                const isPortuguese = voice.lang.startsWith('pt');
                if (!isPortuguese) return;
                
                // Calcula score baseado nos padrões
                let score = 0;
                
                femaleVoicePatterns.forEach(pattern => {
                    if (pattern.pattern.test(voice.name)) {
                        score += pattern.priority;
                        
                        // Bonus para vozes pt-BR
                        if (voice.lang === 'pt-BR') score += 2;
                        
                        // Bonus para vozes que não são default/system
                        if (!voice.default && !voice.name.toLowerCase().includes('system')) {
                            score += 1;
                        }
                        
                        // Bonus para vozes premium/neural
                        if (voice.name.toLowerCase().includes('neural') || 
                            voice.name.toLowerCase().includes('premium')) {
                            score += 3;
                        }
                    }
                });
                
                // Se não encontrou padrão específico, mas é português, dá score básico
                if (score === 0 && isPortuguese) {
                    score = 1;
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestVoice = voice;
                }
            });
            
            if (bestVoice) {
                this.preferredVoice = bestVoice;
                this.voicesLoaded = true;
                console.log('🎤 Voz selecionada:', bestVoice.name, '| Idioma:', bestVoice.lang, '| Score:', bestScore);
            } else {
                // Fallback para primeira voz disponível
                this.preferredVoice = voices.find(v => v.lang.startsWith('pt')) || voices[0];
                this.voicesLoaded = true;
                console.warn('⚠️ Usando voz fallback:', this.preferredVoice?.name);
            }
        };

        // Garante que as vozes sejam carregadas mesmo que o evento não seja disparado
        loadVoices();
        
        // Alguns navegadores carregam as vozes assincronamente
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = () => {
                if (!this.voicesLoaded) {
                    loadVoices();
                }
            };
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
            const audioBtn = target.closest('#playAudioBtn');
            this._toggleMainAudioPlayback(this.activeTheme.content.acaoAudio, audioBtn);
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
        if (target.closest('.quiz-knowledge-section .item-card-header')) {
            const section = target.closest('.quiz-knowledge-section');
            if (target.closest('.btn-audio-detail')) {
                e.stopPropagation();
                const button = target.closest('.btn-audio-detail');
                const text = button.dataset.audioText;
                if (text) {
                    this._toggleAudioPlayback(text, button);
                }
            } else {
                section.classList.toggle('active');
                const isExpanded = section.classList.contains('active');
                const header = section.querySelector('.item-card-header');
                header.setAttribute('aria-expanded', isExpanded);
            }
            return;
        }
        
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
        
        // Adiciona botão de revisão para semanas completadas
        const reviewButton = isWeekCompleted ? `
            <button class="btn btn-review" 
                    data-week="${week.week}" 
                    data-trail="${trailName}" 
                    onclick="event.stopPropagation(); this._handleReviewWeek(event)"
                    aria-label="Revisar conteúdo da semana ${week.week}">
                <span class="btn-review-icon">📖</span>
                Revisar
            </button>
        ` : '';
        
        const isNewlyCompleted = isWeekCompleted && !this.appState.isWeekAcknowledged(week.week, trailName);
        
        // Se a fase acabou de ser completada, adiciona a classe completing e mostra o overlay
        if (isNewlyCompleted) {
            markerClass += ' completing';
            
            // Agenda o overlay e o reconhecimento
            setTimeout(() => {
                this._showWeekCompletionOverlay(week, trailName);
                setTimeout(() => {
                    this.appState.acknowledgeWeek(week.week, trailName);
                }, 3500);
            }, 500);
        }

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
        
        // Indicador de revisão disponível para semanas completadas
        const reviewIndicator = isWeekCompleted ? `<span class="review-icon" title="Conteúdo disponível para revisão">🔄</span>` : '';

        return `
            <div class="journey-week ${isWeekLocked ? 'locked' : ''} ${isWeekCompleted ? 'reviewable' : ''}" data-week="${week.week}" data-trail="${trailName}">
                <div class="week-marker ${markerClass}">
                     ${isWeekLocked ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>` : week.week}
                </div>
                <div class="week-content">
                    <div class="week-title">${week.title}</div>
                    <div class="week-topics">${week.description}</div>
                    ${this._renderWeekBadges(uniqueBadges)}
                    ${this._renderCompletionOverlay(isNewlyCompleted, week.week, uniqueBadges)}
                    ${hasQuiz && !isWeekLocked ? this._renderWeekQuizButtons(week.interactive_flow.quiz_ref, isQuizCompleted) : ''}
                    ${reviewButton}
                </div>
                ${reviewIndicator}
            </div>
        `;
    }

    _renderWeekQuizButtons(quizRef, isCompleted) {
        const quizData = this.quizData[quizRef];
        if (!quizData) return '';
        
        const reviewIcon = isCompleted ? '<span class="review-indicator">🔄</span>' : '';
        const statusText = isCompleted ? 'Quiz Concluído' : quizData.title;
        const buttonClass = isCompleted ? 'completed reviewable' : '';
        
        return `
        <div class="week-quiz-buttons">
            <button class="btn btn-secondary btn-week-quiz ${buttonClass}" data-week-quiz-id="${quizRef}" ${isCompleted ? 'title="Clique para revisar este quiz"' : ''}>
                <span class="quiz-btn-icon">${quizData.icon}</span>
                <span class="quiz-status-text">${statusText}</span>
                ${reviewIcon}
            </button>
        </div>
        `;
    }
    
    _renderBadgeGallery() {
        if (!this.badges || !this.badges.length) {
            console.warn('Nenhuma badge encontrada para exibir');
            return;
        }

        console.log('Total de badges:', this.badges.length);
        console.log('Badges conquistadas:', this.appState.progress.earnedBadges);

        this.domElements.badgeGalleryTabs.innerHTML = `
            <button class="journey-tab ${this.activeTrail === 'baby' ? 'active' : ''}" 
                    data-badge-tab="baby" role="tab" 
                    aria-controls="babyBadgeGallery" 
                    aria-selected="${this.activeTrail === 'baby'}">
                Bebê 👶 <span id="babyBadgeCount" class="badge-tab-counter"></span>
            </button>
            <button class="journey-tab ${this.activeTrail === 'mother' ? 'active' : ''}" 
                    data-badge-tab="mother" role="tab" 
                    aria-controls="motherBadgeGallery" 
                    aria-selected="${this.activeTrail === 'mother'}">
                Mãe 💜 <span id="motherBadgeCount" class="badge-tab-counter"></span>
            </button>
        `;

        // Simplifica a lógica de filtro de badges
        const getBadgesForTrail = (trail) => {
            return this.badges.filter(badge => 
                badge.type === 'both' || badge.type === trail
            );
        };

        const babyBadges = getBadgesForTrail('baby');
        const motherBadges = getBadgesForTrail('mother');

        console.log('Badges do bebê:', babyBadges.length);
        console.log('Badges da mãe:', motherBadges.length);
        
        const renderBadgeList = (badges) => {
            if (!badges.length) return '<div class="no-badges">Nenhuma conquista disponível</div>';
            
            return badges.map(badge => {
                const isEarned = this.appState.progress.earnedBadges.includes(badge.id);
                return `
                    <div class="badge-item ${isEarned ? 'earned' : ''}" 
                         role="listitem" 
                         aria-label="${badge.nome} ${isEarned ? '(Conquistada)' : '(Não conquistada)'}">
                        <div class="badge-item-icon" title="${badge.description || ''}">${badge.icone}</div>
                        <div class="badge-item-name">${badge.nome}</div>
                        ${isEarned ? '<div class="badge-earned-mark">✓</div>' : ''}
                    </div>
                `;
            }).join('');
        };

        // Adiciona role="list" para melhor acessibilidade
        this.domElements.babyBadgeGallery.innerHTML = `
            <div class="badge-list" role="list">
                ${renderBadgeList(babyBadges)}
            </div>
        `;
        this.domElements.motherBadgeGallery.innerHTML = `
            <div class="badge-list" role="list">
                ${renderBadgeList(motherBadges)}
            </div>
        `;

        // Atualiza os contadores
        const earnedBabyBadges = this.appState.progress.earnedBadges.filter(id => 
            babyBadges.some(badge => badge.id === id)
        ).length;
        const earnedMotherBadges = this.appState.progress.earnedBadges.filter(id => 
            motherBadges.some(badge => badge.id === id)
        ).length;

        this.domElements.babyBadgeCount.textContent = `(${earnedBabyBadges}/${babyBadges.length})`;
        this.domElements.motherBadgeCount.textContent = `(${earnedMotherBadges}/${motherBadges.length})`;

        console.log(`Conquistas do Bebê: ${earnedBabyBadges}/${babyBadges.length}`);
        console.log(`Conquistas da Mãe: ${earnedMotherBadges}/${motherBadges.length}`);

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
            const dobDate = new Date(dob + 'T00:00:00Z');
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
        // Feedback visual imediato no botão
        const completeBtn = this.domElements.completeBtn;
        completeBtn.disabled = true;
        completeBtn.innerHTML = '<span class="completion-success">✓</span>Tema Concluído!';
        completeBtn.classList.add('theme-completed');

        // Atualiza o estado
        this.appState.completeTheme(this.activeTheme.title);
        const newBadgeId = this.activeTheme.content.badge.id;
        const wasBadgeAdded = this.appState.addBadge(newBadgeId);

        // Overlay de conclusão
        const successMessage = document.createElement('div');
        successMessage.className = 'completion-message';
        
        // Constrói a mensagem de forma segura sem template literals
        const messageParts = [
            '<div class="completion-icon">🎉</div>',
            '<h3>Parabéns!</h3>',
            '<p>Você concluiu o tema "' + this._escapeHtml(this.activeTheme.title) + '"</p>',
            '<div class="review-availability-notice">',
            '<span class="review-notice-icon">🔄</span>',
            '<p><strong>Conteúdo disponível para revisão!</strong><br>',
            'Você pode revisar este tema a qualquer momento na tela da jornada.</p>',
            '</div>'
        ];

        if (wasBadgeAdded) {
            messageParts.push(
                '<div class="completion-badge-preview">',
                '<div class="badge-icon">' + this._escapeHtml(this.activeTheme.content.badge.icone) + '</div>',
                '<p>Nova conquista desbloqueada!</p>',
                '</div>'
            );
        }

        messageParts.push(
            '<button class="btn btn-primary btn-full-width" onclick="this.parentElement.remove()">',
            'Continuar',
            '</button>'
        );

        successMessage.innerHTML = messageParts.join('');
        document.body.appendChild(successMessage);

        // Atualiza o progresso
        this.appState.updateProgress(this.journeyData);

        // Após 2 segundos, destaca o botão
        setTimeout(() => {
            completeBtn.classList.add('pulse');
        }, 2000);
    }

    // Método auxiliar para escapar HTML e prevenir XSS
    _escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    _renderWeekBadges(badges) {
        if (!badges || !badges.length) return '';
        
        const badgeIcons = badges.map(badgeId => {
            const badge = this.badges.find(b => b.id === badgeId);
            if (!badge) return '';
            
            const div = document.createElement('div');
            div.className = 'week-badge-icon';
            div.dataset.badgeId = badgeId;
            div.title = badge.nome;
            div.textContent = badge.icone;
            
            return div.outerHTML;
        }).join('');

        return `<div class="week-badges">${badgeIcons}</div>`;
    }

    _renderCompletionOverlay(isNewlyCompleted, weekNumber, badges) {
        if (!isNewlyCompleted) return '';

        let badgesHtml = '';
        if (badges && badges.length) {
            const badgeIcons = badges.map(badgeId => {
                const badge = this.badges.find(b => b.id === badgeId);
                if (!badge) return '';
                
                return '<div class="week-completion-badge" title="' + 
                    this._escapeHtml(badge.nome) + '">' + 
                    this._escapeHtml(badge.icone) + '</div>';
            }).join('');

            badgesHtml = 
                '<div class="week-completion-badges">' + 
                badgeIcons + 
                '</div>' +
                '<p class="week-completion-message">Conquistas Desbloqueadas!</p>';
        }

        return '<div class="week-completion-overlay">' +
            '<div class="week-completion-icon">🎉</div>' +
            '<div class="week-completion-message">Parabéns! Você completou a Semana ' + weekNumber + '!</div>' +
            badgesHtml +
            '</div>';
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
        const isReview = this.currentQuiz.isReview;
        
        // Adiciona indicador de revisão no título se aplicável
        const titlePrefix = isReview ? '🔄 ' : '';
        const titleSuffix = isReview ? ' (Revisão)' : '';
        
        this.domElements.weeklyQuizTitle.textContent = titlePrefix + quizData.title + titleSuffix;
        this.domElements.weeklyQuizDescription.innerHTML = this._personalizeText(quizData.description);
        
        // Adiciona badge de revisão se aplicável
        if (isReview) {
            const reviewBadge = document.createElement('div');
            reviewBadge.className = 'quiz-review-badge';
            reviewBadge.innerHTML = '<span class="badge-icon">🔄</span><span>Modo Revisão</span>';
            this.domElements.weeklyQuizTitle.parentNode.insertBefore(reviewBadge, this.domElements.weeklyQuizDescription);
        }
        
        const domains = quizData.baby_domains.concat(quizData.mother_domains || []);
        
        const currentDomain = domains[this.currentQuiz.step];
        this._renderQuizDomain(currentDomain);
        this._updateQuizNavigation(domains.length);
    }

    _renderQuizDomain(domain) {
        const answer = this.currentQuiz.answers[domain.id];
        const showFeedback = !!answer;
        const feedback = showFeedback ? (answer === domain.options[0] ? domain.feedback.positivo : domain.feedback.negativo) : '';

        // Preservar estado do acordeão antes de re-renderizar
        const wasExpanded = this.domElements.weeklyQuizDomainsContainer.querySelector('.quiz-domain')?.classList.contains('expanded') ?? true;

        this.domElements.weeklyQuizDomainsContainer.innerHTML = `
        <div class="quiz-domain ${wasExpanded ? 'expanded' : ''}" id="domain-${domain.id}">
            <div class="item-card-header" role="button" tabindex="0" aria-expanded="${wasExpanded}" aria-controls="quiz-content-${domain.id}">
                <div class="header-content">
                    <span class="status-icon">${showFeedback ? '✓' : '○'}</span>
                    <span class="label">${domain.title}</span>
                </div>
                <span class="chevron">❯</span>
            </div>
            <div class="quiz-content" id="quiz-content-${domain.id}">
                <div class="quiz-domain-question">
                    <p>${this._personalizeText(domain.question)}</p>
                </div>
                <div class="quiz-domain-options">
                    ${domain.options.map(option => `
                    <label class="quiz-option ${answer === option ? 'selected' : ''}">
                        <input type="radio" name="${domain.id}" value="${option}" ${answer === option ? 'checked' : ''}>
                        <span class="option-text">${this._personalizeText(option)}</span>
                        ${answer === option ? `<span class="check-icon">✓</span>` : ''}
                    </label>
                    `).join('')}
                </div>
                ${showFeedback ? `
                    <div class="quiz-feedback ${answer === domain.options[0] ? 'feedback-positivo' : 'feedback-negativo'}">
                        <div class="feedback-icon">${answer === domain.options[0] ? '✨' : '💡'}</div>
                        <p>${this._personalizeText(feedback)}</p>
                    </div>
                ` : ''}
             ${this._renderQuizKnowledge(domain.knowledge, domain.id)}
        </div>
        `;
        
        const radios = this.domElements.weeklyQuizDomainsContainer.querySelectorAll(`input[name="${domain.id}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                // Preservar estado expandido do acordeão
                const wasExpanded = this.domElements.weeklyQuizDomainsContainer.querySelector('.quiz-domain.expanded');
                
                this.currentQuiz.answers[domain.id] = e.target.value;
                this._renderQuizDomain(domain);
                
                // Restaurar estado expandido após re-renderização
                if (wasExpanded) {
                    const newQuizDomain = this.domElements.weeklyQuizDomainsContainer.querySelector('.quiz-domain');
                    newQuizDomain.classList.add('expanded');
                    const header = newQuizDomain.querySelector('.item-card-header');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });

        // Adiciona eventos para o acordeão do Quiz
        const quizDomain = this.domElements.weeklyQuizDomainsContainer.querySelector('.quiz-domain');
        const header = quizDomain.querySelector('.item-card-header');
        
        header.addEventListener('click', () => {
            quizDomain.classList.toggle('expanded');
            const expanded = quizDomain.classList.contains('expanded');
            header.setAttribute('aria-expanded', expanded);
        });

        const slider = this.domElements.weeklyQuizDomainsContainer.querySelector('.quiz-image-slider-container');
        if (slider) this._initQuizSlider(slider);
    }
    
    _renderQuizKnowledge(knowledge, domainId) {
        if (!knowledge) return '';
        const sectionId = `knowledge-${domainId}`;
        return `
            <div class="quiz-knowledge-section" data-domain-id="${domainId}">
                <div class="item-card-header" role="button" tabindex="0" aria-expanded="false" aria-controls="${sectionId}">
                    <div class="header-content">
                        <span class="label">${this._personalizeText(knowledge.title)}</span>
                    </div>
                    <div class="header-actions">
                        <button class="btn-audio-detail" data-audio-text="${knowledge.audio}" aria-label="Ouvir explicação">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        </button>
                        <span class="chevron">❯</span>
                    </div>
                </div>
                <div class="item-details-content" id="${sectionId}">
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
        // Validar se pergunta atual foi respondida antes de avançar
        if (direction > 0) {
            const domains = this.currentQuiz.data.baby_domains.concat(this.currentQuiz.data.mother_domains || []);
            const currentDomain = domains[this.currentQuiz.step];
            
            if (currentDomain && !this.currentQuiz.answers[currentDomain.id]) {
                this._showValidationError("Por favor, responda esta pergunta antes de continuar.");
                return;
            }
        }
        
        this.currentQuiz.step += direction;
        this._renderQuizStep();
    }
    
    _goToQuizStep(step) {
        this.currentQuiz.step = step;
        this._renderQuizStep();
    }
    
    _showValidationError(message) {
        this.showModal({
            title: "⚠️ Pergunta Pendente",
            text: message,
            buttons: [{ 
                text: "Entendi", 
                class: "btn-primary", 
                action: () => {} 
            }]
        });
    }
    
    _validateQuizCompletion() {
        const domains = this.currentQuiz.data.baby_domains.concat(this.currentQuiz.data.mother_domains || []);
        const unansweredDomains = domains.filter(domain => !this.currentQuiz.answers[domain.id]);
        
        if (unansweredDomains.length > 0) {
            this._showIncompleteQuizModal(unansweredDomains);
            return false;
        }
        return true;
    }
    
    _showIncompleteQuizModal(unansweredDomains) {
        const pendingList = unansweredDomains.map(d => `• ${d.title}`).join('\n');
        
        this.showModal({
            title: "🔄 Quiz Incompleto",
            text: `Ainda há ${unansweredDomains.length} pergunta(s) pendente(s):\n\n${pendingList}\n\nGostaria de revisar essas perguntas?`,
            buttons: [
                { text: "Revisar", class: "btn-primary", action: () => this._goToFirstUnanswered() },
                { text: "Concluir Mesmo Assim", class: "btn-secondary", action: () => this._forceCompleteQuiz() }
            ]
        });
    }
    
    _goToFirstUnanswered() {
        const domains = this.currentQuiz.data.baby_domains.concat(this.currentQuiz.data.mother_domains || []);
        const firstUnanswered = domains.findIndex(domain => !this.currentQuiz.answers[domain.id]);
        
        if (firstUnanswered !== -1) {
            this.currentQuiz.step = firstUnanswered;
            this._renderQuizStep();
        }
    }
    
    _forceCompleteQuiz() {
        // Completa o quiz mesmo com perguntas não respondidas
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
    
    _completeQuiz() {
        // Validar se todas as perguntas foram respondidas
        if (!this._validateQuizCompletion()) {
            return;
        }
        
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

        // Se já está tocando e é o mesmo botão, pausa
        if (this.speechSynthesis.speaking && this.activeAudioButton === buttonElement) {
            this.speechSynthesis.cancel();
            this._updateAudioUI(buttonElement, 'stopped');
            return;
        }

        // Se há outro áudio tocando, para ele primeiro
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
            if (this.activeAudioButton) {
                this._updateAudioUI(this.activeAudioButton, 'stopped');
            }
        }

        // Mostra estado de loading
        this._updateAudioUI(buttonElement, 'loading');

        // Recarrega as vozes se necessário
        if (!this.voicesLoaded || !this.preferredVoice) {
            this._initSpeechSynthesis();
            // Se ainda não tiver vozes, tenta novamente em 100ms
            if (!this.voicesLoaded) {
                setTimeout(() => {
                    this._updateAudioUI(buttonElement, 'stopped');
                    this._toggleAudioPlayback(text, buttonElement);
                }, 100);
                return;
            }
        }

        this.activeAudioButton = buttonElement;
        this.speechUtterance = new SpeechSynthesisUtterance(this._personalizeText(text));
        
        // Configura a voz feminina selecionada
        if (this.preferredVoice) {
            this.speechUtterance.voice = this.preferredVoice;
            this.speechUtterance.lang = this.preferredVoice.lang;
            console.log('🎵 Reproduzindo com voz:', this.preferredVoice.name);
        } else {
            this.speechUtterance.lang = 'pt-BR';
            console.warn('⚠️ Usando voz padrão do sistema');
        }
        
        // Parâmetros otimizados para voz mais natural e agradável
        this.speechUtterance.rate = 0.85;   // Velocidade mais calma e natural
        this.speechUtterance.pitch = 1.15;  // Tom ligeiramente mais agudo para feminino
        this.speechUtterance.volume = 0.9;  // Volume um pouco reduzido para ser mais suave
        
        // Adiciona pausas naturais em pontuação
        const naturalText = this._personalizeText(text)
            .replace(/\./g, '. ')  // Pausa após pontos
            .replace(/,/g, ', ')   // Pausa curta após vírgulas
            .replace(/:/g, ': ')   // Pausa após dois pontos
            .replace(/;/g, '; ')   // Pausa após ponto e vírgula
            .replace(/\!/g, '! ')  // Pausa após exclamação
            .replace(/\?/g, '? ')  // Pausa após interrogação
            .replace(/\s+/g, ' '); // Remove espaços duplos
        
        this.speechUtterance.text = naturalText;
        
        // Event listeners com melhor feedback
        this.speechUtterance.onstart = () => {
            console.log('🔊 Iniciando reprodução de áudio');
            this._updateAudioUI(buttonElement, 'playing');
        };
        
        this.speechUtterance.onend = () => {
            console.log('✅ Áudio finalizado');
            this._stopAudio();
        };
        
        this.speechUtterance.onerror = (e) => {
            console.error('❌ Erro na síntese de voz:', e.error);
            this._updateAudioUI(buttonElement, 'error');
            setTimeout(() => {
                this._stopAudio();
            }, 2000); // Mostra erro por 2 segundos
        };
        
        // Adiciona pequeno delay para dar feedback visual do loading
        setTimeout(() => {
            try {
                this.speechSynthesis.speak(this.speechUtterance);
            } catch (error) {
                console.error('❌ Erro ao iniciar reprodução:', error);
                this._updateAudioUI(buttonElement, 'error');
                setTimeout(() => this._stopAudio(), 2000);
            }
        }, 200);
    }
    
    _toggleMainAudioPlayback(text, buttonElement) {
        if (!this.speechSynthesis || !text) return;

        // Se já está tocando e é o mesmo botão, pausa
        if (this.speechSynthesis.speaking && this.activeAudioButton === buttonElement) {
            this.speechSynthesis.cancel();
            this._updateMainAudioUI(buttonElement, 'stopped');
            return;
        }

        // Se há outro áudio tocando, para ele primeiro
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
            if (this.activeAudioButton) {
                if (this.activeAudioButton === buttonElement) {
                    this._updateMainAudioUI(this.activeAudioButton, 'stopped');
                } else {
                    this._updateAudioUI(this.activeAudioButton, 'stopped');
                }
            }
        }

        // Mostra estado de loading
        this._updateMainAudioUI(buttonElement, 'loading');

        // Recarrega as vozes se necessário
        if (!this.voicesLoaded || !this.preferredVoice) {
            this._initSpeechSynthesis();
            if (!this.voicesLoaded) {
                setTimeout(() => {
                    this._updateMainAudioUI(buttonElement, 'stopped');
                    this._toggleMainAudioPlayback(text, buttonElement);
                }, 100);
                return;
            }
        }

        this.activeAudioButton = buttonElement;
        this.speechUtterance = new SpeechSynthesisUtterance(this._personalizeText(text));
        
        // Configura a voz feminina selecionada
        if (this.preferredVoice) {
            this.speechUtterance.voice = this.preferredVoice;
            this.speechUtterance.lang = this.preferredVoice.lang;
            console.log('🎵 Reproduzindo com voz:', this.preferredVoice.name);
        } else {
            this.speechUtterance.lang = 'pt-BR';
            console.warn('⚠️ Usando voz padrão do sistema');
        }
        
        // Parâmetros otimizados para voz mais natural e agradável
        this.speechUtterance.rate = 0.85;
        this.speechUtterance.pitch = 1.15;
        this.speechUtterance.volume = 0.9;
        
        // Adiciona pausas naturais em pontuação
        const naturalText = this._personalizeText(text)
            .replace(/\./g, '. ')
            .replace(/,/g, ', ')
            .replace(/:/g, ': ')
            .replace(/;/g, '; ')
            .replace(/\!/g, '! ')
            .replace(/\?/g, '? ')
            .replace(/\s+/g, ' ');
        
        this.speechUtterance.text = naturalText;
        
        // Event listeners
        this.speechUtterance.onstart = () => {
            console.log('🔊 Iniciando reprodução de áudio principal');
            this._updateMainAudioUI(buttonElement, 'playing');
        };
        
        this.speechUtterance.onend = () => {
            console.log('✅ Áudio principal finalizado');
            this._stopMainAudio();
        };
        
        this.speechUtterance.onerror = (e) => {
            console.error('❌ Erro na síntese de voz principal:', e.error);
            this._updateMainAudioUI(buttonElement, 'error');
            setTimeout(() => {
                this._stopMainAudio();
            }, 2000);
        };
        
        // Adiciona pequeno delay para dar feedback visual do loading
        setTimeout(() => {
            try {
                this.speechSynthesis.speak(this.speechUtterance);
            } catch (error) {
                console.error('❌ Erro ao iniciar reprodução principal:', error);
                this._updateMainAudioUI(buttonElement, 'error');
                setTimeout(() => this._stopMainAudio(), 2000);
            }
        }, 200);
    }
    
    _updateMainAudioUI(buttonElement, state) {
        if (!buttonElement) return;
        
        const audioIcon = buttonElement.querySelector('#audioIcon');
        const audioLabel = buttonElement.querySelector('#audioLabel');
        
        const icons = {
            play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-icon">
                <path d="M8 5v14l11-7z"/>
            </svg>`,
            pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-icon">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>`,
            loading: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="audio-icon audio-loading">
                <circle cx="12" cy="12" r="3"/>
            </svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
            </svg>`
        };

        const labels = {
            playing: 'Pausar Narração',
            loading: 'Carregando...',
            error: 'Erro no Áudio',
            stopped: 'Tocar Narração'
        };

        if (state === 'playing') {
            buttonElement.classList.add('playing');
            audioIcon.innerHTML = icons.pause;
            audioLabel.textContent = labels.playing;
        } else if (state === 'loading') {
            buttonElement.classList.remove('playing');
            buttonElement.classList.add('loading');
            audioIcon.innerHTML = icons.loading;
            audioLabel.textContent = labels.loading;
        } else if (state === 'error') {
            buttonElement.classList.remove('playing', 'loading');
            buttonElement.classList.add('error');
            audioIcon.innerHTML = icons.error;
            audioLabel.textContent = labels.error;
        } else {
            buttonElement.classList.remove('playing', 'loading', 'error');
            audioIcon.innerHTML = icons.play;
            audioLabel.textContent = labels.stopped;
        }
    }
    
    _stopMainAudio() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        if (this.activeAudioButton && this.activeAudioButton.id === 'playAudioBtn') {
            this._updateMainAudioUI(this.activeAudioButton, 'stopped');
            this.activeAudioButton = null;
        }
    }
    
    _stopAudio() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        if (this.activeAudioButton) {
            if (this.activeAudioButton.id === 'playAudioBtn') {
                this._updateMainAudioUI(this.activeAudioButton, 'stopped');
            } else {
                this._updateAudioUI(this.activeAudioButton, 'stopped');
            }
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
            play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-icon">
                <path d="M8 5v14l11-7z"/>
            </svg>`,
            pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-icon">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>`,
            loading: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="audio-icon audio-loading">
                <circle cx="12" cy="12" r="3"/>
            </svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
            </svg>`
        };

        if (state === 'playing') {
            buttonElement.classList.add('playing');
            buttonElement.innerHTML = icons.pause;
            buttonElement.setAttribute('title', 'Pausar áudio');
            buttonElement.setAttribute('aria-label', 'Pausar narração de áudio');
        } else if (state === 'loading') {
            buttonElement.classList.remove('playing');
            buttonElement.classList.add('loading');
            buttonElement.innerHTML = icons.loading;
            buttonElement.setAttribute('title', 'Carregando...');
            buttonElement.setAttribute('aria-label', 'Carregando áudio...');
        } else if (state === 'error') {
            buttonElement.classList.remove('playing', 'loading');
            buttonElement.classList.add('error');
            buttonElement.innerHTML = icons.error;
            buttonElement.setAttribute('title', 'Erro ao reproduzir áudio');
            buttonElement.setAttribute('aria-label', 'Erro na reprodução de áudio');
        } else {
            buttonElement.classList.remove('playing', 'loading', 'error');
            buttonElement.innerHTML = icons.play;
            buttonElement.setAttribute('title', 'Reproduzir áudio');
            buttonElement.setAttribute('aria-label', 'Reproduzir narração de áudio');
        }
    }
}

// ==================== APP INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const app = new TitiNautaApp();
    app.init();
});
