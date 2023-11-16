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
    console.log(req.body);
    
    let allSubscriptions = req.body.subscriptions;

    if (allSubscriptions) {
        allSubscriptions = Array.from(allSubscriptions).map(x => JSON.parse(x.subscriptionObject));
    }

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

    console.log(allSubscriptions);

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

router.post("/email/send", async (req, res) => {
    let body = req.body;

    if (body.transporter) {
        let transporter = emailService.customTransporter(body.transporter);
        let error = null;

        if (body.mail) {
            
            let promise = await new Promise((res, rej) => {
                transporter.sendMail(body.mail, function(err, data) {
                    if (err) {
                      console.log(err);
                      error = err;
                      res(err)
                    } else {
                        console.log("Email sent successfully");
                        res(data)
                    }
                })
            })

            if (error) {
                return res.status(503).send(JSON.stringify(error))
            } else {
                res.status(200).send({message: "Email sent successfully"});
            }
        } else {
            return res.status(400).send({message: "Email body is missing and its required."})
        }
    }
    
    return res.status(400).send({message: "Transporter not found. Its mandatory!"})
});
