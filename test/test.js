const express = require('express');
const app = express();

// 1Anime specific domains
const targetDomains = [
    '1anime.site',
    'media.1anime.site',
    'cdn-eu.1ani.me',
    'megacloud.to',
    'fetch1.zencloudz.cc'
];

// Helper function to determine if content is text-based
function isTextContent(contentType) {
    if (!contentType) return false;
    const textTypes = [
        'text/html',
        'text/css',
        'application/javascript',
        'application/json',
        'application/x-javascript',
        'text/javascript'
    ];
    return textTypes.some(type => contentType.includes(type));
}

// Helper function to rewrite URLs
function rewriteUrls(content, baseUrl) {
    let rewritten = content;
    
    // Rewrite absolute URLs to go through proxy
    const urlRegex = /(https?:\/\/[^\s"'\()<>\[\]{}|\\^`]+)/g;
    rewritten = rewritten.replace(urlRegex, (url) => {
        if (url.includes('/proxy?url=')) return url;
        if (url.startsWith('data:')) return url;
        if (url.startsWith('blob:')) return url;
        
        const shouldProxy = targetDomains.some(domain => url.includes(domain));
        if (shouldProxy) {
            return `/proxy?url=${encodeURIComponent(url)}`;
        }
        return url;
    });
    
    // Rewrite relative paths
    rewritten = rewritten.replace(/(src|href)=["'](?!https?:\/\/|\/\/|data:|blob:|#)([^"']+)["']/gi, (match, attr, path) => {
        let fullUrl;
        if (path.startsWith('/')) {
            fullUrl = `https://1anime.site${path}`;
        } else {
            fullUrl = `https://1anime.site/${path}`;
        }
        return `${attr}="/proxy?url=${encodeURIComponent(fullUrl)}"`;
    });
    
    return rewritten;
}

// Main proxy endpoint
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }
    
    console.log(`[PROXY] ${targetUrl.substring(0, 80)}...`);
    
    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Referer': 'https://1anime.site/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Origin': 'https://1anime.site',
            }
        });
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        // Forward status and content type
        res.status(response.status);
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        
        // Get response body
        const buffer = await response.arrayBuffer();
        let body = Buffer.from(buffer);
        
        // For text content, rewrite URLs
        if (isTextContent(contentType)) {
            let textBody = body.toString('utf-8');
            textBody = rewriteUrls(textBody, targetUrl);
            body = Buffer.from(textBody, 'utf-8');
        }
        
        res.send(body);
        
    } catch (error) {
        console.error(`[ERROR] ${error.message}`);
        res.status(500).send(`Proxy error: ${error.message}`);
    }
});

app.options('/proxy', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(204).send();
});

