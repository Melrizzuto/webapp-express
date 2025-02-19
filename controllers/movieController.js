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
    // Controlla se req.body esiste e contiene i dati necessari
    if (!req.body || !req.body.text || !req.body.name || !req.body.vote) {
        return res.status(400).json({ error: "Dati mancanti. Assicurati di inviare 'text', 'name' e 'vote'." });
    }

    const { text, name, vote, } = req.body;

    // Recuperiamo l'id
    const { id } = req.params;

    // Prepariamo la query con i campi da popolare
    const sql = "INSERT INTO reviews (text, name, vote, movie_id) VALUES (?, ?, ?, ?)";

    // Eseguiamo la query
    connection.query(sql, [text, name, vote, id], (err, results) => {
        if (err) {
            console.error("Errore nella query:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        console.log(results); // Log dei risultati per debug
        res.status(201).json({ message: "Review added", id: results.insertId });
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

