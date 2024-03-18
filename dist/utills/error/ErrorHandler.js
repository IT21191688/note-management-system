"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { Response, Request, NextFunction } from "express";
const NotFoundError_1 = __importDefault(require("./error.classes/NotFoundError"));
const BadRequestError_1 = __importDefault(require("./error.classes/BadRequestError"));
const ForbiddenError_1 = __importDefault(require("./error.classes/ForbiddenError"));
const ConflictError_1 = __importDefault(require("./error.classes/ConflictError"));
const UnauthorizedError_1 = __importDefault(require("./error.classes/UnauthorizedError"));
const InternalServerError_1 = __importDefault(require("./error.classes/InternalServerError"));
const CustomAPIError_1 = __importDefault(require("./error.classes/CustomAPIError"));
class ErrorHandler {
    static handle(err, req, res) {
        if (err instanceof NotFoundError_1.default) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        else if (err instanceof BadRequestError_1.default) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        else if (err instanceof ForbiddenError_1.default) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        else if (err instanceof ConflictError_1.default) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        else if (err instanceof UnauthorizedError_1.default) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        else if (err instanceof InternalServerError_1.default) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        else if (err instanceof CustomAPIError_1.default) {
            return res.status(500).json({ message: err.message });
        }
        else {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.default = ErrorHandler;
