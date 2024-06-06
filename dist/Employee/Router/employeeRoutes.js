"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../Controller/employeeController");
const router = express_1.default.Router();
router.post('/create', employeeController_1.createEmployee);
router.get('/', employeeController_1.getEmployee);
router.get('/forAssignment', employeeController_1.getEmployeeForAssignment);
exports.default = router;
