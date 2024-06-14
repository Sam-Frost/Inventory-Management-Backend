import { prisma } from '../../lib/db';

export async function readUniqueItem(itemId: number) {
    try {
        const response = await prisma.item.findUnique({
            where: {
                itemId: itemId
            }
        });
        return {
            code: 200,
            data: response
        };
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        };
    }
}

export async function readItemByName(itemName: string, location: string) {
    try {
        const response = await prisma.item.findUnique({
            where: {
                unique_location_itemName: {
                    itemName: itemName,
                    location: location
                }
            }
        });
        return {
            code: 200,
            data: response
        };
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        };
    }
}

export async function readItems(location: string) {
    try {
        const response = await prisma.item.findMany({
            where: {
                location: location
            }
        });
        return {
            code: 200,
            data: response
        };
    } catch (error) {
        return {
            code: 500,
            data: "Error occured while trying to read data!"
        };
    }
}

export async function addItem(itemName: string, partNumber: string, location: string, quantity: number, price: number) {

    try {
        const response = await prisma.item.create({
            data: {
                itemName,
                partNumber,
                location,
                quantity,
                price
            }
        });

        return {
            code: 201,
            data: response
        };

    } catch (error) {


        console.log(error)
        return {
            code: 500,
            data: "Unknown database error!",
        };
    }
}

export async function updateItemQuantity(itemId: number, quantity: number) {

    try {
        const response = await prisma.item.update({
            where: {
                itemId: itemId
            },
            data: {
                quantity: quantity
            }
        });

        return {
            code: 201,
            data: response
        };

    } catch (error) {
        return {
            code: 500,
            data: "Error in updating",
        };
    }
}

export async function getItemQuantityById(itemId: number) {
    return await prisma.item.findUnique({
        select: { quantity: true },
        where: { itemId: itemId },
    });
}

export async function updateAssignedItemAndAvailableQuantity(row: { empId: number; itemId: number; quantity: number; location: string; }) {
    try {
        return await prisma.$transaction([
            // Increase the quantity of item assigned to the person
            prisma.assignedItem.update({
                data: {
                    quantity: {
                        increment: row.quantity
                    }
                },
                where: {
                    unique_empId_itemID: {
                        empId: row.empId,
                        itemId: row.itemId
                    }
                }
            }),
            // Decrease the quantity of item from total items
            prisma.item.update({
                data: {
                    quantity: {
                        decrement: row.quantity
                    }
                },
                where: {
                    itemId: row.itemId
                }
            })
        ])
    } catch (err) {
        return null
    }
    
    
}

export async function assignItemAndUpdateQuantity(row: { empId: number; itemId: number; quantity: number; location: string; }) {

    try {
        return await prisma.$transaction([
            prisma.assignedItem.create({
                data: row
            }),
            prisma.assignedItemRecord.create({
                data: row
            }),
            // Decrease the quantity of item from total items
            prisma.item.update({
                data: {
                    quantity: {
                        decrement: row.quantity
                    }
                },
                where: {
                    itemId: row.itemId
                }
            })

        ])
    } catch (err) {
        return null;
    }

}
/*
export async function assignItemsToEmployee(empId: number, items: Items, location: string) {

    try {
        console.log("Entering try block")

        let dbData: { empId: number; itemId: number; quantity: number; location: string; }[] = []

        items.forEach((item) => {
            dbData.push({
                empId,
                itemId: item.itemId,
                quantity: item.quantity,
                location
            })
        })

        // Check if all the items that we want to assign the quantities are less than what we have available
        await checkItemQuantities(dbData)
            .then(() => console.log('Quantities checked successfully'))
            .catch(error => console.error('Error checking quantities:', error));


        console.log(dbData)

        let status: boolean[] = [];
        let statusData: any[] = [];

        console.log("Starting Loop!")
        for (const row of dbData) {
            console.log("------ITERATION-----")
            let response = [];
            try {

                if (await checkAssignedItemExists(row.empId, row.itemId)) {
                    console.log("Item is already assigned!")
                    console.log(row)
                    response = await prisma.$transaction([
                        // Increase the quantity of item assigned to the person
                        prisma.assignedItem.update({
                            data: {
                                quantity: {
                                    increment: row.quantity
                                }
                            },
                            where: {
                                unique_empId_itemID: {
                                    empId: row.empId,
                                    itemId: row.itemId
                                }
                            }
                        }),
                        // Decrease the quantity of item from total items
                        prisma.item.update({
                            data: {
                                quantity: {
                                    decrement: row.quantity
                                }
                            },
                            where: {
                                itemId: row.itemId
                            }
                        })
                    ])
                    console.log("Increased the quantiy")
                    console.log("Transaction compleated")

                } else {
                    console.log(`Assignment starting for itemId : ${row.empId}`)
                    console.log(row)

                    response = await prisma.$transaction([
                        prisma.assignedItem.create({
                            data: row
                        }),
                        prisma.assignedItemRecord.create({
                            data: row
                        }),
                        // Decrease the quantity of item from total items
                        prisma.item.update({
                            data: {
                                quantity: {
                                    decrement: row.quantity
                                }
                            },
                            where: {
                                itemId: row.itemId
                            }
                        })

                    ])
                    console.log(`Assignment completed for itemId : ${row.empId}`)
                    console.log("Transaction compleated")

                }


                console.log(response)
                statusData.push(response)
                status.push(true)


            } catch (error) {
                status.push(false)
            }

        }

        return {
            code: 201,
            data: status,
            finalData: statusData
        };

    } catch (error) {
        console.log("Entering error block")
        console.log(error)

        return {
            code: 500,
            data: "Unkown database error"
        }
    }
}

*/