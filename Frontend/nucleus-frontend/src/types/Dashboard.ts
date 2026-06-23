export interface Dashboard {
    openIssuesCount:number;
    projectsCount:number;
    membersCount:number;

    stats:{
        assignedIssues:number;
        reportedIssues:number;
    };
}