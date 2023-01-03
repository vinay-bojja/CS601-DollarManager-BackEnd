const config = {
    NAME: process.env.NAME || "DollarManager",
    MONGO_URL: process.env.MONGO_URL || "mongodb+srv://vinay:SideProject123@cluster0.hue9xxx.mongodb.net/?retryWrites=true&w=majority",
    PORT: process.env.PORT || 5000,
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    Gmail_User: process.env.GMAIL_USER || "vinay.bojja@viit.ac.in",
    Gmail_Password: process.env.GMAIL_PASSWORD || "abc@12345",
    GOOGLE: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "539808842398-vgv7qitl4p6i692ba6efkmmmggkl90vp.apps.googleusercontent.com",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "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"
    },
    CORS_OPTIONS: {
        WHITELISTDOMAINS: [
            /.*/ //allow all domains (wildcard match *)
        ]
    },
};


export default config;
