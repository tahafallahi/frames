import type { Request, Response } from "express";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";
import { body, matchedData, validationResult } from "express-validator";

const singupValidators = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("username length must be between 3 and 32"),
  body("password")
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage("password must be between 8 and 100 charachters"),
];

export const signupUser = [
  singupValidators,
  async function (req: Request, res: Response) {
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ errors: validationResult(req).array() });

    const { username, password } = matchedData(req);
    const user = await prisma.user.findUnique({ where: { username } });

    if (user) return res.status(409).json({ error: "username already exist" });

    const hash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: { username, hashedPassword: hash },
    });

    res.json(newUser);
  },
];
