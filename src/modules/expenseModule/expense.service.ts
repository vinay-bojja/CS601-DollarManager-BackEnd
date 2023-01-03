import { NextFunction } from "express";
import { ExpenseDetails, User, UserExpense } from "../../../commons/models";
import { CrudOperations } from "../../../commons/utils";
import mongoose, { Types } from "mongoose";

class ExpenseService {

    public async addExpense(expenseDoc: any, userId: any, next: CallableFunction) {
        try {
            //add expense to expenses collection
            let expense = await new CrudOperations(ExpenseDetails).save({ ...expenseDoc, userId: userId });
            //add the expenseId to userExpense collection
            let userExpense = await new CrudOperations(UserExpense).getDocument({ userId: userId }, {});
            if (userExpense == null) {
                let userExpenseDoc = {
                    userId: userId,
                    expenseIds: [expense._id]
                }
                await new CrudOperations(UserExpense).save(userExpenseDoc);

            }
            else {
                userExpense.expenseIds.push(expense._id);
                await new CrudOperations(UserExpense).updateDocument({ userId: userId }, userExpense);
            }
            next(null, expense);

        } catch (error) {
            console.log(error);
        }
    }

    public async updateExpense(expenseDoc: any, expenseId: any, next: CallableFunction) {
        try {
            const expense = await new CrudOperations(ExpenseDetails).getDocument({ _id: expenseId }, {});
            if (expense == null) {
                return next(null, "Error updating expense.");
            }

            let result = await new CrudOperations(ExpenseDetails).updateDocument({ _id: expenseId }, expenseDoc);

            next(null, result);

        } catch (error) {
            console.log(error);
        }
    }

    public async deleteExpense(expenseId: any, next: CallableFunction) {
        try {
            const expense = await new CrudOperations(ExpenseDetails).getDocument({ _id: expenseId }, {});
            if (expense == null) {
                return next(null, "Error finding expense.");
            }
            //delete expense from ExpenseDetails
            let result = await new CrudOperations(ExpenseDetails).updateDocument({ _id: expenseId }, { isDeleted: true });

            //delete expense from userId
            let userExpense = await new CrudOperations(UserExpense).getDocument({ userId: expense.userId }, {});
            if (userExpense == null) {
                return next(null, "Error finding user.");
            }
            let idx = userExpense.expenseIds.indexOf(expenseId);
            if (idx >= 0) {
                userExpense.expenseIds.splice(idx, 1);
            }
            await new CrudOperations(UserExpense).updateDocument({ userId: expense.userId }, userExpense);

            next(null, result);

        } catch (error) {
            console.log(error);
        }
    }

    public async getAllExpenseOfUser(userId: any, next: CallableFunction) {
        try {
            let getAllExpenseOfUser = await new CrudOperations(UserExpense).getDocument({ userId: userId }, {});
            if (getAllExpenseOfUser == null) {
                return next(null, "Error getting expenses of user");
            }
            for (let expenseId in getAllExpenseOfUser.expenseIds) {
                let expenseDetails = await new CrudOperations(ExpenseDetails).getDocument({ _id: getAllExpenseOfUser.expenseIds[expenseId] }, {});
                getAllExpenseOfUser.expenseIds[expenseId] = expenseDetails;
            }
            next(null, getAllExpenseOfUser)
        } catch (error) {
            console.log("getAllExpenseOfUser", error);
        }
    }

    public async getExpense(expenseId: any, next: CallableFunction) {
        try {
            let expense = await new CrudOperations(ExpenseDetails).getDocument({ _id: expenseId }, {});
            if (expense == null) {
                return next(null, "Error getting expense");
            }
            let userDetails = await new CrudOperations(User).getDocument({ _id: expense.userId }, {});
            expense = { ...expense._doc, userDetails: userDetails };
            return next(null, expense);
        } catch (error) {
            console.log("getExpense", error);
        }
    }

    public async getExpensesInDateRange(body: any, userId: any, next: CallableFunction) {
        try {
            let startDate = new Date(body.startDate);
            let endDate = new Date(body.endDate);
            let expenses = await new CrudOperations(ExpenseDetails).getAllDocuments({createdAt: {$gte:startDate,$lte:endDate}, isDeleted:false, userId: userId},{},{pageNo:0, limit:0});
            next(null, expenses);
        } catch (error) {
            console.log("getExpensesInDateRange", error);
        }
    }
}

export default new ExpenseService();