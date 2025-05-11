// const express = require("express");
// const fetch = require("node-fetch");
// const cors = require("cors");

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());

// app.get("/suggest", async (req, res) => {
//   const query = req.query.q;
//   if (!query) return res.status(400).json({ error: "Query is required" });

//   try {
//     const response = await fetch(
//       `https://clients1.google.com/complete/search?client=youtube&ds=yt&hl=en&gl=IN&q=${encodeURIComponent(query)}`
//     );

//     const text = await response.text();
//     const json = JSON.parse(
//       text.substring(text.indexOf("["), text.lastIndexOf("]") + 1)
//     );

//     const suggestions = json[1].map((item) => item[0]);
//     res.json({ suggestions });
//   } catch (err) {
//     console.error("Error fetching suggestions:", err);
//     res.status(500).json({ error: "Failed to fetch suggestions" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Proper dynamic import for fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('✅ Suggestion backend is running!');
});

app.get('/suggest', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: 'Missing query param `q`' });

  const apiUrl = `https://thingproxy.freeboard.io/fetch/https://clients1.google.com/complete/search?client=youtube&ds=yt&hl=en&gl=IN&q=${encodeURIComponent(q)}`;

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
    res.json({ suggestions });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Fail to fetch suggestions' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
