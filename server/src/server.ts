import 'dotenv/config';
import { createApp } from './app.js';

const PORT = process.env.PORT !== undefined ? parseInt(process.env.PORT, 10) : 4000;

const app = createApp();

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`,
  );
});
