import { Router } from "express";

import UserRoutes from "./authModule/auth.router";
import ExpenseRoutes from "./expenseModule/expense.router";
import groupExpenseController from "./groupExpenseModule/groupExpense.router";

const router = Router();

router.use("/auth", UserRoutes);
router.use("/expense", ExpenseRoutes);
router.use("/groupExpenses", groupExpenseController);

export default router;

