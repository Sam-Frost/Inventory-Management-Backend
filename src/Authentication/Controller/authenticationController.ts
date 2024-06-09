import { Request, Response } from 'express';
import { createAdmin, getAdminRefreshToken, isAdminModel, readAdmin, updateAdminRefreshToken } from '../Model/authenticationModel';
import { decodeToken, generateAccessToken, generateRefreshToken } from '../Service/authenticationService';
import { Payload } from '../Service/authenticationService'
import * as jwt from 'jsonwebtoken'
import { HttpStatus } from '../../lib/httpStatusCodes';
import { IS_COOKIE_SECURE } from '../../constants';

export async function adminLogin(req: Request, res: Response) {
    console.log("Login route hit!")

    const username: string = req.body.username;
    const password: string = req.body.password;


    console.log("Reading user from database!")
    const response = await readAdmin(username, password)


    if (response.code == 200) {

        console.log("Printing response")
        console.log(response)

        if (isAdminModel(response.data)) {

            const id: number = response.data.id;
            const username: string = response.data.username;
            const location: string = response.data.location;
            const name: string = response.data.name;

            const accessTokenPayload = {
                id,
                username,
                location,
                name
            }
            const refreshTokenPayload = {
                id
            }

            const accessToken: string = generateAccessToken(accessTokenPayload)
            const refreshToken: string = generateRefreshToken(refreshTokenPayload)

            await updateAdminRefreshToken(id, refreshToken)

            res.cookie('accessToken', accessToken, { httpOnly: true, secure: IS_COOKIE_SECURE, maxAge: 3600000  });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: IS_COOKIE_SECURE, maxAge: 3600000 });
            res.status(response.code).json(accessTokenPayload);

        } else {
          

        }

    } else {
        console.log("Hitting inner bock!")
        console.log(response.data)
        res.status(response.code).json(response.data);
    }

};

export async function adminRegister(req: Request, res: Response) {

    // Retrieving data from request body
    const username: string = req.body.username;
    const password: string = req.body.password;
    const location: string = req.body.location;
    const name: string = req.body.name;

    console.log("All values are recieved")

    // Creating user in database(User deatils + refresh token)
    const response = await createAdmin(username, password, location, name)

    console.log("User created in database")


    if (response.data && !(typeof response.data == 'string'))
        {
            const refreshToken = response.data.refreshToken
            const user = response.data.updatedUser;

            const payload = {
                id: user.id,
                username: user.username,
                location: user.location,
                name: user.name
            }

            const accessToken = generateAccessToken(payload);  

            res.cookie('accessToken', accessToken, { httpOnly: true, secure: IS_COOKIE_SECURE, maxAge: 3600000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: IS_COOKIE_SECURE, maxAge: 3600000  });
      
            res.status(response.code).json(payload);
        
        }
};

export async function userAuthenticated(req: Request, res: Response) {
    res.status(200).send({message: 'Tokens have been refreshed'})

};


export async function userLogout(req: Request, res: Response) {
    res.clearCookie('refreshToken', { path: '/', httpOnly: true, secure: IS_COOKIE_SECURE });
    res.clearCookie('accessToken', { path: '/', httpOnly: true, secure: IS_COOKIE_SECURE });
    res.status(HttpStatus.OK).send({message: 'User logged out!'})

};




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