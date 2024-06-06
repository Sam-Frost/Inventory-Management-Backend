"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const approvalController_1 = require("../Controller/approvalController");
const router = express_1.default.Router();
router.get('/:location', approvalController_1.getApprovalRequests);
router.post('/create', approvalController_1.createApprovalRequests);
router.post('/update', approvalController_1.updateApprovalRequests);
exports.default = router;
