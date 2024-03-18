import { Request, Response } from "express";
import userUtil from "../utills/user-utill";
import userService from "../services/user-service";
import User from "../models/user-model";
import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import CustomResponse from "../utills/responce";

import { sendEmail } from "../utills/email/email-server";
import emailService from "../utills/email/email-templates";

// Import custom errors
import NotFoundError from "../utills/error/error.classes/NotFoundError";
import BadRequestError from "../utills/error/error.classes/BadRequestError";

import ErrorHandler from "../utills/error/ErrorHandler";

const RegisterUser = async (req: Request, res: Response) => {
  const body: any = req.body;
  const user: any = new User(body.user);

  try {
    const existingUser = await userService.findByEmail(user.email);

    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    let createdUser = null;

    user.password = await userUtil.hashPassword(body.user.password);

    const session = await startSession();

    try {
      session.startTransaction();

      createdUser = await userService.save(user, session);

      if (createdUser != null) {
        const subject = "Register Success";
        const htmlBody = emailService.UserRegisteredEmail({
          fullName: createdUser.firstname + " " + createdUser.lastname,
        });

        await sendEmail(user.email, subject, htmlBody, null);
      }

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      // End session
      session.endSession();
    }

    return CustomResponse(
      res,
      true,
      StatusCodes.CREATED,
      "User registered successfully!",
      createdUser
    );
  } catch (error) {
    ErrorHandler.handle(error, req, res); // Handle error using ErrorHandler
  }
};

const UserLogin = async (req: Request, res: Response) => {
  const body: any = req.body;

  try {
    if (!body.email || !body.password) {
      throw new BadRequestError("Email and password are required");
    }

    const isAuthCheck: any = await userService.findByEmail(body.email);

    if (!isAuthCheck) {
      throw new NotFoundError("Invalid email!");
    }

    const isPasswordMatch = await userUtil.comparePassword(
      body.password,
      isAuthCheck.password
    );

    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid password!");
    }

    const token = userUtil.signToken(isAuthCheck);

    let user = {
      fullName: isAuthCheck.fullName,
      email: isAuthCheck.email,
      role: isAuthCheck.role,
    };

    CustomResponse(res, true, StatusCodes.OK, "Log in successfully!", {
      token,
      user: user,
    });
  } catch (error) {
    ErrorHandler.handle(error, req, res); // Pass error to ErrorHandler
  }
};

const GetUserProfile = async (req: Request, res: Response) => {
  try {
    const auth: any = req.auth;

    const user = await userService.findById(auth._id);

    if (!user) {
      throw new NotFoundError("User not found!");
    }

    return CustomResponse(
      res,
      true,
      StatusCodes.OK,
      "Profile fetched successfully!",
      user
    );
  } catch (error) {
    ErrorHandler.handle(error, req, res); // Handle error using ErrorHandler
  }
};

export { RegisterUser, GetUserProfile, UserLogin };
