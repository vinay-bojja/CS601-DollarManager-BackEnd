import { User } from "../../../commons/models";
import { CrudOperations, Password } from "../../../commons/utils";
import nodemailer from "nodemailer";
import config from "../../appConfig"
import { Group } from "../../../commons/models/group.entity";

class UserService {
    public async signUp(user: any, next: CallableFunction) {
        try {
            let userDetails = await new CrudOperations(User).getDocument({ email: user.email }, {});
            if (userDetails && userDetails.isManualLogin) {
                return next(null, "User already Exist. Please log in.")
            }
            else if (userDetails && !userDetails.isManualLogin) {
                user = { ...user, isManualLogin: true }
                let updatedDocument = await new CrudOperations(User).updateDocument({ email: user.email }, user);
                return next(null, updatedDocument);
            }
            else {
                user = { ...user, isManualLogin: true, }
                let savedUser = await new CrudOperations(User).save(user);
                return next(null, savedUser);
            }
        }
        catch (err) {
            next("SignUp error.")
        }
    }

    public async signIn(user: any, next: CallableFunction) {
        try {
            let userDetails = await new CrudOperations(User).getDocument({ email: user.email }, {});
            if (!userDetails) {
                return next(null, "No user found with email.")
            }
            else if (userDetails && !(await Password.compare(userDetails.password, user.password))) {
                return next(null, "Wrong password.")
            }
            else {
                return next(null, userDetails);
            }
        }
        catch (err) {
            next("SignIn error.")
        }
    }

    public async forgotPassword(body: any, next: CallableFunction) {
        try {
            let userDetails = await new CrudOperations(User).getDocument({ ssouid: body.ssouid }, {});
            if (!userDetails) {
                return next("No user found with the password.")
            }
            else {
                let newPassword = await Password.toHash(body.newPassword);
                let updatedUser = { password: newPassword, isManualLogin: true };
                let savedUser = await new CrudOperations(User).updateDocument({ _id: userDetails._id }, updatedUser);
                return next(null, savedUser);
            }
        }
        catch (err) {
            next("Forgot password error.")
        }
    }

    public async getUser(userId: any, next: CallableFunction) {
        try {

            const userDetails = await new CrudOperations(User).getDocument({ _id: userId }, {});
            if (userDetails) {
                return next(null, userDetails);
            }
            else {
                return next(null, "Error getting user.");
            }
        } catch (error) {
            console.log("getUser error: " + error);
        }
    }

    public async sendForgotPasswordLink(email: any, next: CallableFunction) {
        try {
            let userDetails = await new CrudOperations(User).getDocument({ email: email }, {});
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.Gmail_User,
                    pass: config.Gmail_Password
                }
            });

            var mailOptions = {
                from: 'vinay.bojja@viit.ac.in',
                to: email,
                subject: 'Dollar manager: Reset password.',
                text: `${config.FRONTEND_URL}/forgotPassword/resetPassword/${userDetails.ssouid}` //
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    next(null, "error");
                } else {
                    next(null, 'Email sent.');
                }
            });


        } catch (error) {

        }
    }

    public async getAddFriendUsers(groupId: any, next: CallableFunction) {
        try {
            const groupDetails = await new CrudOperations(Group).getDocument({ _id: groupId }, {});
            const userDetails = await new CrudOperations(User).getAllDocuments({ _id: { $nin: groupDetails.userIds } }, {}, { pageNo: 0, limit: 0 });

            if (userDetails) {
                return next(null, userDetails);
            }
            else {
                return next(null, "Error getting user.");
            }
        } catch (error) {
            console.log("getUser error: " + error);
        }
    }

}

export default new UserService();
