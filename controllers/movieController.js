import connection from "../connection.js";

// Index - Leggi tutti i movies
function index(req, res) {
    const sql = "SELECT * FROM movies";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }

        const response = {
            info: {
                totalCount: results.length,
            },
            results: results,
        };

        res.json(response);
    });
}

// Show - Leggi un singolo movie
function show(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const sql = `
        SELECT movies.*, AVG(reviews.vote) AS vote_average
        FROM movies
        LEFT JOIN reviews ON reviews.movie_id = movies.id
        WHERE movies.id = ?
        GROUP BY reviews.movie_id
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore nella query del database" });
        }

        const item = results[0];
        if (!item) {
            return res.status(404).json({ error: "Movie non trovato" });
        }

        const sqlReviews = "SELECT * FROM reviews WHERE movie_id = ?";
        connection.query(sqlReviews, [id], (error, reviews) => {
            if (error) {
                return res.status(500).json({ error: "Errore nel recupero delle recensioni" });
            }

            item.reviews = reviews; // Aggiunta delle recensioni al film
            res.json({ success: true, item });
        });
    });
}

// Store - Crea un nuovo movie
function store(req, res) {
    let newId = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].id > newId) {
            newId = items[i].id;
        }
    }
    newId += 1;
    const newItem = { id: newId, ...req.body };
    items.push(newItem);
    res.json({ success: true, item: newItem });
}

function storeReview(req, res) {
    // recuperiamo i parametri dalla richiesta
    const { id } = req.params;

    // verifica che l'ID sia valido
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid movie ID" });
    }

    // Recuperiamo il body
    const { text, name, vote } = req.body;

    // Validazione del body
    if (!text || !name || vote === undefined || isNaN(parseFloat(vote))) {
        return res.status(400).json({
            error: "Invalid input.",
        });
    }

    // Prepariamo la query
    const sql = "INSERT INTO reviews (text, name, vote, book_id) VALUES (?, ?, ?, ?)";

    // Eseguiamo la query
    connection.query(sql, [text, name, vote, id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        res.status(201).json({
            message: "Review added",
            id: results.insertId,
        });
    });
}

// Update - Modifica un movie esistente
function update(req, res) {
    const id = parseInt(req.params.id);
    const item = items.find((item) => item.id === id);
    if (!item) {
        throw new CustomError("L'elemento non esiste", 404);
    }

    for (const key in item) {
        if (key !== "id") {
            item[key] = req.body[key];
        }
    }

    res.json(item);
}

// Destroy - Elimina un movie
function destroy(req, res) {
    const id = parseInt(req.params.id);
    const sql = "DELETE FROM movies WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Errore nella query di eliminazione" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Movie non trovato" });
        }

        res.sendStatus(204);
    });
}

export { index, show, store, storeReview, update, destroy };

