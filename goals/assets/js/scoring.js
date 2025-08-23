// Daily Scoring System - Core Logic
export class ScoringSystem {
    constructor() {
        this.maxDailyPoints = 100;
        this.categories = {
            sleep: {
                maxPoints: 30,
                criteria: {
                    bedtimeCompliance: 10,    // Bedtime at 11:30 PM
                    wakeupCompliance: 10,     // Wake up at 7:30 AM
                    phoneAvoidance: 10        // No phone first 30 minutes
                }
            },
            priority: {
                maxPoints: 40,
                criteria: {
                    morningBlock: 25,         // 8:00-10:30 AM Priority 1 block
                    eveningBlock: 15          // 8:00-10:00 PM evening energy block
                }
            },
            discipline: {
                maxPoints: 30,
                criteria: {
                    phoneBoundaries: 15,      // Phone boundaries during work blocks
                    energyManagement: 10,     // Afternoon energy management
                    windDownRoutine: 5        // Evening wind-down routine
                }
            }
        };
        
        this.streakThresholds = {
            bronze: { min: 70, days: 3, multiplier: 1.0, title: 'Bronze Warrior' },
            silver: { min: 80, days: 7, multiplier: 1.1, title: 'Silver Champion' },
            gold: { min: 90, days: 14, multiplier: 1.2, title: 'Gold Master' },
            diamond: { min: 95, days: 30, multiplier: 1.3, title: 'Diamond Legend' }
        };

        this.achievements = {
            consistencyKing: { name: 'Consistency King', description: '7 days in a row 85+', points: 100 },
            earlyRiser: { name: 'Early Riser', description: '14 days perfect wake time', points: 75 },
            phoneMaster: { name: 'Phone Master', description: '30 days perfect phone discipline', points: 150 },
            priorityWarrior: { name: 'Priority Warrior', description: '21 days completing both priority blocks', points: 200 }
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

    checkAchievements(entries, currentAchievements = []) {
        const newAchievements = [];
        
        // Consistency King - 7 days in a row 85+
        if (!currentAchievements.includes('consistencyKing')) {
            let consecutiveHighScore = 0;
            const recentEntries = entries.slice(0, 7);
            for (let entry of recentEntries) {
                const score = this.calculateDailyScore(entry);
                if (score.totalPoints >= 85) {
                    consecutiveHighScore++;
                } else {
                    break;
                }
            }
            if (consecutiveHighScore >= 7) {
                newAchievements.push('consistencyKing');
            }
        }

        // Early Riser - 14 days perfect wake time
        if (!currentAchievements.includes('earlyRiser')) {
            let perfectWakeups = 0;
            const recentEntries = entries.slice(0, 14);
            for (let entry of recentEntries) {
                const sleepPoints = this.calculateSleepPoints(entry);
                if (sleepPoints.wakeupCompliance === 10) {
                    perfectWakeups++;
                }
            }
            if (perfectWakeups >= 14) {
                newAchievements.push('earlyRiser');
            }
        }

        return newAchievements;
    }

    getWeeklyRewards(weeklyPoints) {
        const rewards = [];
        if (weeklyPoints >= 500) rewards.push({ type: 'meal', name: 'Special Meal' });
        if (weeklyPoints >= 600) rewards.push({ type: 'book', name: 'New Book' });
        if (weeklyPoints >= 650) rewards.push({ type: 'night_out', name: 'Night Out' });
        if (weeklyPoints >= 700) rewards.push({ type: 'purchase', name: 'Special Purchase' });
        return rewards;
    }

    generateInsights(entries) {
        if (entries.length < 7) return [];

        const insights = [];
        const recentWeek = entries.slice(0, 7);
        
        // Best performing day analysis
        const dayPerformance = {};
        recentWeek.forEach(entry => {
            const dayOfWeek = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
            const score = this.calculateDailyScore(entry);
            if (!dayPerformance[dayOfWeek]) dayPerformance[dayOfWeek] = [];
            dayPerformance[dayOfWeek].push(score.totalPoints);
        });

        const avgByDay = Object.entries(dayPerformance).map(([day, scores]) => ({
            day,
            avg: scores.reduce((a, b) => a + b, 0) / scores.length
        }));

        const bestDay = avgByDay.reduce((a, b) => a.avg > b.avg ? a : b);
        const worstDay = avgByDay.reduce((a, b) => a.avg < b.avg ? a : b);

        insights.push(`Your best day is ${bestDay.day} with an average of ${bestDay.avg.toFixed(1)} points`);
        insights.push(`Focus on improving ${worstDay.day}s - currently averaging ${worstDay.avg.toFixed(1)} points`);

        // Sleep pattern analysis
        const sleepScores = recentWeek.map(entry => this.calculateSleepPoints(entry).total);
        const avgSleepScore = sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length;
        
        if (avgSleepScore < 20) {
            insights.push('Sleep foundation needs attention - focus on consistent bedtime and wake time');
        }

        return insights;
    }
}

export default new ScoringSystem();