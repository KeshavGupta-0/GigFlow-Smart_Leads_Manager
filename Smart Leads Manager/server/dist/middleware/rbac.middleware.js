"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(403, 'Not authorized to access this route'));
        }
        next();
    };
};
exports.requireRole = requireRole;
