const app = require('./src/app');

const PUERTO = process.env.PUERTO || 3333;

app.listen(PUERTO, () => {
    console.log(`SERVER http://localhost:${PUERTO}`);
});
