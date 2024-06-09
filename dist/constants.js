"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_COOKIE_SECURE = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const toBoolean = (value) => value === 'true';
exports.IS_COOKIE_SECURE = toBoolean(process.env.IS_COOKIE_SECURE);
// RTEt
