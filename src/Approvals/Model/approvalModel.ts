import { Approval } from '@prisma/client';
import { prisma } from '../../lib/db';

export async function addApprovalRequest(empId: number, items: {itemId: number, quantity: number}[], requestNumber: string, location: string) {

    try {
        let finalData: {empId: number, itemId: number, status: string, requestNumber: string, quantity: number, location: string}[] = [];

        items.forEach((item) => {
            finalData.push({
                empId,
                itemId: item.itemId,
                status: 'PENDING',
                requestNumber,
                quantity: item.quantity,
                location
            })
        })

        console.log(finalData)

        const response = await prisma.approval.createMany({
            data: finalData
          });

        console.log(response)
        
        return {
            code: 201,
            message: "Approval Request created successfully!",
            data : response
        };

    } catch (error) {

        return {
            code: 500,
            message: "Unknown database error!",
        };

    }   
}


// Need to add pagination
// Try to fix
export async function readAllApprovalRequests(location: string): Promise<{ code: number, data : string | { requestNumber: string; approvals: { approvalId: number; createdAt: Date; empId: number; itemId: number; status: string; quantity: number; location: string; }[]; }[]}> {
    
    try {

        let allEntries: Approval[] = [];

        const initialResponse = await prisma.approval.findMany({
            orderBy: { createdAt: 'desc' }, // Sort by createdAt descending
            skip: 0, // Skip the first 0 entries (start from the beginning)
            take: 20, // Limit results to 20 entries
          })

            // Checking if more entires exist for the last request number   
          if (initialResponse.length > 0) {
            const lastRequestNumber = initialResponse[initialResponse.length - 1].requestNumber;
            
            const additionalEntries = await prisma.approval.findMany({
              where: { requestNumber: lastRequestNumber },
              orderBy: { createdAt: 'desc' }, // Sort by createdAt descending within the group
              skip: initialResponse.length, // Skip entries already retrieved
            });
          
            // Concatenate initial and additional entries (optional)
            allEntries = initialResponse.concat(additionalEntries);
          } 
          
        const finalData = groupApprovalsByRequestNumber(allEntries);
        return {
            code: 200,
            data : finalData
        }

    } catch (error) {
        console.log("Error")
        return {
            code: 500,
            data : "Error occured while trying to read data!"
        }
    }
}


export async function updateApprovalRequests(approvalId: number, status: string) {
    
    try {
        const response = await prisma.approval.update(
            {
                where: { approvalId },
                data: { status }
            }
        )
    
        return {
            code: 200,
            data : response
        }
    } catch (error) {
        console.log("Error")
        return {
            code: 500,
            data : "Error occured while trying to update approval request!"
        }
    }
}