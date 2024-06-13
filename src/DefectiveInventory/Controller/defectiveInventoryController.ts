import { Request, Response } from 'express';
// import { addDefectiveItem, readDefectiveInventory } from '../Model/defectiveInventoryModel';
import { prisma } from '../../lib/db';
import { HttpStatus } from '../../lib/httpStatusCodes';

export async function createDefectiveInventory(req: Request, res: Response) {

    // const itemName: string = req.body.itemName.toLowerCase();
    const itemName: string = req.body.itemName;
    const employeeName: string = req.body.employeeName;
    // const employeeName: string = req.body.employeeName.toLowerCase();
    const quantity: number = req.body.quantity;
    const location: string = req.body.location;

    console.log("WORKING IN DEFECTIVE INVENTORY")
    console.log(itemName)

    try {
        console.log("STEP 1")
        const item = await prisma.item.findUnique({
            where: {
                unique_location_itemName: {
                    itemName: itemName,
                    location: location
                }
            }
        });
        if (!item) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg: "Item not found!"})
        }
        
        console.log("STEP 2")
        const employee = await prisma.employee.findUnique({
            where: {
                unique_location_name: {
                    name: employeeName,
                    location: location
                }
            }
        })
        if (!employee) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg: "Employee not found!"})
        }

        console.log("STEP 3")
        // Check if the item has the item is assigned to them, and as quantity greater than than assigned wuantity
        const itemAssigned = await prisma.assignedItem.findUnique({
            where: {
                unique_empId_itemID: {
                    empId: employee.empId,
                    itemId: item.itemId
                }
            }
        })
        if (!itemAssigned) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg: "Item not assigned to employee!"})
        }

        if ( quantity < itemAssigned.quantity ) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg: "Quantity being returned is more than the quantity assigned!"})
        }


        const response = await prisma.$transaction([
            prisma.defectiveItem.create({
                data: {
                    empId: employee.empId,
                    itemId: item.itemId,
                    quantity: quantity,
                    location: location
                }
            }),
            prisma.assignedItem.update({
                where: {
                    unique_empId_itemID: {
                        empId: employee.empId,
                        itemId: item.itemId
                    }
                },
                data: {
                    quantity: { decrement: quantity} 
                }
            })
        ])

        if (response) {
           return res.status(HttpStatus.CREATED).json({msg: "Defective Inventory Succesfully Added!"});
        }
    
    } catch (err ) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg: "Internal error!"});
    }

    
  
};

export async function getDefectiveInventory(req: Request, res: Response) {

    // // Return the deatils of the employee(Along with all the items assigned!)
    // if (req.params.location) {
    //     const location: string = req.params.location;

    //     const response = await readDefectiveInventory(location)
    //     res.status(response.code).send(response.data)
    // }
    // else {
    //     console.log("No location provided!")
    // }

};


