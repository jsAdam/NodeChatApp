const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

router.post("/", async function(req, res, next){
    try{
        const search = await db.query("SELECT * FROM users WHERE name = $1::text LIMIT 1", [req.body.name]);
        
        if(search.rows.length > 0){
            const hashedWord = await bcrypt.compare(
                req.body.specialWord,
                search.rows[0].special_word
            );
            
            if(hashedWord === false){
                return res.json({ message: "Invalid Password" });
            }
            return res.json({ message: "Logged In!", id: search.rows[0].id, name: search.rows[0].name });
        } else {
            const hashedWord = await bcrypt.hash(req.body.specialWord, 10);
            const results = await db.query(
                "INSERT INTO users (name, special_word) VALUES($1::TEXT, $2::TEXT) RETURNING *",
                [req.body.name, hashedWord]
            );
            return res.json({ message: "User Created", id: results.rows[0].id, name: results.rows[0].user_name });
        }
    } catch(err){
        return next(err);
    }
});

router.get("/chat", async function(req, res, next){
    try{
        const results = await db.query("SELECT * FROM chats");
        return res.json(results.rows);
    } catch(err){
        return next(err);
    }
});

router.post("/chat", async function(req, res, next){
    try{
        const result = await db.query(
            "INSERT INTO chats (user_id, content, user_name) VALUES($1::integer, $2::text, $3::text) RETURNING *",
            [req.body.id, req.body.content, req.body.user_name]
        );
        return res.json({ message: "Chat created", id: result.rows[0].id });
    } catch(err){
        return next(err);
    }
});

module.exports = router;