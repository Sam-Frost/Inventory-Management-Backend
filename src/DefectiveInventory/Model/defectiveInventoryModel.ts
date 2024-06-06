import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { prisma } from "../../lib/db";
import { readAssignedItemQuantity } from "../../AssignedItem/Model/assignedItemModel";


export async function addDefectiveItem(
    itemId: number,
    empId: number,
    quantity: number,
    location: string
) {
    try {
        // check if the items being returned is more than the item they have
        if (quantity <= 0) {
            return;
            // Have to return a quatity greatere than zero
        }

        // Get the current items that the person have
        const currentQuantity = await readAssignedItemQuantity(itemId, empId);

        if (!currentQuantity.quantity) {
            return
            // Couldn't find the assigned item in database
        }

        if (quantity > currentQuantity.quantity) {
            return
            // The defective inventory being returned is more than the inventory assigned to the employee
        }

        const updatedQuantity = currentQuantity.quantity - quantity;

        const response = await prisma.$transaction([
            prisma.defectiveItem.create({
                data: {
                    itemId,
                    empId,
                    quantity,
                    location,
                },
            }),
            prisma.assignedItem.update({
                where: {
                    unique_empId_itemID: {
                        empId,
                        itemId,
                    },
                },
                data: {
                    quantity: updatedQuantity
                },
            }),
        ]);

        return {
            code: 201,
            data: response,
        };
    } catch (error) {
        if (error instanceof PrismaClientValidationError) {
            return {
                code: 400,
                data: "Missing fields or Invalid Assignments",
            };
        } else {
            console.log(error);
            return {
                code: 500,
                data: "Unknown database error!",
            };
        }
    }
}

export async function readDefectiveInventory(location: string) {
    try {
        const response = await prisma.defectiveItem.findMany({
            where: {
                location: location,
            },
        });
        return {
            code: 200,
            data: response,
        };
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!",
        };
    }
}
