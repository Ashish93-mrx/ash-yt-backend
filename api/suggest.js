// api/suggest.js

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query param `q`' });
  }

  const apiUrl = `https://clients1.google.com/complete/search?client=youtube&ds=yt&hl=en&gl=IN&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const text = await response.text();
      console.error('Upstream API error:', response.status, text);
      return res.status(response.status).json({ error: 'Upstream API error' });
    }

    const text = await response.text();
    const json = JSON.parse(
      text.substring(text.indexOf('['), text.lastIndexOf(']') + 1)
    );

    const suggestions = json[1].map((item) => item[0]);
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Fail to fetch suggestions' });
  }
}
