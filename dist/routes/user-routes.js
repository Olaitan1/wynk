"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user-controller");
const router = express_1.default.Router();
router.post('/register', user_controller_1.Register);
router.get("/verify/:signature", user_controller_1.verifyUser);
router.post('/login', user_controller_1.Login);
router.post("/forgot-password", user_controller_1.forgotPassword);
router.get("/resetpassword/:id/:token", user_controller_1.resetPasswordGet);
router.post("/resetpassword/:id/:token", user_controller_1.resetPasswordPost);
router.get('/users', user_controller_1.getAllUsers);
// router.get("/profile", protect, getUserProfile);
// router.put("/edit-profile", upload.single("image"), protect, updateProfile);
exports.default = router;
