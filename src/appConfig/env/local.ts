const config = {
    NAME: process.env.NAME || "DollarManager",
    MONGO_URL: process.env.MONGO_URL || "", //enter mongodb URL
    PORT: process.env.PORT || 5000,
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    Gmail_User: process.env.GMAIL_USER || "", //gmail
    Gmail_Password: process.env.GMAIL_PASSWORD || "", //gmail password
    GOOGLE: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "", //google clientId
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "" //google secretId
    },
    CORS_OPTIONS: {
        WHITELISTDOMAINS: [
            /.*/ //allow all domains (wildcard match *)
        ]
    },
};


export default config;
