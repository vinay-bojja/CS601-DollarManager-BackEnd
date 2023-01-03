import { Request, Response, NextFunction } from "express";
import { HttpException, HttpResponse } from "../../../../../commons/utils";
import GroupExpenseService from "../../../../modules/groupExpenseModule/groupExpense.service";

class GroupExpenseController {

  public async createGroup(request: Request, response: Response, next: NextFunction) {
    try {
      let body = request.body;
      GroupExpenseService.createGroup(body, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("createGroup", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  // udpateGroupExpense
  public async udpateGroup(request: Request, response: Response, next: NextFunction) {
    try {
      let body = request.body;
      let id = request.query.id;
      GroupExpenseService.updateGroup(body, id, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("udpateGroup", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async getGroup(request: Request, response: Response, next: NextFunction) {
    try {
      let query = request.query;
      GroupExpenseService.getGroup(query, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("getGroup", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async createGroupExpenseDetails(request: Request, response: Response, next: NextFunction) {
    try {
      let body = request.body;
      GroupExpenseService.createGroupExpenseDetails(body, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("createGroupExpenseDetail", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async getGroupExpenseDetail(request: Request, response: Response, next: NextFunction) {
    try {
      let groupId = request.query.groupId;
      GroupExpenseService.getGroupExpenseDetail(groupId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("groupExpenseDetailsId", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async getUserPendingApprovalExpense(request: Request, response: Response, next: NextFunction) {
    try {
      let groupId = request.query.userId;
      GroupExpenseService.getUserPendingApprovalExpense(groupId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("getUserPendingApprovalExpense", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async updateGroupExpenseDetail(request: Request, response: Response, next: NextFunction) {
    try {
      let groupExpenseDetailsId = request.query.groupExpenseDetailsId;
      let isApproved = request.query.isApproved;
      let body = request.body;
      GroupExpenseService.updateGroupExpenseDetail(groupExpenseDetailsId, body, isApproved, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("updateGroupExpenseDetail", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  public async getBalance(request: Request, response: Response, next: NextFunction) {
    try {
      let groupId = request.query.groupId;
      GroupExpenseService.getBalance(groupId, (err: any, result: any) => {
        if (err) {
          return next(new HttpException(400, err));
        }
        else {
          return response.status(200).send(new HttpResponse("getBalance", result, null, null, null, null));
        }
      })

    } catch (error) {
      console.log(error);
    }
  }
}

export default new GroupExpenseController();