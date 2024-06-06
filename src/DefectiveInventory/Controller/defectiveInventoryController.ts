import { Request, Response } from 'express';
import { addDefectiveItem, readDefectiveInventory } from '../Model/defectiveInventoryModel';

export async function createDefectiveInventory(req: Request, res: Response) {

    const itemId: number = req.body.itemId;
    const empId: number = req.body.empId;
    const quantity: number = req.body.quantity;
    const location: string = req.body.location;

    const response = await addDefectiveItem(itemId, empId, quantity, location);

    if (response) {
        res.status(response.code).json(response);
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


