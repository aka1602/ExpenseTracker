import { ExpenseCategory, IncomeCategory } from './enums';

export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);

export const INCOME_CATEGORIES = Object.values(IncomeCategory);

export const CATEGORY_COLORS = {
  [ExpenseCategory.FOOD_DINING]: "#FF6B6B",
  [ExpenseCategory.TRANSPORTATION]: "#4ECDC4",
  [ExpenseCategory.SHOPPING]: "#45B7D1",
  [ExpenseCategory.ENTERTAINMENT]: "#96CEB4",
  [ExpenseCategory.BILLS_UTILITIES]: "#FECA57",
  [ExpenseCategory.HEALTHCARE]: "#FF9FF3",
  [ExpenseCategory.EDUCATION]: "#54A0FF",
  [ExpenseCategory.TRAVEL]: "#5F27CD",
  [ExpenseCategory.GROCERIES]: "#00D2D3",
  [ExpenseCategory.PERSONAL_CARE]: "#FF9F43",
  [ExpenseCategory.HOME_GARDEN]: "#10AC84",
  [ExpenseCategory.INSURANCE]: "#EE5A24",
  [ExpenseCategory.GIFTS_DONATIONS]: "#0ABDE3",
  [ExpenseCategory.BUSINESS]: "#006BA6",
  [IncomeCategory.SALARY]: "#2ECC71",
  [IncomeCategory.FREELANCE]: "#3498DB",
  [IncomeCategory.INVESTMENT]: "#9B59B6",
  [IncomeCategory.RENTAL]: "#E67E22",
  [IncomeCategory.GIFT]: "#E74C3C",
  [IncomeCategory.BONUS]: "#F39C12",
  [IncomeCategory.REFUND]: "#1ABC9C",
  [ExpenseCategory.OTHER]: "#95A5A6",
  [IncomeCategory.OTHER]: "#95A5A6",
} as const;
