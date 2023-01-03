import { Request, Response, NextFunction } from "express";
import { User } from "../../../../../commons/models";
import { CrudOperations, HttpException, HttpResponse, Password } from "../../../../../commons/utils";
import UserService from "../../../../modules/authModule/user.service";

class UserController {


  public async sendForgotPasswordLink(request: Request, response: Response, next: NextFunction) {
    try {
      let email = request.body.email;
      UserService.sendForgotPasswordLink(email, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        } else {
          response.status(200).send(new HttpResponse("signUp", result, null, null, null, null));
        }
      });
    }
    catch (err) {
      console.log("Something went wrong!")
    }
  }

  public async socialSignIn(user: any, next: CallableFunction) {
    try {
      let userDetails = await new CrudOperations(User).getDocument({ email: user.email }, {});

      if (userDetails && userDetails.isGoogleLogin) {
        // localStorage.setItem("user-info",userDetails);
        next(null, userDetails)
      }
      else if (userDetails && !userDetails.isGoogleLogin) {
        let updatedUser = {
          isGoogleLogin: true,
          profilePicture: user.profilePicture,
          ssouid: user.id
        }
        let savedUser = await new CrudOperations(User).updateDocument({ email: user.email }, updatedUser);
        // localStorage.setItem("user-info",savedUser);
        next(null, savedUser)
      }
      else {
        let object = {
          email: user.email,
          name: user.name,
          isGoogleLogin: true,
          profilePicture: user.profilePicture,
          ssouid: user.id
        }

        let savedUser = await new CrudOperations(User).save(object);
        // localStorage.setItem("user-info",savedUser);
        next(null, savedUser);
      }
    }
    catch (err) {
      console.log("Something went wrong!", err);
    }
  }

  public async signUp(request: Request, response: Response, next: NextFunction) {
    try {
      let user = request.body;
      user.password = await Password.toHash(user.password);
      UserService.signUp(user, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        } else {
          response.status(200).send(new HttpResponse("signUp", result, null, null, null, null));
        }
      });
    }
    catch (err) {
      console.log("SignUp error.");
    }
  }

  public async signIn(request: Request, response: Response, next: NextFunction) {
    try {
      let user = request.body;
      UserService.signIn(user, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("signIn", result, null, null, null, null));
        }
      })
    }
    catch (err) {
      console.log("SignIn error.");
    }
  }

  public async forgotPassword(request: Request, response: Response, next: NextFunction) {
    try {
      let body = request.body;
      UserService.forgotPassword(body, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          response.status(200).send(new HttpResponse("forgotPassword", result, "Password set successfully.", null, null, null));
        }
      })
    }
    catch (err) {
      console.log("SignIn error.");
    }
  }

  public async getUser(request: Request, response: Response, next: NextFunction) {
    try {
      let userId = request.params.id;
      UserService.getUser(userId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          response.status(200).send(new HttpResponse("getUser", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log("Error in getUser", error);
    }
  }

  public async getAddFriendUsers(request: Request, response: Response, next: NextFunction) {
    try {
      let groupId = request.params.id;
      UserService.getAddFriendUsers(groupId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          response.status(200).send(new HttpResponse("getAddFriendUsers", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log("Error in getUser", error);
    }
  }

}

export default new UserController();

