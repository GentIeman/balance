export const categoriesTableColumns = [
    {
        key: "title",
        label: "Title",
        sortable: true
    },
    {
        key: "budgetLimit",
        label: "Budget limit",
        sortable: true
    },
    {
        key: "localeDate",
        label: "Date creation",
        sortable: true
    },
    {
        key: "actions"
    }
]

export const expensesTableColumns = [
    {
        key: "amount",
        label: "Amount",
        sortable: true
    },
    {
        key: "category",
        label: "Category",
        sortable: true
    },
    {
        key: "localeDate",
        label: "Date",
        sortable: true
    },
    {
        key: "actions"
    }
]

export const categoriesStatusTableColumns = [
    {
        key: "title",
        label: "Title",
        sortable: true
    },
    {
        key: "budgetLimit",
        label: "Budget limit",
        sortable: true
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
    }
]

export const totalExpensesColumns = [
    {
        key: "category",
        label: "Category",
        sortable: true
    },
    {
        key: "expenses",
        label: "Total Expenses",
        sortable: true
    }
]

export const expectedExpensesColumns = [
    {
        key: "category",
        label: "Category",
        sortable: true
    },
    {
        key: "currentExpenses",
        label: "Current expenses",
        sortable: true
    },
    {
        key: "expectedExpenses", label: "Expected expenses", sortable: true
    }
]
