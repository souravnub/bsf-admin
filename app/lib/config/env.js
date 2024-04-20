class Env {
    static SMTP_HOST = process.env.SMTP_HOST;
    static SMTP_PORT = process.env.SMTP_PORT;
    static SMTP_USER = process.env.SMTP_USER;
    static SMTP_PASSWORD = process.env.SMTP_PASSWORD;
    static SMTP_SECURE = process.env.SMTP_SECURE;
    static EMAIL_FROM = process.env.EMAIL_FROM;
    static SECRET_KEY = process.env.AUTH_SECRET;
    static APP_URL = process.env.APP_URL;

    static AWS_S3_REGION = process.env.AWS_S3_REGION;
    static AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    static AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
    static AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
}

export default Env;
