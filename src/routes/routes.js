import { EmailService } from "../services/email-service.js";
import { Router } from "express";

export const router = Router();

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
