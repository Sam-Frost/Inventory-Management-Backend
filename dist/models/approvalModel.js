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
exports.updateApprovalRequests = exports.readAllApprovalRequests = exports.addApprovalRequest = void 0;
const db_1 = require("../lib/db");
function addApprovalRequest(empId, items, requestNumber, location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let finalData = [];
            items.forEach((item) => {
                finalData.push({
                    empId,
                    itemId: item.itemId,
                    status: 'PENDING',
                    requestNumber,
                    quantity: item.quantity,
                    location
                });
            });
            console.log(finalData);
            const response = yield db_1.prisma.approval.createMany({
                data: finalData
            });
            console.log(response);
            return {
                code: 201,
                message: "Approval Request created successfully!",
                data: response
            };
        }
        catch (error) {
            return {
                code: 500,
                message: "Unknown database error!",
            };
        }
    });
}
exports.addApprovalRequest = addApprovalRequest;
// Need to add pagination
// Try to fix
function readAllApprovalRequests(location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let allEntries = [];
            const initialResponse = yield db_1.prisma.approval.findMany({
                orderBy: { createdAt: 'desc' }, // Sort by createdAt descending
                skip: 0, // Skip the first 0 entries (start from the beginning)
                take: 20, // Limit results to 20 entries
            });
            // Checking if more entires exist for the last request number   
            if (initialResponse.length > 0) {
                const lastRequestNumber = initialResponse[initialResponse.length - 1].requestNumber;
                const additionalEntries = yield db_1.prisma.approval.findMany({
                    where: { requestNumber: lastRequestNumber },
                    orderBy: { createdAt: 'desc' }, // Sort by createdAt descending within the group
                    skip: initialResponse.length, // Skip entries already retrieved
                });
                // Concatenate initial and additional entries (optional)
                allEntries = initialResponse.concat(additionalEntries);
            }
            const finalData = groupApprovalsByRequestNumber(allEntries);
            return {
                code: 200,
                data: finalData
            };
        }
        catch (error) {
            console.log("Error");
            return {
                code: 500,
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.readAllApprovalRequests = readAllApprovalRequests;
function updateApprovalRequests(approvalId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.approval.update({
                where: { approvalId },
                data: { status }
            });
            return {
                code: 200,
                data: response
            };
        }
        catch (error) {
            console.log("Error");
            return {
                code: 500,
                data: "Error occured while trying to update approval request!"
            };
        }
    });
}
exports.updateApprovalRequests = updateApprovalRequests;
