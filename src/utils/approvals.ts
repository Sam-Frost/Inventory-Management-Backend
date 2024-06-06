function groupApprovalsByRequestNumber(
  approvals: {
    approvalId: number;
    createdAt: Date;
    empId: number;
    itemId: number;
    status: string;
    requestNumber: string;
    quantity: number;
    location: string;
  }[]
): {
  requestNumber: string;
  approvals: {
    approvalId: number;
    createdAt: Date;
    empId: number;
    itemId: number;
    status: string;
    quantity: number;
    location: string;
  }[];
}[] {
  const groupedApprovals: {
    [key: string]: {
      requestNumber: string;
      approvals: {
        approvalId: number;
        createdAt: Date;
        empId: number;
        itemId: number;
        status: string;
        quantity: number;
        location: string;
      }[];
    };
  } = {};

  for (const approval of approvals) {
    const key = approval.requestNumber;
    groupedApprovals[key] = groupedApprovals[key] || {
      requestNumber: key,
      approvals: [],
    };
    groupedApprovals[key].approvals.push(approval);
  }

  return Object.values(groupedApprovals); // Convert object to array of arrays
}
