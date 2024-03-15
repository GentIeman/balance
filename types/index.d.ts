declare global {
    interface IUser {
        id?: number
        email: string,
        username?: string,
        password: string,
        salary?: number,
        pensionYear?: number
    }

    interface ICategory {
        id: number,
        title: string,
        color: string,
        limit?: number | null
    }

    interface ICategoryLimit {
        id?: number,
        limit: number | null,
        category: {
            id: number
        }
    }

    interface IExpense {
        id?: number,
        amount: number,
        createdAt: string,
        categories: {
            id: number
        }
    }

    interface IChart {
        labels: string[];
        datasets: {
            label?: string;
            backgroundColor: string | string[];
            data: number[];
        }[];
    }

    interface IBarChartConfig {
        structure: {
            dateKey: string,
            contentKey: string
        },
        days?: number,
        months?: number,
        label: string,
        backgroundColor: string
    }

    interface IPieChartConfig {
        label: string,
        dataKey: string,
        colorKey: string
    }

    interface ISaving {
        title: string,
        totalAmount: number,
        currentAmount: number,
        endDate: string,
    }
}

export {}