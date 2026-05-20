"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_repository_1 = require("../repositories/user.repository");
const ApiError_1 = require("../utils/ApiError");
const jwt_utils_1 = require("../utils/jwt.utils");
const register = async (body) => {
    const existingUser = await (0, user_repository_1.findByEmail)(body.email);
    if (existingUser) {
        throw new ApiError_1.ApiError(400, 'Email is already registered');
    }
    const user = await (0, user_repository_1.createUser)({
        name: body.name,
        email: body.email,
        passwordHash: body.password,
    });
    const payload = { userId: user._id.toString(), role: user.role, email: user.email };
    const token = (0, jwt_utils_1.signToken)(payload);
    const userObj = user.toObject();
    delete userObj.passwordHash;
    return { user: userObj, token };
};
exports.register = register;
const login = async (body) => {
    const user = await (0, user_repository_1.findByEmail)(body.email);
    if (!user) {
        throw new ApiError_1.ApiError(401, 'Invalid credentials');
    }
    const isMatch = await user.comparePassword(body.password);
    if (!isMatch) {
        throw new ApiError_1.ApiError(401, 'Invalid credentials');
    }
    const payload = { userId: user._id.toString(), role: user.role, email: user.email };
    const token = (0, jwt_utils_1.signToken)(payload);
    const userObj = user.toObject();
    delete userObj.passwordHash;
    return { user: userObj, token };
};
exports.login = login;
