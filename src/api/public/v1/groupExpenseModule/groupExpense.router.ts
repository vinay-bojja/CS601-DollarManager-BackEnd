import { Router } from "express";
import GroupExpenseController from "./groupExpense.controller";

let router = Router();


router.post('/createGroup', GroupExpenseController.createGroup);

router.put('/updateGroup', GroupExpenseController.udpateGroup);

router.get('/getGroup', GroupExpenseController.getGroup);

router.post('/createGroupExpenseDetail', GroupExpenseController.createGroupExpenseDetails);

router.get('/getGroupExpenseDetail', GroupExpenseController.getGroupExpenseDetail);

router.get('/getUserPendingApprovalExpense', GroupExpenseController.getUserPendingApprovalExpense);

router.put('/updateGroupExpenseDetail', GroupExpenseController.updateGroupExpenseDetail);

router.get('/getBalance',GroupExpenseController.getBalance);

export default router;