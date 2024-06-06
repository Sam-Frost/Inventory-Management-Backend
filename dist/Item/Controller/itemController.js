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
exports.assignItems = exports.putItem = exports.createItem = exports.getItems = void 0;
const itemModel_1 = require("../Model/itemModel");
function getItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Middleware has done its thinf!!");
        const location = req.params.location;
        const response = yield (0, itemModel_1.readItems)(location);
        console.log("Item data has been read from database");
        return res.status(response.code).json(response.data);
    });
}
exports.getItems = getItems;
;
function createItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the entry of item in the database
        const itemName = req.body.itemName;
        const partNumber = req.body.partNumber;
        const location = req.body.location; // THIS FIELD NEEDS TO BE FILLED FROM SESSION, NOT JSON
        const quantity = req.body.quantity;
        const price = req.body.price;
        const response = yield (0, itemModel_1.addItem)(itemName, partNumber, location, quantity, price);
        if (response) {
            return res.status(response.code).json(response.data);
        }
    });
}
exports.createItem = createItem;
;
function putItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Access the request body
        const itemId = req.body.itemId;
        const quantityToAdd = req.body.quantity;
        // Check for -ve quantity values
        if (quantityToAdd <= 0) {
            return res.status(400).json({
                message: "Atleast increase the quantity by 1."
            });
        }
        else {
            // 1. Get the current quantity of the item
            const readResponse = yield (0, itemModel_1.readUniqueItem)(itemId);
            let currentItemQuantiy = 0;
            if (readResponse.data && typeof readResponse.data !== 'string') {
                currentItemQuantiy = readResponse.data.quantity;
            }
            // 2. Increase the current quanttiy of the item
            const updatedItemQuantity = currentItemQuantiy + quantityToAdd;
            // 3. Update the quantity in the database
            const updateResponse = yield (0, itemModel_1.updateItemQuantity)(itemId, updatedItemQuantity);
            return res.status(updateResponse.code).json(updateResponse.data);
        }
    });
}
exports.putItem = putItem;
;
function assignItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const empId = req.body.empId;
        const items = req.body.items;
        const location = req.body.location;
        const response = yield (0, itemModel_1.assignItemsToEmployee)(empId, items, location);
        return res.status(response.code).json(response);
    });
}
exports.assignItems = assignItems;
