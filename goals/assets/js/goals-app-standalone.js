// Goals Application - Standalone Version (No Modules)
// All components combined into a single file for direct HTML usage

// Local Storage Database Management
class DatabaseManager {
    constructor() {
        this.storageKey = 'goals-app-data';
        this.currentUser = { uid: 'local-user', email: 'local@user.com' };
        this.initializeLocalData();
    }

    initializeLocalData() {
        const existingData = this.getLocalData();
        if (!existingData) {
            const initialData = {
                profile: {
                    createdAt: new Date().toISOString(),
                    totalPoints: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    level: 'Bronze Warrior',
                    achievements: [],
                    settings: {
                        targetBedtime: '23:30',
                        targetWakeup: '07:30',
                        notificationsEnabled: true
                    }
                },
                entries: []
            };
            this.saveLocalData(initialData);
        }
    }

    getLocalData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to parse local data:', error);
            return null;
        }
    }

    saveLocalData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save local data:', error);
            return false;
        }
    }

    async saveDailyEntry(date, data) {
        const localData = this.getLocalData();
        if (!localData) throw new Error('No local data found');
        
        // Remove existing entry for the same date
        localData.entries = localData.entries.filter(entry => entry.date !== date);
        
        // Add new entry
        const newEntry = {
            ...data,
            date,
            timestamp: new Date().toISOString(),
            id: `entry-${Date.now()}`
        };
        
        localData.entries.unshift(newEntry);
        
        // Update user stats
        await this.updateUserStats();
        
        return this.saveLocalData(localData);
    }

    async updateUserStats() {
        const localData = this.getLocalData();
        if (!localData) return;

        // Recalculate streaks
        const { current, best } = this.calculateStreaks(localData.entries);

        localData.profile.currentStreak = current;
        localData.profile.bestStreak = Math.max(localData.profile.bestStreak, best);
        localData.profile.lastUpdated = new Date().toISOString();

        return this.saveLocalData(localData);
    }

    calculateEntryScore(entry) {
        let totalPoints = 0;
        
        // Sleep points (30 max)
        if (entry.bedtime) totalPoints += 10;
        if (entry.wakeupTime) totalPoints += 10;
        if (entry.phoneAvoidanceFirst30) totalPoints += 10;
        
        // Priority points (40 max)
        if (entry.morningPriorityBlock) {
            const completion = entry.morningPriorityCompletion || 0;
            totalPoints += Math.floor((completion / 100) * 25);
        }
        if (entry.eveningEnergyBlock) {
            const completion = entry.eveningBlockCompletion || 0;
            totalPoints += Math.floor((completion / 100) * 15);
        }
        
        // Discipline points (30 max)
        const phoneViolations = entry.phoneViolations || 0;
        if (phoneViolations === 0) totalPoints += 15;
        else if (phoneViolations <= 2) totalPoints += 10;
        else if (phoneViolations <= 5) totalPoints += 5;
        
        if (entry.energyManagementFollowed) totalPoints += 10;
        if (entry.windDownRoutineCompleted) totalPoints += 5;
        
        return { totalPoints: Math.min(totalPoints, 100) };
    }

    calculateStreaks(entries) {
        if (!entries || entries.length === 0) return { current: 0, best: 0 };

        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        // Sort entries by date (most recent first)
        const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Calculate current streak (from most recent date)
        for (let i = 0; i < sortedEntries.length; i++) {
            const score = this.calculateEntryScore(sortedEntries[i]);
            if (score.totalPoints >= 70) {
                if (i === 0 || this.isConsecutiveDay(sortedEntries[i-1].date, sortedEntries[i].date)) {
                    currentStreak++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        // Calculate best streak overall
        for (let entry of sortedEntries.reverse()) {
            const score = this.calculateEntryScore(entry);
            if (score.totalPoints >= 70) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        return { current: currentStreak, best: bestStreak };
    }

    isConsecutiveDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    async getDailyEntries(startDate, endDate) {
        const localData = this.getLocalData();
        if (!localData) return [];

        return localData.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return entryDate >= start && entryDate <= end;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    async getRecentEntries(limitCount = 30) {
        const localData = this.getLocalData();
        if (!localData) return [];

        return localData.entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limitCount);
    }

    async getUserProfile() {
        const localData = this.getLocalData();
        return localData ? localData.profile : null;
    }

    async updateUserProfile(updates) {
        const localData = this.getLocalData();
        if (!localData) throw new Error('No local data found');

        localData.profile = {
            ...localData.profile,
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        return this.saveLocalData(localData);
    }

    async exportUserData() {
        const localData = this.getLocalData();
        if (!localData) throw new Error('No local data found');

        return {
            ...localData,
            exportDate: new Date().toISOString(),
            userId: this.currentUser.uid
        };
    }

    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeLocalData();
    }
}

// Scoring System
class ScoringSystem {
    constructor() {
        this.maxDailyPoints = 100;
        this.categories = {
            sleep: {
                maxPoints: 30,
                criteria: {
                    bedtimeCompliance: 10,
                    wakeupCompliance: 10,
                    phoneAvoidance: 10
                }
            },
            priority: {
                maxPoints: 40,
                criteria: {
                    morningBlock: 25,
                    eveningBlock: 15
                }
            },
            discipline: {
                maxPoints: 30,
                criteria: {
                    phoneBoundaries: 15,
                    energyManagement: 10,
                    windDownRoutine: 5
                }
            }
        };
        
        this.streakThresholds = {
            bronze: { min: 70, days: 3, multiplier: 1.0, title: 'Bronze Warrior' },
            silver: { min: 80, days: 7, multiplier: 1.1, title: 'Silver Champion' },
            gold: { min: 90, days: 14, multiplier: 1.2, title: 'Gold Master' },
            diamond: { min: 95, days: 30, multiplier: 1.3, title: 'Diamond Legend' }
        };
    }

    calculateDailyScore(entry) {
        let totalPoints = 0;
        let breakdown = {};

        // Sleep Foundation (30 points max)
        const sleepPoints = this.calculateSleepPoints(entry);
        totalPoints += sleepPoints.total;
        breakdown.sleep = sleepPoints;

        // Priority Execution (40 points max)
        const priorityPoints = this.calculatePriorityPoints(entry);
        totalPoints += priorityPoints.total;
        breakdown.priority = priorityPoints;

        // Discipline Systems (30 points max)
        const disciplinePoints = this.calculateDisciplinePoints(entry);
        totalPoints += disciplinePoints.total;
        breakdown.discipline = disciplinePoints;

        return {
            totalPoints: Math.min(totalPoints, this.maxDailyPoints),
            breakdown,
            percentage: (totalPoints / this.maxDailyPoints) * 100
        };
    }

    calculateSleepPoints(entry) {
        let points = {
            bedtimeCompliance: 0,
            wakeupCompliance: 0,
            phoneAvoidance: 0,
            total: 0
        };

        // Bedtime compliance (10 points)
        if (entry.bedtime) {
            const targetBedtime = new Date(`1970-01-01T23:30:00`);
            const actualBedtime = new Date(`1970-01-01T${entry.bedtime}:00`);
            const diffMinutes = Math.abs(targetBedtime - actualBedtime) / (1000 * 60);
            
            if (diffMinutes <= 15) points.bedtimeCompliance = 10;
            else if (diffMinutes <= 30) points.bedtimeCompliance = 7;
            else if (diffMinutes <= 60) points.bedtimeCompliance = 4;
        }

        // Wake up compliance (10 points)
        if (entry.wakeupTime) {
            const targetWakeup = new Date(`1970-01-01T07:30:00`);
            const actualWakeup = new Date(`1970-01-01T${entry.wakeupTime}:00`);
            const diffMinutes = Math.abs(targetWakeup - actualWakeup) / (1000 * 60);
            
            if (diffMinutes <= 15) points.wakeupCompliance = 10;
            else if (diffMinutes <= 30) points.wakeupCompliance = 7;
            else if (diffMinutes <= 60) points.wakeupCompliance = 4;
        }

        // Phone avoidance (10 points)
        if (entry.phoneAvoidanceFirst30) {
            points.phoneAvoidance = 10;
        }

        points.total = points.bedtimeCompliance + points.wakeupCompliance + points.phoneAvoidance;
        return points;
    }

    calculatePriorityPoints(entry) {
        let points = {
            morningBlock: 0,
            eveningBlock: 0,
            total: 0
        };

        // Morning priority block (25 points)
        if (entry.morningPriorityBlock) {
            const completion = entry.morningPriorityCompletion || 0;
            if (completion >= 90) points.morningBlock = 25;
            else if (completion >= 75) points.morningBlock = 20;
            else if (completion >= 50) points.morningBlock = 15;
            else if (completion >= 25) points.morningBlock = 10;
        }

        // Evening energy block (15 points)
        if (entry.eveningEnergyBlock) {
            const completion = entry.eveningBlockCompletion || 0;
            if (completion >= 90) points.eveningBlock = 15;
            else if (completion >= 75) points.eveningBlock = 12;
            else if (completion >= 50) points.eveningBlock = 8;
        }

        points.total = points.morningBlock + points.eveningBlock;
        return points;
    }

    calculateDisciplinePoints(entry) {
        let points = {
            phoneBoundaries: 0,
            energyManagement: 0,
            windDownRoutine: 0,
            total: 0
        };

        // Phone boundaries (15 points)
        const phoneViolations = entry.phoneViolations || 0;
        if (phoneViolations === 0) points.phoneBoundaries = 15;
        else if (phoneViolations <= 2) points.phoneBoundaries = 10;
        else if (phoneViolations <= 5) points.phoneBoundaries = 5;

        // Energy management (10 points)
        if (entry.energyManagementFollowed) {
            points.energyManagement = 10;
        }

        // Wind-down routine (5 points)
        if (entry.windDownRoutineCompleted) {
            points.windDownRoutine = 5;
        }

        points.total = points.phoneBoundaries + points.energyManagement + points.windDownRoutine;
        return points;
    }

    calculateStreak(entries) {
        if (!entries || entries.length === 0) return { current: 0, best: 0 };

        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        // Sort entries by date (most recent first)
        const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Calculate current streak (from most recent date)
        for (let i = 0; i < sortedEntries.length; i++) {
            const score = this.calculateDailyScore(sortedEntries[i]);
            if (score.totalPoints >= 70) {
                if (i === 0 || this.isConsecutiveDay(sortedEntries[i-1].date, sortedEntries[i].date)) {
                    currentStreak++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        // Calculate best streak overall
        for (let entry of sortedEntries.reverse()) {
            const score = this.calculateDailyScore(entry);
            if (score.totalPoints >= 70) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        return { current: currentStreak, best: bestStreak };
    }

    isConsecutiveDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    getUserLevel(streak, averageScore) {
        for (let [level, threshold] of Object.entries(this.streakThresholds).reverse()) {
            if (streak >= threshold.days && averageScore >= threshold.min) {
                return {
                    level: threshold.title,
                    multiplier: threshold.multiplier,
                    nextLevel: this.getNextLevel(level)
                };
            }
        }
        return {
            level: 'Beginner',
            multiplier: 1.0,
            nextLevel: this.streakThresholds.bronze
        };
    }

    getNextLevel(currentLevel) {
        const levels = Object.keys(this.streakThresholds);
        const currentIndex = levels.indexOf(currentLevel);
        if (currentIndex < levels.length - 1) {
            return this.streakThresholds[levels[currentIndex + 1]];
        }
        return null; // Already at max level
    }
}

// Demo Data Generator
class DemoDataGenerator {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    async initializeDemoData() {
        const existingData = this.dbManager.getLocalData();
        
        if (!existingData || !existingData.entries || existingData.entries.length === 0) {
            const demoEntries = this.generateDemoEntries();
            
            for (const entry of demoEntries) {
                await this.dbManager.saveDailyEntry(entry.date, entry);
            }
            
            return true;
        }
        
        return false;
    }

    generateDemoEntries() {
        const entries = [];
        const today = new Date();
        
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isMonday = dayOfWeek === 1;
            
            const entry = this.generateRealisticEntry(dateStr, isWeekend, isMonday, i);
            entries.push(entry);
        }
        
        return entries;
    }

    generateRealisticEntry(date, isWeekend, isMonday, daysAgo) {
        let basePerformance = 0.75;
        
        if (isWeekend) basePerformance = 0.6;
        if (isMonday) basePerformance = 0.65;
        
        const performance = Math.max(0.3, Math.min(0.95, basePerformance + (Math.random() - 0.5) * 0.3));
        
        const bedtimeVariation = Math.floor((Math.random() - 0.5) * 60);
        const wakeupVariation = Math.floor((Math.random() - 0.5) * 45);
        
        const baseBedtime = new Date(`1970-01-01T23:30:00`);
        baseBedtime.setMinutes(baseBedtime.getMinutes() + bedtimeVariation);
        
        const baseWakeup = new Date(`1970-01-01T07:30:00`);
        baseWakeup.setMinutes(baseWakeup.getMinutes() + wakeupVariation);
        
        const phoneDisciplineImprovement = Math.max(0, (14 - daysAgo) / 14 * 0.3);
        const phoneAvoidance = Math.random() + phoneDisciplineImprovement > 0.6;
        const phoneViolations = Math.floor(Math.random() * (phoneAvoidance ? 2 : 5));
        
        const morningBlockCompleted = Math.random() < performance;
        const morningCompletion = morningBlockCompleted ? 
            60 + Math.floor(Math.random() * 40) : 
            Math.floor(Math.random() * 60);
            
        const eveningBlockCompleted = Math.random() < performance * 0.8;
        const eveningCompletion = eveningBlockCompleted ? 
            65 + Math.floor(Math.random() * 35) : 
            Math.floor(Math.random() * 50);
        
        const energyManagement = Math.random() < performance * 0.9;
        const windDownRoutine = Math.random() < performance * 0.7;
        
        const jobApps = isWeekend ? 0 : Math.floor(Math.random() * (performance > 0.8 ? 3 : 2));
        const interviews = Math.random() < 0.15 ? 1 : 0;
        const portfolioWork = Math.random() * (isWeekend ? 4 : 2.5);
        
        let notes = '';
        if (daysAgo < 3 && Math.random() < 0.7) {
            const noteOptions = [
                'Good momentum today! Staying focused on priorities.',
                'Struggled with phone discipline in the afternoon.',
                'Early morning block was very productive.',
                'Need to work on evening routine consistency.',
                'Great day overall - feeling motivated!',
                'Phone got the better of me during work blocks.',
                'Excellent focus during priority time.',
                'Wind down routine really helped with sleep.'
            ];
            notes = noteOptions[Math.floor(Math.random() * noteOptions.length)];
        }
        
        return {
            date,
            bedtime: this.timeToString(baseBedtime),
            wakeupTime: this.timeToString(baseWakeup),
            phoneAvoidanceFirst30: phoneAvoidance,
            morningPriorityBlock: morningBlockCompleted,
            morningPriorityCompletion: morningCompletion,
            eveningEnergyBlock: eveningBlockCompleted,
            eveningBlockCompletion: eveningCompletion,
            phoneViolations: phoneViolations,
            energyManagementFollowed: energyManagement,
            windDownRoutineCompleted: windDownRoutine,
            jobApplications: jobApps,
            interviews: interviews,
            portfolioWork: Number(portfolioWork.toFixed(1)),
            dailyNotes: notes
        };
    }

    timeToString(dateObj) {
        return dateObj.toTimeString().slice(0, 5);
    }

    async showWelcomeMessage() {
        return new Promise((resolve) => {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            welcomeDiv.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-rocket text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold mb-4">Welcome to Goals!</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            I've added some sample data to get you started. Try adding your first real entry using the + button!
                        </p>
                        <div class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <div>🎯 <strong>100 points max daily</strong></div>
                            <div>🔥 <strong>70+ points</strong> builds streaks</div>
                            <div>📊 <strong>All data</strong> saves locally</div>
                        </div>
                        <button id="welcome-close" class="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Let's Go!
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(welcomeDiv);
            
            document.getElementById('welcome-close').addEventListener('click', () => {
                document.body.removeChild(welcomeDiv);
                resolve();
            });
            
            setTimeout(() => {
                if (welcomeDiv.parentNode) {
                    document.body.removeChild(welcomeDiv);
                    resolve();
                }
            }, 10000);
        });
    }
}

// Dashboard Management
class Dashboard {
    constructor() {
        this.dbManager = new DatabaseManager();
        this.scoringSystem = new ScoringSystem();
        this.currentData = {
            entries: [],
            profile: null,
            streak: { current: 0, best: 0 },
            level: { level: 'Beginner', multiplier: 1.0 }
        };
    }

    async initialize() {
        try {
            await this.loadUserData();
            this.renderDashboard();
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
        }
    }

    async loadUserData() {
        const [profile, entries] = await Promise.all([
            this.dbManager.getUserProfile(),
            this.dbManager.getRecentEntries(30)
        ]);

        this.currentData.profile = profile || {
            totalPoints: 0,
            currentStreak: 0,
            bestStreak: 0,
            level: 'Beginner',
            achievements: []
        };
        this.currentData.entries = entries || [];
        this.currentData.streak = this.scoringSystem.calculateStreak(entries);
        
        const avgScore = this.calculateAverageScore(entries.slice(0, 7));
        this.currentData.level = this.scoringSystem.getUserLevel(
            this.currentData.streak.current, 
            avgScore
        );
    }

    calculateAverageScore(entries) {
        if (entries.length === 0) return 0;
        const total = entries.reduce((sum, entry) => {
            return sum + this.scoringSystem.calculateDailyScore(entry).totalPoints;
        }, 0);
        return total / entries.length;
    }

    renderDashboard() {
        this.renderQuickStats();
        this.renderTodayWidget();
        this.renderStreakDisplay();
        this.renderWeeklyProgress();
        this.renderMonthlyCalendar();
    }

    renderQuickStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = this.currentData.entries.find(entry => entry.date === today);
        const todayScore = todayEntry ? this.scoringSystem.calculateDailyScore(todayEntry) : { totalPoints: 0 };

        const weeklyEntries = this.currentData.entries.slice(0, 7);
        const weeklyPoints = weeklyEntries.reduce((sum, entry) => {
            return sum + this.scoringSystem.calculateDailyScore(entry).totalPoints;
        }, 0);

        // Update quick stats
        const todayScoreEl = document.getElementById('today-score');
        const currentStreakEl = document.getElementById('current-streak');
        const currentLevelEl = document.getElementById('current-level');
        const weeklyPointsEl = document.getElementById('weekly-points');

        if (todayScoreEl) todayScoreEl.textContent = todayScore.totalPoints;
        if (currentStreakEl) currentStreakEl.textContent = this.currentData.streak.current;
        if (currentLevelEl) currentLevelEl.textContent = this.currentData.level.level;
        if (weeklyPointsEl) weeklyPointsEl.textContent = weeklyPoints;
    }

    renderTodayWidget() {
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = this.currentData.entries.find(entry => entry.date === today);
        const todayScore = todayEntry ? this.scoringSystem.calculateDailyScore(todayEntry) : null;

        const widget = document.getElementById('today-widget');
        if (!widget) return;

        widget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Today's Progress</h3>
                <div class="flex items-center justify-center mb-4">
                    <div class="relative w-32 h-32">
                        <canvas id="today-progress-circle" width="128" height="128"></canvas>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-accent">
                                    ${todayScore ? todayScore.totalPoints : 0}
                                </div>
                                <div class="text-sm text-gray-500">points</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${todayScore ? this.renderScoreBreakdown(todayScore.breakdown) : 
                    '<div class="text-center text-gray-500">No entry for today yet</div>'}
                
                <div class="mt-4 text-center">
                    <button id="quick-entry-btn" class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors">
                        ${todayEntry ? 'Update Entry' : 'Quick Entry'}
                    </button>
                </div>
            </div>
        `;

        this.renderProgressCircle('today-progress-circle', todayScore ? todayScore.percentage : 0);
    }

    renderScoreBreakdown(breakdown) {
        return `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Sleep Foundation</span>
                    <span class="font-medium">${breakdown.sleep.total}/30</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Priority Execution</span>
                    <span class="font-medium">${breakdown.priority.total}/40</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Discipline Systems</span>
                    <span class="font-medium">${breakdown.discipline.total}/30</span>
                </div>
            </div>
        `;
    }

    renderStreakDisplay() {
        const streakWidget = document.getElementById('streak-widget');
        if (!streakWidget) return;

        const { current, best } = this.currentData.streak;
        const { level, multiplier, nextLevel } = this.currentData.level;

        streakWidget.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
                <h3 class="text-xl font-semibold mb-4">Current Status</h3>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold">${current}</div>
                        <div class="text-sm opacity-80">Current Streak</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold">${best}</div>
                        <div class="text-sm opacity-80">Best Streak</div>
                    </div>
                </div>
                
                <div class="text-center mb-4">
                    <div class="text-lg font-semibold">${level}</div>
                    <div class="text-sm opacity-80">${multiplier}x Multiplier</div>
                </div>
                
                ${nextLevel ? `
                    <div class="bg-white bg-opacity-20 rounded-lg p-3">
                        <div class="text-sm">Next: ${nextLevel.title}</div>
                        <div class="text-xs opacity-80">
                            ${nextLevel.days} days at ${nextLevel.min}+ points
                        </div>
                    </div>
                ` : '<div class="text-center text-sm opacity-80">Maximum Level Achieved!</div>'}
            </div>
        `;
    }

    renderWeeklyProgress() {
        const weeklyWidget = document.getElementById('weekly-progress');
        if (!weeklyWidget) return;

        const weeklyEntries = this.currentData.entries.slice(0, 7);
        const weeklyPoints = weeklyEntries.reduce((sum, entry) => {
            return sum + this.scoringSystem.calculateDailyScore(entry).totalPoints;
        }, 0);

        weeklyWidget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Weekly Progress</h3>
                
                <div class="mb-4">
                    <div class="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>${weeklyPoints}/700 points</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-accent h-3 rounded-full" style="width: ${(weeklyPoints/700)*100}%"></div>
                    </div>
                </div>
                
                <div class="grid grid-cols-7 gap-1 mb-4">
                    ${this.renderWeeklyCalendar(weeklyEntries)}
                </div>
                
                <div class="space-y-2">
                    <h4 class="font-medium text-sm">Weekly Summary:</h4>
                    <div class="text-sm text-gray-600">
                        Average: ${weeklyEntries.length > 0 ? Math.round(weeklyPoints / weeklyEntries.length) : 0} points/day
                    </div>
                </div>
            </div>
        `;
    }

    renderWeeklyCalendar(entries) {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const today = new Date();
        
        return days.map((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));
            const dateStr = date.toISOString().split('T')[0];
            const entry = entries.find(e => e.date === dateStr);
            const score = entry ? this.scoringSystem.calculateDailyScore(entry).totalPoints : 0;
            
            let bgColor = 'bg-gray-100';
            if (score >= 90) bgColor = 'bg-green-500';
            else if (score >= 80) bgColor = 'bg-green-400';
            else if (score >= 70) bgColor = 'bg-yellow-400';
            else if (score >= 50) bgColor = 'bg-orange-400';
            else if (score > 0) bgColor = 'bg-red-400';
            
            return `
                <div class="text-center">
                    <div class="text-xs text-gray-500 mb-1">${day}</div>
                    <div class="w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center text-xs font-medium text-white">
                        ${score || ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderMonthlyCalendar() {
        const calendarWidget = document.getElementById('monthly-calendar');
        if (!calendarWidget) return;

        const today = new Date();

        calendarWidget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">
                        ${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                </div>
                
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-calendar-alt text-3xl mb-4"></i>
                    <p>Monthly calendar view available with more data points</p>
                </div>
                
                <div class="mt-4 flex justify-between text-xs text-gray-500">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            90+ pts
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                            70-89 pts
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-red-400 rounded mr-2"></div>
                            &lt;70 pts
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProgressCircle(canvasId, percentage) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 45;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Progress arc
        if (percentage > 0) {
            const angle = (percentage / 100) * 2 * Math.PI;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + angle);
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }
}

// Main Application
class GoalsApp {
    constructor() {
        this.dashboard = new Dashboard();
        this.scoringSystem = new ScoringSystem();
        this.dbManager = new DatabaseManager();
        this.demoGenerator = new DemoDataGenerator(this.dbManager);
        this.currentTheme = 'light';
        
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            this.initializeTheme();
            this.initializeAOS();
            
            await this.initializeApp();
            
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }

    async initializeApp() {
        const demoAdded = await this.demoGenerator.initializeDemoData();
        await this.dashboard.initialize();
        
        if (demoAdded) {
            setTimeout(() => {
                this.demoGenerator.showWelcomeMessage();
            }, 1000);
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('mobile-theme-toggle')?.addEventListener('click', () => this.toggleTheme());

        // Mobile menu
        document.getElementById('mobile-menu-button')?.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });

        // Quick actions
        document.getElementById('quick-entry-fab')?.addEventListener('click', () => this.showDailyEntryModal());
        document.getElementById('export-data-fab')?.addEventListener('click', () => this.exportData());

        // Daily entry modal
        document.getElementById('entry-modal-close')?.addEventListener('click', () => this.hideDailyEntryModal());
        document.getElementById('entry-cancel-btn')?.addEventListener('click', () => this.hideDailyEntryModal());
        document.getElementById('daily-entry-form')?.addEventListener('submit', (e) => this.handleDailyEntrySubmit(e));

        // Range sliders
        document.getElementById('morning-completion')?.addEventListener('input', (e) => {
            document.getElementById('morning-completion-value').textContent = e.target.value + '%';
        });
        document.getElementById('evening-completion')?.addEventListener('input', (e) => {
            document.getElementById('evening-completion-value').textContent = e.target.value + '%';
        });

        // Quick entry button in today widget
        document.addEventListener('click', (e) => {
            if (e.target.id === 'quick-entry-btn') {
                this.showDailyEntryModal();
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Scroll progress bar
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('scrollProgress').style.width = scrolled + '%';
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.currentTheme = 'dark';
            document.documentElement.classList.add('dark');
        } else {
            this.currentTheme = 'light';
            document.documentElement.classList.remove('dark');
        }
        
        this.updateThemeIcons();
    }

    toggleTheme() {
        if (this.currentTheme === 'light') {
            this.currentTheme = 'dark';
            document.documentElement.classList.add('dark');
        } else {
            this.currentTheme = 'light';
            document.documentElement.classList.remove('dark');
        }
        
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcons();
    }

    updateThemeIcons() {
        const desktopIcon = document.getElementById('theme-icon');
        const mobileIcon = document.getElementById('mobile-theme-icon');
        
        const iconClass = this.currentTheme === 'dark' ? 'fas fa-moon text-lg' : 'fas fa-sun text-lg';
        
        if (desktopIcon) desktopIcon.className = iconClass;
        if (mobileIcon) mobileIcon.className = iconClass;
    }

    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
    }

    showDailyEntryModal(date = null) {
        const modal = document.getElementById('daily-entry-modal');
        const dateInput = document.getElementById('entry-date');
        
        const entryDate = date || new Date().toISOString().split('T')[0];
        dateInput.value = entryDate;
        
        this.loadExistingEntry(entryDate);
        modal.classList.add('active');
    }

    hideDailyEntryModal() {
        const modal = document.getElementById('daily-entry-modal');
        modal.classList.remove('active');
        document.getElementById('daily-entry-form').reset();
    }

    async loadExistingEntry(date) {
        try {
            const entries = await this.dbManager.getDailyEntries(date, date);
            const entry = entries.find(e => e.date === date);
            
            if (entry) {
                this.populateEntryForm(entry);
            }
        } catch (error) {
            console.error('Failed to load existing entry:', error);
        }
    }

    populateEntryForm(entry) {
        Object.keys(entry).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = entry[key];
                } else if (element.type === 'range') {
                    element.value = entry[key];
                    const valueDisplay = document.getElementById(element.id + '-value');
                    if (valueDisplay) valueDisplay.textContent = entry[key] + '%';
                } else {
                    element.value = entry[key];
                }
            }
        });
    }

    async handleDailyEntrySubmit(e) {
        e.preventDefault();
        
        const entryData = this.parseEntryFormData();
        const saveBtn = document.getElementById('entry-save-btn');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        try {
            await this.dbManager.saveDailyEntry(entryData.date, entryData);
            
            const score = this.scoringSystem.calculateDailyScore(entryData);
            
            await this.dashboard.loadUserData();
            this.dashboard.renderDashboard();
            
            this.hideDailyEntryModal();
            this.showSuccess(`Entry saved! You scored ${score.totalPoints} points today.`);
            
        } catch (error) {
            console.error('Failed to save entry:', error);
            this.showError('Failed to save entry. Please try again.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Entry';
        }
    }

    parseEntryFormData() {
        return {
            date: document.getElementById('entry-date').value,
            bedtime: document.getElementById('bedtime').value,
            wakeupTime: document.getElementById('wakeup-time').value,
            phoneAvoidanceFirst30: document.getElementById('phone-avoidance').checked,
            morningPriorityBlock: document.getElementById('morning-priority-block').checked,
            morningPriorityCompletion: parseInt(document.getElementById('morning-completion').value),
            eveningEnergyBlock: document.getElementById('evening-energy-block').checked,
            eveningBlockCompletion: parseInt(document.getElementById('evening-completion').value),
            phoneViolations: parseInt(document.getElementById('phone-violations').value) || 0,
            energyManagementFollowed: document.getElementById('energy-management').checked,
            windDownRoutineCompleted: document.getElementById('wind-down-routine').checked,
            jobApplications: parseInt(document.getElementById('job-applications').value) || 0,
            interviews: parseInt(document.getElementById('interviews').value) || 0,
            portfolioWork: parseFloat(document.getElementById('portfolio-work').value) || 0,
            dailyNotes: document.getElementById('daily-notes').value
        };
    }

    async exportData() {
        try {
            const data = await this.dbManager.exportUserData();
            
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `goals-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess('Data exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            this.showError('Failed to export data. Please try again.');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('opacity-100'), 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.goalsApp = new GoalsApp();
});