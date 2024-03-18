"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = exports.GetUserProfile = exports.RegisterUser = void 0;
const user_utill_1 = __importDefault(require("../utills/user-utill"));
const user_service_1 = __importDefault(require("../services/user-service"));
const user_model_1 = __importDefault(require("../models/user-model"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const responce_1 = __importDefault(require("../utills/responce"));
const email_server_1 = require("../utills/email/email-server");
const email_templates_1 = __importDefault(require("../utills/email/email-templates"));
// Import custom errors
const NotFoundError_1 = __importDefault(require("../utills/error/error.classes/NotFoundError"));
const BadRequestError_1 = __importDefault(require("../utills/error/error.classes/BadRequestError"));
const ErrorHandler_1 = __importDefault(require("../utills/error/ErrorHandler"));
const RegisterUser = async (req, res) => {
    const body = req.body;
    const user = new user_model_1.default(body.user);
    try {
        const existingUser = await user_service_1.default.findByEmail(user.email);
        if (existingUser) {
            throw new BadRequestError_1.default("User already exists!");
        }
        let createdUser = null;
        user.password = await user_utill_1.default.hashPassword(body.user.password);
        const session = await (0, mongoose_1.startSession)();
        try {
            session.startTransaction();
            createdUser = await user_service_1.default.save(user, session);
            if (createdUser != null) {
                const subject = "Register Success";
                const htmlBody = email_templates_1.default.UserRegisteredEmail({
                    fullName: createdUser.firstname + " " + createdUser.lastname,
                });
                await (0, email_server_1.sendEmail)(user.email, subject, htmlBody, null);
            }
            await session.commitTransaction();
        }
        catch (e) {
            await session.abortTransaction();
            throw e;
        }
        finally {
            // End session
            session.endSession();
        }
        return (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.CREATED, "User registered successfully!", createdUser);
    }
    catch (error) {
        ErrorHandler_1.default.handle(error, req, res); // Handle error using ErrorHandler
    }
};
exports.RegisterUser = RegisterUser;
const UserLogin = async (req, res) => {
    const body = req.body;
    try {
        if (!body.email || !body.password) {
            throw new BadRequestError_1.default("Email and password are required");
        }
        const isAuthCheck = await user_service_1.default.findByEmail(body.email);
        if (!isAuthCheck) {
            throw new NotFoundError_1.default("Invalid email!");
        }
        const isPasswordMatch = await user_utill_1.default.comparePassword(body.password, isAuthCheck.password);
        if (!isPasswordMatch) {
            throw new BadRequestError_1.default("Invalid password!");
        }
        const token = user_utill_1.default.signToken(isAuthCheck);
        let user = {
            fullName: isAuthCheck.fullName,
            email: isAuthCheck.email,
            role: isAuthCheck.role,
        };
        (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.OK, "Log in successfully!", {
            token,
            user: user,
        });
    }
    catch (error) {
        ErrorHandler_1.default.handle(error, req, res); // Pass error to ErrorHandler
    }
};
exports.UserLogin = UserLogin;
const GetUserProfile = async (req, res) => {
    try {
        const auth = req.auth;
        const user = await user_service_1.default.findById(auth._id);
        if (!user) {
            throw new NotFoundError_1.default("User not found!");
        }
        return (0, responce_1.default)(res, true, http_status_codes_1.StatusCodes.OK, "Profile fetched successfully!", user);
    }
    catch (error) {
        ErrorHandler_1.default.handle(error, req, res); // Handle error using ErrorHandler
    }
};
exports.GetUserProfile = GetUserProfile;
