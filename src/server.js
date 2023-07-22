import express from "express";
import webpush from "web-push";
import vapidKeys from "../keys.json" assert { type: "json"};
import { MongoService } from "./services/mongo-service.js";

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app = express();

app.route("/subscribe").post(async(req, res) => {
    const sub = await MongoService.setSubscriber(req.body);
    res.status(200);
    // .json({message: sub ?'Subscriver sent successfully.' : "Subscriber error"})
})

app.route("/notify").get(async (req, res) => {
    const allSubscriptions = await MongoService.getSubscribers();

    console.log('Total subscriptions', allSubscriptions.length);
    allSubscriptions && allSubscriptions.length && console.log(allSubscriptions);

    const notificationPayload = {
        "notification": {
            "title": "Test Push",
            "body": "Testing Push Notifications!",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
            }
        }
    };


    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then((x) => res.status(200).json({message: 'Newsletter sent successfully.', record: x}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
})


app.listen({
    host : '0.0.0.0',
    port: process.env.PORT ?? "5454"
}, () => console.log(`Server Running at 0.0.0.0:${process.env.PORT ?? "5454"}`))