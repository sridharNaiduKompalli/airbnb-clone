import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Airbnb Clone Backend API running         `);
  console.log(` Port:    ${PORT}                        `);
  console.log(` URL:     http://localhost:${PORT}      `);
  console.log(` Health:  http://localhost:${PORT}/health `);
  console.log(`=========================================`);
});
