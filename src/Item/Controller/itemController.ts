import { Request, Response } from 'express';

import { readUniqueItem, readItems, addItem, updateItemQuantity, getItemQuantityById, updateAssignedItemAndAvailableQuantity, assignItemAndUpdateQuantity } from '../Model/itemModel';
import { HttpStatus } from '../../lib/httpStatusCodes';
import { checkIfAssignedItemExists } from '../../AssignedItem/Model/assignedItemModel';

export async function getItems(req: Request, res: Response) {

    console.log("Middleware has done its thinf!!")
    const location: string = req.params.location;
    const response = await readItems(location);
    console.log("Item data has been read from database")
    return res.status(response.code).json(response.data);

};

export async function createItem(req: Request, res: Response) {

    // Create the entry of item in the database
    const itemName: string = req.body.itemName;
    const partNumber: string = req.body.partNumber;
    const location: string = req.body.location; // THIS FIELD NEEDS TO BE FILLED FROM SESSION, NOT JSON
    const quantity: number = req.body.quantity;
    const price: number = req.body.price;

    const response = await addItem(itemName, partNumber, location, quantity, price);
    if (response) {
        return res.status(response.code).json(response.data);
    }
};

export async function putItem(req: Request, res: Response) {

    // Access the request body
    const itemId: number = req.body.itemId;
    const quantityToAdd: number = req.body.quantity;

    // Check for -ve quantity values
    if (quantityToAdd <= 0) {
        return res.status(400).json({
            message: "Atleast increase the quantity by 1."
        })
    }
    else {

        // 1. Get the current quantity of the item
        const readResponse = await readUniqueItem(itemId);

        let currentItemQuantiy: number = 0;

        if (readResponse.data && typeof readResponse.data !== 'string') {
            currentItemQuantiy = readResponse.data.quantity;
        }

        // 2. Increase the current quanttiy of the item
        const updatedItemQuantity: number = currentItemQuantiy + quantityToAdd;

        // 3. Update the quantity in the database
        const updateResponse = await updateItemQuantity(itemId, updatedItemQuantity);

        return res.status(updateResponse.code).json(updateResponse.data)
    }
};

export async function assignItems(req: Request, res: Response) {

    console.log("++++++++++++++++++++++++++++++++++++++++++++++")
    const empId: number = req.body.empId
    const items: Items = req.body.items
    const location: string = req.body.location


    // Coverting request data to database table format
    let dbData: { empId: number; itemId: number; quantity: number; location: string; }[] = []
    items.forEach((item) => {
        dbData.push({
            empId,
            itemId: item.itemId,
            quantity: item.quantity,
            location
        })
    })

    console.log("Print dbData")
    console.log(dbData)

    
    console.log("Check if all the items that we want to assign the quantities are less than what we have available")

    // Check if all the items that we want to assign the quantities are less than what we have available
    for (const row of dbData) {
        const availableItemQuantityResponse = await getItemQuantityById(row.itemId);
        if (availableItemQuantityResponse) {
            const availableItemQuantity = availableItemQuantityResponse.quantity;
            if (row.quantity > availableItemQuantity) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Quantity being assigned is more then the available quantity." })
            }
        }
    }
    console.log("DONE")


    let status: boolean[] = [];
    let statusData: any[] = [];

    console.log("Starting Loop!")
    for (const row of dbData) {
        console.log("------ITERATION-----")
        let response: any[] | null = [];
        // try {

            // console.log("INSIDE TRY BLOCK")
            if (await checkIfAssignedItemExists(row.empId, row.itemId)) {
                console.log("Item is already assigned!")
                response = await updateAssignedItemAndAvailableQuantity(row);
                console.log(`updateAssignedItemAndAvailableQuantity: ${response}`)
                if (!response) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg:"PARTIL ASIGNMENT ERROR!"})
                }
                console.log("Increased the quantiy")

            } else {
                console.log(`Assignment starting for itemId : ${row.empId}`)
                response = await assignItemAndUpdateQuantity(row);
                console.log(`assignItemAndUpdateQuantity: ${response}`)
                if (!response) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg:"PARTIL ASIGNMENT ERROR!"})
                }
                console.log(`Assignment completed for itemId : ${row.empId}`)
            }

            console.log(response)
            const stat = response ? true : false;
            status.push(stat) 
            statusData.push(response)

        // } catch (error) {
        //     console.log("ERROR OCCURED")
        //     console.log(error)
        //     status.push(false)
        // }
        console.log("------ITERATION ++ END  -----")

        
    }

    // let operationSuccessful = true;

    // Check if all the assignemnets operations were sucess!
    // status.forEach((stats) => {
    //     if (!stats) {
    //         operationSuccessful = stats;
    //     }
    // })

    // Rollback if there are partial faliures!

    console.log("SENDING RESPONSE TO FRONTEND")
    return res.status(HttpStatus.OK).json({msg:"Items assigned Successfully!"})
}



interface assignItemsRequest {
    empId: number,
    items: [{
        itemId: number,
        quantity: number
    }],
    location: string
}

export type Items = [{
    itemId: number,
    quantity: number
}]
