import { load } from 'cheerio';

export default function episodesExtract(episodesHtml, aniId) {
    if (!episodesHtml) return [];
    
    const $ = load(episodesHtml);
    const response = [];
    
    // Find all episode list ranges
    $('.eplist .range').each((rangeIndex, rangeElement) => {
        const $range = $(rangeElement);
        const rangeValue = $range.attr('data-range');
        
        // Find all episode links within this range
        $range.find('li a').each((index, element) => {
            const $el = $(element);
            
            // Extract episode number
            const episodeNum = $el.attr('num');
            if (!episodeNum) return;
            
            const episodeNumber = parseInt(episodeNum);
            
            // Extract title
            const $span = $el.find('span');
            let title = null;
            let alternativeTitle = null;
            
            if ($span.length) {
                const jpTitle = $span.attr('data-jp');
                const spanText = $span.text().trim();
                
                // Use Japanese title if available, otherwise use span text
                if (jpTitle && jpTitle !== '') {
                    title = jpTitle;
                    alternativeTitle = spanText || null;
                } else if (spanText && spanText !== '') {
                    title = spanText;
                } else {
                    title = `Episode ${episodeNumber}`;
                }
            } else {
                // If no span, get direct text (excluding the episode number)
                const fullText = $el.text().trim();
                const titleMatch = fullText.replace(episodeNum, '').trim();
                title = titleMatch || `Episode ${episodeNumber}`;
            }
            
            // Extract token, slug, and langs
            const token = $el.attr('token');
            const slug = $el.attr('slug');
            const langs = $el.attr('langs');
            
            // Parse langs to determine available audio/subtitle options
            // 1 = Sub only, 2 = Dub only, 3 = Both Sub & Dub
            let hasSub = false;
            let hasDub = false;
            
            if (langs) {
                const langsNum = parseInt(langs);
                hasSub = langsNum === 1 || langsNum === 3;
                hasDub = langsNum === 2 || langsNum === 3;
            }
            
            // Check if episode is currently selected/active
            const isActive = $el.hasClass('active');
            
            response.push({
                title: title,
                alternativeTitle: alternativeTitle,
                id: `${aniId}-episode-${episodeNumber}`,
                episodeNumber: episodeNumber,
                token: token,
                slug: slug,
                langs: langs ? parseInt(langs) : 1,
                hasSub: hasSub,
                hasDub: hasDub,
                isFiller: false, // No filler indication in this structure
                isActive: isActive,
                url: $el.attr('href') || null,
            });
        });
    });
    
    // If no episodes found with the range structure, try alternative selectors
    if (response.length === 0) {
        // Try general episode list selectors
        const alternativeSelectors = [
            '.ep-list li a',
            '.episode-list li a',
            '.eplist li a',
            'ul.episodes li a'
        ];
        
        for (const selector of alternativeSelectors) {
            $(selector).each((index, element) => {
                const $el = $(element);
                
                // Try to extract episode number from various attributes
                let episodeNum = $el.attr('data-num') || 
                                $el.attr('data-episode') ||
                                $el.attr('episode');
                
                if (!episodeNum) {
                    // Try to extract from text
                    const text = $el.text().trim();
                    const match = text.match(/^(\d+)/);
                    if (match) episodeNum = match[1];
                }
                
                if (episodeNum) {
                    const episodeNumber = parseInt(episodeNum);
                    const token = $el.attr('data-token') || $el.attr('token');
                    const slug = $el.attr('data-slug') || $el.attr('slug');
                    
                    response.push({
                        title: `Episode ${episodeNumber}`,
                        alternativeTitle: null,
                        id: `${aniId}-episode-${episodeNumber}`,
                        episodeNumber: episodeNumber,
                        token: token,
                        slug: slug,
                        langs: 1,
                        hasSub: true,
                        hasDub: false,
                        isFiller: false,
                        isActive: false,
                        url: $el.attr('href') || null,
                    });
                }
            });
            
            if (response.length > 0) break;
        }
    }
    
    // Remove duplicates (in case of multiple server listings)
    const uniqueEpisodes = response.reduce((acc, current) => {
        const exists = acc.find(item => item.episodeNumber === current.episodeNumber);
        if (!exists) {
            acc.push(current);
        }
        return acc;
    }, []);
    
    // Sort by episode number
    return uniqueEpisodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
}