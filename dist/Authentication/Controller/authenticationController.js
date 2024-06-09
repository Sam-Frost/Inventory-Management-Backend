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
exports.userLogout = exports.userAuthenticated = exports.adminRegister = exports.adminLogin = void 0;
const authenticationModel_1 = require("../Model/authenticationModel");
const authenticationService_1 = require("../Service/authenticationService");
const httpStatusCodes_1 = require("../../lib/httpStatusCodes");
const constants_1 = require("../../constants");
function adminLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Login route hit!");
        const username = req.body.username;
        const password = req.body.password;
        console.log("Reading user from database!");
        const response = yield (0, authenticationModel_1.readAdmin)(username, password);
        if (response.code == 200) {
            console.log("Printing response");
            console.log(response);
            if ((0, authenticationModel_1.isAdminModel)(response.data)) {
                const id = response.data.id;
                const username = response.data.username;
                const location = response.data.location;
                const name = response.data.name;
                const accessTokenPayload = {
                    id,
                    username,
                    location,
                    name
                };
                const refreshTokenPayload = {
                    id
                };
                const accessToken = (0, authenticationService_1.generateAccessToken)(accessTokenPayload);
                const refreshToken = (0, authenticationService_1.generateRefreshToken)(refreshTokenPayload);
                yield (0, authenticationModel_1.updateAdminRefreshToken)(id, refreshToken);
                res.cookie('accessToken', accessToken, { httpOnly: true, secure: constants_1.IS_COOKIE_SECURE, maxAge: 3600000, sameSite: 'none' });
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: constants_1.IS_COOKIE_SECURE, maxAge: 3600000, sameSite: 'none' });
                res.status(response.code).json(accessTokenPayload);
            }
            else {
            }
        }
        else {
            console.log("Hitting inner bock!");
            console.log(response.data);
            res.status(response.code).json(response.data);
        }
    });
}
exports.adminLogin = adminLogin;
;
function adminRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retrieving data from request body
        const username = req.body.username;
        const password = req.body.password;
        const location = req.body.location;
        const name = req.body.name;
        console.log("All values are recieved");
        // Creating user in database(User deatils + refresh token)
        const response = yield (0, authenticationModel_1.createAdmin)(username, password, location, name);
        console.log("User created in database");
        if (response.data && !(typeof response.data == 'string')) {
            const refreshToken = response.data.refreshToken;
            const user = response.data.updatedUser;
            const payload = {
                id: user.id,
                username: user.username,
                location: user.location,
                name: user.name
            };
            const accessToken = (0, authenticationService_1.generateAccessToken)(payload);
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: constants_1.IS_COOKIE_SECURE, maxAge: 3600000, sameSite: 'none' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: constants_1.IS_COOKIE_SECURE, maxAge: 3600000, sameSite: 'none' });
            res.status(response.code).json(payload);
        }
    });
}
exports.adminRegister = adminRegister;
;
function userAuthenticated(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).send({ message: 'Tokens have been refreshed' });
    });
}
exports.userAuthenticated = userAuthenticated;
;
function userLogout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie('refreshToken', { path: '/', httpOnly: true, secure: constants_1.IS_COOKIE_SECURE });
        res.clearCookie('accessToken', { path: '/', httpOnly: true, secure: constants_1.IS_COOKIE_SECURE });
        res.status(httpStatusCodes_1.HttpStatus.OK).send({ message: 'User logged out!' });
    });
}
exports.userLogout = userLogout;
;
// export async function refreshAccessToken(req: Request, res: Response) {
//     // Access tokens
//     const incommingAccessToken = req.cookies.authToken;
//     const incommingRefreshToken = req.cookies.authToken;
//     // Decode the tokens
//     const decodedIncommingAccessToken: Payload | null = decodeToken(incommingAccessToken)
//     const decodedIncommingRefreshToken: Payload | null = decodeToken(incommingRefreshToken)
//     if (decodedIncommingAccessToken) {
//         delete decodedIncommingAccessToken.iat
//         delete decodedIncommingAccessToken.exp
//     }
//     if (decodedIncommingRefreshToken) {
//         delete decodedIncommingRefreshToken.iat
//         delete decodedIncommingRefreshToken.exp
//     }
//     const adminId: number = decodedIncommingRefreshToken.id
//     // Check if resresh token matches
//     const response = await getAdminRefreshToken(adminId) 
//     if ( !(typeof response.data === 'string') && response.data) {
//         let oldRefreshToken: string = ''
//         if ( typeof response.data.refreshToken == 'string' ) {
//              oldRefreshToken = response.data.refreshToken
//         }
//     // User is verified, send new tokess
//     if ( oldRefreshToken === incommingRefreshToken){
//         // Save the new refresh token
//         const newAccessToken: string = generateAccessToken(decodedIncommingAccessToken)
//         const newRefreshToken: string = generateRefreshToken(decodedIncommingRefreshToken)
//         updateAdminRefreshToken(adminId ,newRefreshToken)
//         // Send to the user as cookie access and  refresh token
//         res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
//         res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
//     } else { //User is unverified, send error messag, invalid credentials
//         res.json(401).send({msg: "Unauthorized"})
//     }
//     }
//     return res.status(401).json({ message: 'Invalid token' });
// };
