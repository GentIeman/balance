import {object, string, number} from "yup"

export const formValidationSchema = object({
    email: string().email("You must enter an email").required("Required"),
    username: string().required("Required").min(4, "Must be at least 4 characters"),
    password: string().required("Required").min(8, "Must be at least 8 characters"),
    salary: number().required("Required").moreThan(1, "We can't get 0 dollars"),
    pensionYear: number().min(new Date().getFullYear(), "We can't go back in time").lessThan(new Date().getFullYear()+60, "Too far way")
})