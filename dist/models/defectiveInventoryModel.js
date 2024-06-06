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
exports.readDefectiveInventory = exports.addDefectiveItem = void 0;
const library_1 = require("@prisma/client/runtime/library");
const db_1 = require("../lib/db");
const assignedItemModel_1 = require("../AssignedItem/Model/assignedItemModel");
function addDefectiveItem(itemId, empId, quantity, location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // check if the items being returned is more than the item they have
            if (quantity <= 0) {
                return;
                // Have to return a quatity greatere than zero
            }
            // Get the current items that the person have
            const currentQuantity = yield (0, assignedItemModel_1.readAssignedItemQuantity)(itemId, empId);
            if (!currentQuantity.quantity) {
                return;
                // Couldn't find the assigned item in database
            }
            if (quantity > currentQuantity.quantity) {
                return;
                // The defective inventory being returned is more than the inventory assigned to the employee
            }
            const updatedQuantity = currentQuantity.quantity - quantity;
            const response = yield db_1.prisma.$transaction([
                db_1.prisma.defectiveItem.create({
                    data: {
                        itemId,
                        empId,
                        quantity,
                        location,
                    },
                }),
                db_1.prisma.assignedItem.update({
                    where: {
                        unique_empId_itemID: {
                            empId,
                            itemId,
                        },
                    },
                    data: {
                        quantity: updatedQuantity
                    },
                }),
            ]);
            return {
                code: 201,
                data: response,
            };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientValidationError) {
                return {
                    code: 400,
                    data: "Missing fields or Invalid Assignments",
                };
            }
            else {
                console.log(error);
                return {
                    code: 500,
                    data: "Unknown database error!",
                };
            }
        }
    });
}
exports.addDefectiveItem = addDefectiveItem;
function readDefectiveInventory(location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.defectiveItem.findMany({
                where: {
                    location: location,
                },
            });
            return {
                code: 200,
                data: response,
            };
        }
        catch (error) {
            return {
                code: 500,
                data: "Error occured while trying to read data!",
            };
        }
    });
}
exports.readDefectiveInventory = readDefectiveInventory;
