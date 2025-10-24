🔐 Authentication APIs
1. Register User
   Endpoint: POST /api/auth/register

Request:

json
{
"username": "john_doe",
"email": "john@example.com",
"password": "securePassword123",
"role": "DEVELOPER"
}
Response:

json
{
"status": "success",
"message": "User registered successfully",
"data": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": null,
"role": "DEVELOPER",
"isActive": true,
"lastLoginAt": null,
"createdAt": "2025-10-14T18:30:00Z"
},
"timestamp": "2025-10-14T18:30:00Z"
}
2. Login
   Endpoint: POST /api/auth/login

Request:

json
{
"username": "john_doe",
"password": "securePassword123"
}
Response:

json
{
"status": "success",
"message": "Login successful",
"data": {
"token": "eyJhbGciOiJIUzUxMiJ9...",
"expiresIn": 3600000,
"username": "john_doe",
"role": "DEVELOPER"
},
"timestamp": "2025-10-14T18:30:00Z"
}
👥 User Management APIs
3. Get All Users
   Endpoint: GET /api/users

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Users fetched successfully",
"data": [
{
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe",
"role": "DEVELOPER",
"isActive": true,
"lastLoginAt": "2025-10-14T18:30:00Z",
"createdAt": "2025-10-14T10:00:00Z"
},
{
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith",
"role": "PROJECT_ADMIN",
"isActive": true,
"lastLoginAt": "2025-10-14T17:45:00Z",
"createdAt": "2025-10-14T09:00:00Z"
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
4. Get User by ID
   Endpoint: GET /api/users/1

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "User fetched successfully",
"data": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe",
"role": "DEVELOPER",
"isActive": true,
"lastLoginAt": "2025-10-14T18:30:00Z",
"createdAt": "2025-10-14T10:00:00Z"
},
"timestamp": "2025-10-14T18:30:00Z"
}
5. Create User
   Endpoint: POST /api/users

Headers: Authorization: Bearer <token>

Request:

json
{
"username": "mike_jones",
"email": "mike@example.com",
"password": "password123",
"displayName": "Mike Jones",
"role": "VIEWER"
}
Response:

json
{
"status": "success",
"message": "User created successfully",
"data": {
"id": 3,
"username": "mike_jones",
"email": "mike@example.com",
"displayName": "Mike Jones",
"role": "VIEWER",
"isActive": true,
"lastLoginAt": null,
"createdAt": "2025-10-14T18:35:00Z"
},
"timestamp": "2025-10-14T18:35:00Z"
}
6. Update User
   Endpoint: PUT /api/users/3

Headers: Authorization: Bearer <token>

Request:

json
{
"username": "mike_jones",
"email": "mike.jones@example.com",
"displayName": "Michael Jones",
"role": "DEVELOPER",
"isActive": true
}
Response:

