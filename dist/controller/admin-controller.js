"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAgent = exports.AdminRegister = void 0;
const userModel_1 = require("../model/userModel");
const utility_1 = require("../utils/utility");
const uuid_1 = require("uuid");
const agentModel_1 = require("../model/agentModel");
const AdminRegister = async (req, res) => {
    try {
        const uuiduser = (0, uuid_1.v4)();
        const { email, phone, password, firstName, lastName } = req.body;
        const validateRegister = utility_1.Adminschema.validate(req.body, utility_1.option);
        if (validateRegister.error) {
            //  return res.status(400).json({ msg: "invalid email" });
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)(10);
        //Encrypting password
        const adminPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //check if admin exists
        const admin = (await userModel_1.UserInstance.findOne({
            where: { email: email }
        }));
        if (admin && admin.email === email) {
            return res.status(400).json({ Error: "Admin already exists" });
        }
        //create admin
        if (!admin) {
            let newAdmin = await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                image: "",
                phone,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",
            });
            let signature = await (0, utility_1.GenerateSignature)({
                id: newAdmin.id,
                email: newAdmin.email,
                verified: newAdmin.verified,
            });
            return res
                .status(201)
                .json({ msg: "Admin created successfully", user: newAdmin, signature });
        }
        return res.status(401).json({ Error: "Unauthorized" });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admin/register",
        });
    }
};
exports.AdminRegister = AdminRegister;
/*========================= Create Agent ======================*/
const CreateAgent = async (req, res) => {
    try {
        const { id } = req.user;
        const { NameOfOwner, email, phone, address, password, companyName, pincode, } = req.body;
        // console.log(id); 
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)(10);
        //Encrypting password
        const agentPassword = await (0, utility_1.GeneratePassword)(password, salt);
        // check if vendor exists
        const agent = (await agentModel_1.AgentInstance.findOne({
            where: { email: email }
        }));
        const admin = (await userModel_1.UserInstance.findOne({
            where: { id: id }
        }));
        const validateRegister = utility_1.agentSchema.validate(req.body, utility_1.option);
        if (validateRegister.error) {
            //  return res.status(400).json({ msg: "invalid email" });
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        console.log(validateRegister);
        const agentId = (0, uuid_1.v4)();
        if (admin.role === "admin" || admin.role === "superadmin") {
            if (!agent) {
                const newAgent = await agentModel_1.AgentInstance.create({
                    id: agentId,
                    companyName,
                    NameOfOwner,
                    salt,
                    address,
                    email,
                    phone,
                    password: agentPassword,
                    serviceAvailable: false,
                    rating: 0,
                    role: "agent",
                    pincode,
                    coverImage: "",
                });
                return res
                    .status(201)
                    .json({ msg: "Agent created successfully", newAgent });
            }
            return res.status(401).json({ Error: "Agent already exists" });
        }
        return res.status(400).json({
            Error: "Unauthorized",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admin/create-agent",
        });
    }
};
exports.CreateAgent = CreateAgent;
