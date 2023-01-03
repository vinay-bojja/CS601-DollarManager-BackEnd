import localConfig from "./env/local";

let effectiveConfig: {
    NAME: string,
    PORT: number | string,
    CORS_OPTIONS: any,
    MONGO_URL: string,
    BACKEND_URL: string,
    FRONTEND_URL: string,
    GOOGLE: any,
    Gmail_User:any,
    Gmail_Password: any
} = localConfig;


export default effectiveConfig;

