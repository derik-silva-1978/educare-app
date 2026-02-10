const https = require('https');
const http = require('http');

async function shortenUrl(longUrl) {
  try {
    const shortened = await shortenWithIsGd(longUrl);
    if (shortened) return shortened;
  } catch (err) {
    console.warn(`[URL Shortener] is.gd failed: ${err.message}`);
  }

  return longUrl;
}

function shortenWithIsGd(longUrl) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;
    const timeout = 5000;

    const req = https.get(apiUrl, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.shorturl) {
            resolve(parsed.shorturl);
          } else if (parsed.errorcode) {
            reject(new Error(`is.gd error ${parsed.errorcode}: ${parsed.errormessage || 'Unknown'}`));
          } else {
            reject(new Error('is.gd returned unexpected response'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse is.gd response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('is.gd request timed out'));
    });
  });
}

async function shortenMultiple(urls) {
  const results = await Promise.allSettled(
    urls.map(url => shortenUrl(url))
  );
  return results.map((result, i) => 
    result.status === 'fulfilled' ? result.value : urls[i]
  );
}

module.exports = { shortenUrl, shortenMultiple };
