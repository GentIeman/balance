import {object, string, number} from "yup"

export const registerFormValidation = object({
    email: string().email("You must enter an email").required("Required"),
    username: string().min(4, "Must be at least 4 characters"),
    password: string().min(8, "Must be at least 8 characters"),
    salary: number().moreThan(1, "We can't get 0 dollars"),
    pensionYear: number().transform((value) => Number.isNaN(value) ? new Date().getFullYear() : value ).nullable().min(new Date().getFullYear(), "We can't go back in time").lessThan(new Date().getFullYear()+60, "Too far way")
})

export const loginFormValidation = object({
    email: string().email("You must enter an email").required("Required"),
    password: string().min(8, "Must be at least 8 characters"),
})