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

export async function checkIfAssignedItemExists( empId: number, itemId: number ): Promise<boolean> {
    console.log("Checking if assignment exits")
    try {

    const existingItem = await prisma.assignedItem.findUnique({
        where: { unique_empId_itemID: {
          empId: empId,
          itemId: itemId
        } },
      });
    
      return !!existingItem; // Convert response to boolean (truthy for existing row)
    } catch (err) {
        return false
    }
  }
  