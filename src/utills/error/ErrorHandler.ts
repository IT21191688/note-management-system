//import { Response, Request, NextFunction } from "express";
import NotFoundError from "./error.classes/NotFoundError";
import BadRequestError from "./error.classes/BadRequestError";
import ForbiddenError from "./error.classes/ForbiddenError";
import ConflictError from "./error.classes/ConflictError";
import UnauthorizedError from "./error.classes/UnauthorizedError";
import InternalServerError from "./error.classes/InternalServerError";
import CustomAPIError from "./error.classes/CustomAPIError";

class ErrorHandler {
  static handle(err: any, req: any, res: any) {
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof BadRequestError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof ForbiddenError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof ConflictError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof UnauthorizedError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof InternalServerError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof CustomAPIError) {
      return res.status(500).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default ErrorHandler;
