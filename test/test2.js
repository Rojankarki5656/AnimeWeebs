import fetch from 'node-fetch';

const ENCDEC_URL = 'https://enc-dec.app/api/enc-kai'; // Replace with the actual URL

async function encodeToken(text) {
    try {
        const response = await fetch(`${ENCDEC_URL}?text=${encodeURIComponent(text)}`, {
            method: 'GET',
            timeout: 15000, // 15 seconds timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 200 && data.result) {
            return data.result;
        }
        
        return null;
    } catch (error) {
        console.error('Encode token error:', error.message);
        return null;
    }
}

// Usage
async function getEncodedAnimeId(aniId) {
    const encoded = await encodeToken(aniId);
    if (encoded) {
        console.log(`Encoded ${aniId} -> ${encoded}`);
        return encoded;
    }
    return null;
}

// Test with your ani_ids
async function test() {
    const aniIds = ['dYe69Q', 'c4e78qU', 'c4C5-KM', 'dIGz9Q', 'cIu_9A'];
    
    for (const id of aniIds) {
        const encoded = await encodeToken(id);
        console.log(`${id} -> ${encoded}`);
    }
}

getEncodedAnimeId("c4e78qU");