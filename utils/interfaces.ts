export interface IUser {
    email: string,
    username: string,
    password: string,
    salary: number,
    pensionYear?: number | null
}