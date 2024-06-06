import { prisma } from '../../lib/db';

export async function addEmployee(name: string, phoneNumber: string, position: string, password: string, location: string) {

    try {
        const response = await prisma.employee.create({
            data: {
                name,
                phoneNumber,
                position,
                password,
                location
            }
        });

        return {
            code: 201,
            message: "Employee created successfully!",
            data: response
        };

    } catch (error) {
        console.log(error)
        return {
            code: 500,
            message: "Unknown database error!",
        };
    }
}


// TODO - Modify this function to also "return all the items assigned to the employee"
export async function readEmployee(empId: number) {

    try {
        const response = await prisma.employee.findMany(
            {
                select: {
                    empId: true,
                    name: true,
                    phoneNumber: true,
                    position: true
                },

                where: {
                    empId: empId
                },
            }
        )
        return {
            code: 200,
            data: response
        }
    } catch (error) {
        console.log("Error")
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        }
    }
}

export async function readAllEmployee(location: string) {

    try {
        const response = await prisma.employee.findMany(
            {
                select: {
                    empId: true,
                    name: true,
                    phoneNumber: true,
                    position: true
                },

                where: {
                    location: location
                }
            }
        )

        return {
            code: 200,
            data: response
        }
    } catch (error) {
        console.log("Error")
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        }
    }
}


export async function readEmployeeForAssignment(location: string) {

    try {
        const response = await prisma.employee.findMany(
            {
                select: {
                    empId: true,
                    name: true,
                },

                where: {
                    location: location
                }
            }
        )

        return {
            code: 200,
            data: response
        }
    } catch (error) {
        console.log("Error")
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        }
    }
}

