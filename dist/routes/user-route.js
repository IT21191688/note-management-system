"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = __importDefault(require("../middlewares/user-middleware"));
const user_controller_1 = require("../controllers/user-controller");
const constants_1 = __importDefault(require("../utills/constants"));
const UserRouter = (0, express_1.Router)();
UserRouter.post("/register", user_controller_1.RegisterUser);
UserRouter.post("/login", user_controller_1.UserLogin);
UserRouter.get("/profile", user_middleware_1.default.authorize([constants_1.default.USER.ROLES.USER]), user_controller_1.GetUserProfile);
exports.default = UserRouter;
