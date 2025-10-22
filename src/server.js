import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // importante no Docker!

app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});
