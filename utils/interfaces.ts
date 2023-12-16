export interface IUser {
    email: string,
    username?: string,
    password: string,
    salary?: number | null,
    pensionYear?: number | null
}

export interface IAuthState {
    errors: IServerErrors | null
}

export interface IServerErrors {
    name: string,
    message: string,
    status: number
}

export interface IAuthFormProps {
    state: IUser
}