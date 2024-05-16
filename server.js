const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('cars.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY, brand TEXT NOT NULL, model TEXT NOT NULL, year INTEGER NOT NULL, details TEXT NOT NULL)");
});

app.get('/cars', (req, res) => {
    const { year } = req.query;
    let sql = "SELECT * FROM cars";
    const params = [];
    if (year) {
        sql += " WHERE year = ?";
        params.push(year);
    }
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/addCar', (req, res) => {
    const { brand, model, year, details } = req.body;
    const sql = "INSERT INTO cars (brand, model, year, details) VALUES (?, ?, ?, ?)";
    const params = [brand, model, year];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            brand: brand,
            model: model,
            year: year,
	    details: details
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});