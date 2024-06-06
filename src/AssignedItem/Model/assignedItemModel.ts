import { prisma } from "../../lib/db";

export async function readAssignedItemQuantity(itemId: number, empId: number): Promise<any>{
    try {
        const response = await prisma.assignedItem.findFirst({
            select: {
                quantity: true
            },
            where : {
                itemId,
                empId
            }
        });

       return response

    } catch (error) {
        return error
    }
}

export async function readItemsAssignedToEmployee(empId: number) {
    try {
        const response = await prisma.assignedItem.findMany({
            where : {
                empId
            }
         
        }   
        )

        return response
        
    } catch (err) {
        return err;
    }
}

export async function checkAssignedItemExists( empId: number, itemId: number ): Promise<boolean> {
    console.log("Checking if assignment exits")
    const existingItem = await prisma.assignedItem.findFirst({
      where: { empId, itemId },
    });
  
    return !!existingItem; // Convert response to boolean (truthy for existing row)
  }
  