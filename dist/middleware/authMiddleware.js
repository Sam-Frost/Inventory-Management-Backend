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
exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const authenticationService_1 = require("../Authentication/Service/authenticationService");
const authenticationModel_1 = require("../Authentication/Model/authenticationModel");
const httpStatusCodes_1 = require("../lib/httpStatusCodes");
const constants_1 = require("../constants");
const SECRET_KEY = 'this_is_my_temporariy_secret_key';
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Middleware Reached!");
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    console.log("Access Token from cookie: ", accessToken);
    console.log("Refresh Token from cookie: ", refreshToken);
    // Check if access token is present
    console.log("Checking if access token is present!");
    if (!accessToken) {
        console.log("Access token is not present");
        return res.status(401).json({ message: 'Access token is missing!' });
    }
    console.log("Access token present. Moving forward!");
    // Check access token signature and expiration
    try {
        // Access Token is valid, authorize
        console.log("Checking if token has valid signature and hasn't expired");
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        console.log("Access  Token is VALID & SIGNED");
        console.log("Moving out of middleware");
        console.log("---------------------------------");
        return next();
    }
    catch (error) {
        // If Access token expired, check refresh token
        if (!refreshToken) {
            return res.status(httpStatusCodes_1.HttpStatus.UNAUTHORIZED).json({ message: "Refresh Token Missing!" });
        }
        console.log("Access Token is expired! Starting to assign new tokens!");
        if (error instanceof jwt.TokenExpiredError) {
            try {
                console.log("Verifying the refesh token!");
                const decoded = jwt.verify(refreshToken, SECRET_KEY);
                console.log("Refresh token verified!");
                // Create and send a new set of tokens
                console.log("Starting to create new  refresh token");
                const response = yield refreshAccessToken(accessToken, refreshToken);
                console.log("Created new refresh token");
                if (response) {
                    res.cookie('accessToken', response.accessToken, { httpOnly: true, secure: constants_1.IS_COOKIE_SECURE, maxAge: 3600000, sameSite: 'none' });
                    res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: constants_1.IS_COOKIE_SECURE, maxAge: 3600000, sameSite: 'none' });
                    // return next();
                    // res.status(201).json({ msg: "Tokens refreshed"})
                    console.log("TOKENS HAVE BEEN SUCCESSSFULLY REFRESHED AND MOVING AHEAD WITH USERS REQUEST");
                    return next(); //FLAG
                }
            }
            catch (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    console.log("Refresh token is expired. TIME HAS PASSED");
                    return res.status(401).json({ message: 'Refresh Token Expired' });
                }
                else {
                    console.log("Refresh token is tampered with or bad signature");
                    return res.status(401).json({ message: 'Refresh Token Invalid' });
                }
            }
            console.log("REACHED THE FINAL NEXT");
            return next();
            // return res.status(401).json({ message: 'Access token has expired' });
        }
        else {
            console.log("Token is not expired, but has been tampered  with!");
            return res.status(401).json({ message: 'Invalid access token' });
        }
        console.log("REACHING HERE DUNNO WHY");
        return next();
    }
    console.log("ALSO REACHERD HERE !@!@@@");
    return next();
});
exports.authMiddleware = authMiddleware;
function refreshAccessToken(incommingAccessToken, incommingRefreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Refreshing access tooken!!");
        // Decode the tokens
        const decodedIncommingAccessToken = (0, authenticationService_1.decodeToken)(incommingAccessToken);
        const decodedIncommingRefreshToken = (0, authenticationService_1.decodeToken)(incommingRefreshToken);
        if (decodedIncommingAccessToken && decodedIncommingRefreshToken) {
            if (decodedIncommingAccessToken) {
                delete decodedIncommingAccessToken.iat;
                delete decodedIncommingAccessToken.exp;
            }
            if (decodedIncommingRefreshToken) {
                delete decodedIncommingRefreshToken.iat;
                delete decodedIncommingRefreshToken.exp;
            }
            const adminId = decodedIncommingRefreshToken.id;
            // Check if refresh token matches
            const response = yield (0, authenticationModel_1.getAdminRefreshToken)(adminId);
            if (!(typeof response.data === 'string') && response.data) {
                let oldRefreshToken = '';
                if (typeof response.data.refreshToken == 'string') {
                    oldRefreshToken = response.data.refreshToken;
                }
                // User is verified, send new tokess
                if (oldRefreshToken === incommingRefreshToken) {
                    // Save the new refresh token
                    const newAccessToken = (0, authenticationService_1.generateAccessToken)(decodedIncommingAccessToken);
                    const newRefreshToken = (0, authenticationService_1.generateRefreshToken)(decodedIncommingRefreshToken);
                    (0, authenticationModel_1.updateAdminRefreshToken)(adminId, newRefreshToken);
                    console.log("Access token refreshed in mi!!!");
                    return {
                        'accessToken': newAccessToken,
                        'refreshToken': newRefreshToken
                    };
                }
                else { //User is unverified, send error messag, invalid credentials
                    // res.json(401).send({msg: "Unauthorized"})
                }
            }
            // return res.status(401).json({ message: 'Invalid token' });
        }
    });
}
;
