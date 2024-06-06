import express from 'express';

import { getAssignedItems } from '../Controller/assignedItemController'

const router = express.Router();

router.get('/:empId', getAssignedItems);


export default router;