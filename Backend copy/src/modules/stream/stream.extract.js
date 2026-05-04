// This file is optional since we're doing all processing in the handler
// But kept for consistency with your pattern

export default function streamExtract(data) {
  return {
    embed_url: data.embed_url,
    skip: data.skip,
    sources: data.sources,
    tracks: data.tracks,
    download: data.download,
  };
}