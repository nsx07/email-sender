import {vapidKeysObject} from "../environment/environment.js"
import { Router } from "express";
import webpush from "web-push";

webpush.setVapidDetails(
    vapidKeysObject.subject,
    vapidKeysObject.publicKey,
    vapidKeysObject.privateKey
);

export const router = Router();

router.post("/notify", async (req, res) => {
    const allSubscriptions = req.body.subscriptions;

    allSubscriptions && allSubscriptions.length &&
        console.log('Total subscriptions', allSubscriptions.length) || console.log(allSubscriptions);

    const notificationPayload = req.body.payload ?? {
        "notification": {
            "title": "Base test",
            "body": "Testing Push Notifications!",
            "vibrate": [100, 50, 100],
        }
    };

    if (!allSubscriptions) {
        res.status(404)
        res.send({message: "No subscriber found."})
        req.next();
        return undefined;
    } else if (allSubscriptions.length < 1) {
        res.status(404)
        res.send({message: "No subscriber found."})
        req.next();
        return undefined;
    }

    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then((x) => res.status(200).json({message: 'Notification sent successfully.', record: x}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
})

router.get("/publicKey", (req, res) => {
    const publicKey = vapidKeysObject.publicKey;

    res.status(200);
    res.send({publicKey: publicKey});
})