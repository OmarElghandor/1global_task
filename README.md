# Device Management API

A RESTful API for managing devices built with Node.js, Express, TypeScript, and PostgreSQL. This API allows you to create, read, update, and delete devices, as well as filter them by brand or state.

## Features

- **Full CRUD Operations**: Create, read, update, and delete devices
- **Device Filtering**: Filter devices by brand or state
- **Device States**: Track device availability (available, in_use, inactive)
- **Health Check**: Built-in health check endpoint for monitoring
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Request Logging**: Automatic logging of all API requests
- **Type Safety**: Built with TypeScript for type-safe development
- **Database Migrations**: Prisma migrations for database schema management
- **Docker Support**: Easy deployment with Docker and Docker Compose
- **Test Suite**: Comprehensive test coverage for all endpoints

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **Testing**: Custom test suite with tsx

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v16 or higher) - [Download here](https://www.postgresql.org/download/)
- **Docker** and **Docker Compose** (optional, for containerized setup) - [Download here](https://www.docker.com/get-started)

## Installation

You can set up this project in two ways: using Docker Compose (recommended for quick setup) or running it locally.

### Option 1: Docker Compose Setup (Recommended)

This is the easiest way to get started. Docker Compose will set up both the database and the application for you.

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd 1global_task
   ```

2. **Start the services**:
   ```bash
   docker-compose up -d
   ```

   This command will:
   - Pull the PostgreSQL 16 image
   - Build the application Docker image
   - Start both the database and application containers
   - Run database migrations automatically
   - Make the API available at `http://localhost:3000`

3. **Check if everything is running**:
   ```bash
   docker-compose ps
   ```

4. **View logs** (optional):
   ```bash
   docker-compose logs -f app
   ```

5. **Stop the services** (when you're done):
   ```bash
   docker-compose down
   ```

   To also remove the database volume (clean slate):
   ```bash
   docker-compose down -v
   ```

### Option 2: Local Development Setup

If you prefer to run the application locally without Docker:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up your PostgreSQL database**:
   - Create a new PostgreSQL database (you can name it `1global_task` or any name you prefer)
   - Note down your database connection details

3. **Create a `.env` file** in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/1global_task"
   NODE_ENV=development
   PORT=3000
   ```

   Replace `username`, `password`, and `1global_task` with your actual PostgreSQL credentials and database name.

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**:
   ```bash
   npx prisma migrate deploy
   ```

   Or if you want to create a new migration:
   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` and automatically restart when you make changes to the code.

## Environment Variables

The following environment variables are required:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `PORT` | Server port number | `3000` | No |

**Example `.env` file**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/1global_task"
NODE_ENV=development
PORT=3000
```

## API Documentation

All API endpoints are prefixed with `/api`. The base URL is `http://localhost:3000` when running locally.

### Health Check

Check if the API is running and healthy.

**Endpoint**: `GET /ping`

**Response**:
```json
{
  "ok": true,
  "env": "development"
}
```

**Example**:
```bash
curl http://localhost:3000/ping
```

### Get All Devices

Retrieve a list of all devices.

**Endpoint**: `GET /api/devices`

**Response**:
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "brand": "Apple",
    "state": "available",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Galaxy S23",
    "brand": "Samsung",
    "state": "in_use",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Example**:
```bash
curl http://localhost:3000/api/devices
```

### Create a Device

Create a new device. The `name` and `brand` fields are required. The `state` field is optional and defaults to `available`.

**Endpoint**: `POST /api/device`

**Request Body**:
```json
{
  "name": "iPhone 15",
  "brand": "Apple",
  "state": "available"
}
```

**Valid States**: `available`, `in_use`, `inactive`

**Response** (201 Created):
```json
{
  "id": 1,
  "name": "iPhone 15",
  "brand": "Apple",
  "state": "available",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/device \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "brand": "Apple",
    "state": "available"
  }'
```

**Error Responses**:
- `400 Bad Request`: Missing required fields (`name` or `brand`)
- `409 Conflict`: Device already exists (if unique constraint exists)

### Get Device by ID

Retrieve a specific device by its ID.

**Endpoint**: `GET /api/device/:id`

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "iPhone 15",
  "brand": "Apple",
  "state": "available",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Example**:
```bash
curl http://localhost:3000/api/device/1
```

**Error Responses**:
- `400 Bad Request`: Invalid device ID format
- `404 Not Found`: Device not found

### Update a Device

Update an existing device. You can update any combination of `name`, `brand`, or `state`. The `createdAt` field cannot be updated.

**Endpoint**: `PUT /api/device/:id`

**Request Body** (all fields are optional, but at least one must be provided):
```json
{
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "state": "in_use"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "state": "in_use",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Example**:
```bash
curl -X PUT http://localhost:3000/api/device/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "state": "in_use"
  }'
```

**Error Responses**:
- `400 Bad Request`: Invalid device ID, no fields provided, or attempt to update `createdAt`
- `404 Not Found`: Device not found

### Delete a Device

Delete a device by its ID.

**Endpoint**: `DELETE /api/device/:id`

**Response** (200 OK):
```json
{
  "message": "Device deleted successfully"
}
```

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/device/1
```

**Error Responses**:
- `400 Bad Request`: Invalid device ID format
- `404 Not Found`: Device not found

### Get Devices by Brand

Retrieve all devices that match a specific brand.

**Endpoint**: `GET /api/device/brand/:brand`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "brand": "Apple",
    "state": "available",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 3,
    "name": "iPhone 14",
    "brand": "Apple",
    "state": "in_use",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

**Example**:
```bash
curl http://localhost:3000/api/device/brand/Apple
```

**Error Responses**:
- `400 Bad Request`: Brand parameter is missing

### Get Devices by State

Retrieve all devices that match a specific state.

**Endpoint**: `GET /api/device/state/:state`

**Valid States**: `available`, `in_use`, `inactive`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "brand": "Apple",
    "state": "available",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Galaxy S23",
    "brand": "Samsung",
    "state": "available",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Example**:
```bash
curl http://localhost:3000/api/device/state/available
```

**Error Responses**:
- `400 Bad Request`: State parameter is missing

## Running Tests

The project includes a comprehensive test suite that covers all API endpoints.

**Run all tests**:
```bash
npm test
```

The test suite will:
- Test all CRUD operations
- Test filtering by brand and state
- Test error handling (404, 400, etc.)
- Test validation (missing fields, invalid IDs)
- Clean up test data automatically

**Note**: Make sure your server is running before executing tests, as they make HTTP requests to `http://localhost:3000`.

## Project Structure

```
1global_task/
├── src/
│   ├── app/
│   │   ├── controllers/      # Request handlers
│   │   │   └── device.controller.ts
│   │   ├── middlewares/      # Express middlewares
│   │   │   └── errorHandler.ts
│   │   ├── routes/           # API route definitions
│   │   │   ├── device.routes.ts
│   │   │   └── index.ts
│   │   ├── services/         # Business logic
│   │   │   └── device.service.ts
│   │   └── app.ts            # Express app setup
│   ├── config/               # Configuration files
│   │   └── env.ts
│   ├── db/                   # Database connection
│   │   └── prisma.ts
│   ├── tests/                # Test files
│   │   ├── device.test.ts
│   │   └── run-tests.ts
│   └── server.ts             # Application entry point
├── prisma/
│   ├── migrations/           # Database migrations
│   └── schema.prisma         # Database schema
├── generated/                # Generated Prisma client
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image definition
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Development

### Development Mode

Run the server in development mode with hot-reload:

```bash
npm run dev
```

The server will automatically restart when you make changes to the code.

### Database Management

**View your database in Prisma Studio** (visual database browser):
```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your database records.

**Create a new migration**:
```bash
npx prisma migrate dev --name your_migration_name
```

**Reset the database** (⚠️ This will delete all data):
```bash
npx prisma migrate reset
```

### Code Structure

- **Controllers** (`src/app/controllers/`): Handle HTTP requests and responses, validate input
- **Services** (`src/app/services/`): Contain business logic and database operations
- **Routes** (`src/app/routes/`): Define API endpoints and map them to controllers
- **Middlewares** (`src/app/middlewares/`): Handle cross-cutting concerns like error handling
- **Config** (`src/config/`): Environment configuration and validation

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. **Check your `DATABASE_URL`** in the `.env` file
2. **Verify PostgreSQL is running**:
   ```bash
   # On macOS/Linux
   pg_isready
   
   # Or check Docker container
   docker-compose ps db
   ```
3. **Test the connection**:
   ```bash
   psql $DATABASE_URL
   ```

### Port Already in Use

If port 3000 is already in use:

1. **Change the port** in your `.env` file:
   ```env
   PORT=3001
   ```
2. **Or stop the process using port 3000**:
   ```bash
   # Find the process
   lsof -i :3000
   
   # Kill it (replace PID with actual process ID)
   kill -9 PID
   ```

### Docker Issues

If Docker containers aren't starting:

1. **Check Docker is running**:
   ```bash
   docker ps
   ```
2. **View container logs**:
   ```bash
   docker-compose logs app
   docker-compose logs db
   ```
3. **Rebuild containers**:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!

---

**Happy coding! 🚀**

