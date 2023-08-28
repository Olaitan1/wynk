"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { Register } from "../controller/usercontrollers";
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.status(200).send('welcome to our store, click to view documentation');
});
exports.default = router;
