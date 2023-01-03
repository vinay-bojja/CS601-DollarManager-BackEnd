import { Request, Response, NextFunction } from "express";
import { HttpException, HttpResponse } from "../../../../../commons/utils";
import ExpenseService from "../../../../modules/expenseModule/expense.service";

class ExpenseController {

  public async addExpense(request: Request, response: Response, next: NextFunction) {
    try {
      let userId: any = request.query.userId;
      ExpenseService.addExpense(request.body, userId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("addExpense", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async updateExpense(request: Request, response: Response, next: NextFunction) {
    try {
      let expenseId: any = request.query.expenseId;
      ExpenseService.updateExpense(request.body, expenseId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("updateExpense", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async deleteExpense(request: Request, response: Response, next: NextFunction) {
    try {
      let expenseId: any = request.query.expenseId;
      ExpenseService.deleteExpense(expenseId,  (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("deleteExpense", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async getAllExpenseOfUser(request: Request, response: Response, next: NextFunction) {
    try {
      let userId: any = request.query.userId;
      ExpenseService.getAllExpenseOfUser(userId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("getAllExpenseOfUser", result, null, null, null, null));
        }
      });
    } catch (error) {
      console.log("getAllExpenseOfUser controller error:", error);
    }
  }

  public async getExpense(request: Request, response: Response, next: NextFunction) {

    try {
      let expenseId: any = request.query.expenseId;
      ExpenseService.getExpense(expenseId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("getAllExpenseOfUser", result, null, null, null, null));
        }
      });
    }
    catch(error){
      console.log("getExpense controller error:", error);
    }
  }

  public async getExpensesInDateRange(request: Request, response: Response, next: NextFunction){
    try {
      let userId:any = request.query.userId;
      ExpenseService.getExpensesInDateRange(request.body, userId, (err: any, result: any) => {
        if(err){
          return next(new HttpException(400,err));
        }
        else{
          return response.status(200).send(new HttpResponse("getExpensesInDateRange",result,null,null,null,null));
        }
    });

    } catch (error) {
      console.log("getExpensesController error",error);
    }
  }
}

export default new ExpenseController();