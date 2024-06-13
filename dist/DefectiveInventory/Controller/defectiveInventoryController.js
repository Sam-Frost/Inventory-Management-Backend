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
// import { addDefectiveItem, readDefectiveInventory } from '../Model/defectiveInventoryModel';
const db_1 = require("../../lib/db");
const httpStatusCodes_1 = require("../../lib/httpStatusCodes");
function createDefectiveInventory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // const itemName: string = req.body.itemName.toLowerCase();
        const itemName = req.body.itemName;
        const employeeName = req.body.employeeName;
        // const employeeName: string = req.body.employeeName.toLowerCase();
        const quantity = req.body.quantity;
        const location = req.body.location;
        console.log("WORKING IN DEFECTIVE INVENTORY");
        console.log(itemName);
        try {
            console.log("STEP 1");
            const item = yield db_1.prisma.item.findUnique({
                where: {
                    unique_location_itemName: {
                        itemName: itemName,
                        location: location
                    }
                }
            });
            if (!item) {
                return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Item not found!" });
            }
            console.log("STEP 2");
            const employee = yield db_1.prisma.employee.findUnique({
                where: {
                    unique_location_name: {
                        name: employeeName,
                        location: location
                    }
                }
            });
            if (!employee) {
                return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Employee not found!" });
            }
            console.log("STEP 3");
            // Check if the item has the item is assigned to them, and as quantity greater than than assigned wuantity
            const itemAssigned = yield db_1.prisma.assignedItem.findUnique({
                where: {
                    unique_empId_itemID: {
                        empId: employee.empId,
                        itemId: item.itemId
                    }
                }
            });
            if (!itemAssigned) {
                return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Item not assigned to employee!" });
            }
            if (quantity < itemAssigned.quantity) {
                return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Quantity being returned is more than the quantity assigned!" });
            }
            const response = yield db_1.prisma.$transaction([
                db_1.prisma.defectiveItem.create({
                    data: {
                        empId: employee.empId,
                        itemId: item.itemId,
                        quantity: quantity,
                        location: location
                    }
                }),
                db_1.prisma.assignedItem.update({
                    where: {
                        unique_empId_itemID: {
                            empId: employee.empId,
                            itemId: item.itemId
                        }
                    },
                    data: {
                        quantity: { decrement: quantity }
                    }
                })
            ]);
            if (response) {
                return res.status(httpStatusCodes_1.HttpStatus.CREATED).json({ msg: "Defective Inventory Succesfully Added!" });
            }
        }
        catch (err) {
            return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Internal error!" });
        }
    });
}
exports.createDefectiveInventory = createDefectiveInventory;
;
function getDefectiveInventory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // // Return the deatils of the employee(Along with all the items assigned!)
        // if (req.params.location) {
        //     const location: string = req.params.location;
        //     const response = await readDefectiveInventory(location)
        //     res.status(response.code).send(response.data)
        // }
        // else {
        //     console.log("No location provided!")
        // }
    });
}
exports.getDefectiveInventory = getDefectiveInventory;
;
