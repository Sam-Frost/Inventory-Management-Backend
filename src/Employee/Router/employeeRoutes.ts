import express from 'express';
import { createEmployee, getEmployee, getEmployeeForAssignment  } from '../Controller/employeeController';

const router = express.Router();

router.post('/create', createEmployee);
router.get('/', getEmployee);
router.get('/forAssignment', getEmployeeForAssignment);

export default router; 