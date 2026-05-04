import { load } from 'cheerio';

const normalizeGroupKey = (value = '') => {
  const key = String(value).toLowerCase().trim();

  if (['subbed', 'sub', 'subtitle', 'subtitles', 'soft-sub', 'soft sub'].includes(key)) {
    return 'sub';
  }

  if (['softsub', 'soft-subbed', 'soft'].includes(key)) {
    return 'softsub';
  }

  if (['dubbed', 'dub', 'audio'].includes(key)) {
    return 'dub';
  }

  return key || 'unknown';
};

const dedupeByLinkId = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.link_id || `${item.server_id}:${item.episode_id}:${item.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function serversExtract(html) {
  
  if (!html || html.trim() === '') {
    return {
      watching: '',
      servers: {}
    };
  }
  
  const $ = load(html);
  const servers = {};
  
  // Try multiple selectors to find server groups
  let serverGroups = $('.server-items');
  
  if (serverGroups.length === 0) {
    // Try alternative selectors
    serverGroups = $('[class*="server"]');
  }
  
  // Find all server groups
  serverGroups.each((index, element) => {
    const $group = $(element);
    const lang = normalizeGroupKey($group.attr('data-id') || $group.attr('data-type') || 'unknown');
    
    
    servers[lang] = servers[lang] || [];
    
    // Find servers within this group - try multiple selectors
    let serversList = $group.find('.server');
    if (serversList.length === 0) {
      serversList = $group.find('.server-item');
    }
    if (serversList.length === 0) {
      serversList = $group.find('[data-sid]');
    }
    if (serversList.length === 0) {
      serversList = $group.find('a');
    }
        
    serversList.each((idx, serverEl) => {
      const $server = $(serverEl);
      
      const serverData = {
        name: $server.text().trim() || $server.attr('data-name') || `Server ${idx + 1}`,
        server_id: $server.attr('data-sid') || $server.attr('data-server-id') || '',
        episode_id: $server.attr('data-eid') || $server.attr('data-episode-id') || '',
        link_id: $server.attr('data-lid') || $server.attr('data-link-id') || '',
      };
      
      
      // Only add if we have at least episode_id or link_id
      if (serverData.episode_id || serverData.link_id) {
        servers[lang].push(serverData);
      }
    });
    
    servers[lang] = dedupeByLinkId(servers[lang]);

    // Remove empty arrays
    if (servers[lang].length === 0) {
      delete servers[lang];
    }
  });
  
  // Get watching text - try multiple selectors
  let watching = '';
  const watchingSelectors = [
    '.server-note p',
    '.server-notice',
    '.watching-info',
    '.episode-info'
  ];
  
  for (const selector of watchingSelectors) {
    const element = $(selector);
    if (element.length) {
      watching = element.text().trim();
      if (watching) break;
    }
  }
  
  return {
    watching,
    servers,
  };
}