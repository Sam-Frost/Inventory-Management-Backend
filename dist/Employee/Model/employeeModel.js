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
exports.readEmployeeForAssignment = exports.readAllEmployee = exports.readEmployee = exports.addEmployee = void 0;
const db_1 = require("../../lib/db");
function addEmployee(name, phoneNumber, position, password, location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.employee.create({
                data: {
                    name,
                    phoneNumber,
                    position,
                    password,
                    location
                }
            });
            return {
                code: 201,
                message: "Employee created successfully!",
                data: response
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: 500,
                message: "Unknown database error!",
            };
        }
    });
}
exports.addEmployee = addEmployee;
// TODO - Modify this function to also "return all the items assigned to the employee"
function readEmployee(empId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.employee.findMany({
                select: {
                    empId: true,
                    name: true,
                    phoneNumber: true,
                    position: true
                },
                where: {
                    empId: empId
                },
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
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.readEmployee = readEmployee;
function readAllEmployee(location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.employee.findMany({
                select: {
                    empId: true,
                    name: true,
                    phoneNumber: true,
                    position: true
                },
                where: {
                    location: location
                }
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
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.readAllEmployee = readAllEmployee;
function readEmployeeForAssignment(location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.employee.findMany({
                select: {
                    empId: true,
                    name: true,
                },
                where: {
                    location: location
                }
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
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.readEmployeeForAssignment = readEmployeeForAssignment;
