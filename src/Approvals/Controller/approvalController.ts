import { Request, Response } from "express";
import { readAllApprovalRequests, addApprovalRequest } from "../Model/approvalModel";

export async function getApprovalRequests(req: Request, res: Response) {

    // Return deatils of all approval request of that location
    if (req.query.location) {
        const response = await readAllApprovalRequests(req.query.location as string)
        res.status(response.code).send(response.data)
    }
    else {
        console.log("No location provided")
    }

}

export async function createApprovalRequests(req: Request, res: Response) {

    const empId: number = req.body.empId;
    const requestNumber: string = req.body.requestNumber;
    const items: {itemId: number, quantity: number}[] = req.body.items;
    const location: string = req.body.location;

    const response = await addApprovalRequest(empId, items, requestNumber, location);

    res.status(response.code).send(response.data)
    

}

export async function updateApprovalRequests(req: Request, res: Response) {

}

