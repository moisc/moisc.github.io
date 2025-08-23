// Dashboard Management and Data Visualization
import ScoringSystem from './scoring.js';
import DatabaseManager from '../config/database.js';

export class Dashboard {
    constructor() {
        this.scoringSystem = ScoringSystem;
        this.dbManager = DatabaseManager;
        this.charts = {};
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
            this.setupEventListeners();
            this.renderDashboard();
            this.startAutoRefresh();
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            this.showError('Failed to load dashboard data');
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
        this.renderTodayWidget();
        this.renderStreakDisplay();
        this.renderWeeklyProgress();
        this.renderMonthlyCalendar();
        this.renderAnalytics();
        this.renderAchievements();
        this.renderInsights();
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

        const rewards = this.scoringSystem.getWeeklyRewards(weeklyPoints);

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
                    <h4 class="font-medium text-sm">Rewards Available:</h4>
                    ${rewards.length > 0 ? rewards.map(reward => `
                        <div class="flex items-center text-sm text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            ${reward.name}
                        </div>
                    `).join('') : '<div class="text-sm text-gray-500">No rewards unlocked yet</div>'}
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
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        calendarWidget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">
                        ${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div class="flex space-x-1">
                        <button id="prev-month" class="p-2 hover:bg-gray-100 rounded-lg">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button id="next-month" class="p-2 hover:bg-gray-100 rounded-lg">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-7 gap-1">
                    ${this.renderMonthlyCalendarDays(firstDay, lastDay)}
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

    renderMonthlyCalendarDays(firstDay, lastDay) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let html = '';
        
        // Header row
        html += days.map(day => `
            <div class="text-center text-xs font-medium text-gray-500 py-2">${day}</div>
        `).join('');
        
        // Calendar days
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = currentDate.getMonth() === firstDay.getMonth();
            const dateStr = currentDate.toISOString().split('T')[0];
            const entry = this.currentData.entries.find(e => e.date === dateStr);
            const score = entry ? this.scoringSystem.calculateDailyScore(entry).totalPoints : 0;
            
            let bgColor = 'bg-gray-50';
            let textColor = 'text-gray-400';
            
            if (isCurrentMonth) {
                textColor = 'text-gray-700';
                if (score >= 90) bgColor = 'bg-green-500 text-white';
                else if (score >= 70) bgColor = 'bg-yellow-400 text-white';
                else if (score > 0) bgColor = 'bg-red-400 text-white';
            }
            
            html += `
                <div class="text-center p-2 ${bgColor} ${textColor} text-xs hover:bg-gray-100 cursor-pointer rounded" 
                     data-date="${dateStr}">
                    ${currentDate.getDate()}
                </div>
            `;
        }
        
        return html;
    }

    renderAnalytics() {
        const analyticsWidget = document.getElementById('analytics-widget');
        if (!analyticsWidget) return;

        const recentEntries = this.currentData.entries.slice(0, 30);
        
        analyticsWidget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Analytics</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-medium mb-3">30-Day Trend</h4>
                        <canvas id="trend-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div>
                        <h4 class="font-medium mb-3">Category Performance</h4>
                        <canvas id="category-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="md:col-span-2">
                        <h4 class="font-medium mb-3">Weekly Patterns</h4>
                        <canvas id="pattern-chart" width="800" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;

        this.renderTrendChart(recentEntries);
        this.renderCategoryChart(recentEntries);
        this.renderPatternChart(recentEntries);
    }

    renderAchievements() {
        const achievementsWidget = document.getElementById('achievements-widget');
        if (!achievementsWidget) return;

        const userAchievements = this.currentData.profile?.achievements || [];
        const newAchievements = this.scoringSystem.checkAchievements(
            this.currentData.entries, 
            userAchievements
        );

        achievementsWidget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Achievements</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${Object.entries(this.scoringSystem.achievements).map(([key, achievement]) => {
                        const isUnlocked = userAchievements.includes(key);
                        const isNew = newAchievements.includes(key);
                        
                        return `
                            <div class="border rounded-lg p-4 ${isUnlocked ? 'border-green-300 bg-green-50' : 'border-gray-200'} ${isNew ? 'ring-2 ring-blue-500' : ''}">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-trophy ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'} mr-2"></i>
                                    <h4 class="font-medium">${achievement.name}</h4>
                                    ${isNew ? '<span class="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded-full">NEW!</span>' : ''}
                                </div>
                                <p class="text-sm text-gray-600">${achievement.description}</p>
                                <div class="text-xs text-accent mt-1">${achievement.points} bonus points</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderInsights() {
        const insightsWidget = document.getElementById('insights-widget');
        if (!insightsWidget) return;

        const insights = this.scoringSystem.generateInsights(this.currentData.entries);

        insightsWidget.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Insights & Recommendations</h3>
                
                <div class="space-y-3">
                    ${insights.map((insight, index) => `
                        <div class="flex items-start">
                            <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                <i class="fas fa-lightbulb text-blue-600 text-xs"></i>
                            </div>
                            <div class="text-sm text-gray-700">${insight}</div>
                        </div>
                    `).join('')}
                    
                    ${insights.length === 0 ? `
                        <div class="text-center text-gray-500 py-8">
                            <i class="fas fa-chart-line text-3xl mb-4"></i>
                            <p>More insights will appear as you build your tracking history!</p>
                        </div>
                    ` : ''}
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

    renderTrendChart(entries) {
        // Implementation would use Chart.js or similar library
        console.log('Rendering trend chart with', entries.length, 'entries');
    }

    renderCategoryChart(entries) {
        // Implementation would use Chart.js or similar library
        console.log('Rendering category chart');
    }

    renderPatternChart(entries) {
        // Implementation would use Chart.js or similar library
        console.log('Rendering pattern chart');
    }

    setupEventListeners() {
        // Quick entry button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'quick-entry-btn') {
                this.showQuickEntryModal();
            }
        });

        // Calendar navigation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prev-month' || e.target.id === 'next-month') {
                // Handle month navigation
                this.navigateMonth(e.target.id === 'next-month' ? 1 : -1);
            }
        });

        // Calendar day clicks
        document.addEventListener('click', (e) => {
            if (e.target.dataset.date) {
                this.showDayDetail(e.target.dataset.date);
            }
        });
    }

    showQuickEntryModal() {
        // Implementation for quick entry modal
        console.log('Showing quick entry modal');
    }

    navigateMonth(direction) {
        // Implementation for month navigation
        console.log('Navigating month:', direction);
    }

    showDayDetail(date) {
        // Implementation for day detail view
        console.log('Showing detail for date:', date);
    }

    startAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(async () => {
            await this.loadUserData();
            this.renderTodayWidget();
            this.renderStreakDisplay();
        }, 5 * 60 * 1000);
    }

    showError(message) {
        // Implementation for error display
        console.error('Dashboard error:', message);
    }
}

export default Dashboard;