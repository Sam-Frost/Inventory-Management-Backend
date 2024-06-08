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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as jwt from 'jsonwebtoken';
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const itemRoutes_1 = __importDefault(require("./Item/Router/itemRoutes"));
const employeeRoutes_1 = __importDefault(require("./Employee/Router/employeeRoutes"));
const approvalRoutes_1 = __importDefault(require("./Approvals/Router/approvalRoutes"));
const defectiveInventoryRoutes_1 = __importDefault(require("./DefectiveInventory/Router/defectiveInventoryRoutes"));
const assignedItemsRoutes_1 = __importDefault(require("./AssignedItem/Router/assignedItemsRoutes"));
const authenticationRouter_1 = __importDefault(require("./Authentication/Router/authenticationRouter"));
const db_1 = require("./lib/db");
const cors_1 = __importDefault(require("cors"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const PORT = 3000;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    // origin: '*',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/auth', authenticationRouter_1.default);
app.use('/employee', authMiddleware_1.authMiddleware, employeeRoutes_1.default);
app.use('/item', authMiddleware_1.authMiddleware, itemRoutes_1.default);
app.use('/approval', authMiddleware_1.authMiddleware, approvalRoutes_1.default);
app.use('/defective', authMiddleware_1.authMiddleware, defectiveInventoryRoutes_1.default);
app.use('/assignedItem', authMiddleware_1.authMiddleware, assignedItemsRoutes_1.default);
// app.get('/', authMiddleware,  function (req: Request, res: Response) {
app.get('/', function (req, res) {
    // const token: string = generateAccessToken({id: 1,
    //     username: "sam", 
    //     location: "gugaon",
    //     name: "samrto"
    // })
    // const token = req.headers.authorization?.split(' ')[1]; // Extract token from authorization header
    // if (!token) {
    //     return res.status(401).send('Unauthorized'); // Handle missing token
    // }
    // const response: boolean = isTokenSignatureValid(token)
    // const tokenData = decodeToken(token)
    // console.log("Printing decoded token data")
    // console.log(tokenData)
    // res.json({ response });
    // res.json({token})
    // asda asdas s asdasd 
    // UPDATED CODE BRUH TRIGERING NOW FROM THE GITGHUB
    res.json({ msg: "All good" });
});
app.get('/delete', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield db_1.prisma.admin.deleteMany({});
        res.json(response);
    });
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
