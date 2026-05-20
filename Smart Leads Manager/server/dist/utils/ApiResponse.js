"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const ApiResponse = (statusCode, message, data) => {
    return {
        success: statusCode < 400,
        statusCode,
        message,
        data,
    };
};
exports.ApiResponse = ApiResponse;
