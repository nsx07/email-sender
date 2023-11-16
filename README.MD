# EMAIL-SENDER API 
### Endpoint [POST] : email-sender-development.up.railway.app/api/email/send 
/**
 * JSON object representing the body of an HTTP request to a microservice for sending emails.
 * 
 * @property {Object} transporter - Object containing information about the email transporter.
 * @property {string} transporter.service - The email service being used (e.g. "gmail").
 * @property {string} transporter.host - The SMTP host for the email service.
 * @property {number} transporter.port - The port number for the SMTP host.
 * @property {boolean} transporter.secure - Whether or not the connection to the SMTP host should be secure.
 * @property {Object} transporter.auth - Object containing authentication information for the email service.
 * @property {string} transporter.auth.type - The type of authentication being used (e.g. "OAuth2").
 * @property {string} transporter.auth.user - The email address of the account being used to send the email.
 * @property {string} transporter.auth.pass - The password for the account being used to send the email.
 * @property {string} transporter.auth.clientId - The client ID for the OAuth2 authentication.
 * @property {string} transporter.auth.clientSecret - The client secret for the OAuth2 authentication.
 * @property {string} transporter.auth.refreshToken - The refresh token for the OAuth2 authentication.
 * @property {Object} transporter.tls - Object containing TLS configuration information.
 * @property {boolean} transporter.tls.requireTLS - Whether or not TLS is required for the connection to the SMTP host.
 * @property {Object} mail - Object containing information about the email being sent.
 * @property {string} mail.to - The email address of the recipient.
 * @property {string} mail.subject - The subject line of the email.
 * @property {string} mail.text - The body text of the email.
 */
# Email Microservice Request Body

This JSON object represents the body of an HTTP request to a microservice for sending emails.

## Transporter

Object containing information about the email transporter.

- `service` (string): The email service being used (e.g. "gmail").
- `host` (string): The SMTP host for the email service.
- `port` (number): The port number for the SMTP host.
- `secure` (boolean): Whether or not the connection to the SMTP host should be secure.

### Auth

Object containing authentication information for the email service.

- `type` (string): The type of authentication being used (e.g. "OAuth2").
- `user` (string): The email address of the account being used to send the email.
- `pass` (string): The password for the account being used to send the email.
- `clientId` (string): The client ID for the OAuth2 authentication.
- `clientSecret` (string): The client secret for the OAuth2 authentication.
- `refreshToken` (string): The refresh token for the OAuth2 authentication.

### TLS

Object containing TLS configuration information.

- `requireTLS` (boolean): Whether or not TLS is required for the connection to the SMTP host.

## Mail

Object containing information about the email being sent.

- `to` (string): The email address of the recipient.
- `subject` (string): The subject line of the email.
- `text` (string): The body text of the email.

### Example

```json
{
  "transporter": {
    "service": "gmail",
    "host": "smtp.gmail.com",
    "port": 465,
    "secure": false,
    "auth": {
          "type": "OAuth2",
          "user": "your email...",
          "pass": "your pass...",
          "clientId": "your clientId...",
          "clientSecret": "your clientSecret...",
          "refreshToken": "your refreshToken...",
        },
    "tls": { "requireTLS": true }
  },

  "mail" : {
    "to": "destination email that wants to send, comma separated to multiple",
    "subject": "subject",
    "text": "body text",
    "html": "body html"
  }
} 
```