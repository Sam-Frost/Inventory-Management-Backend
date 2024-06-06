import express from 'express';
import { createApprovalRequests, getApprovalRequests, updateApprovalRequests } from '../Controller/approvalController';

const router = express.Router();

router.get('/:location', getApprovalRequests);
router.post('/create', createApprovalRequests);
router.post('/update', updateApprovalRequests);


export default router;