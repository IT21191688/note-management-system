"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserRegisteredEmail = (data) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Note Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            font-size: 16px;
            color: #555555;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Note Management System, ${data.fullName}!</h1>
        <p>Dear ${data.fullName},</p>
        <p>Congratulations! You have successfully registered on our Note Management platform.</p>
        <p>Thank you for joining our platform. We're excited to help you manage your notes effectively.</p>
        <p>Feel free to create new notes, organize them, and keep track of your important information.</p>
        <p>If you have any questions or need assistance, don't hesitate to contact our support team.</p>
        <p>Enjoy managing your notes!</p>
        <p>Best regards,</p>
        <p>Note Management System Team</p>
    </div>
</body>
</html>
    `;
};
exports.default = {
    UserRegisteredEmail,
};
