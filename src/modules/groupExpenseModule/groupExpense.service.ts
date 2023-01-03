
import { CrudOperations } from "../../../commons/utils";
import { Group } from "../../../commons/models/group.entity";
import { GroupExpenseDetail } from "../../../commons/models/groupExpenseDetail.entity";
import { User } from "../../../commons/models/user.entity";

class GroupExpenseService {

    public async createGroup(body: any, next: CallableFunction) {
        try {
            await new CrudOperations(Group).save(body);

            next(null, "Group created.")

        } catch (error) {
            console.log("createGroupExpense", error);
        }
    }

    public async updateGroup(body: any, id: any, next: CallableFunction) {
        try {
            if (body.userIds) {
                let oldGroupExpense = await new CrudOperations(Group).getDocument({ _id: id }, {});
                body.userIds = oldGroupExpense.userIds.concat(body.userIds);
            }
            let result = await new CrudOperations(Group).updateDocument({ _id: id }, body);
            if (result) {
                next(null, "Group udpated.");
            } else {
                next(null, "GroupId Not found.");
            }

        } catch (error) {
            console.log("updateGroupExpense", error);
        }
    }

    public async getGroup(query: any, next: CallableFunction) {
        try {
            let groupExpense = null;
            if (query.userId) {
                groupExpense = await new CrudOperations(Group).getAllDocuments({ userIds: query.userId }, {}, { pageNo: 0, limit: 0 });
            } else if (query.groupId) {
                groupExpense = await new CrudOperations(Group).getDocument({ _id: query.groupId }, {});

                if (groupExpense.userIds) {
                    for (let userId in groupExpense.userIds) {
                        let user = await new CrudOperations(User).getDocument({ _id: groupExpense.userIds[userId] }, {});
                        groupExpense.userIds[userId] = user;
                    }
                }
                let user = await new CrudOperations(User).getDocument({ _id: groupExpense.createdBy }, {});
                groupExpense = { ...groupExpense._doc, createdByDetail: user };
            }

            if (groupExpense) {
                next(null, groupExpense);
            } else {
                next(null, "No group Found.");
            }

        } catch (error) {
            console.log("Get Group", error);
        }
    }

    public async createGroupExpenseDetails(body: any, next: CallableFunction) {
        try {
            await new CrudOperations(GroupExpenseDetail).save(body);

            next(null, "Group expense created.")

        } catch (error) {
            console.log("createGroupExpense", error);
        }
    }

    public async getGroupExpenseDetail(groupId: any, next: CallableFunction) {
        try {
            let groupExpenseDetails = await new CrudOperations(GroupExpenseDetail).getAllDocuments({ groupId: groupId }, {}, { pageNo: 0, limit: 0 });

            if (groupExpenseDetails) {
                for (let groupExpense in groupExpenseDetails) {
                    let approvedUsers: any = [];
                    let rejectedUsers: any = [];
                    if (groupExpenseDetails[groupExpense]?.expenseRejectedByUser != undefined) {
                        rejectedUsers = Object.keys(groupExpenseDetails[groupExpense].expenseRejectedByUser);
                    }
                    if (groupExpenseDetails[groupExpense]?.expenseApprovedByUser != undefined) {
                        approvedUsers = Object.keys(groupExpenseDetails[groupExpense].expenseApprovedByUser);
                    }
                    let pendingUsers: any = [];
                    let group = await new CrudOperations(Group).getDocument({ _id: groupExpenseDetails[groupExpense].groupId }, {});

                    //create pending users array
                    for (let userId in group.userIds) {
                        if (group.userIds[userId] != groupExpenseDetails[groupExpense].paidBy) {
                            let flag = false;
                            for (let i in approvedUsers) {
                                if (approvedUsers[i] == group.userIds[userId]) {
                                    flag = true
                                }
                            }
                            for (let i in rejectedUsers) {
                                if (rejectedUsers[i] == group.userIds[userId]) {
                                    flag = true
                                }
                            }
                            if (flag != true) {
                                pendingUsers.push(group.userIds[userId]);
                            }
                        }
                        //insert paidBy user to approved users array
                        else if (group.userIds[userId] == groupExpenseDetails[groupExpense].paidBy) {
                            approvedUsers.push(groupExpenseDetails[groupExpense].paidBy);
                        }
                    }

                    //approved users
                    for (let key in approvedUsers) {
                        let user = await new CrudOperations(User).getDocument({ _id: approvedUsers[key] }, {});
                        approvedUsers[key] = user;
                    }
                    groupExpenseDetails[groupExpense].approvedUsers = approvedUsers;
                    //rejected Users
                    for (let key in rejectedUsers) {
                        let user = await new CrudOperations(User).getDocument({ _id: rejectedUsers[key] }, {});
                        rejectedUsers[key] = user;
                    }
                    groupExpenseDetails[groupExpense].rejectedUsers = rejectedUsers;
                    //rejected Users
                    for (let key in pendingUsers) {
                        let user = await new CrudOperations(User).getDocument({ _id: pendingUsers[key] }, {});
                        pendingUsers[key] = user;
                    }
                    groupExpenseDetails[groupExpense].pendingUsers = pendingUsers;
                    //Set paidBy user
                    let user = await new CrudOperations(User).getDocument({ _id: groupExpenseDetails[groupExpense].paidBy }, {});
                    groupExpenseDetails[groupExpense].paidBy = user;


                }
                next(null, groupExpenseDetails);
            } else {
                next(null, "Group expense details not found.")
            }
        } catch (error) {
            console.log("createGroupExpense", error);
        }
    }

