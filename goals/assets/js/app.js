// Main Application Controller
import Dashboard from './dashboard.js';
import ScoringSystem from './scoring.js';
import DatabaseManager from '../config/database.js';
import DemoDataGenerator from './demo.js';

class GoalsApp {
    constructor() {
        this.dashboard = new Dashboard();
        this.scoringSystem = ScoringSystem;
        this.dbManager = DatabaseManager;
        this.demoGenerator = new DemoDataGenerator(DatabaseManager);
        this.currentUser = null;
        this.isAuthenticated = true; // Always authenticated with local storage
        this.currentTheme = 'light';
        
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            this.initializeTheme();
            this.initializeAOS();
            
            // Initialize with local storage (no auth needed)
            await this.initializeApp();
            
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showError('Failed to initialize application');
        }
    }

    async initializeApp() {
        // Set up local user
        this.currentUser = this.dbManager.currentUser;
        
        // Check if this is a first-time user and add demo data if needed
        const demoAdded = await this.demoGenerator.initializeDemoData();
        
        // Initialize dashboard
        await this.dashboard.initialize();
        
        // Show welcome message for new users
        if (demoAdded) {
            setTimeout(() => {
                this.demoGenerator.showWelcomeMessage();
            }, 1000);
        }
    }

    // Demo data generation moved to demo.js

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('mobile-theme-toggle')?.addEventListener('click', () => this.toggleTheme());

        // Mobile menu
        document.getElementById('mobile-menu-button')?.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });

        // No auth modal needed

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

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                // Close mobile menu if open
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

    // Authentication methods removed - using local storage only

    // User display methods no longer needed

    showDailyEntryModal(date = null) {
        const modal = document.getElementById('daily-entry-modal');
        const dateInput = document.getElementById('entry-date');
        
        // Set date to today or provided date
        const entryDate = date || new Date().toISOString().split('T')[0];
        dateInput.value = entryDate;
        
        // Load existing entry if available
        this.loadExistingEntry(entryDate);
        
        modal.classList.add('active');
    }

    hideDailyEntryModal() {
        const modal = document.getElementById('daily-entry-modal');
        modal.classList.remove('active');
        
        // Clear form
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
        // Populate form fields with existing data
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
        
        const formData = new FormData(e.target);
        const entryData = this.parseEntryFormData(formData);
        
        const saveBtn = document.getElementById('entry-save-btn');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        try {
            // Save to local storage
            await this.dbManager.saveDailyEntry(entryData.date, entryData);
            
            // Calculate and display score
            const score = this.scoringSystem.calculateDailyScore(entryData);
            this.showScoreBreakdown(score);
            
            // Refresh dashboard
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

    parseEntryFormData(formData) {
        return {
            date: formData.get('entry-date') || document.getElementById('entry-date').value,
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

    // updateGuestDemoData no longer needed - using local storage directly

    showScoreBreakdown(score) {
        // Create and show score breakdown modal or notification
        const breakdown = score.breakdown;
        let message = `Score Breakdown:\n`;
        message += `Sleep: ${breakdown.sleep.total}/30\n`;
        message += `Priority: ${breakdown.priority.total}/40\n`;
        message += `Discipline: ${breakdown.discipline.total}/30\n`;
        message += `Total: ${score.totalPoints}/100`;
        
        console.log(message);
    }

    async exportData() {
        try {
            const data = await this.dbManager.exportUserData();
            
            // Create and download JSON file
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

    // showAuthPrompt no longer needed

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
        
        // Animate in
        setTimeout(() => notification.classList.add('opacity-100'), 10);
        
        // Auto-dismiss after 5 seconds
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

export default GoalsApp;