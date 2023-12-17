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