    public async getUserPendingApprovalExpense(userId: any, next: CallableFunction) {
        try {
            let userGroups = await new CrudOperations(Group).getAllDocuments({ userIds: userId }, {}, { pageNo: 0, limit: 0 });
            let pendingAprrovalExpense: any = [];
            for (let group in userGroups) {
                const groupExpenseDetails = await new CrudOperations(GroupExpenseDetail).getAllDocuments({ groupId: userGroups[group]._id }, {}, { pageNo: 0, limit: 0 });
                for (let groupExpenseDetail in groupExpenseDetails) {
                    let flag = false;
                    if (groupExpenseDetails[groupExpenseDetail].paidBy != userId) {
                        if (groupExpenseDetails[groupExpenseDetail]?.expenseApprovedByUser != undefined) {
                            if (userId in groupExpenseDetails[groupExpenseDetail].expenseApprovedByUser) {
                                flag = true;
                            }
                        }
                        if (groupExpenseDetails[groupExpenseDetail]?.expenseRejectedByUser != undefined) {
                            if (userId in groupExpenseDetails[groupExpenseDetail].expenseRejectedByUser) {
                                flag = true;
                            }
                        }
                        if (flag != true) {
                            let user = await new CrudOperations(User).getDocument({ _id: groupExpenseDetails[groupExpenseDetail].paidBy }, {});
                            groupExpenseDetails[groupExpenseDetail].paidBy = user;
                            pendingAprrovalExpense.push(groupExpenseDetails[groupExpenseDetail]);
                        }
                    }
                }
            }
            next(null, pendingAprrovalExpense);

        } catch (error) {
            console.log("getUserPendingApprovalExpense", error);
        }
    }

    public async updateGroupExpenseDetail(groupExpenseDetailsId: any, body: any, isApproved: any, next: CallableFunction) {
        try {
            let groupExpense = await new CrudOperations(GroupExpenseDetail).getDocument({ _id: groupExpenseDetailsId }, {});

            if (isApproved == "1") {
                //add to expenseApprovedByUser
                if (groupExpense?.expenseApprovedByUser == undefined) {
                    groupExpense = { ...groupExpense._doc, ...body };
                }
                else {
                    groupExpense.expenseApprovedByUser = { ...groupExpense.expenseApprovedByUser, ...body.expenseApprovedByUser };
                }

            } else {
                //add to expenseRejectedByUser
                if (groupExpense?.expenseRejectedByUser == undefined) {
                    groupExpense = { ...groupExpense._doc, ...body };
                }
                else {
                    groupExpense.expenseRejectedByUser = { ...groupExpense.expenseRejectedByUser, ...body.expenseRejectedByUser };
                }
            }
            let result = await new CrudOperations(GroupExpenseDetail).updateDocument({ _id: groupExpenseDetailsId }, groupExpense);
            next(null, result);
        } catch (error) {
            console.log("updateGroupExpenseDetail", error);
        }
    }

