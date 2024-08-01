declare namespace NodeJS {
    interface ProcessEnv {
        CLIENT_ID: string,
        CLIENT_SECRET: string,

        BOT_TOKEN: string,
        BOT_PREFIX: string,

        DB_PORT: string
    }
};