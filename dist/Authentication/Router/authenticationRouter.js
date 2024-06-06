"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationController_1 = require("../Controller/authenticationController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/login', authenticationController_1.adminLogin);
router.post('/register', authenticationController_1.adminRegister);
router.get('/isAuthenticated', authMiddleware_1.authMiddleware, authenticationController_1.userAuthenticated);
router.get('/logout', authenticationController_1.userLogout);
// router.get('/refreshAccessToken', refreshAccessToken);
exports.default = router;
