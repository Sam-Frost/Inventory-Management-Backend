"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemController_1 = require("../Controller/itemController");
const router = express_1.default.Router();
router.get('/:location', itemController_1.getItems);
router.post('/create', itemController_1.createItem);
router.post('/update', itemController_1.putItem);
router.post('/assign', itemController_1.assignItems);
exports.default = router;
