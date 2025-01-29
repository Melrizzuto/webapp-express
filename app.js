import express from "express";
import cors from 'cors';
import { json } from "express";
import moviesRouter from "./routers/moviesRouter.js";
import errorHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware per il parsing del corpo delle richieste JSON
app.use(json()); // Aggiungi questo middleware per gestire i dati in formato JSON

// Consenti richieste da 'http://localhost:5173'
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Altri middleware
app.use(express.static("public")); // Middleware per definire la cartella pubblica per i file statici

// Rotte
app.use("/movies", moviesRouter);

// Middleware per gli errori generali
app.use(errorHandler);

// Middleware per le risorse non trovate
app.use(notFound);

// Avvio del server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});