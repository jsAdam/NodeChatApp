const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "chat-db",
    password: "santamuffin12",
    port: 5432
});

client.connect();

module.exports = client;