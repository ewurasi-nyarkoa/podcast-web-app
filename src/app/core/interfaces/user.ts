export interface User {
    id:    number;
    name:  string;
    email: string;
    role:  string;
}

export interface UserRegisterCredentials {
    name:                  string;
    email:                 string;
    password:              string;
    password_confirmation: string;
    role:                  string;

}



export interface UserLoginCredentials {
    email: string;
    password: string;
}