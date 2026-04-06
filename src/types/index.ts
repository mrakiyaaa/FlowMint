export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  theme: "dark" | "light";
}

export interface SalaryIncome {
  id: string;
  user_id: string;
  amount: number;
  month: number;
  year: number;
  tag: string;
}

export interface OtherIncome {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  date: string;
  month: number;
  year: number;
}

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  date: string;
  month: number;
  year: number;
  tag: string;
}

export interface Saving {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  source: string;
}

export interface Automation {
  id: string;
  user_id: string;
  label: string;
  action_type: "Save" | "Expense";
  amount: number;
  trigger_month: number;
  from_source: "Salary" | "Other Income";
  target: string;
  is_active: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
