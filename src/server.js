import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import webpush from "web-push";
import vapidKeys from "../keys.json" assert { type: "json"};
import { MongoService } from "./services/mongo-service.js";

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: "*"
}));

app.route("/subscribe").post(async(req, res) => {
    console.log(req.body);
    const sub = await MongoService.setSubscriber(req.body);
    const response = {};
    
    if (sub) {
        res.status(200);
        response["message"] = "Inscrito com sucesso!"
    } else {
        res.status(500);
        response["message"] = "Erro ao se inscrever!"
    }
    
    res.json(response)
})

app.route("/notify").post(async (req, res) => {
    const allSubscriptions = await MongoService.getSubscribers();

    allSubscriptions && allSubscriptions.length &&
        console.log('Total subscriptions', allSubscriptions.length) || console.log(allSubscriptions);

    const notificationPayload = req.body ?? {
        "notification": {
            "title": "Base test",
            "body": "Testing Push Notifications!",
            "vibrate": [100, 50, 100],
        }
    };

    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then((x) => res.status(200).json({message: 'Notification sent successfully.', record: x}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
})


app.listen({
    host : '0.0.0.0',
    port: process.env.PORT ?? "5454"
}, () => console.log(`Server Running at 0.0.0.0:${process.env.PORT ?? "5454"}`))