import { User } from "./user";

export interface RegisterSuccessResponse {
    message: string;
    user:    User;
}



export interface LoginSuccessResponse {
    access_token: string;
    token_type:   string;
    expires_in:   number;
}

export interface LogoutSuccessResponse {
    message: string;
}

export interface AuthErrorResponse {
    error: string;
}


