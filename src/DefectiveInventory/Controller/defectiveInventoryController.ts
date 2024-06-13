import { Request, Response } from 'express';
import { addDefectiveItem, readDefectiveInventory } from '../Model/defectiveInventoryModel';
import { readItemByName } from '../../Item/Model/itemModel';

export async function createDefectiveInventory(req: Request, res: Response) {

    const itemName: string = req.body.itemName.toLowerCase();
    const employeeName: string = req.body.employeeName.toLowerCase();
    const quantity: number = req.body.quantity;
    const location: string = req.body.location;

    try {

        const item = readItemByName(itemName, location)

        const response = await addDefectiveItem(itemId, empId, quantity, location);
        
        if (response) {
           return res.status(response.code).json(response);
        }
    
    } catch (err ) {
        
    }

    
  
};

export async function getDefectiveInventory(req: Request, res: Response) {

    // Return the deatils of the employee(Along with all the items assigned!)
    if (req.params.location) {
        const location: string = req.params.location;

        const response = await readDefectiveInventory(location)
        res.status(response.code).send(response.data)
    }
    else {
        console.log("No location provided!")
    }

};


