import {object, string, number, date} from "yup"

export const userRegistrationSchema = object().shape({
    email: string()
        .matches(/^[^;:<>/\\"`?!,+={}]*$/, "This email is invalid")
        .email("You must enter an email")
        .required("Required"),
    username: string()
        .matches(/^[a-zA-Z0-9_]*$/, "This username is invalid")
        .required("Username is required")
        .min(4, "Must be at least 4 characters")
        .max(30, "Maximum number of values"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Password is required"),
    salary: number()
        .transform((value) => Number.isNaN(value) ? null : value)
        .moreThan(99, "More than 99")
        .lessThan(999999, "Less than 999999")
        .required("Salary is required"),
    pensionYear: number()
        .transform((value) => Number.isNaN(value) ? new Date().getFullYear() : value)
        .nullable()
        .min(new Date().getFullYear(), "We can't go back in time")
        .lessThan(new Date().getFullYear()+60, "Too far way")
        .notRequired()
})

export const userLoginSchema = object().shape({
    email: string()
        .matches(/^[^;:<>/\\"`?!,+={}]*$/, "This email is invalid")
        .email("You must enter an email")
        .required("Required"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Password is required"),
})

export const categoryFormValidation = object({
    title: string().min(3, "Must be at least 3 characters").required("Required"),
    budgetLimit: number().transform((value) => Number.isNaN(value) ? null : value ).nullable().moreThan(9, "Not enough for the limit").max(9999999, "Can you do?").required("Required")
})

export const expenseFormValidation = object({
    category: string(),
    amount: number().transform((value) => Number.isNaN(value) ? null : value ).nullable().moreThan(1, "Upps...").max(99999999, "Do you have that much money?").required("Required")
})

export const goalFormValidation = object({
    title: string().min(3, "Must be at least 3 characters").required("Required"),
    currentAmount: number().transform((value) => Number.isNaN(value) ? null : value ).nullable().moreThan(1, "Upps...").max(99999999, "Do you have that much money?"),
    totalAmount: number().transform((value) => Number.isNaN(value) ? null : value ).nullable().moreThan(1, "Upps...").max(99999999, "Do you want how much money?").required("Required"),
    endDate: date().required("Required").min(new Date().toISOString().slice(0, 10), "Date is too early").max(new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().slice(0, 10), "Future").nullable().typeError("Invalid Date")
})