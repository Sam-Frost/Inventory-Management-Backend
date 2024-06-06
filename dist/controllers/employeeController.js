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
exports.getEmployee = exports.createEmployee = void 0;
const employeeModel_1 = require("../models/employeeModel");
const passwordHasher_1 = require("../utils/passwordHasher");
// Employee phone number needs to be unique everyhwere, name can be repeated though
function createEmployee(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = req.body.name;
        const phoneNumber = req.body.phoneNumber;
        const position = req.body.position;
        const password = yield (0, passwordHasher_1.passwordHasher)(req.body.password);
        const location = req.body.location;
        const response = yield (0, employeeModel_1.addEmployee)(name, phoneNumber, position, password, location);
        if (response) {
            res.status(response.code).json(response);
        }
    });
}
exports.createEmployee = createEmployee;
;
function getEmployee(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Return the deatils of the employee(Along with all the items assigned!)
        if (req.query.empId) {
            const response = yield (0, employeeModel_1.readEmployee)(parseInt(req.query.empId));
            res.status(response.code).send(response.data);
        }
        else {
            console.log("No Employee Id provided!");
        }
        // Return deatils of all employee of that location
        if (req.query.location) {
            const response = yield (0, employeeModel_1.readAllEmployee)(req.query.location);
            res.status(response.code).send(response.data);
        }
        else {
            console.log("No location provided");
        }
        // Add
        res.send(req.params.empId);
    });
}
exports.getEmployee = getEmployee;
;
