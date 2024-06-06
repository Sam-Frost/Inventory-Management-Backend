import express from 'express';
import { createDefectiveInventory, getDefectiveInventory } from '../Controller/defectiveInventoryController';

const router = express.Router();

router.get('/:location', getDefectiveInventory);
router.post('/create', createDefectiveInventory);


export default router;