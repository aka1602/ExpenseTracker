export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum StorageKeys {
  TRANSACTIONS = "@expense_tracker_transactions",
  THEME = "@expense_tracker_theme",
}

export enum ExpenseCategory {
  FOOD_DINING = "Food & Dining",
  TRANSPORTATION = "Transportation",
  SHOPPING = "Shopping",
  ENTERTAINMENT = "Entertainment",
  BILLS_UTILITIES = "Bills & Utilities",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  TRAVEL = "Travel",
  GROCERIES = "Groceries",
  PERSONAL_CARE = "Personal Care",
  HOME_GARDEN = "Home & Garden",
  INSURANCE = "Insurance",
  GIFTS_DONATIONS = "Gifts & Donations",
  BUSINESS = "Business",
  OTHER = "Other",
}

export enum IncomeCategory {
  SALARY = "Salary",
  FREELANCE = "Freelance",
  BUSINESS = "Business",
  INVESTMENT = "Investment",
  RENTAL = "Rental",
  GIFT = "Gift",
  BONUS = "Bonus",
  REFUND = "Refund",
  OTHER = "Other",
}

export enum Messages {
  TRANSACTION_ADDED = "Transaction added successfully",
  TRANSACTION_UPDATED = "Transaction updated successfully",
  TRANSACTION_DELETED = "Transaction deleted successfully",
  FAILED_ADD = "Failed to add transaction",
  FAILED_UPDATE = "Failed to update transaction",
  FAILED_DELETE = "Failed to delete transaction",
}