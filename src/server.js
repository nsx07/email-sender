import fs from "fs";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes/routes.js";

export const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: "*"
}));
app.use(bodyParser.json());
app.use("/api", router)
app.get("/", (req, res) => {
    res.send(`
        <h1>EMAIL SENDER API</h1>
        <p>API para envio de emails</p>

        <h2>Rotas</h2>
        <ul>
            <li>POST /api/email</li>
            <li>GET /doc</li>
        </ul>

    `);
});
app.get("/doc", (req, res) => {
    
    const filePath = "../README.md";
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading README file");
        } else {
            res.send(data);
        }
    });
});

const env = {
    host: "0.0.0.0",
    port: process.env.PORT ?? "7777"
}

app.listen(env, () => console.log(`Server Running at ${env.host}:${env.port}`))