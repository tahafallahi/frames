import type { NextFunction, Request, Response } from "express";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";
import { body, matchedData, validationResult } from "express-validator";
import { error } from "node:console";

const singupValidators = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("username length must be between 3 and 32"),
  body("email").trim().notEmpty().withMessage("email is required"),
  body("password")
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage("password must be between 8 and 100 charachters"),
];

export const signupUser = [
  singupValidators,
  async function (req: Request, res: Response, next: NextFunction) {
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ errors: validationResult(req).array() });

    const { username, password, email } = matchedData(req);

    const userFromUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (userFromUsername)
      return res.status(409).json({ error: "username already exist" });

    const userFromEmail = await prisma.user.findUnique({ where: { email } });
    if (userFromEmail)
      return res.status(409).json({ error: "email already exist" });

    const hash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: { username, hashedPassword: hash, email },
    });

    req.logIn({ id: newUser.id }, (error) => {
      if (error) return next(error);
      res.status(201).json({ username, email });
    });
  },
];
