class Env {
    static SMTP_HOST = process.env.SMTP_HOST || null;
    static SMTP_PORT = process.env.SMTP_PORT || null;
    static SMPT_USER = process.env.SMTP_USER || null;
    static SMTP_PASSWORD = process.env.SMTP_PASSWORD || null;
    static SMTP_SECURE = process.env.SMTP_SECURE || null;
    static EMAIL_FROM = process.env.EMAIL_FROM || null;
    static SECRET_KEY = process.env.AUTH_SECRET || null;
    static APP_URL = process.env.APP_URL || null;
}

export default Env;
