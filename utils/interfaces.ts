export interface IUser {
    email: string,
    username?: string,
    password: string,
    salary?: number | null,
    pensionYear?: number | null
}

export interface IAuthState {
    user: IUser | object
    errors: IServerErrors | null,
}

export interface IServerErrors {
    name: string,
    message: string,
    status: number
}

export interface IAuthFormProps {
    state: IUser
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