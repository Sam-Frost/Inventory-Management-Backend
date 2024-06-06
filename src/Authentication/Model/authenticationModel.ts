import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { prisma } from '../../lib/db';
import { generateRefreshToken } from '../Service/authenticationService';
import { HttpStatus } from '../../lib/httpStatusCodes';
import { DatabaseResponse } from '../../utils/databaseResponse';

export interface adminModel {
    id: number,     
    username: string, 
    password: string,
    location: string,
    name: string,
    refreshToken?: string | null
}

export function isAdminModel(obj: any): obj is adminModel {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.username === 'string' &&
        typeof obj.password === 'string' &&
        typeof obj.location === 'string' &&
        typeof obj.name === 'string' &&
        (obj.refreshToken === undefined || obj.refreshToken === null || typeof obj.refreshToken === 'string')
    );
}

export async function readAdmin(username: string, password: string): Promise<DatabaseResponse<adminModel>> {
    console.log("Startind database reading admin process")
    try {
        const response = await prisma.admin.findUnique({
            where: {
                username,
                password
            }
        });
    console.log("Admin  read from database and being returned!")

        // If  user is found
        if (response) {
            return {
                code: HttpStatus.OK,
                data: response
            }
        } else {
            // User not found
            return {
                code: HttpStatus.UNAUTHORIZED,
                data: {message: "User not found"}
            }
        }
        
    } catch (error) {
    console.log("Error occuerds in  reading admin from the database")

        return {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            data: {message: "Error occured while trying to read data!"}
        };
    }
}

export async function createAdmin(username: string, password: string, location: string, name: string) {
    try {

        const response = await prisma.$transaction(async (prisma) => {

            const newUser = await prisma.admin.create({
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
            }

            const refreshToken: string = generateRefreshToken(payload)


            const updatedUser = await prisma.admin.update({
                where: {
                  id: newUser.id
                },
                data: {
                    refreshToken
                }
              });
            
              return {refreshToken, updatedUser}
        })
    

        return {
            code: 200,
            data: response
        };
    // TODO : Modify to return error message if user already exists
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        };
    }
}

export async function getAdminRefreshToken(id: number) {
    try {
        const response = await prisma.admin.findUnique({
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
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        };
    }
}

export async function updateAdminRefreshToken(id: number, refreshToken: string,) {
    try {
        const response = await prisma.admin.update({
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
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        };
    }
}
