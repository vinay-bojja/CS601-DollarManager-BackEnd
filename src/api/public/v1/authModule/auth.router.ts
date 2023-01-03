import { Router } from "express";
import passport from "passport";
import UserController from "./auth.controller";
import config from "../../../../appConfig";
import { Request, Response } from "express";
import strategy from "passport-google-oauth20";

const GoogleStrategy = strategy.Strategy;


passport.serializeUser((user: any, cb: any) => {
  cb(null, user);
});
passport.deserializeUser((user: any, cb: any) => {
  cb(null, user);
});

// let users: any = {};

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE.GOOGLE_CLIENT_SECRET,
  callbackURL: "/public/api/v1/auth/google/callback",
  passReqToCallback: true,
  proxy: true
}, (request: any, accessToken: any, refreshToken: any, profile: any, cb: any) => {
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails !== undefined || null ? profile.emails[0].value : null,
    profilePicture: profile.photos[0].value
  };


  UserController.socialSignIn(user, (err: any, user: any) => {
    if (err) {
      return cb(null, err);
    }
    else {
      let users = { ...user };
      return cb(null, users);
    }
  });

}));

const router = Router();

// Google
router.get("/google",
  (request: Request, response: Response) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(request, response);
  }
);

router.get("/google/callback", passport.authenticate("google", {
  // successRedirect: "http://localhost:3000/expenseHome", //successRedirect  to Expense module
  failureRedirect: "/public/api/v1/auth/google/failure" //failureRedirect   alert failed msg and redirect to login page
}), (req: Request, res: Response) => {
  let user = Object(req.user);
  if (user) {
    res.redirect(`${config.FRONTEND_URL}/Login/SetLocalStorage/${user._doc._id}`);
  }
}
);

router.get("/google/success", (request: Request, response: Response) => {
  response.send("Success!");
});

router.get("/google/failure", (request: Request, response: Response) => {
  response.send("FAILED");
});

router.post('/sendForgotPasswordLink', UserController.sendForgotPasswordLink);

router.post("/signUp", UserController.signUp);

router.post("/signIn", UserController.signIn);

router.post("/forgotPassword", UserController.forgotPassword);

router.get("/getUser/:id", UserController.getUser);

router.get("/getAddFriendUsers/:id", UserController.getAddFriendUsers);

export default router;