// Main player page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>1Anime Video Player</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    background: #0a0a0a;
                    padding: 20px;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .container { max-width: 1000px; margin: 0 auto; }
                .player-wrapper {
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                    aspect-ratio: 16 / 9;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .controls {
                    margin-top: 20px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                input, button {
                    padding: 12px 18px;
                    border-radius: 8px;
                    border: none;
                    font-size: 14px;
                }
                input {
                    background: #1a1a1a;
                    color: #fff;
                    flex: 1;
                    min-width: 250px;
                    border: 1px solid #333;
                }
                button {
                    background: #ffdd95;
                    color: #000;
                    cursor: pointer;
                    font-weight: bold;
                }
                .episode-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                    gap: 8px;
                    margin-top: 20px;
                    max-height: 300px;
                    overflow-y: auto;
                    padding: 10px;
                    background: #111;
                    border-radius: 8px;
                }
                .ep-btn {
                    background: #2a2a2a;
                    color: #fff;
                    padding: 8px;
                    font-size: 12px;
                    text-align: center;
                    cursor: pointer;
                    border-radius: 6px;
                }
                .ep-btn.active {
                    background: #ffdd95;
                    color: #000;
                }
                .ep-btn:hover {
                    background: #3a3a3a;
                }
                .info {
                    margin-top: 15px;
                    padding: 12px;
                    background: #1a1a1a;
                    border-radius: 8px;
                    color: #888;
                    text-align: center;
                    font-size: 13px;
                }
                h1 { color: #fff; text-align: center; margin-bottom: 20px; }
                .status { color: #ffdd95; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎬 1Anime Video Player</h1>
                
                <div class="player-wrapper">
                    <iframe id="videoFrame" src="about:blank"></iframe>
                </div>
                
                <div class="controls">
                    <input type="text" id="episodeId" placeholder="Episode ID (e.g., 874)" value="874">
                    <button id="loadBtn">▶ Load Episode</button>
                    <button id="reloadBtn">⟳ Reload</button>
                </div>
                
                <div class="episode-grid" id="episodeGrid"></div>
                
                <div class="info" id="info">
                    💡 Enter a 1Anime episode ID (like 874) to play<br>
                    🔧 Proxy server is running
                </div>
            </div>
            
            <script>
                const videoFrame = document.getElementById('videoFrame');
                const episodeId = document.getElementById('episodeId');
                const loadBtn = document.getElementById('loadBtn');
                const reloadBtn = document.getElementById('reloadBtn');
                const episodeGrid = document.getElementById('episodeGrid');
                const infoDiv = document.getElementById('info');
                
                const PROXY_BASE = '/proxy?url=';
                
                // Common episode IDs (Fire Force Season 3 Part 2)
                const episodes = [
                    { id: 874, num: 1 },
                    { id: 876, num: 2 },
                    { id: 1087, num: 3 },
                    { id: 1221, num: 4 },
                    { id: 1345, num: 5 },
                    { id: 1480, num: 6 },
                    { id: 1606, num: 7 },
                    { id: 1718, num: 8 },
                    { id: 1830, num: 9 },
                    { id: 1938, num: 10 },
                    { id: 2086, num: 11 },
                    { id: 18854, num: 12 },
                    { id: 19024, num: 13 }
                ];
                
                function buildEpisodeUrl(episodeIdNum) {
                    return \`https://1anime.site/megaplay/stream/s-2/\${episodeIdNum}/sub\`;
                }
                
                function loadVideo() {
                    let input = episodeId.value.trim();
                    
                    // If input is numeric, treat as episode ID
                    if (/^\\d+$/.test(input)) {
                        targetUrl = buildEpisodeUrl(input);
                    } else {
                        targetUrl = input;
                    }
                    
                    const proxyUrl = PROXY_BASE + encodeURIComponent(targetUrl);
                    infoDiv.innerHTML = \`🔄 Loading episode ID: \${input}<br>📡 \${targetUrl}\`;
                    videoFrame.src = proxyUrl;
                    
                    // Highlight active episode
                    document.querySelectorAll('.ep-btn').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.dataset.id === input) {
                            btn.classList.add('active');
                        }
                    });
                }
                
                function reloadVideo() {
                    if (videoFrame.src && videoFrame.src !== 'about:blank') {
                        videoFrame.src = videoFrame.src;
                        infoDiv.innerHTML = \`🔄 Reloading...\`;
                    } else {
                        loadVideo();
                    }
                }
                
                function buildEpisodeGrid() {
                    episodeGrid.innerHTML = '';
                    episodes.forEach(ep => {
                        const btn = document.createElement('div');
                        btn.className = 'ep-btn';
                        btn.textContent = \`Ep \${ep.num}\`;
                        btn.dataset.id = ep.id;
                        btn.onclick = () => {
                            episodeId.value = ep.id;
                            loadVideo();
                        };
                        episodeGrid.appendChild(btn);
                    });
                }
                
                loadBtn.addEventListener('click', loadVideo);
                reloadBtn.addEventListener('click', reloadVideo);
                
                episodeId.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') loadVideo();
                });
                
                buildEpisodeGrid();
                
                // Load default episode
                setTimeout(() => loadVideo(), 500);
            </script>
        </body>
        </html>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ═══════════════════════════════════════════
    🎬 1Anime Proxy Server Running!
    ═══════════════════════════════════════════
    
    📡 URL: http://localhost:${PORT}
    
    🎮 Controls:
       - Enter episode ID (e.g., 874)
       - Or click episode buttons
       - Video plays automatically
    
    📺 Working episodes: 1-13 (Fire Force)
    ═══════════════════════════════════════════
    `);
});