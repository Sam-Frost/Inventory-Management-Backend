import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken"
import { AdminAccessTokenPayload, AdminRefreshTokenPayload, decodeToken, generateAccessToken, generateRefreshToken } from '../Authentication/Service/authenticationService';
import { getAdminRefreshToken, updateAdminRefreshToken } from '../Authentication/Model/authenticationModel';

import { Payload } from '../Authentication/Service/authenticationService'
import { HttpStatus } from '../lib/httpStatusCodes';


const SECRET_KEY = 'this_is_my_temporariy_secret_key'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    console.log("Middleware Reached!")

    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    console.log("Access Token from cookie: ", accessToken)
    console.log("Refresh Token from cookie: ", refreshToken)


    // Check if access token is present
    console.log("Checking if access token is present!")
    if (!accessToken) {
        console.log("Access token is not present") 
        return res.status(401).json({ message: 'Access token is missing!' });
    }
    console.log("Access token present. Moving forward!")


    // Check access token signature and expiration
    try {
        // Access Token is valid, authorize
        console.log("Checking if token has valid signature and hasn't expired")
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        console.log("Access  Token is VALID & SIGNED")
        console.log("Moving out of middleware")
        console.log("---------------------------------")
        return next();

    } catch (error) {


        // If Access token expired, check refresh token


        if (!refreshToken) {
            return res.status(HttpStatus.UNAUTHORIZED).json({message: "Refresh Token Missing!"})
        }
        
        console.log("Access Token is expired! Starting to assign new tokens!")
        if (error instanceof jwt.TokenExpiredError) {

            try {
                
                console.log("Verifying the refesh token!")             
                const decoded = jwt.verify(refreshToken, SECRET_KEY);
                console.log("Refresh token verified!")             

                // Create and send a new set of tokens
                console.log("Starting to create new  refresh token")             
                const response = await refreshAccessToken(accessToken, refreshToken)
                console.log("Created new refresh token")             


                if (response) {
                    res.cookie('accessToken', response.accessToken, { httpOnly: true, secure: false, maxAge: 3600000  });
                    res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: false, maxAge: 3600000  });
                    // return next();
                    // res.status(201).json({ msg: "Tokens refreshed"})
                    console.log("TOKENS HAVE BEEN SUCCESSSFULLY REFRESHED AND MOVING AHEAD WITH USERS REQUEST")
                    return next() //FLAG
                }

            } catch (err) {

                if (err instanceof jwt.TokenExpiredError) {
                    console.log("Refresh token is expired. TIME HAS PASSED")
                    return res.status(401).json({ message: 'Refresh Token Expired' });

                } else {
                    console.log("Refresh token is tampered with or bad signature")
                    return res.status(401).json({ message: 'Refresh Token Invalid' });

                }

            }
            
            console.log("REACHED THE FINAL NEXT")
            return next();
            // return res.status(401).json({ message: 'Access token has expired' });
        } else {
            console.log("Token is not expired, but has been tampered  with!")
            return res.status(401).json({ message: 'Invalid access token' });
        }

        console.log("REACHING HERE DUNNO WHY")
        return next();

    }
    console.log("ALSO REACHERD HERE !@!@@@")
    return next();
};


async function refreshAccessToken(incommingAccessToken: string, incommingRefreshToken: string) {

    console.log("Refreshing access tooken!!")
    // Decode the tokens
    const decodedIncommingAccessToken: Payload | null = decodeToken(incommingAccessToken)
    const decodedIncommingRefreshToken: Payload | null = decodeToken(incommingRefreshToken)

    if (decodedIncommingAccessToken && decodedIncommingRefreshToken) {
        if (decodedIncommingAccessToken) {
            delete decodedIncommingAccessToken.iat
            delete decodedIncommingAccessToken.exp
        }

        if (decodedIncommingRefreshToken) {
            delete decodedIncommingRefreshToken.iat
            delete decodedIncommingRefreshToken.exp
        }

        const adminId: number = decodedIncommingRefreshToken.id
        // Check if refresh token matches
        const response = await getAdminRefreshToken(adminId)
        if (!(typeof response.data === 'string') && response.data) {
            let oldRefreshToken: string = ''
            if (typeof response.data.refreshToken == 'string') {
                oldRefreshToken = response.data.refreshToken
            }

            // User is verified, send new tokess
            if (oldRefreshToken === incommingRefreshToken) {

                // Save the new refresh token
                const newAccessToken: string = generateAccessToken(decodedIncommingAccessToken as AdminAccessTokenPayload)
                const newRefreshToken: string = generateRefreshToken(decodedIncommingRefreshToken as AdminRefreshTokenPayload)

                updateAdminRefreshToken(adminId, newRefreshToken)
                console.log("Access token refreshed in mi!!!")
                
                return {
                    'accessToken': newAccessToken,
                    'refreshToken': newRefreshToken
                }


            } else { //User is unverified, send error messag, invalid credentials
                // res.json(401).send({msg: "Unauthorized"})
            }
        }
        // return res.status(401).json({ message: 'Invalid token' });
    }
};