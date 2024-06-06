import { Request, Response } from 'express';
import { addEmployee, readEmployee, readAllEmployee, readEmployeeForAssignment } from '../Model/employeeModel'; 
import { passwordHasher } from '../../utils/passwordHasher';
import { HttpStatus } from '../../lib/httpStatusCodes';


// Employee phone number needs to be unique everyhwere, name can be repeated though


export async function createEmployee(req: Request, res: Response) {

    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const position = req.body.position;
    const password = await passwordHasher(req.body.password);
    const location = req.body.location;

    const response = await addEmployee(name, phoneNumber, position, password, location);

    if (response) {
        return res.status(response.code).json(response);
    }
  
};

export async function getEmployee(req: Request, res: Response) {

    // Return the deatils of the employee(Along with all the items assigned!)
    if (req.query.empId) {
        const response = await readEmployee(parseInt(req.query.empId as string))
        return res.status(response.code).send(response.data)
    }
    else {
        console.log("No Employee Id provided!")
    }

    // Return deatils of all employee of that location
    if (req.query.location) {
        const response = await readAllEmployee(req.query.location as string)
        return res.status(response.code).send(response.data)
    }
    else {
        console.log("No location provided")
    }

    // Add
    res.send(req.params.empId);
};


export async function getEmployeeForAssignment(req: Request, res: Response) {

    // Return deatils of all employee of that location
    if (req.query.location) {
        const response = await readEmployeeForAssignment(req.query.location as string)
        return res.status(response.code).send(response.data)
    }
    else {
        console.log("No location provided")
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({'msg': "ERRROROROR"})

    }

};


