import type { SalaryIncome, OtherIncome, Expense, Saving } from "@/types";

export function sumSalary(items: SalaryIncome[]): number {
  return items.reduce((sum, i) => sum + i.amount, 0);
}

export function sumOtherIncome(items: OtherIncome[]): number {
  return items.reduce((sum, i) => sum + i.amount, 0);
}

export function sumExpenses(items: Expense[]): number {
  return items.reduce((sum, i) => sum + i.amount, 0);
}

export function sumSavings(items: Saving[]): number {
  return items.reduce((sum, i) => sum + i.amount, 0);
}

export function calculateRemaining(
  totalSalary: number,
  totalOtherIncome: number,
  totalExpenses: number,
  totalSavings: number
): number {
  return totalSalary + totalOtherIncome - totalExpenses - totalSavings;
}
