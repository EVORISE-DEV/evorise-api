import app from './app';

const PORT = parseInt(process.env.API_PORT, 10) || 3333;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API ouvindo em http://0.0.0.0:${PORT}`);
});

