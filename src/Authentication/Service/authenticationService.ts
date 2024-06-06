import * as jwt from 'jsonwebtoken';

let SECRET_KEY: string = "this_is_my_temporariy_secret_key";
 
interface EmployeeAccessTokenPayload {
    userId: string;
    username: string;
    // Add other user data as needed
}

export interface AdminAccessTokenPayload {
    id: number,
    username: string,
    location: string,
    name: string,
}


export interface AdminRefreshTokenPayload {
    id: number,
}

export function generateAccessToken(payload: AdminAccessTokenPayload | EmployeeAccessTokenPayload) {
    
    console.log("Generating access token")
    const token = jwt.sign(payload, SECRET_KEY, {
        // expiresIn: 300000,
        expiresIn: 9000000,
    });

    return token;

}

export function generateRefreshToken(payload: AdminRefreshTokenPayload) {

    console.log("Generating refresh token")
    const token = jwt.sign(payload, SECRET_KEY, {
        // expiresIn: 900000,
        expiresIn: 9000000,
    });

    return token;

}


export function isTokenSignatureValid(token: string): boolean {

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
        console.log(decoded)
        return true
    }   catch(err){
        return false
    }
}


export interface Payload extends jwt.JwtPayload {
    id: number,
    username?: string,
    location?: string,
    name?: string
}


export function decodeToken(token: string) {
    try {
        const decoded = jwt.decode(token);
        if (typeof decoded === 'string') {
            return null;
          }
        return decoded as Payload;
    } catch (error) {
        return null; // Handle decoding errors gracefully
    }

}
