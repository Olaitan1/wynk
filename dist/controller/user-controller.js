"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.resetPasswordGet = exports.resetPasswordPost = exports.Login = exports.getAllUsers = exports.Register = exports.verifyUser = void 0;
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const notification_1 = require("../utils/notification");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utility_1 = require("../utils/utility");
const config_1 = require("../config");
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.UserInstance.findAll({
            attributes: { exclude: ["password", "salt"] },
        });
        // console.log(req.user && req.user.toJSON());
        res.status(200).json(users);
    }
    catch (error) {
        res.status(401).send("An error occurred");
    }
};
exports.getAllUsers = getAllUsers;
/**===================================== Register User ===================================== **/
const Register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        //console.log(req.body)
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)(10);
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        // //Generate OTP
        //     const { otp, expiry } = GenerateOTP();
        //check if user exists
        const user = await userModel_1.UserInstance.findOne({ where: { email: email } });
        // create user
        if (!user) {
            let User = await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                firstName: firstName,
                lastName: lastName,
                salt,
                image: "",
                phone,
                // otp,
                // otp_expiry:expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user"
            });
            //       let signature = await GenerateSignature({
            //         id: User.id,
            //         email: User.email,
            //         verified: User.verified,
            //       });
            //       //send Email to user
            //         const html = emailHtml(link);
            //       await sendMail(FromAdminMail, email, userSubject, html);
            //       return res.status(201).json({
            //         message:
            //           "User Created Successfully, check your email or phone number for verification",
            //         signature,
            //         verified: User.verified,
            //       });
            //     }
            //     res.status(400).json({ Error: "User already exists" });
            //   } catch (err) {
            //     console.log(err);
            //     res.status(500).json({
            //       Error: "Internal Server Error",
            //       route: "/users/signup",
            //     });
            //   }
            // };
            let signature = await (0, utility_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            // console.log(process.env.fromAdminMail, email, userSubject);
            //send Email to user
            const link = `${process.env.BASE_URL}/users/verify/${signature}`;
            const html = (0, notification_1.emailHtml3)(link);
            await (0, notification_1.mailSent)(process.env.fromAdminMail, email, "A4&T User Verification", html);
            return res.status(201).json({
                message: "You have registered successfully, Check your email for verification",
                signature,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/register",
            err,
        });
    }
};
exports.Register = Register;
/**==================== Verify Users ========================**/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        // Verify the signature
        const { id, email, verified } = await (0, utility_1.verifySignature)(token);
        // Find the user with the matching verification token
        const user = await userModel_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            throw new Error("Invalid verification token");
        }
        // Set the user's verified status to true
        const User = await userModel_1.UserInstance.update({
            verified: true,
        }, { where: { id } });
        await user.save();
        // // Redirect the user to the login page
        // return res.redirect(301, `${process.env.CLIENT_URL}/login`);
        // res
        //   .status(200)
        //   .send({
        //     message: "user has been verified successfully",
        //     success: true,
        //   })
        //   .redirect(`${process.env.CLIENT_URL}/login`);
        // Send a success response to the client
        return res.status(201).json({ message: 'Your email has been verified.' });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
        });
    }
};
exports.verifyUser = verifyUser;
/**==================== Login User ========================**/
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        console.log("bug");
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exist
        const User = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (!User) {
            return res.status(400).json({
                Error: "Wrong Username or password",
            });
        }
        if (User.verified) {
            const validation = await (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Regenerate a signature
                let signature = await (0, utility_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                });
            }
            return res.status(400).json({
                Error: "Wrong Username or password",
            });
        }
        return res.status(400).json({
            Error: "you have not been verified",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
            err,
        });
    }
};
exports.Login = Login;
/**==================== Forgot Password ========================**/
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const validateResult = utility_1.forgotPasswordSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const oldUser = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        //console.log(oldUser);
        if (!oldUser) {
            return res.status(400).json({
                message: "user not found",
            });
        }
        const secret = config_1.APP_SECRET + oldUser.password;
        const token = jsonwebtoken_1.default.sign({ email: oldUser.email, id: oldUser.id }, secret, {
            expiresIn: "1d",
        });
        const link = `${process.env.CLIENT_URL}/users/resetpassword/?userId=${oldUser.id}&token=${token}`;
        if (oldUser) {
            const html = (0, notification_1.emailHtml2)(link);
            await (0, notification_1.mailSent2)(config_1.FromAdminMail, oldUser.email, "Reset your password", html);
            return res.status(200).json({
                message: "password reset link sent to email",
                link,
            });
        }
        //console.log(link);
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgot-password",
        });
    }
};
exports.forgotPassword = forgotPassword;
//On clicking the email link ,
const resetPasswordGet = async (req, res) => {
    const { id, token } = req.params;
    const oldUser = await userModel_1.UserInstance.findOne({
        where: { id: id },
    });
    if (!oldUser) {
        return res.status(400).json({
            message: "User Does Not Exist",
        });
    }
    const secret = config_1.APP_SECRET + oldUser.password;
    console.log(secret);
    try {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        return res.status(200).json({
            email: oldUser.email,
            verify,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/resetpassword/:id/:token",
        });
    }
};
exports.resetPasswordGet = resetPasswordGet;
// Page for filling the new password and confirm password
const resetPasswordPost = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log(req.body);
    const validateResult = utility_1.resetPasswordSchema.validate(req.body, utility_1.option);
    if (validateResult.error) {
        return res.status(400).json({
            Error: validateResult.error.details[0].message,
        });
    }
    const oldUser = await userModel_1.UserInstance.findOne({
        where: { id: id },
    });
    if (!oldUser) {
        return res.status(400).json({
            message: "user does not exist",
        });
    }
    const secret = config_1.APP_SECRET + oldUser.password;
    try {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        const encryptedPassword = await bcrypt_1.default.hash(password, oldUser.salt);
        const updatedPassword = (await userModel_1.UserInstance.update({
            password: encryptedPassword,
        }, { where: { id: id } }));
        return res.status(200).json({
            message: "you have succesfully changed your password",
            updatedPassword,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/resetpassword/:id/:token",
        });
    }
};
exports.resetPasswordPost = resetPasswordPost;
