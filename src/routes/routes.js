import { vapidKeysObject } from "../environment/environment.js"
import { EmailService } from "../services/email-service.js";
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
            res.status(500).send({error: err});
        });
});

router.get("/publicKey", (req, res) => {
    res.status(200).send({publicKey: vapidKeysObject.publicKey});
});

router.post("/email", (req, res) => {
    const transporter = req.body.transporter 
        ? EmailService.customTransporter(req.body.transporter)
        : EmailService.getDefaultTransporter();

    if (req.body.mail) {
        transporter.sendMail(req.body.mail, function(err, data) {
            if (err) {
              console.log("Error " + err);
              res.status(503).send({message: "Error " + err});
            } else {
              console.log("Email sent successfully");
              res.status(200).send({message: "Email sent successfully"});
            }
          });
    } else {
        res.status(400).send({message: "Email body is missing and its required."})
    }
});