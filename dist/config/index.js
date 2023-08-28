"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = exports.Client_Secret = exports.Client_ID = exports.GMAIL_USER = exports.GMAIL_PASS = exports.userSubject = exports.FromAdminMail = exports.fromAdminPhone = exports.authToken = exports.accountSid = exports.APP_SECRET = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.APP_SECRET = process.env.APP_SECRET;
exports.accountSid = process.env.AccountSID;
exports.authToken = process.env.AuthToken;
exports.fromAdminPhone = process.env.fromAdminPhone;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.usersubject;
exports.GMAIL_PASS = process.env.GMAIL_USER;
exports.GMAIL_USER = process.env.GMAIL_PASS;
exports.Client_ID = process.env.Client_ID;
exports.Client_Secret = process.env.Client_Secret;
//for hosted db
exports.db = new sequelize_1.Sequelize(process.env.DB_CONNECTION_STRING, {
    logging: false,
    dialectOptions: {
        ssl: {
            require: process.env.NODE_ENV === "development" && false,
        },
    },
});
// for local connection
// export const db = new Sequelize("postgres", "postgres", "password", {
//   storage:"./a4andt.sqlite",
//   host: "localhost",
//   port: 5433,
//   dialect: "postgres",
//   logging: false,
// });
const connectDB = async () => {
    try {
        await exports.db.authenticate();
        await exports.db.sync();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
exports.connectDB = connectDB;
