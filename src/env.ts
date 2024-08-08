import { z } from "zod";

import "dotenv/config";

const envType = z.object({
  CLIENT_ID: z.string().min(16),
  CLIENT_SECRET: z.string().length(32),

  BOT_TOKEN: z.string().min(50),
  BOT_PREFIX: z.string().optional().default("!"),

  DB_PORT: z.string().regex(/^mongodb\+srv:\/\/[^:]+:[^@]+@[^\\/]+\/\?[^\\/]+$/),
});

envType.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envType> {}
  }
}
