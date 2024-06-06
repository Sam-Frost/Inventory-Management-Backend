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
exports.checkAssignedItemExists = exports.readItemsAssignedToEmployee = exports.readAssignedItemQuantity = void 0;
const db_1 = require("../lib/db");
function readAssignedItemQuantity(itemId, empId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.assignedItem.findFirst({
                select: {
                    quantity: true
                },
                where: {
                    itemId,
                    empId
                }
            });
            return response;
        }
        catch (error) {
            return error;
        }
    });
}
exports.readAssignedItemQuantity = readAssignedItemQuantity;
function readItemsAssignedToEmployee(empId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.assignedItem.findMany({
                where: {
                    empId
                }
            });
            return response;
        }
        catch (err) {
            return err;
        }
    });
}
exports.readItemsAssignedToEmployee = readItemsAssignedToEmployee;
function checkAssignedItemExists(empId, itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Checking if assignment exits");
        const existingItem = yield db_1.prisma.assignedItem.findFirst({
            where: { empId, itemId },
        });
        return !!existingItem; // Convert response to boolean (truthy for existing row)
    });
}
exports.checkAssignedItemExists = checkAssignedItemExists;
