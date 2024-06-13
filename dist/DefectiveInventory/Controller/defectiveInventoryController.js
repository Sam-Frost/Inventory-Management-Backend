"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefectiveInventory = exports.createDefectiveInventory = void 0;
const defectiveInventoryModel_1 = require("../Model/defectiveInventoryModel");
const itemModel_1 = require("../../Item/Model/itemModel");
function createDefectiveInventory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemName = req.body.itemName.toLowerCase();
        const employeeName = req.body.employeeName.toLowerCase();
        const quantity = req.body.quantity;
        const location = req.body.location;
        try {
            const item = (0, itemModel_1.readItemByName)(itemName, location);
            const response = yield (0, defectiveInventoryModel_1.addDefectiveItem)(itemId, empId, quantity, location);
            if (response) {
                return res.status(response.code).json(response);
            }
        }
        catch (err) {
        }
    });
}
exports.createDefectiveInventory = createDefectiveInventory;
;
function getDefectiveInventory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Return the deatils of the employee(Along with all the items assigned!)
        if (req.params.location) {
            const location = req.params.location;
            const response = yield (0, defectiveInventoryModel_1.readDefectiveInventory)(location);
            res.status(response.code).send(response.data);
        }
        else {
            console.log("No location provided!");
        }
    });
}
exports.getDefectiveInventory = getDefectiveInventory;
;
