/**
 * AnimeFlix - Main Application Module
 * This file contains the main application logic and initialization
 */

// Main Application Class
class AnimeFlixApp {
    constructor() {
        // DOM Elements
        this.domElements = {
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            navLinks: document.querySelector('.nav-links'),
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            continueSlider: document.getElementById('continueSlider'),
            featuredSide: document.getElementById('featuredSide'),
            popularGrid: document.getElementById('popularGrid'),
            recentGrid: document.getElementById('recentGrid'),
            footerContent: document.getElementById('footerContent'),
            currentYear: document.getElementById('currentYear'),
            newsletterForm: document.getElementById('newsletterForm'),
            heroWatchBtn: document.getElementById('heroWatchBtn'),
            heroAddToListBtn: document.getElementById('heroAddToListBtn'),
            signInBtn: document.getElementById('signInBtn'),
            signUpBtn: document.getElementById('signUpBtn')
        };

        // App State
        this.state = {
            isMobileMenuOpen: false,
            searchQuery: '',
            isLoading: false,
            continueAutoScroll: null
        };

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.renderContent();
        this.updateCurrentYear();
        this.startAutoScroll();
        
        // Log initialization
        console.log('AnimeFlix App Initialized');
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        this.domElements.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Navigation link clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e));
        });
        
        // Search functionality
        this.domElements.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        this.domElements.searchBtn.addEventListener('click', () => this.performSearch());
        this.domElements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        
        // Newsletter form submission
        this.domElements.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        
        // Hero button actions
        this.domElements.heroWatchBtn.addEventListener('click', () => this.handleWatchNow());
        this.domElements.heroAddToListBtn.addEventListener('click', () => this.handleAddToList());
        
        // Auth button actions
        this.domElements.signInBtn.addEventListener('click', () => this.handleSignIn());
        this.domElements.signUpBtn.addEventListener('click', () => this.handleSignUp());
        
        // Anime card clicks (delegated)
        document.addEventListener('click', (e) => this.handleAnimeCardClick(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    /**
     * Render all content on the page
     */
    renderContent() {
        this.renderContinueWatching();
        this.renderFeaturedSide();
        this.renderPopularAnime();
        this.renderRecentAnime();
        this.renderFooter();
    }

    /**
     * Render continue watching section
     */
    renderContinueWatching() {
        const slider = this.domElements.continueSlider;
        if (!slider) return;
        
        // Clear existing content
        slider.innerHTML = '';
        
        // Show loading state
        const skeletons = Components.createSkeletonCards(3);
        skeletons.forEach(skeleton => slider.appendChild(skeleton));
        
        // Simulate API delay (remove in production)
        setTimeout(() => {
            slider.innerHTML = '';
            
            // Render actual content
            AnimeData.continueWatching.forEach(anime => {
                const card = Components.createContinueCard(anime);
                slider.appendChild(card);
            });
        }, 500);
    }

    /**
     * Render featured side section
     */
    renderFeaturedSide() {
        const sideContainer = this.domElements.featuredSide;
        if (!sideContainer) return;
        
        // Clear existing content
        sideContainer.innerHTML = '';
        
        // Render featured side cards
        AnimeData.featuredSide.forEach(anime => {
            const card = Components.createFeaturedSideCard(anime);
            sideContainer.appendChild(card);
        });
    }

    /**
     * Render popular anime section
     */
    renderPopularAnime() {
        const grid = this.domElements.popularGrid;
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Show loading state
        const skeletons = Components.createSkeletonCards(6);
        skeletons.forEach(skeleton => grid.appendChild(skeleton));
        
        // Simulate API delay (remove in production)
        setTimeout(() => {
            grid.innerHTML = '';
            
            // Render actual content
            AnimeData.popularAnime.forEach(anime => {
                const card = Components.createAnimeCard(anime);
                grid.appendChild(card);
            });
        }, 500);
    }

    /**
     * Render recent anime section
     */
    renderRecentAnime() {
        const grid = this.domElements.recentGrid;
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Show loading state
        const skeletons = Components.createSkeletonCards(6);
        skeletons.forEach(skeleton => grid.appendChild(skeleton));
        
        // Simulate API delay (remove in production)
        setTimeout(() => {
            grid.innerHTML = '';
            
            // Render actual content
            AnimeData.recentAnime.forEach(anime => {
                const card = Components.createAnimeCard(anime);
                grid.appendChild(card);
            });
        }, 500);
    }

    /**
     * Render footer content
     */
    renderFooter() {
        const footerContent = this.domElements.footerContent;
        if (!footerContent) return;
        
        // Clear existing content
        footerContent.innerHTML = '';
        
        // Create about section
        const aboutSection = document.createElement('div');
        aboutSection.className = 'footer-about';
        
        aboutSection.innerHTML = `
            <div class="footer-logo">
                <i class="fas fa-play-circle"></i>
                AnimeFlix
            </div>
            <p class="footer-description">${AnimeData.footerData.about.description}</p>
        `;
        
        // Add social links
        const socialLinks = Components.createSocialLinks(AnimeData.footerData.social);
        aboutSection.appendChild(socialLinks);
        
        footerContent.appendChild(aboutSection);
        
        // Create other footer sections
        const browseSection = Components.createFooterSection('Browse', AnimeData.footerData.links.browse);
        const genresSection = Components.createFooterSection('Genres', AnimeData.footerData.links.genres);
        const legalSection = Components.createFooterSection('Legal', AnimeData.footerData.links.legal);
        
        footerContent.appendChild(browseSection);
        footerContent.appendChild(genresSection);
        footerContent.appendChild(legalSection);
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        this.domElements.navLinks.classList.toggle('active');
        
        // Update menu button icon
        const icon = this.domElements.mobileMenuBtn.querySelector('i');
        if (this.state.isMobileMenuOpen) {
            icon.className = 'fas fa-times';
            this.domElements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            icon.className = 'fas fa-bars';
            this.domElements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Handle clicks outside the mobile menu
     */
    handleOutsideClick(event) {
        const { mobileMenuBtn, navLinks } = this.domElements;
        
        if (this.state.isMobileMenuOpen && 
            !navLinks.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            this.toggleMobileMenu();
        }
    }

    /**
     * Handle navigation link clicks
     */
    handleNavLinkClick(event) {
        event.preventDefault();
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Close mobile menu if open
        if (this.state.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Scroll to section (in a real app, this would navigate to different pages)
        const targetId = event.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Handle search input
     */
    handleSearchInput(event) {
        this.state.searchQuery = event.target.value.trim();
        
        // Show search suggestions (simplified - in production would make API call)
        if (this.state.searchQuery.length > 2) {
            console.log('Searching for:', this.state.searchQuery);
            // In production: this.showSearchSuggestions();
        }
    }

    /**
     * Perform search
     */
    performSearch() {
        const query = this.state.searchQuery.trim();
        
        if (query) {
            // In production: Redirect to search results page or show modal
            alert(`Searching for: "${query}"`);
            console.log('Performing search for:', query);
            
            // Clear search input
            this.domElements.searchInput.value = '';
            this.state.searchQuery = '';
        }
    }

    /**
     * Handle newsletter form submission
     */
    handleNewsletterSubmit(event) {
        event.preventDefault();
        
        const emailInput = this.domElements.newsletterForm.querySelector('.newsletter-input');
        const email = emailInput.value.trim();
        
        if (this.validateEmail(email)) {
            // In production: Send to backend
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
            emailInput.focus();
        }
    }

    /**
     * Validate email address
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Handle watch now button click
     */
    handleWatchNow() {
        // In production: Redirect to video player
        console.log('Playing featured anime');
        alert('Starting playback...');
    }

    /**
     * Handle add to list button click
     */
    handleAddToList() {
        // In production: Add to user's watchlist
        console.log('Adding to watchlist');
        alert('Added to your watchlist!');
    }

    /**
     * Handle sign in
     */
    handleSignIn() {
        // In production: Show sign in modal
        console.log('Sign in clicked');
        alert('Sign In feature would open here');
    }

    /**
     * Handle sign up
     */
    handleSignUp() {
        // In production: Show sign up modal
        console.log('Sign up clicked');
        alert('Sign Up feature would open here');
    }

    /**
     * Handle anime card clicks (event delegation)
     */
    handleAnimeCardClick(event) {
        // Find the closest anime card
        const card = event.target.closest('.anime-card, .continue-card, .featured-side-card');
        
        if (card) {
            const animeId = card.getAttribute('data-id');
            console.log('Anime card clicked:', animeId);
            
            // In production: Navigate to anime details page
            // For now, show a notification
            const title = card.querySelector('.anime-title')?.textContent || 'Anime';
            alert(`Loading details for: ${title}`);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust auto-scroll speed based on screen size
        if (this.state.continueAutoScroll) {
            this.stopAutoScroll();
            this.startAutoScroll();
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            this.domElements.searchInput.focus();
        }
        
        // Escape to close mobile menu
        if (event.key === 'Escape' && this.state.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Space/Enter on anime cards
        if ((event.key === ' ' || event.key === 'Enter') && 
            event.target.classList.contains('anime-card')) {
            event.preventDefault();
            this.handleAnimeCardClick({ target: event.target });
        }
    }

    /**
     * Start auto-scroll for continue watching section
     */
    startAutoScroll() {
        const slider = this.domElements.continueSlider;
        if (!slider) return;
        
        let scrollDirection = 1;
        let scrollSpeed = window.innerWidth <= 768 ? 1 : 2;
        
        this.state.continueAutoScroll = setInterval(() => {
            if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10) {
                scrollDirection = -1;
            } else if (slider.scrollLeft <= 10) {
                scrollDirection = 1;
            }
            
            slider.scrollLeft += scrollDirection * scrollSpeed;
        }, 50);
        
        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            if (this.state.continueAutoScroll) {
                clearInterval(this.state.continueAutoScroll);
            }
        });
        
        slider.addEventListener('mouseleave', () => {
            this.startAutoScroll();
        });
    }

    /**
     * Stop auto-scroll
     */
    stopAutoScroll() {
        if (this.state.continueAutoScroll) {
            clearInterval(this.state.continueAutoScroll);
            this.state.continueAutoScroll = null;
        }
    }

    /**
     * Update current year in footer
     */
    updateCurrentYear() {
        if (this.domElements.currentYear) {
            this.domElements.currentYear.textContent = new Date().getFullYear();
        }
    }

    /**
     * Clean up resources (for Single Page Applications)
     */
    destroy() {
        this.stopAutoScroll();
        
        // Remove event listeners
        // (In a real SPA, you would properly remove all event listeners)
        
        console.log('AnimeFlix App Cleaned Up');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.animeflixApp = new AnimeFlixApp();
    
    // Make app instance globally available for debugging
    console.log('AnimeFlix App Ready:', window.animeflixApp);
});