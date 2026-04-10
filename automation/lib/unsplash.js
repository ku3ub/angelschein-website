'use strict';

/**
 * Fetches a random landscape image URL from Unsplash matching the query.
 * @param {string} query - e.g. "fishing germany lake"
 * @param {string} accessKey - Unsplash API access key
 * @returns {Promise<string>} - Regular-size image URL
 */
async function fetchImage(query, accessKey) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });
  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!data?.urls?.regular) {
    throw new Error('Unsplash response missing urls.regular');
  }
  return data.urls.regular;
}

module.exports = { fetchImage };
