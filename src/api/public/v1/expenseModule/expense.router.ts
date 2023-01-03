import { Router } from "express";
import ExpenseController from "./expense.controller";

let router = Router();


router.post('/addExpense', ExpenseController.addExpense);

router.put('/updateExpense', ExpenseController.updateExpense);

router.delete('/deleteExpense', ExpenseController.deleteExpense);

router.get('/getAllExpenseOfUser', ExpenseController.getAllExpenseOfUser);

router.get('/getExpense', ExpenseController.getExpense);

router.post('/getExpensesInDateRange', ExpenseController.getExpensesInDateRange);

export default router;