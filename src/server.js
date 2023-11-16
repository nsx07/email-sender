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

const env = {
    host: "0.0.0.0",
    port: process.env.PORT ?? "7777"
}

app.listen(env, () => console.log(`Server Running at ${env.host}:${env.port}`))