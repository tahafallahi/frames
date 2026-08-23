import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy, type VerifyFunction } from "passport-local";
import { prisma } from "./prisma";

const verify: VerifyFunction = async (username, password, done) => {
  if (!process.env.DUMMY_HASH_12) {
    throw new Error("DUMMY_HASH_12 is not provided in enviroment variables");
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (user && user.hashedPassword) {
      const result = await bcrypt.compare(password, user.hashedPassword);
      if (result) {
        return done(null, { id: user.id });
      } else {
        return done(null, false);
      }
    } else {
      await bcrypt.compare(password, process.env.DUMMY_HASH_12)
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
};

passport.use(new Strategy(verify));


passport.serializeUser((user,done) => {
  return done(null, user.id)
})

passport.deserializeUser(async(id: string, done) => {
  try {
    const user = await prisma.user.findUnique({where:{id}})
    return done(null, user)
  } catch (error) {
    return done(error)
  }
})