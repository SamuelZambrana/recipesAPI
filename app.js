const express = require('express');

// Configuración del puerto
const PORT = 3000;
const recipesRouter = require('./routers/recipesRouter');
const userRouter = require('./routers/userRouter');
const loginRouter = require('./routers/loginRouter');

require("dotenv").config();

const connectToDatabase = require('./db/connectDb');

// Crear una aplicación de Express
const app = express();
// Middleware básico para analizar JSON en las solicitudes
app.use(express.json());

connectToDatabase();
app.use('/api/recipe', recipesRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', loginRouter);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
