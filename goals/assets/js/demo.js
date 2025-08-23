// Demo Data Generator for First-Time Users
export class DemoDataGenerator {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    async initializeDemoData() {
        // Check if user has any existing data
        const existingData = this.dbManager.getLocalData();
        
        if (!existingData || !existingData.entries || existingData.entries.length === 0) {
            const demoEntries = this.generateDemoEntries();
            
            // Add demo entries to local storage
            for (const entry of demoEntries) {
                await this.dbManager.saveDailyEntry(entry.date, entry);
            }
            
            return true; // Demo data was added
        }
        
        return false; // No demo data needed
    }

    generateDemoEntries() {
        const entries = [];
        const today = new Date();
        
        // Generate last 14 days of realistic demo data
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Create realistic patterns based on day of week
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isMonday = dayOfWeek === 1;
            
            // Generate entry based on patterns
            const entry = this.generateRealisticEntry(dateStr, isWeekend, isMonday, i);
            entries.push(entry);
        }
        
        return entries;
    }

    generateRealisticEntry(date, isWeekend, isMonday, daysAgo) {
        // Base performance that varies by day type
        let basePerformance = 0.75; // 75% baseline
        
        if (isWeekend) basePerformance = 0.6; // Weekends are harder
        if (isMonday) basePerformance = 0.65; // Monday blues
        
        // Add some randomness but keep it realistic
        const performance = Math.max(0.3, Math.min(0.95, basePerformance + (Math.random() - 0.5) * 0.3));
        
        // Sleep timing - slightly inconsistent
        const bedtimeVariation = Math.floor((Math.random() - 0.5) * 60); // ±30 minutes
        const wakeupVariation = Math.floor((Math.random() - 0.5) * 45); // ±22.5 minutes
        
        const baseBedtime = new Date(`1970-01-01T23:30:00`);
        baseBedtime.setMinutes(baseBedtime.getMinutes() + bedtimeVariation);
        
        const baseWakeup = new Date(`1970-01-01T07:30:00`);
        baseWakeup.setMinutes(baseWakeup.getMinutes() + wakeupVariation);
        
        // Phone discipline - gets better over time (showing improvement)
        const phoneDisciplineImprovement = Math.max(0, (14 - daysAgo) / 14 * 0.3);
        const phoneAvoidance = Math.random() + phoneDisciplineImprovement > 0.6;
        const phoneViolations = Math.floor(Math.random() * (phoneAvoidance ? 2 : 5));
        
        // Priority blocks - realistic completion rates
        const morningBlockCompleted = Math.random() < performance;
        const morningCompletion = morningBlockCompleted ? 
            60 + Math.floor(Math.random() * 40) : // 60-100% when completed
            Math.floor(Math.random() * 60); // 0-60% when not completed
            
        const eveningBlockCompleted = Math.random() < performance * 0.8; // Slightly harder
        const eveningCompletion = eveningBlockCompleted ? 
            65 + Math.floor(Math.random() * 35) : // 65-100% when completed
            Math.floor(Math.random() * 50); // 0-50% when not completed
        
        // Energy management and routines
        const energyManagement = Math.random() < performance * 0.9;
        const windDownRoutine = Math.random() < performance * 0.7;
        
        // Job search activities (more on weekdays)
        const jobApps = isWeekend ? 0 : Math.floor(Math.random() * (performance > 0.8 ? 3 : 2));
        const interviews = Math.random() < 0.15 ? 1 : 0; // 15% chance of interview
        const portfolioWork = Math.random() * (isWeekend ? 4 : 2.5);
        
        // Notes for recent entries to show engagement
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

    // Helper method to add a welcome message for new users
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
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                if (welcomeDiv.parentNode) {
                    document.body.removeChild(welcomeDiv);
                    resolve();
                }
            }, 10000);
        });
    }
}

export default DemoDataGenerator;