export interface NameI {
  firstName: string;
  lastName: string;
  otherName?: string;
}
// default value for createdAt && date

// accepted time intervals
export enum AcceptTiming {
  "HOURLY" = "hourly",
  "DAILY" = "daily",
  "WEEKLY" = "weekly",
  "BIWEEKLY" = "biweekly",
  "MONTHLY" = "monthly",
  "QUATERLY" = "quarterly",
  "BIANNUALLY" = "biannually",
  "ANNUALLY" = "annually",
  "CUSTOM" = "custom",
}

export interface DurationI {
  start?: string | Date;
  end?: string | Date;
}

// accepted time transaction types
export enum AcceptTransactionType {
  "EXPENSES" = "expenses",
  "INCOME" = "income",
  "SAVINGS" = "savings",
}

// reoccuring transactions (income) structure
export interface reOccurence {
  status: boolean;
  timing: AcceptTiming;
  description: string;
}

// user data structure
export interface UserI {
  email: string;
  id?: string;
  password?: string;
  password_confirm?: string;
  name: NameI;
  displayName: string;
  phoneNumber: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// labels (income, expenses, savings, budgets) structure
export interface LabelsI {
  id: string;
  name: string;
  category: AcceptTransactionType;
  description: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// transactions structure
export interface TransactionI {
  id: string;
  type: AcceptTransactionType;
  labelIds: string[];
  userId: string;
  details: {
    from?: string;
    to?: string;
    date: string;
    description: string;
  };
  amount: string;
  currency: string;
  createdAt?: string | Date;
}

// income streams structure
export interface IncomeStreamI {
  id: string;
  LabelId: string;
  userId: string;
  reOccurence: reOccurence;
  amount: string;
  currency: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// budget details structure
export interface BudgetDetailsI {
  type: AcceptTransactionType;
  LabelId: string;
  amount: string;
  currency: string;
}

// budget structure
export interface BudgetI {
  id?: string;
  LabelIds?: string[];
  userId: string;
  duration: DurationI;
  items: BudgetDetailsI[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// savings structure
export interface SavingsI {
  id?: string;
  LabelIds?: string[];
  userId: string;
  planTitle: string;
  duration: DurationI;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// session structure
export interface SessionI {
  id?: string;
  client: string;
  token: string;
  expired: boolean;
  userId: string;
  expiresAt?: string | Date;
  createdAt?: string | Date;
  updateAt: string | Date;
}

export interface AuthI {
  id?: string;
  userId: string;
  createdAt?: string | Date;
  updateAt: string | Date;
  lastSeen: {
    sessionId: string;
    seenAt?: string | Date;
  }[];
}
