import { Request, Response } from 'express';

import { readUniqueItem, readItems, addItem, updateItemQuantity, assignItemsToEmployee } from '../Model/itemModel';
import { HttpStatus } from '../../lib/httpStatusCodes';

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
    if ( quantityToAdd <= 0 ) {
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
    
    const empId: number = req.body.empId
    const items: Items  = req.body.items
    const location: string =  req.body.location
    
    const response = await assignItemsToEmployee(empId, items, location);
    
    return res.status(response.code).json(response)
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
