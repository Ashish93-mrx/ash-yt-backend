// api/suggest.js

export default async function handler(req, res) {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: 'Missing query param `q`' });
  }

  const apiUrl = `https://clients1.google.com/complete/search?client=youtube&ds=yt&hl=en&gl=IN&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from upstream:', response.status, text);
      return res.status(response.status).json({ error: 'Upstream API error' });
    }

    const text = await response.text();
    const json = JSON.parse(
      text.substring(text.indexOf("["), text.lastIndexOf("]") + 1)
    );

    const suggestions = json[1].map((item) => item[0]);

    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS fix
    res.status(200).json({ suggestions });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Fail to fetch suggestions' });
  }
}
