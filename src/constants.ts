import { config } from 'dotenv';
config();

const toBoolean = (value: string | undefined): boolean => value === 'true';

export const IS_COOKIE_SECURE = toBoolean(process.env.IS_COOKIE_SECURE);
// RTEt
