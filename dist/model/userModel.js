"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../config/index");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "Email address required" },
            isEmail: { msg: "Please provide a valid email" },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Provide a password" },
        },
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: { msg: "User must be verified" },
            notEmpty: { msg: "User not verified" },
        },
        defaultValue: false,
    },
    // otp: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       msg: " OTP is required",
    //     },
    //     notEmpty: {
    //       msg: "provide an OTP",
    //     },
    //   },
    // },
    // otp_expiry: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       msg: " OTP has expired",
    //     },
    //   },
    // },
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
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Salt is required" },
            notEmpty: { msg: "Provide a salt" },
        },
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lng: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lat: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: index_1.db,
    tableName: "users",
});
