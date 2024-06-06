"use strict";
function groupApprovalsByRequestNumber(approvals) {
    const groupedApprovals = {};
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
