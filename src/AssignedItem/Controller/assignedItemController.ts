import { Request, Response } from 'express';

import { readItemsAssignedToEmployee } from '../Model/assignedItemModel';
import { HttpStatus } from '../../lib/httpStatusCodes';

export async function getAssignedItems(req: Request, res: Response) {

    const empId: number = Number(req.params.empId);
    const response = await readItemsAssignedToEmployee(empId);
    res.status(HttpStatus.CREATED).json(response);

};