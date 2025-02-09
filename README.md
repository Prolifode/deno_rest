# Deno REST - A Deno RESTful API Boilerplate

![Deno Logo](https://deno.land/images/deno_logo_4.gif)

[![CircleCI](https://circleci.com/gh/Prolifode/deno_rest.svg?style=svg)](https://circleci.com/gh/Prolifode/deno_rest)

Deno REST is a straightforward boilerplate project for creating RESTful APIs
using Deno, Oak, and deno_mongo. Deno is a secure runtime for JavaScript and
TypeScript that uses V8 and is built in Rust, Oak is a middleware framework for
Deno's http server, and deno_mongo is a MongoDB driver for Deno.

## Features

- **Organized by Model, Controller, Service structure:** This project follows a
  clean architecture that separates concerns into different layers, making it
  easy to maintain and scale.
- **MongoDB integration:** We utilize the deno_mongo library for seamless
  interaction with MongoDB databases.
- **JWT-based authentication:** Securely authenticate users with JSON Web Tokens
  (JWTs).
- **User authorization:** Implement role-based access control to restrict
  resources based on user roles.
- **CORS support:** CORS middleware is integrated to handle cross-origin
  requests.
- **Environment management via .env:** Manage different environments with ease
  using the .env file.
- **Request validation:** Validate incoming requests to ensure they contain
  valid data.
- **Error handling:** Gracefully handle errors and provide helpful error
  messages to the client.
- **Database seeding:** Populate your database with initial data using our
  database seeding feature.
- **User roles and permissions:** Manage user access and permissions
  efficiently.
- **User activity history:** Keep track of user activities within your
  application.
- **Password hashing with BCrypt:** Securely store user passwords with BCrypt
  hashing.
- **Integration tests:** Test your application with our pre-written integration
  tests.
- **Docker and CircleCI integration:** Containerize your application with Docker
  and set up continuous integration with CircleCI.

## Libraries Utilized

- [Oak](https://jsr.io/@oak/oak) - Middleware framework for Deno's net server
- [deno_mongo](https://jsr.io/@db/mongo) - MongoDB driver for Deno
- [cors](https://jsr.io/@tajpouria/cors) - CORS middleware for Deno
- [djwt](https://jsr.io/@zaubrik/djwt) - JSON Web Tokens in Deno, based on JWT
  and JWS specifications
- [yup](https://www.npmjs.com/package/yup) - Schema builder for value parsing
  and validation
- [bcrypt](https://jsr.io/@da/bcrypt) - OpenBSD Blowfish password hashing
  algorithm

## Getting Started

### Installation / Upgrade

To get started with this project, you first need to have Deno installed. If you
haven't installed it already, you can follow the official
[Installation Guide](https://deno.com/manual@v1.35.0/getting_started/installation#installation).

### Environment Variables

Review the `.environments/.env.example` file and create a suitable `.env` file
based on your needs. For example, create a `.env.development` file under the
`.environments` directory for a development environment. For a test environment,
create a `.env.test` file under the `.environments` directory. Then, add the
necessary variables.

### Database Seeding

We use a seeding script to populate the database with initial data. Run the
following command to execute the seeding script:

```bash
deno run seed
```

### Running the Project

After setting up everything, you can run the project using the following
command:

```bash
deno start
```

#### with file watch:

```bash
deno start:watch
```

The server will start and listen for incoming requests.

### Tests

```bash
deno test
```

## User Roles and Permissions

User roles and permissions are defined in the `config/roles.ts` file. You can
add, modify, or remove roles and their associated permissions in this file.

To add a new role, follow these steps:

1. Open the `config/roles.ts` file.
2. Add a new role to the `enum Role` declaration. For example, to add a `GUEST`
   role, your `enum Role` might look like this:

```typescript
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}
```

3. Define permissions for the new role in the `roleRights` object. For example,
   to allow a `GUEST` to view users but not modify them, your `roleRights`
   object might look like this:

```typescript
export const roleRights = new Map([
  [Role.USER, [
    PermissionList.GET_USER,
    PermissionList.POST_USER,
    PermissionList.PUT_USER,
    PermissionList.DELETE_USER,
  ]],
  [Role.ADMIN, [
    PermissionList.GET_USER,
    PermissionList.POST_USER,
    PermissionList.PUT_USER,
    PermissionList.DELETE_USER,
    PermissionList.MANAGE_ROLES,
  ]],
  [Role.GUEST, [PermissionList.GET_USER]],
]);
```

## API Routes

This project comes with the following API routes:

- **GET /users:** Fetch a list of all users.
- **GET /users/:id:** Fetch a specific user by ID.
- **POST /users:** Create a new user.
- **PUT /users/:id:** Update a specific user by ID.
- **DELETE /users/:id:** Delete a specific user by ID.

Each route is secured and requires appropriate permissions to access.

## Contributing

We welcome contributions to this project. Please feel free to open an issue or
submit a pull request.

## License

This project is licensed under the MIT License.
