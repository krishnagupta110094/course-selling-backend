# Course Selling App

This is a Node.js application for selling online courses with user and admin functionalities.

## Features

- User login and signup
- Purchase a course
- View all courses
- View purchased courses
- Admin login and signup
- Create, delete, and manage courses
- Add course content

## Getting Started

### Steps to Create the App

1. Initialize a new Node.js project.
2. Add dependencies:
   - Express
   - jsonwebtoken
   - mongoose
3. Create `index.js`.
4. Add route skeletons:
   - User: login, signup, purchase a course, see all courses, see purchased courses
   - Admin: login, signup, create a course, delete a course, update,getAdminCourses
5. Define schemas for:
   - User
   - Admin
   - Course
   - Purchase
6. Add a database using MongoDB.
   - Use `dotenv` to store the database connection string.
7. Add middleware for user and admin authentication.
8. Complete the routes for user login, signup, purchase a course, and view courses.
   - Extra: Use Express routing to better structure your routes.
9. Create the frontend.

## Good to Haves

- Use cookies instead of JWT for authentication
- Add a rate-limiting middleware
- Frontend in React
