"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
require("./database");
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// Main Application
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use((0, connect_timeout_1.default)("120s"));
app.use((0, body_parser_1.default)());
app.use(haltOnTimedout);
app.use((0, morgan_1.default)("dev"));
// Static file serving
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "public")));
function haltOnTimedout(req, res, next) {
    if (!req.timedout)
        next();
}
app.get("/", (req, res, next) => {
    res.json({
        data: {},
        message: "Server running!",
    });
});
// Main routes
app.use("/", routes_1.default);
// 404 Route
const route404 = (req, res, next) => {
    res.json({ message: "Route not Found", data: {} });
};
app.use("*", (0, connect_timeout_1.default)("1200s"), route404);
// Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.json({
        message: "Something went wrong",
        errs: Array.isArray(err)
            ? err
            : typeof err === "object" && err.message
                ? [err.message]
                : [err],
    });
});
// TODO: init sockets
const server = app.listen(constants_1.PORT, () => {
    constants_1.ISDEV && console.clear();
    console.log(` Server running on PORT \n\t${constants_1.ISDEV ? ansi_colors_1.default.cyan("http://localhost:8080") : ansi_colors_1.default.cyan(String(constants_1.PORT))}\n at ${Date()}`);
});
