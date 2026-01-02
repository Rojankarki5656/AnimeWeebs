/**
 * AnimeFlix - Components Module
 * This file contains reusable UI components
 */

const Components = {
    /**
     * Create a continue watching card
     * @param {Object} anime - Anime data object
     * @returns {HTMLElement} Continue watching card element
     */
    createContinueCard(anime) {
        const card = document.createElement('div');
        card.className = 'continue-card';
        card.setAttribute('data-id', anime.id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Continue watching ${anime.title}, ${anime.progress}% complete`);
        
        card.innerHTML = `
            <div class="continue-poster">
                <img src="${anime.image}" alt="${anime.title}" loading="lazy">
            </div>
            <div class="continue-info">
                <div>
                    <h3 class="anime-title">${anime.title}</h3>
                    <div class="anime-meta">
                        <span>${anime.type}</span>
                        <span class="anime-episodes">
                            <i class="fas fa-film" aria-hidden="true"></i> ${anime.episode}
                        </span>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-text">
                        <span>Continue Watching</span>
                        <span>${anime.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${anime.progress}%"></div>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    },

    /**
     * Create a featured side card
     * @param {Object} anime - Anime data object
     * @returns {HTMLElement} Featured side card element
     */
    createFeaturedSideCard(anime) {
        const card = document.createElement('div');
        card.className = 'featured-side-card';
        card.setAttribute('data-id', anime.id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Featured anime: ${anime.title}`);
        
        card.innerHTML = `
            <div class="featured-side-poster">
                <img src="${anime.image}" alt="${anime.title}" loading="lazy">
            </div>
            <div class="featured-side-info">
                <h4>${anime.title}</h4>
                <p>${anime.description}</p>
                <div class="anime-meta" style="margin-top: 10px;">
                    <span>${anime.type}</span>
                    <span><i class="fas fa-star" aria-hidden="true"></i> ${anime.rating}</span>
                </div>
            </div>
        `;
        
        return card;
    },

    /**
     * Create an anime card for grid display
     * @param {Object} anime - Anime data object
     * @returns {HTMLElement} Anime card element
     */
    createAnimeCard(anime) {
        const card = document.createElement('article');
        card.className = 'anime-card';
        card.setAttribute('data-id', anime.id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${anime.title}, ${anime.rating} rating`);
        
        card.innerHTML = `
            <div class="anime-poster">
                <img src="${anime.image}" alt="${anime.title}" loading="lazy">
                <div class="anime-rating">
                    <i class="fas fa-star" aria-hidden="true"></i> ${anime.rating}
                </div>
            </div>
            <div class="anime-info">
                <h3 class="anime-title">${anime.title}</h3>
                <div class="anime-meta">
                    <span>${anime.type}</span>
                    <span class="anime-episodes">
                        <i class="fas fa-film" aria-hidden="true"></i> ${anime.episodes}
                    </span>
                </div>
                <div class="anime-tags">
                    ${anime.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        return card;
    },

    /**
     * Create footer section
     * @param {string} title - Section title
     * @param {Array} links - Array of link objects
     * @returns {HTMLElement} Footer section element
     */
    createFooterSection(title, links) {
        const section = document.createElement('div');
        section.className = 'footer-section';
        
        const heading = document.createElement('h3');
        heading.className = 'footer-heading';
        heading.textContent = title;
        
        const list = document.createElement('ul');
        list.className = 'footer-links';
        
        links.forEach(link => {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = '#';
            anchor.textContent = link;
            listItem.appendChild(anchor);
            list.appendChild(listItem);
        });
        
        section.appendChild(heading);
        section.appendChild(list);
        
        return section;
    },

    /**
     * Create social links
     * @param {Array} platforms - Array of social media platforms
     * @returns {HTMLElement} Social links container
     */
    createSocialLinks(platforms) {
        const container = document.createElement('div');
        container.className = 'social-links';
        
        platforms.forEach(platform => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'social-link';
            link.setAttribute('aria-label', `Follow us on ${platform}`);
            
            const icon = document.createElement('i');
            icon.className = `fab fa-${platform}`;
            
            link.appendChild(icon);
            container.appendChild(link);
        });
        
        return container;
    },

    /**
     * Create loading skeleton for anime cards
     * @param {number} count - Number of skeleton cards to create
     * @returns {Array} Array of skeleton card elements
     */
    createSkeletonCards(count) {
        const skeletons = [];
        
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'anime-card loading';
            skeleton.innerHTML = `
                <div class="anime-poster loading"></div>
                <div class="anime-info">
                    <div class="anime-title loading" style="height: 20px; margin-bottom: 10px;"></div>
                    <div class="anime-meta loading" style="height: 15px; margin-bottom: 10px;"></div>
                    <div class="anime-tags">
                        <span class="tag loading" style="width: 60px;"></span>
                        <span class="tag loading" style="width: 70px;"></span>
                    </div>
                </div>
            `;
            skeletons.push(skeleton);
        }
        
        return skeletons;
    },

    /**
     * Create error message component
     * @param {string} message - Error message to display
     * @returns {HTMLElement} Error message element
     */
    createErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button class="btn btn-secondary retry-btn">Retry</button>
        `;
        
        return errorDiv;
    },

    /**
     * Create empty state component
     * @param {string} message - Message to display
     * @param {string} icon - Font Awesome icon class
     * @returns {HTMLElement} Empty state element
     */
    createEmptyState(message, icon = 'fa-film') {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        
        emptyDiv.innerHTML = `
            <i class="fas ${icon}"></i>
            <h3>${message}</h3>
            <p>Try searching for something else or check back later.</p>
        `;
        
        return emptyDiv;
    }
};

// Export components for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}