import { prisma } from "../lib/db";

export async function checkItemQuantities(dbData: { empId: number; itemId: number; quantity: number; location: string; }[]) {
    for (const row of dbData) {
      const response = await prisma.item.findUnique({
        select: { quantity: true },
        where: { itemId: row.itemId },
      });
  
      if (response) {
        const itemQuantity = response.quantity;
        if (row.quantity > itemQuantity) {
          throw new Error('Insufficient quantity'); // More descriptive error
        }
      }
  
      console.log("forEach response printing");
      console.log(response);
    }
  }

/*
dbData.forEach(async (row) => {

            const response = await prisma.item.findUnique({
                select: {
                    quantity: true
                },
                where: {
                    itemId: row.itemId
                }
            });

            if (response) {
                const itemQuantity: number = response?.quantity;
                // The quantity trying to be assigned is more than the exisiting quantity
                if (row.quantity > itemQuantity) {
                    throw new Error;
                }
            }

            console.log("forEach response printing");
            console.log(response);


        })

*/