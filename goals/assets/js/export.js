// Data Export and Import Functionality
export class DataExporter {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    async exportToJSON(dateRange = null) {
        try {
            const data = await this.gatherUserData(dateRange);
            const jsonString = JSON.stringify(data, null, 2);
            
            const blob = new Blob([jsonString], { type: 'application/json' });
            this.downloadFile(blob, `goals-data-${this.getDateString()}.json`);
            
            return { success: true, data };
        } catch (error) {
            console.error('JSON export failed:', error);
            return { success: false, error: error.message };
        }
    }

    async exportToCSV(dateRange = null) {
        try {
            const data = await this.gatherUserData(dateRange);
            const csvString = this.convertToCSV(data.entries);
            
            const blob = new Blob([csvString], { type: 'text/csv' });
            this.downloadFile(blob, `goals-entries-${this.getDateString()}.csv`);
            
            return { success: true };
        } catch (error) {
            console.error('CSV export failed:', error);
            return { success: false, error: error.message };
        }
    }

    async exportSummaryReport(dateRange = null) {
        try {
            const data = await this.gatherUserData(dateRange);
            const report = this.generateSummaryReport(data);
            
            const blob = new Blob([report], { type: 'text/plain' });
            this.downloadFile(blob, `goals-summary-${this.getDateString()}.txt`);
            
            return { success: true };
        } catch (error) {
            console.error('Summary export failed:', error);
            return { success: false, error: error.message };
        }
    }

    async gatherUserData(dateRange = null) {
        const profile = await this.dbManager.getUserProfile();
        let entries;
        
        if (dateRange) {
            entries = await this.dbManager.getDailyEntries(dateRange.start, dateRange.end);
        } else {
            entries = await this.dbManager.getRecentEntries(365); // Last year
        }
        
        return {
            exportMetadata: {
                timestamp: new Date().toISOString(),
                version: '1.0',
                userId: this.dbManager.currentUser?.uid,
                dateRange: dateRange || 'all'
            },
            profile,
            entries: entries.map(entry => this.sanitizeEntry(entry)),
            statistics: this.calculateStatistics(entries)
        };
    }

    sanitizeEntry(entry) {
        // Remove any sensitive data and ensure consistent format
        const sanitized = { ...entry };
        delete sanitized.userId;
        delete sanitized.id;
        
        return sanitized;
    }

