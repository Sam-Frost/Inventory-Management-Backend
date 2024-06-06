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
exports.updateApprovalRequests = exports.createApprovalRequests = exports.getApprovalRequests = void 0;
const approvalModel_1 = require("../models/approvalModel");
function getApprovalRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Return deatils of all approval request of that location
        if (req.query.location) {
            const response = yield (0, approvalModel_1.readAllApprovalRequests)(req.query.location);
            res.status(response.code).send(response.data);
        }
        else {
            console.log("No location provided");
        }
    });
}
exports.getApprovalRequests = getApprovalRequests;
function createApprovalRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const empId = req.body.empId;
        const requestNumber = req.body.requestNumber;
        const items = req.body.items;
        const location = req.body.location;
        const response = yield (0, approvalModel_1.addApprovalRequest)(empId, items, requestNumber, location);
        res.status(response.code).send(response.data);
    });
}
exports.createApprovalRequests = createApprovalRequests;
function updateApprovalRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.updateApprovalRequests = updateApprovalRequests;
