import passport from "passport";
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import { prisma } from "./prisma";
import { faker } from "@faker-js/faker";

if (!process.env.GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID is not provided in enviroment variables");
if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error(
    "GOOGLE_CLIENT_SECRET is not provided in enviroment variables",
  );
if (!process.env.GOOGLE_REDIRECT_URL)
  throw new Error(
    "GOOGLE_REDIRECT_URL is not provided in enviroment variables",
  );

const config: client.Configuration = await client.discovery(
  new URL("https://accounts.google.com"),
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
const scope = "openid email profile";
const callbackURL = process.env.GOOGLE_REDIRECT_URL;

const verify: VerifyFunction = async (tokens, done) => {
  try {
    const { sub, iss, email, name, picture } = tokens.claims()!;
    const user = await prisma.federatedUser.findUnique({
      where: { subject: sub },
    });

    if (user) {
      return done(null, { id: user.user_id});
    } else {
      let username = "";

      for (let i = 0; i < 10; i++) {
        let options = name ? { firstName: name.toString() } : {};
        username = faker.internet.username(options);
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) break;
        if (i === 9) username = crypto.randomUUID();
      }

      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email ? email.toString() : null,
          profilePath: picture ? picture.toString() : null,
        },
      });

      const newFederatedUser = await prisma.federatedUser.create({
        data: { subject: sub, provider: iss, user_id: newUser.id },
      });

      console.log(
        "new user created" + sub,
        email,
        picture,
        name,
        iss,
        username,
      );

      return done(null, { id: newFederatedUser.user_id });
    }
  } catch (error) {
    return done(error);
  }
};

passport.use("openid", new Strategy({ config, scope, callbackURL }, verify));