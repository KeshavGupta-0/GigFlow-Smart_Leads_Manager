"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyToken = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const ApiError_1 = require("../utils/ApiError");
const verifyToken = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            return next(new ApiError_1.ApiError(401, 'Not authorized, no token provided'));
        }
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(new ApiError_1.ApiError(401, 'Not authorized, invalid token'));
    }
};
exports.verifyToken = verifyToken;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(403, 'Forbidden: insufficient permissions'));
        }
        next();
    };
};
exports.requireRole = requireRole;
