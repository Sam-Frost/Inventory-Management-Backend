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
exports.updateAdminRefreshToken = exports.getAdminRefreshToken = exports.createAdmin = exports.readAdmin = exports.isAdminModel = void 0;
const db_1 = require("../../lib/db");
const authenticationService_1 = require("../Service/authenticationService");
const httpStatusCodes_1 = require("../../lib/httpStatusCodes");
function isAdminModel(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.username === 'string' &&
        typeof obj.password === 'string' &&
        typeof obj.location === 'string' &&
        typeof obj.name === 'string' &&
        (obj.refreshToken === undefined || obj.refreshToken === null || typeof obj.refreshToken === 'string'));
}
exports.isAdminModel = isAdminModel;
function readAdmin(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Startind database reading admin process");
        try {
            const response = yield db_1.prisma.admin.findUnique({
                where: {
                    username,
                    password
                }
            });
            console.log("Admin  read from database and being returned!");
            // If  user is found
            if (response) {
                return {
                    code: httpStatusCodes_1.HttpStatus.OK,
                    data: response
                };
            }
            else {
                // User not found
                return {
                    code: httpStatusCodes_1.HttpStatus.UNAUTHORIZED,
                    data: { message: "User not found" }
                };
            }
        }
        catch (error) {
            console.log("Error occuerds in  reading admin from the database. NOW PRITING ERROR");
            console.log(error);
            return {
                code: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
                data: { message: "Error occured while trying to read data!" }
            };
        }
    });
}
exports.readAdmin = readAdmin;
function createAdmin(username, password, location, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                const newUser = yield prisma.admin.create({
                    data: {
                        username,
                        password,
                        location,
                        name,
                    }
                });
                const payload = {
                    id: newUser.id,
                    username,
                    location,
                    name
                };
                const refreshToken = (0, authenticationService_1.generateRefreshToken)(payload);
                const updatedUser = yield prisma.admin.update({
                    where: {
                        id: newUser.id
                    },
                    data: {
                        refreshToken
                    }
                });
                return { refreshToken, updatedUser };
            }));
            return {
                code: 200,
                data: response
            };
            // TODO : Modify to return error message if user already exists
        }
        catch (error) {
            return {
                code: 500,
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.createAdmin = createAdmin;
function getAdminRefreshToken(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.admin.findUnique({
                where: {
                    id
                },
                select: {
                    refreshToken: true
                }
            });
            return {
                code: 200,
                data: response
            };
            // TODO : Modify to return error message if user already exists
        }
        catch (error) {
            return {
                code: 500,
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.getAdminRefreshToken = getAdminRefreshToken;
function updateAdminRefreshToken(id, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db_1.prisma.admin.update({
                where: {
                    id
                },
                data: {
                    refreshToken
                }
            });
            return {
                code: 200,
                data: response
            };
            // TODO : Modify to return error message if user already exists
        }
        catch (error) {
            return {
                code: 500,
                data: "Error occured while trying to read data!"
            };
        }
    });
}
exports.updateAdminRefreshToken = updateAdminRefreshToken;
