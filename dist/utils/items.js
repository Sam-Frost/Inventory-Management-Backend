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
exports.checkItemQuantities = void 0;
const db_1 = require("../lib/db");
function checkItemQuantities(dbData) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of dbData) {
            const response = yield db_1.prisma.item.findUnique({
                select: { quantity: true },
                where: { itemId: row.itemId },
            });
            if (response) {
                const itemQuantity = response.quantity;
                if (row.quantity > itemQuantity) {
                    throw new Error('Insufficient quantity'); // More descriptive error
                }
            }
            console.log("forEach response printing");
            console.log(response);
        }
    });
}
exports.checkItemQuantities = checkItemQuantities;
/*
dbData.forEach(async (row) => {

            const response = await prisma.item.findUnique({
                select: {
                    quantity: true
                },
                where: {
                    itemId: row.itemId
                }
            });

            if (response) {
                const itemQuantity: number = response?.quantity;
                // The quantity trying to be assigned is more than the exisiting quantity
                if (row.quantity > itemQuantity) {
                    throw new Error;
                }
            }

            console.log("forEach response printing");
            console.log(response);


        })

*/ 
