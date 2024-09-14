# User-Management-nodejs-api
here is the .env 
PORT=
DB_NAME=
DB_USER=
DB_PASS= 
DB_HOST=
#server
DB_PORT=
JWT_SECRET=
ENCRYPTION_KEY=
ENCRYPTION_IV=


Dear Rahul Gupta,

We hope you're doing well. As part of your technical assessment, we would like you to complete a task that will help us evaluate your skills in Node.js and React.js.

Task: User Management System with Authentication and Role-Based Access

Scenario:

You are required to build a full-stack User Management System where:

Users can register, log in, and view their profile.✔
Only authenticated users can create, update, or delete user profiles.✔
There are two types of users: Regular Users and Admins.
Admins can view a list of all users, while Regular Users can only view and update their own profile.✔
Frontend (React.js):

User Registration and Login:

Create forms for user registration (name, email, password, confirm password) and login (email, password).✔
Upon successful login, store the JWT token and use it for authenticated API requests.✔
Profile Page:✔

A regular user can view and update their own profile. ✔
An admin user can view a list of all users and perform CRUD operations (create, update, delete user profiles). ✔ ✔ ✔ ✔
State Management:

Use React hooks, or State management Store to manage user data and authentication states.
Display different UI options based on the user's role (Regular User or Admin).
UI Design:

Use React Material UI or Tailwind CSS or BootStrap for building the UI components.
Backend (Node.js):

User Authentication and Authorization:

Implement JWT-based authentication for password hashing. ✔
Create middleware to protect certain routes and verify user roles (Admin vs. Regular User). ✔
RESTful API for CRUD Operations: 

POST /register: Register a new user. ✔
POST /login: Authenticate the user and return a JWT token ✔
GET /profile: Retrieve the authenticated user's profile. ✔
PUT /profile: Update the authenticated user's profile.✔
GET /users: Admin-only route to retrieve a list of all users. ✔
DELETE /users/ ✔
: Admin-only route to delete a user by ID. ✔
Role-Based Access Control:

Implement middleware to check whether the user is an Admin before granting access to certain routes (e.g., viewing all users, deleting a user).✔
Requirements:

Registration and Login Flow: Implement forms for registration and login, with token-based authentication. Store the token in localStorage and use it in subsequent API calls.
Protected Routes: Ensure only authenticated users can access their profile. Admins should have additional access to user management functionality.
Role-Based Actions: Admins can view and manage all users, while regular users are restricted to their own profile.✔
State Management: Use React hooks to maintain authentication state and UI behavior.
UI Framework: Use React Material UI or Tailwind CSS for styling the frontend.
Submission Instructions:

Please submit your solution by Sunday 15th September 2024 E.O.D. as a GitHub repository and create a netlify link to view the application, And also create a shorter video of running application and backend and send on wetransfer.

We look forward to seeing your work. If you have any questions or need clarification on any part of the task, feel free to reach out.
