/**
 * AnimeFlix - Data Management Module
 * This file contains all the data used in the application
 * Separated from logic for easy maintenance and updates
 */

// Main data structure for the application
const AnimeData = {
    // Continue watching anime data
    continueWatching: [
        {
            id: 1,
            title: "Jujutsu Kaisen",
            episode: "Episode 12",
            progress: 65,
            image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            rating: 8.6,
            color: "#FF6B6B"
        },
        {
            id: 2,
            title: "My Hero Academia",
            episode: "Episode 24",
            progress: 80,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            rating: 8.4,
            color: "#4ECDC4"
        },
        {
            id: 3,
            title: "One Piece",
            episode: "Episode 1052",
            progress: 45,
            image: "https://images.unsplash.com/photo-1541562232579-512a21360020?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            rating: 8.7,
            color: "#45B7D1"
        },
        {
            id: 4,
            title: "Spy x Family",
            episode: "Episode 8",
            progress: 30,
            image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            rating: 8.9,
            color: "#96CEB4"
        },
        {
            id: 5,
            title: "Chainsaw Man",
            episode: "Episode 5",
            progress: 55,
            image: "https://images.unsplash.com/photo-1639322537502-9e1f6bf0c5e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            rating: 8.8,
            color: "#FFEAA7"
        }
    ],

    // Featured side anime data
    featuredSide: [
        {
            id: 6,
            title: "Blue Lock",
            description: "After a disastrous defeat at the World Cup, Japan's football association hires a mysterious coach to find the best striker.",
            image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80",
            type: "TV Series",
            rating: 8.3
        },
        {
            id: 7,
            title: "Cyberpunk: Edgerunners",
            description: "A street kid trying to survive in Night City, a technology and body modification-obsessed city of the future.",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            rating: 8.5
        },
        {
            id: 8,
            title: "Bocchi the Rock!",
            description: "Hitori Gotoh, a lonely high school girl, dreams of being in a band despite her crushing social anxiety.",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            rating: 8.7
        }
    ],

    // Popular anime data
    popularAnime: [
        {
            id: 9,
            title: "Naruto: Shippuden",
            image: "https://images.unsplash.com/photo-1541562232579-512a21360020?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "500 Episodes",
            rating: 8.3,
            tags: ["Action", "Adventure", "Fantasy"]
        },
        {
            id: 10,
            title: "Death Note",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "37 Episodes",
            rating: 8.6,
            tags: ["Mystery", "Psychological", "Thriller"]
        },
        {
            id: 11,
            title: "Your Name",
            image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80",
            type: "Movie",
            episodes: "1 Episode",
            rating: 8.9,
            tags: ["Romance", "Drama", "Fantasy"]
        },
        {
            id: 12,
            title: "Hunter x Hunter",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "148 Episodes",
            rating: 8.9,
            tags: ["Action", "Adventure", "Fantasy"]
        },
        {
            id: 13,
            title: "One Punch Man",
            image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            episodes: "24 Episodes",
            rating: 8.7,
            tags: ["Action", "Comedy", "Superhero"]
        },
        {
            id: 14,
            title: "Fullmetal Alchemist",
            image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            episodes: "64 Episodes",
            rating: 9.0,
            tags: ["Action", "Adventure", "Drama"]
        }
    ],

    // Recently updated anime data
    recentAnime: [
        {
            id: 15,
            title: "Vinland Saga Season 2",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "Episode 12",
            rating: 8.8,
            tags: ["Action", "Adventure", "Historical"]
        },
        {
            id: 16,
            title: "Bleach: Thousand-Year Blood War",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "Episode 7",
            rating: 9.1,
            tags: ["Action", "Adventure", "Supernatural"]
        },
        {
            id: 17,
            title: "The Eminence in Shadow",
            image: "https://images.unsplash.com/photo-1639322537502-9e1f6bf0c5e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            episodes: "Episode 15",
            rating: 8.2,
            tags: ["Action", "Comedy", "Fantasy"]
        },
        {
            id: 18,
            title: "Mob Psycho 100 III",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "Episode 10",
            rating: 8.9,
            tags: ["Action", "Comedy", "Supernatural"]
        },
        {
            id: 19,
            title: "Bocchi the Rock!",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
            type: "TV Series",
            episodes: "Episode 9",
            rating: 8.7,
            tags: ["Comedy", "Music", "Slice of Life"]
        },
        {
            id: 20,
            title: "Spy x Family Part 2",
            image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80",
            type: "TV Series",
            episodes: "Episode 5",
            rating: 8.9,
            tags: ["Action", "Comedy", "Slice of Life"]
        }
    ],

    // Footer data
    footerData: {
        about: {
            description: "Watch the latest anime series and movies in high quality. Join our community of anime lovers and never miss an episode."
        },
        links: {
            browse: ["Home", "Popular", "Movies", "TV Series", "New Releases"],
            genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance"],
            legal: ["Terms of Service", "Privacy Policy", "Cookie Policy", "DMCA", "Contact"]
        },
        social: ["facebook", "twitter", "instagram", "discord"]
    },

    // Hero data
    heroData: {
        title: "Demon Slayer: Kimetsu no Yaiba",
        description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
        meta: {
            type: "TV Series",
            rating: "8.7/10",
            year: "2019",
            language: "Sub | Dub"
        }
    }
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimeData;
}