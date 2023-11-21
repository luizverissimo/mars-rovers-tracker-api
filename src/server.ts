import app from './app';

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('Server started on port 3333');
});