json
{
"status": "success",
"message": "User updated successfully",
"data": {
"id": 3,
"username": "mike_jones",
"email": "mike.jones@example.com",
"displayName": "Michael Jones",
"role": "DEVELOPER",
"isActive": true,
"lastLoginAt": null,
"createdAt": "2025-10-14T18:35:00Z"
},
"timestamp": "2025-10-14T18:36:00Z"
}
7. Delete User
   Endpoint: DELETE /api/users/3

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "User deleted successfully",
"data": "OK",
"timestamp": "2025-10-14T18:37:00Z"
}
🏢 Organization APIs
8. Get All Organizations
   Endpoint: GET /api/organizations

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Organizations fetched successfully",
"data": [
{
"id": 1,
"name": "Tech Solutions Inc",
"slug": "tech-solutions",
"description": "Software development company",
"createdBy": {
"id": 1,
"username": "admin",
"email": "admin@example.com",
"displayName": "System Admin",
"role": "SUPER_ADMIN"
},
"createdAt": "2025-10-01T00:00:00Z",
"projectCount": 5
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
9. Create Organization
   Endpoint: POST /api/organizations

Headers: Authorization: Bearer <token>

Request:

json
{
"name": "Startup XYZ",
"slug": "startup-xyz",
"description": "Innovative startup company"
}
Response:

json
{
"status": "success",
"message": "Organization created successfully",
"data": {
"id": 2,
"name": "Startup XYZ",
"slug": "startup-xyz",
"description": "Innovative startup company",
"createdBy": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"createdAt": "2025-10-14T18:40:00Z",
"projectCount": 0
},
"timestamp": "2025-10-14T18:40:00Z"
}
🚀 Project APIs
10. Get All Projects
    Endpoint: GET /api/projects

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Projects fetched successfully",
"data": [
{
"id": 1,
"name": "Mobile App Development",
"description": "Building a cross-platform mobile application",
"key": "MOB",
"organization": {
"id": 1,
"name": "Tech Solutions Inc",
"slug": "tech-solutions"
},
"owner": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"isPrivate": false,
"createdAt": "2025-10-10T09:00:00Z",
"updatedAt": "2025-10-14T15:30:00Z",
"issueCount": 23,
"memberCount": 5
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
11. Get Project by Key
    Endpoint: GET /api/projects/key/MOB

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Project fetched successfully",
"data": {
"id": 1,
"name": "Mobile App Development",
"description": "Building a cross-platform mobile application",
"key": "MOB",
"organization": {
"id": 1,
"name": "Tech Solutions Inc",
"slug": "tech-solutions"
},
"owner": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"isPrivate": false,
"createdAt": "2025-10-10T09:00:00Z",
"updatedAt": "2025-10-14T15:30:00Z",
"issueCount": 23,
"memberCount": 5
},
"timestamp": "2025-10-14T18:30:00Z"
}
12. Create Project
    Endpoint: POST /api/projects

Headers: Authorization: Bearer <token>

Request:

json
{
"name": "Website Redesign",
"description": "Complete website redesign with modern UI",
"key": "WEB",
"organizationId": 1,
"isPrivate": true
}
Response:

json
{
"status": "success",
"message": "Project created successfully",
"data": {
"id": 2,
"name": "Website Redesign",
"description": "Complete website redesign with modern UI",
"key": "WEB",
"organization": {
"id": 1,
"name": "Tech Solutions Inc",
"slug": "tech-solutions"
},
"owner": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"isPrivate": true,
"createdAt": "2025-10-14T18:45:00Z",
"updatedAt": "2025-10-14T18:45:00Z",
"issueCount": 0,
"memberCount": 1
},
"timestamp": "2025-10-14T18:45:00Z"
}
👥 Project Member APIs
13. Get Project Members
    Endpoint: GET /api/projects/1/members

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Project members fetched successfully",
"data": [
{
"id": 1,
"user": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith",
"role": "PROJECT_ADMIN"
},
"role": "ADMIN",
"assignedAt": "2025-10-10T09:00:00Z"
},
{
"id": 2,
"user": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe",
"role": "DEVELOPER"
},
"role": "MEMBER",
"assignedAt": "2025-10-11T10:00:00Z"
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
14. Add Project Member
    Endpoint: POST /api/projects/1/members

Headers: Authorization: Bearer <token>

Request:

json
{
"userId": 3,
"role": "MEMBER"
}
Response:

json
{
"status": "success",
"message": "Member added to project successfully",
"data": "OK",
"timestamp": "2025-10-14T18:50:00Z"
}
15. Update Member Role
    Endpoint: PUT /api/projects/1/members/3

Headers: Authorization: Bearer <token>

Request:

json
{
"role": "ADMIN"
}
Response:

json
{
"status": "success",
"message": "Member role updated successfully",
"data": "OK",
"timestamp": "2025-10-14T18:51:00Z"
}
16. Remove Project Member
    Endpoint: DELETE /api/projects/1/members/3

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Member removed from project successfully",
"data": "OK",
"timestamp": "2025-10-14T18:52:00Z"
}
🐞 Issue APIs
17. Get All Issues
    Endpoint: GET /api/issues

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Issues fetched successfully",
"data": [
{
"id": 1,
"key": "MOB-123",
"title": "Login page not loading on iOS",
"description": "The login page fails to load on iOS devices running Safari",
"type": "BUG",
"status": "OPEN",
"priority": "HIGH",
"project": {
"id": 1,
"name": "Mobile App Development",
"key": "MOB"
},
"reporter": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"assignee": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"storyPoints": 3,
"timeEstimate": 240,
"timeSpent": 120,
"createdAt": "2025-10-12T14:30:00Z",
"updatedAt": "2025-10-14T16:45:00Z",
"commentCount": 5
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
18. Get Issue by Key
    Endpoint: GET /api/issues/key/MOB-123

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Issue fetched successfully",
"data": {
"id": 1,
"key": "MOB-123",
"title": "Login page not loading on iOS",
"description": "The login page fails to load on iOS devices running Safari",
"type": "BUG",
"status": "OPEN",
"priority": "HIGH",
"project": {
"id": 1,
"name": "Mobile App Development",
"key": "MOB"
},
"reporter": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"assignee": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"storyPoints": 3,
"timeEstimate": 240,
"timeSpent": 120,
"createdAt": "2025-10-12T14:30:00Z",
"updatedAt": "2025-10-14T16:45:00Z",
"commentCount": 5
},
"timestamp": "2025-10-14T18:30:00Z"
}
19. Create Issue
    Endpoint: POST /api/issues

Headers: Authorization: Bearer <token>

Request:

json
{
"title": "Implement user profile page",
"description": "Create a comprehensive user profile page with edit functionality",
"type": "STORY",
"status": "OPEN",
"priority": "MEDIUM",
"projectId": 1,
"assigneeId": 1,
"storyPoints": 5,
"timeEstimate": 480
}
Response:

json
{
"status": "success",
"message": "Issue created successfully",
"data": {
"id": 2,
"key": "MOB-124",
"title": "Implement user profile page",
"description": "Create a comprehensive user profile page with edit functionality",
"type": "STORY",
"status": "OPEN",
"priority": "MEDIUM",
"project": {
"id": 1,
"name": "Mobile App Development",
"key": "MOB"
},
"reporter": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"assignee": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"storyPoints": 5,
"timeEstimate": 480,
"timeSpent": 0,
"createdAt": "2025-10-14T18:55:00Z",
"updatedAt": "2025-10-14T18:55:00Z",
"commentCount": 0
},
"timestamp": "2025-10-14T18:55:00Z"
}
20. Update Issue
    Endpoint: PUT /api/issues/2

Headers: Authorization: Bearer <token>

Request:

json
{
"title": "Implement user profile page",
"description": "Create a comprehensive user profile page with edit functionality and avatar upload",
"type": "STORY",
"status": "IN_PROGRESS",
"priority": "MEDIUM",
"assigneeId": 1,
"storyPoints": 8,
"timeEstimate": 600,
"timeSpent": 120
}
Response:

json
{
"status": "success",
"message": "Issue updated successfully",
"data": {
"id": 2,
"key": "MOB-124",
"title": "Implement user profile page",
"description": "Create a comprehensive user profile page with edit functionality and avatar upload",
"type": "STORY",
"status": "IN_PROGRESS",
"priority": "MEDIUM",
"project": {
"id": 1,
"name": "Mobile App Development",
"key": "MOB"
},
"reporter": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"assignee": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"storyPoints": 8,
"timeEstimate": 600,
"timeSpent": 120,
"createdAt": "2025-10-14T18:55:00Z",
"updatedAt": "2025-10-14T19:00:00Z",
"commentCount": 0
},
"timestamp": "2025-10-14T19:00:00Z"
}
21. Search Issues by Status
    Endpoint: GET /api/issues/search?status=OPEN

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Issues filtered by status",
"data": [
{
"id": 1,
"key": "MOB-123",
"title": "Login page not loading on iOS",
"description": "The login page fails to load on iOS devices running Safari",
"type": "BUG",
"status": "OPEN",
"priority": "HIGH",
"project": {
"id": 1,
"name": "Mobile App Development",
"key": "MOB"
},
"reporter": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"assignee": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"storyPoints": 3,
"timeEstimate": 240,
"timeSpent": 120,
"createdAt": "2025-10-12T14:30:00Z",
"updatedAt": "2025-10-14T16:45:00Z",
"commentCount": 5
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
💬 Comment APIs
22. Get Comments for Issue
    Endpoint: GET /api/comments/issue/1

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Comments fetched successfully",
"data": [
{
"id": 1,
"content": "I've started investigating this issue. It seems to be related to the Safari browser cache.",
"author": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"createdAt": "2025-10-12T15:00:00Z",
"updatedAt": "2025-10-12T15:00:00Z"
},
{
"id": 2,
"content": "Any updates on this? This is blocking our iOS testing.",
"author": {
"id": 2,
"username": "jane_smith",
"email": "jane@example.com",
"displayName": "Jane Smith"
},
"createdAt": "2025-10-13T09:30:00Z",
"updatedAt": "2025-10-13T09:30:00Z"
}
],
"timestamp": "2025-10-14T18:30:00Z"
}
--------
{
"status": "success",
"message": "Comments fetched successfully",
"data": [
        {
            "id": 1,
            "content": "You are taking more time than it should take",
            "author": null,
            "createdAt": "2025-10-18T18:54:37.608987Z",
            "updatedAt": "2025-10-18T18:54:37.609234Z"
        }
    ],
    "timestamp": "2025-10-18T19:03:46.494855200Z"
}
23. Create Comment
    Endpoint: POST /api/comments

Headers: Authorization: Bearer <token>

Request:

json
{
"content": "I found the root cause. It's a CSS compatibility issue with Safari.",
"issueId": 1
}
Response:

json
{
"status": "success",
"message": "Comment created successfully",
"data": {
"id": 3,
"content": "I found the root cause. It's a CSS compatibility issue with Safari.",
"author": {
"id": 1,
"username": "john_doe",
"email": "john@example.com",
"displayName": "John Doe"
},
"createdAt": "2025-10-14T19:05:00Z",
"updatedAt": "2025-10-14T19:05:00Z"
},
"timestamp": "2025-10-14T19:05:00Z"
}
-----------
{
"status": "success",
"message": "Comment created successfully",
"data": {
"id": 2,
"content": "I found the root cause. It's a CSS compatibility issue with Safari.",
"author": null,
"createdAt": "2025-10-18T19:02:33.018911Z",
"updatedAt": "2025-10-18T19:02:33.019425Z"
},
"timestamp": "2025-10-18T19:02:33.084164500Z"
}
📊 Dashboard APIs
24. Get User Dashboard
    Endpoint: GET /api/dashboard

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Dashboard data fetched successfully",
"data": {
"openIssuesCount": 5,
"projectsCount": 3,
"membersCount": 12,
"stats": {
"assignedIssues": 3,
"reportedIssues": 8,
"recentActivity": [
"Issue MOB-123 updated",
"Comment added to WEB-45",
"Project Mobile App updated"
]
}
},
"timestamp": "2025-10-14T18:30:00Z"
}
25. Get Project Dashboard
    Endpoint: GET /api/dashboard/project/1

Headers: Authorization: Bearer <token>

Response:

json
{
"status": "success",
"message": "Project dashboard data fetched successfully",
"data": {
"openIssuesCount": 12,
"projectsCount": 1,
"membersCount": 5,
"stats": {
"statusCounts": {
"OPEN": 5,
"IN_PROGRESS": 4,
"CODE_REVIEW": 2,
"TESTING": 1,
"DONE": 8,
"CLOSED": 3
},
"priorityBreakdown": {
"LOWEST": 2,
"LOW": 3,
"MEDIUM": 10,
"HIGH": 5,
"HIGHEST": 2,
"CRITICAL": 1
}
}
},
"timestamp": "2025-10-14T18:30:00Z"
}
⚠️ Error Responses
Authentication Error
json
{
"status": "error",
"message": "Invalid username or password",
"data": null,
"timestamp": "2025-10-14T18:30:00Z"
}
Permission Denied
json
{
"status": "error",
"message": "Access denied to this project",
"data": null,
"timestamp": "2025-10-14T18:30:00Z"
}
Resource Not Found
json
{
"status": "error",
"message": "Project not found with id: 999",
"data": null,
"timestamp": "2025-10-14T18:30:00Z"
}
Validation Error
json
{
"status": "error",
"message": "Validation failed",
"data": {
"fieldErrors": {
"email": "Email must be valid",
"password": "Password must be at least 8 characters"
}
},
"timestamp": "2025-10-14T18:30:00Z"
}
Duplicate Resource
json
{
"status": "error",
"message": "Username already exists",
"data": null,
"timestamp": "2025-10-14T18:30:00Z"
}
🔄 Common Request Headers
All authenticated requests require:

http
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json


📋 API Summary
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Register new user	No
POST	/api/auth/login	User login	No
GET	/api/users	Get all users	Yes
POST	/api/users	Create user	Yes
GET	/api/users/{id}	Get user by ID	Yes
PUT	/api/users/{id}	Update user	Yes
DELETE	/api/users/{id}	Delete user	Yes
GET	/api/organizations	Get all organizations	Yes
POST	/api/organizations	Create organization	Yes
GET	/api/projects	Get all projects	Yes
POST	/api/projects	Create project	Yes
GET	/api/projects/{id}	Get project by ID	Yes
GET	/api/projects/key/{key}	Get project by key	Yes
GET	/api/projects/{id}/members	Get project members	Yes
POST	/api/projects/{id}/members	Add project member	Yes
PUT	/api/projects/{id}/members/{userId}	Update member role	Yes
DELETE	/api/projects/{id}/members/{userId}	Remove member	Yes
GET	/api/issues	Get all issues	Yes
POST	/api/issues	Create issue	Yes
GET	/api/issues/{id}	Get issue by ID	Yes
GET	/api/issues/key/{key}	Get issue by key	Yes
GET	/api/issues/search	Search issues	Yes
GET	/api/comments/issue/{issueId}	Get issue comments	Yes
POST	/api/comments	Create comment	Yes
GET	/api/dashboard	Get user dashboard	Yes
GET	/api/dashboard/project/{id}	Get project dashboard	Yes
This completes the comprehensive API documentation with all request/response examples!

Step 1: Build React frontend
cd G:\NUCLEUS\Frontend\nucleus-frontend
npm run build

Step 2: Copy build (dist) to Spring Boot static folder
xcopy "G:\NUCLEUS\Frontend\nucleus-frontend\dist\*" "G:\NUCLEUS\Backend\nucleus_backend\src\main\resources\static" /E /H /C /I /Y

Step 3: Go to backend and run Spring Boot
cd G:\NUCLEUS\Backend\nucleus_backend
mvn spring-boot:run

Step 4: Expose via ngrok
ngrok http 8080


Share the ngrok URL with others; frontend and backend will both work.

https://ophthalmological-bradley-bacterially.ngrok-free.dev