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

        // Recalculate total points from all entries
        const totalPoints = localData.entries.reduce((sum, entry) => {
            // Calculate score for this entry
            const score = this.calculateEntryScore(entry);
            return sum + score.totalPoints;
        }, 0);

        // Calculate streaks
        const { current, best } = this.calculateStreaks(localData.entries);

        localData.profile.totalPoints = totalPoints;
        localData.profile.currentStreak = current;
        localData.profile.bestStreak = Math.max(localData.profile.bestStreak, best);
        localData.profile.lastUpdated = new Date().toISOString();

        return this.saveLocalData(localData);
    }

    calculateEntryScore(entry) {
        // Simple scoring calculation - this should match scoring.js
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

    // Auth methods (simplified for local storage)
    async signIn(email, password) {
        return { success: true };
    }

    async signUp(email, password) {
        return { success: true };
    }

    async signOut() {
        return { success: true };
    }

    // Clear all data (useful for reset)
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeLocalData();
    }
}

export default new DatabaseManager();