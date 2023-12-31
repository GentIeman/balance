export interface IUser {
    email: string,
    username?: string,
    password: string,
    salary?: number,
    pensionYear?: number
}

export interface IAuthState {
    user: IUser | object
}

export interface IHeader {
    title: string,
    subtitle?: string
}

export interface ICategory {
    id: number | 0,
    title: string,
    budgetLimit: number,
    expenses?: object[]
}

export interface ICategoryFormProps {
    category: ICategory
}

export interface IDeleteCategory {
    category: ICategory
}

export interface IExpense {
    id: number | 0,
    amount: number,
    createdAt?: string,
    localeDate?: string,
    categoryId: number,
}

export interface IExpenseFormProps {
    expense: IExpense
}

export interface IDeleteExpense {
    expense: IExpense
}

export interface ITableProps {
    payload: object[],
    pageCount: number,
    columns: object[]
}

export interface IChart {
    labels: string[];
    datasets: {
        label?: string;
        backgroundColor: string;
        data: number[];
    }[];
}

export interface IBarChartConfig {
    structure: {
        date: string,
        content: string
    },
    days: number,
    chartLabel?: string,
    backgroundColor?: string
}

export interface IPieChartConfig {
    label: string,
    dataKey: string,
    colorKey: string
}

export interface IGoal {
    id: number | 0,
    title: string,
    totalAmount: number,
    currentAmount?: number,
    endDate: string,
    history?: object[]
}

export interface IGoalFormProps {
    goal: IGoal,
    userSalary?: number
}

export interface IDeleteGoal {
    goal: ICategory
}