const app = require('./app');

const PUERTO = process.env.PUERTO || 3333;

app.listen(PUERTO, () => {
    console.log(`SERVER http://localhost:${PUERTO}`);
});
