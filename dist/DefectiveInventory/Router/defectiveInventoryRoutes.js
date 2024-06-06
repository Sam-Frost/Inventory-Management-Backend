"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const defectiveInventoryController_1 = require("../Controller/defectiveInventoryController");
const router = express_1.default.Router();
router.get('/:location', defectiveInventoryController_1.getDefectiveInventory);
router.post('/create', defectiveInventoryController_1.createDefectiveInventory);
exports.default = router;