    public async getBalance(groupId: any, next: CallableFunction) {
        try {
            let group = await new CrudOperations(Group).getDocument({ _id: groupId }, {});
            let allExpenses = await new CrudOperations(GroupExpenseDetail).getAllDocuments({ groupId: groupId }, {}, { pageNo: 0, limit: 0 });
            let approvedExpenses: any = [];
            let fromToMoneyArray: any = [];

            for (let expense in allExpenses) {
                //allExpenses[expense]
                if (allExpenses[expense]?.expenseApprovedByUser != undefined) {
                    if ((allExpenses[expense]?.expenseApprovedByUser != undefined) && (Object.keys(allExpenses[expense]?.expenseApprovedByUser).length == (group.userIds.length - 1))) {
                        approvedExpenses.push(allExpenses[expense]);
                    }
                }
            }
            // console.log(approvedExpenses);

            for (let expense in approvedExpenses) {
                //approvedExpenses[expense]
                let paidBy = approvedExpenses[expense].paidBy;
                let totalCost = approvedExpenses[expense].cost;
                let costPerMember = totalCost / group.userIds.length;

                //add
                let keys = Object.keys(approvedExpenses[expense].expenseApprovedByUser);
                for (let user in keys) {
                    //approvedExpenses[expense].expenseApprovedByUser[user]
                    let approvedUser = keys[user];

                    // ["from","to",amount]
                    let entry: any = [];
                    entry.push(approvedUser);
                    entry.push(paidBy);
                    entry.push(costPerMember);
                    fromToMoneyArray.push(entry);
                }
            }

            //simplify logic

            //combine the amounts
            let ResultContainingIds: any = {};
            let ResultContainingNames: any = {}
            let userIds = group.userIds;
            for (let userId of userIds) {
                for (let fromToMoney of fromToMoneyArray) {
                    // fromToMoney
                    if (fromToMoney[0] == userId) {
                        if (ResultContainingIds[userId] == undefined) {
                            let body: any = {};
                            body[fromToMoney[1]] = fromToMoney[2];
                            ResultContainingIds[userId] = body;

                            //ResultContainingNames
                            let from = await new CrudOperations(User).getDocument({ _id: fromToMoney[0] }, {});
                            let to = await new CrudOperations(User).getDocument({ _id: fromToMoney[1] }, {});
                            let namesBody: any = {};
                            namesBody[to.name] = fromToMoney[2];
                            ResultContainingNames[from.name] = namesBody;
                        }
                        else {
                            if (ResultContainingIds[userId][fromToMoney[1]] == undefined) {
                                ResultContainingIds[userId][fromToMoney[1]] = fromToMoney[2];

                                //ResultContainingNames
                                let from = await new CrudOperations(User).getDocument({ _id: fromToMoney[0] }, {});
                                let to = await new CrudOperations(User).getDocument({ _id: fromToMoney[1] }, {});
                                ResultContainingNames[from.name][to.name] = fromToMoney[2];

                            } else {
                                ResultContainingIds[userId][fromToMoney[1]] = ResultContainingIds[userId][fromToMoney[1]] + fromToMoney[2];

                                //ResultContainingNames
                                let from = await new CrudOperations(User).getDocument({ _id: fromToMoney[0] }, {});
                                let to = await new CrudOperations(User).getDocument({ _id: fromToMoney[1] }, {});
                                ResultContainingNames[from.name][to.name] = ResultContainingNames[from.name][to.name] + fromToMoney[2];

                            }

                        }
                    }

                }
            }

            //remove thier share paid users
            

            next(null, ResultContainingNames);

        } catch (error) {
            console.log("getBalance", error);
        }
    }

}

export default new GroupExpenseService();