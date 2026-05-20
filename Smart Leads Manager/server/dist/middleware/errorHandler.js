"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    // Handle specific Mongoose errors
    if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        const messages = Object.values(err.errors).map((val) => val.message);
        message = `Validation failed: ${messages.join(', ')}`;
    }
    else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
    else if (!(err instanceof ApiError_1.ApiError)) {
        statusCode = statusCode || 500;
        message = env_1.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
    }
    res.status(statusCode || 500).json({
        success: false,
        message,
        ...(env_1.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
