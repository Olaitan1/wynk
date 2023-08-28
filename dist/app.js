"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const index_1 = require("./config/index");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const index_2 = __importDefault(require("./routes/index"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
// import router from './routes/index';
dotenv_1.default.config();
(0, index_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({ secret: `${process.env.sessionSecret}` }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/", index_2.default);
//routes
app.use("/users", user_routes_1.default);
app.use("/admin", admin_routes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
