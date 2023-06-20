# Deno REST - A Deno RESTful API Boilerplate

![Deno Logo](https://deno.land/images/deno_logo_4.gif)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Prolifode/deno_rest/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/Prolifode/deno_rest/tree/master)

Deno REST is a straightforward boilerplate project for creating RESTful APIs
with Deno using the [Oak](https://deno.land/x/oak) and
[deno_mongo](https://deno.land/x/mongo) libraries.

## Features

- Organized by Model, Controller, Service structure
- MongoDB integration
- JWT-based authentication
- User authorization
- CORS support
- Environment management via .env
- Request validation
- Error handling
- Database seeding
- User roles and permissions
- User activity history
- Password hashing with BCrypt
- Denon Integration
- Integration tests
- Docker and CircleCI integration

## Libraries Utilized

- [Oak](https://deno.land/x/oak) - Middleware framework for Deno's net server
- [deno_mongo](https://deno.land/x/mongo) - MongoDB driver for Deno
- [cors](https://deno.land/x/cors) - CORS middleware for Deno
- [djwt](https://deno.land/x/djwt) - JSON Web Tokens in Deno, based on JWT and
  JWS specifications
- [yup](https://github.com/jquense/yup) - Schema builder for value parsing and
  validation
- [bcrypt](https://deno.land/x/bcrypt) - OpenBSD Blowfish password hashing
  algorithm

## Getting Started

### Installation / Upgrade

Follow this Installation guide for deno:
https://deno.com/manual@v1.34.3/getting_started/installation#installation

**Directory Structure**

```
|   .gitignore
|   app.ts
|   denon.json
|   deps.ts
|   docker-compose.dev.yml
|   docker-compose.test.yml
|   docker-compose.yml
|   Dockerfile
|   LICENSE
|   import_map.json
|   scripts.config.ts
|   deno.lock
|   README.md
|   seed.ts
|   tsconfig.json
+---.circleci
|       config.yml
|
+---config
|       config.ts
|       roles.ts
|
+---controllers
|       auth.controller.ts
|       user.controller.ts
|
+---data
|       users.json
|
+---db
|       db.ts
|
+---environments
|       .env.development
|       .env.example
|       .env.test
|
+---helpers
|       hash.helper.ts
|       jwt.helper.ts
|
+---middlewares
|       auth.middleware.ts
|       errorHandler.middleware.ts
|       logger.middleware.ts
|       validate.middleware.ts
|
+---models
|       token.model.ts
|       user.model.ts
|       user_history.model.ts
|
+---routers
|       auth.router.ts
|       default.router.ts
|       index.ts
|       user.router.ts
|
+---services
|       auth.service.ts
|       token.service.ts
|       user.service.ts
|
+---tests
|   +---fixtures
|   |       users.fixtures.ts
|   |
|   +---integration
|   |   |   app.test.ts
|   |   |
|   |   +---users
|   |           user-get.test.ts
|   |           user-post.test.ts
|   |
|   +---utils
|           utils.ts
|
+---types
|       types.interface.ts
|
+---validations
|       auth.validation.ts
|       user.validation.ts
```

## Setup

### Environment Variables

Review the `.environments/.env.example` file and create a suitable `.env` file
for your needs. For example, create a `.env.development` file under the
`.environments` directory for a development environment. For a test environment,
create a `.env.test` file under the `.environments` directory. Then, add the
necessary variables.

### Install Denon

Install `denon` from [denon's official page](https://deno.land/x/denon). If you
encounter any issues during installation, refer to
[this solution](https://github.com/denosaurs/denon/issues/122#issuecomment-770895766).

### Install Dependencies

To install dependencies, navigate to the root directory of the project in your
terminal and run:

```shell
deno cache --reload --unstable --lock-write --lock=lock.json ./deps.ts
```

Alternatively, you can run the `reload_deps.sh` file from the project directory.
This will automatically download all dependencies and update the `lock.json`
file.

### Database Seeding

If you need to seed the database initially, simply enable `SEED=true` in your
.env file. You can add or modify any seed file under the `data` directory. A

basic example of a seed file is provided in `data/users.json`.

### Manual Seed File Control

You can control the seed logic in `seed.ts`. Here you can add multiple seed
files as follows:

```typescript
const seedCollections: Array<Record<string, boolean>> = [
  { users: true }, // collection_name: boolean
  { posts: true },
  { comments: false },
  // Add more collections as needed
];
```

Note: The file name must follow the `collection_name.json` pattern.

### Running the Project

In the project root directory, open your terminal and run:

```shell
denon start
```

This will start the project.

## Using Docker

Development server:

```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## User Roles and Rights

User roles are saved in the `config/roles.ts` file:

```typescript
export const roles = ["user", "admin"];
```

And rights are saved as:

```typescript
roleRights.set(roles[0], [
  "getMe",
]);

roleRights.set(roles[1], [
  "getMe",
  "getUsers",
  "manageUsers",
]);
```

You can add or modify roles and rights as per your requirements.

## API Routes

Routes are stored under the `routers` directory. Below is an example of the
`/api/users` route. This route is protected with JWT:

```typescript
// JWT protected route
router.post(
  "/api/users", // route
  auth("manageUsers"), // Auth Guard based on djwt
  validate(createUserValidation), // Yup based validation
  UserController.create, // Controller Function
);
```

Example of a non-JWT protected route:

```typescript
router.post(
  "/api/auth/login",
  validate(loginValidation), // Yup based validation
  AuthController.login,
);
```

## Models, Controllers, and Services

Models, Controllers, and Services are organized under their respective
directories. For detailed examples, please check the repository.

## Contributing

All PRs are welcome.

## License

This project is licensed under the terms of the MIT license.
