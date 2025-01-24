// Import express
import express from "express";
// Create a server instance
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// Other imports
import errorHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";
import moviesRouter from "./routers/moviesRouter.js";
import cors from 'cors';

// Consenti richieste da 'http://localhost:5173'
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Define static assets path
// Create public directory inside the root directory (mkdir public)
app.use('/images', express.static("public/images")); // Middleware to define the public folder for static files, must be set before routes

// Add root route
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Other routes
app.use("/movies", moviesRouter);

// Middleware for general server errors
app.use(errorHandler);

// Middleware for resource not found
app.use(notFound);

// Server must listen on the specified host and port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
