"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentSchema = exports.Adminschema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.validatePassword = exports.verifySignature = exports.loginSchema = exports.registerSchema = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
// import { AuthPayload } from "../interface/auth.dto";
// import { APP_SECRET } from "../Config";
exports.option = {
    abortEarly: false /* means if there's an error in the first keys, it'll takecare of the error
                              first before moving on to the next error  */,
    errors: {
        wrap: { label: "" },
    },
};
const GenerateSalt = async (rounds) => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = async (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: "1d" });
    }
    catch (error) {
        throw "could not create a token";
    } /*1d means 1 day */
};
exports.GenerateSignature = GenerateSignature;
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string()
        .pattern(new RegExp("[ A-Za-z0-9_@./#&+-]*$"))
        .min(8)
        .required(),
    // confirm_password: Joi.any()
    //   .equal(Joi.ref("password"))
    //   .required()
    //   .label("Confirm password")
    //   .messages({ "any.only": "{{#label}} does not match" }),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, config_1.APP_SECRET);
};
exports.verifySignature = verifySignature;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
};
exports.validatePassword = validatePassword;
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
});
exports.resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().regex(/[a-zA-Z0-9]{3,30}/),
    //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({
        "any.only": "passwords do not match",
        "any.required": "You need to add a confirm password",
    }),
});
exports.Adminschema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
exports.agentSchema = joi_1.default.object().keys({
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    companyName: joi_1.default.string().required(),
    NameOfOwner: joi_1.default.string().required(),
    pincode: joi_1.default.number().required()
});
