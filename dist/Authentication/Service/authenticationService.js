"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.isTokenSignatureValid = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
let SECRET_KEY = "this_is_my_temporariy_secret_key";
function generateAccessToken(payload) {
    console.log("Generating access token");
    const token = jwt.sign(payload, SECRET_KEY, {
        // expiresIn: 300000,
        expiresIn: 9000000,
    });
    return token;
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(payload) {
    console.log("Generating refresh token");
    const token = jwt.sign(payload, SECRET_KEY, {
        // expiresIn: 900000,
        expiresIn: 9000000,
    });
    return token;
}
exports.generateRefreshToken = generateRefreshToken;
function isTokenSignatureValid(token) {
    // jwt.verify(token, SECRET_KEY, function (err, decoded) {
    //     if (err) {
    //         return false
    //     } else {
    //         return true
    //     }
    // });
    // return false;
    try {
        var decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isTokenSignatureValid = isTokenSignatureValid;
function decodeToken(token) {
    try {
        const decoded = jwt.decode(token);
        if (typeof decoded === 'string') {
            return null;
        }
        return decoded;
    }
    catch (error) {
        return null; // Handle decoding errors gracefully
    }
}
exports.decodeToken = decodeToken;
