"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const ApiError_1 = require("./utils/ApiError");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const leads_routes_1 = __importDefault(require("./routes/leads.routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
if (env_1.env.NODE_ENV === 'production') {
    app.use((0, morgan_1.default)('combined'));
}
else {
    app.use((0, morgan_1.default)('dev'));
}
// Rate Limiting
app.use(rateLimiter_1.generalLimiter);
// Routes
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'OK', timestamp: new Date() });
});
app.use('/api/v1/auth', rateLimiter_1.authLimiter, auth_routes_1.default);
app.use('/api/v1/leads', leads_routes_1.default);
// 404 Handler
app.use((req, res, next) => {
    next(new ApiError_1.ApiError(404, 'Not found'));
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
