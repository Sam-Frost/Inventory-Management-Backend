import express from 'express';

import { getItems, createItem, putItem, assignItems } from '../Controller/itemController'

const router = express.Router();

router.get('/:location', getItems);
router.post('/create', createItem);
router.post('/update', putItem);
router.post('/assign', assignItems);



export default router;