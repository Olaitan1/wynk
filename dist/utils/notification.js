"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml2 = exports.mailSent2 = exports.emailHtml3 = exports.mailSent = exports.onRequestOTP = exports.GenerateOTP = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
// import {
//   NotificationAttributes,
//   NotificationInstance,
// } from "../model/notificationModel";
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
//using Twilio as sms.......how to send otp to user
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require("twilio")(config_1.accountSid, config_1.authToken);
    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone,
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
//   // note: service and host are the same thing
// const transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: GMAIL_USER,
//         pass: GMAIL_PASS
//     },
//     //tls:transport layer security is used to get the status of the message sent to the mail, either suuccessful or failed
//     tls: {
//         rejectUnauthorized: false
//     }
// })
// export const sendMail = async (from: string, to: string, subject: string, html: string) =>
// {
//     try {
//        const mailSent = await transport.sendMail({
//             from: FromAdminMail,
//             to: GMAIL_USER,
//             subject: userSubject,
//             html
//        })
//          return mailSent;
//     } catch (error) {
//         console.log(error)
//     }
// }
// export const emailHtml3 = (otp:number): string => {
//    let mailSent = 
//         `<div style="background-color: #f5f5f5; max-weight: 700px; height:auto; margin:auto; border: 10px solid;color:#ddd; padding: 50px 20px; font-family: sans-serif;">
//         <h2 style="color: #333; text-align:center; text-transform:upperCase;font-weight: normal;">Welcome To Haya Foods</h2>
//         <p style="color: #ddd" justify-content= "center">Hi there,your otp is ${otp} </p>
//         </div>`
//     return mailSent;
// };
const transport = nodemailer_1.default.createTransport({
    service: "gmail" /*service and host are the same thing */,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const mailSent = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.FromAdminMail,
            to,
            subject: "A4&T Verification Link",
            html,
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.mailSent = mailSent;
const emailHtml3 = (link) => {
    let response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    A4&T
    </h2>
    <p>Hi there, follow the link to verify your account. The link expires in 10 minutes below.</p>
      <p>Click <a href=${link}>here</a> to verify your account</p>
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>
    `;
    return response;
};
exports.emailHtml3 = emailHtml3;
const mailSent2 = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.FromAdminMail,
            subject: "Reset Your Password",
            to,
            html,
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
};
exports.mailSent2 = mailSent2;
const emailHtml2 = (link) => {
    let response = `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    A4&T
    </h2>
    <p>Hi there, follow the link to reset your password. The link expires in 10 minutes below.</p>
     <a href=${link}>Reset Password</a>
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>`;
    return response;
};
exports.emailHtml2 = emailHtml2;