    convertToCSV(entries) {
        if (entries.length === 0) return 'No data to export';

        // Get all unique keys from entries
        const allKeys = new Set();
        entries.forEach(entry => {
            Object.keys(entry).forEach(key => allKeys.add(key));
        });

        const headers = Array.from(allKeys).sort();
        const csvRows = [headers.join(',')];

        entries.forEach(entry => {
            const row = headers.map(header => {
                const value = entry[header] || '';
                // Escape CSV values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    generateSummaryReport(data) {
        const { profile, entries, statistics } = data;
        
        let report = 'GOALS TRACKING SUMMARY REPORT\n';
        report += '='.repeat(50) + '\n\n';
        
        report += `Export Date: ${new Date().toLocaleDateString()}\n`;
        report += `Total Entries: ${entries.length}\n`;
        report += `Date Range: ${entries.length > 0 ? `${entries[entries.length - 1].date} to ${entries[0].date}` : 'No data'}\n\n`;
        
        // Profile Summary
        if (profile) {
            report += 'PROFILE SUMMARY\n';
            report += '-'.repeat(20) + '\n';
            report += `Total Points Earned: ${profile.totalPoints || 0}\n`;
            report += `Current Streak: ${profile.currentStreak || 0} days\n`;
            report += `Best Streak: ${profile.bestStreak || 0} days\n`;
            report += `Current Level: ${profile.level || 'Beginner'}\n`;
            report += `Achievements Unlocked: ${(profile.achievements || []).length}\n\n`;
        }
        
        // Statistics
        if (statistics) {
            report += 'PERFORMANCE STATISTICS\n';
            report += '-'.repeat(25) + '\n';
            report += `Average Daily Score: ${statistics.averageScore.toFixed(1)}/100\n`;
            report += `Best Day Score: ${statistics.bestScore}/100\n`;
            report += `Days with 70+ points: ${statistics.goodDays} (${((statistics.goodDays / entries.length) * 100).toFixed(1)}%)\n`;
            report += `Days with 90+ points: ${statistics.excellentDays} (${((statistics.excellentDays / entries.length) * 100).toFixed(1)}%)\n\n`;
            
            report += 'CATEGORY AVERAGES\n';
            report += '-'.repeat(18) + '\n';
            report += `Sleep Foundation: ${statistics.categoryAverages.sleep.toFixed(1)}/30\n`;
            report += `Priority Execution: ${statistics.categoryAverages.priority.toFixed(1)}/40\n`;
            report += `Discipline Systems: ${statistics.categoryAverages.discipline.toFixed(1)}/30\n\n`;
        }
        
        // Recent Entries Summary
        if (entries.length > 0) {
            report += 'RECENT ENTRIES (Last 10 Days)\n';
            report += '-'.repeat(30) + '\n';
            const recentEntries = entries.slice(0, 10);
            
            recentEntries.forEach(entry => {
                const score = this.calculateEntryScore(entry);
                report += `${entry.date}: ${score.totalPoints} points`;
                if (entry.dailyNotes) {
                    report += ` - ${entry.dailyNotes.substring(0, 50)}${entry.dailyNotes.length > 50 ? '...' : ''}`;
                }
                report += '\n';
            });
        }
        
        report += '\n' + '='.repeat(50) + '\n';
        report += 'End of Report\n';
        
        return report;
    }

    calculateStatistics(entries) {
        if (entries.length === 0) return null;

        let totalScore = 0;
        let bestScore = 0;
        let goodDays = 0;
        let excellentDays = 0;
        let sleepTotal = 0;
        let priorityTotal = 0;
        let disciplineTotal = 0;

        entries.forEach(entry => {
            const score = this.calculateEntryScore(entry);
            totalScore += score.totalPoints;
            bestScore = Math.max(bestScore, score.totalPoints);
            
            if (score.totalPoints >= 70) goodDays++;
            if (score.totalPoints >= 90) excellentDays++;
            
            sleepTotal += score.breakdown.sleep.total;
            priorityTotal += score.breakdown.priority.total;
            disciplineTotal += score.breakdown.discipline.total;
        });

        return {
            averageScore: totalScore / entries.length,
            bestScore,
            goodDays,
            excellentDays,
            categoryAverages: {
                sleep: sleepTotal / entries.length,
                priority: priorityTotal / entries.length,
                discipline: disciplineTotal / entries.length
            }
        };
    }

    calculateEntryScore(entry) {
        // Use the scoring system to calculate entry score
        // This should match the scoring logic from scoring.js
        return window.goalsApp?.scoringSystem?.calculateDailyScore(entry) || { totalPoints: 0, breakdown: { sleep: { total: 0 }, priority: { total: 0 }, discipline: { total: 0 } } };
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getDateString() {
        return new Date().toISOString().split('T')[0];
    }

    async importFromJSON(file) {
        try {
            const text = await this.readFileAsText(file);
            const data = JSON.parse(text);
            
            // Validate data structure
            if (!this.validateImportData(data)) {
                throw new Error('Invalid data format');
            }
            
            // Import entries
            const importResults = await this.processImportData(data);
            
            return {
                success: true,
                imported: importResults.imported,
                skipped: importResults.skipped,
                errors: importResults.errors
            };
        } catch (error) {
            console.error('Import failed:', error);
            return { success: false, error: error.message };
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    validateImportData(data) {
        return (
            data &&
            typeof data === 'object' &&
            Array.isArray(data.entries) &&
            data.exportMetadata &&
            typeof data.exportMetadata === 'object'
        );
    }

    async processImportData(data) {
        const results = { imported: 0, skipped: 0, errors: [] };
        
        for (const entry of data.entries) {
            try {
                // Check if entry already exists
                const existing = await this.dbManager.getDailyEntries(entry.date, entry.date);
                
                if (existing.length > 0) {
                    results.skipped++;
                    continue;
                }
                
                // Import the entry
                await this.dbManager.saveDailyEntry(entry.date, entry);
                results.imported++;
                
            } catch (error) {
                results.errors.push(`Failed to import entry for ${entry.date}: ${error.message}`);
            }
        }
        
        return results;
    }

    // Quick export shortcuts for common formats
    async quickExportJSON() {
        return this.exportToJSON();
    }

    async quickExportCSV() {
        return this.exportToCSV();
    }

    async quickExportReport() {
        return this.exportSummaryReport();
    }

    // Export specific date ranges
    async exportWeek(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        return this.exportToJSON({
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        });
    }

    async exportMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        return this.exportToJSON({
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        });
    }

    async exportYear(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        
        return this.exportToJSON({
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        });
    }
}

export default DataExporter;