"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class AgentInstance extends sequelize_1.Model {
}
exports.AgentInstance = AgentInstance;
AgentInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    NameOfOwner: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "email address is required",
            },
            isEmail: {
                msg: "please provide a valid email",
            },
        },
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: " phone is required",
            },
            notEmpty: {
                msg: "provide a phone number",
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: " password is required",
            },
            notEmpty: {
                msg: " provide a password",
            },
        },
    },
    pincode: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    serviceAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    coverImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: "agent",
});
