// utils/mediaDecryptor.js
export async function decryptMedia(mediaUrl, userAgent) {
  const DEC_MEGA_URL = 'https://enc-dec.app/api/dec-mega';
  
  try {
    // First fetch the encrypted media data from the media URL (now from browser)
    const mediaResponse = await fetch(mediaUrl, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent || navigator.userAgent,
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies if needed
    });
    
    if (!mediaResponse.ok) {
      throw new Error(`Failed to fetch media: ${mediaResponse.status}`);
    }
    
    const mediaData = await mediaResponse.json();
    const encryptedMedia = mediaData.result || '';
    
    if (!encryptedMedia) {
      throw new Error('No encrypted media found');
    }
    
    // Decrypt using the API
    const decryptResponse = await fetch(DEC_MEGA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent || navigator.userAgent,
      },
      body: JSON.stringify({ 
        text: encryptedMedia, 
        agent: userAgent || navigator.userAgent 
      }),
    });
    
    const decryptData = await decryptResponse.json();
    
    if (decryptData.status === 200 && decryptData.result) {
      return decryptData.result;
    } else {
      throw new Error('Media decryption failed');
    }
  } catch (error) {
    console.error('Media decryption error:', error);
    throw error;
  }
}