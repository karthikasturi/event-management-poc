# Event Management POC

A minimal proof-of-concept Event Management API built with Node.js and Express, following Test-Driven Development (TDD).

## Features

- Health check endpoint
- Event management (CRUD operations)
- In-memory storage (POC limitation)
- RESTful API design

## Prerequisites

- Node.js >= 18.0.0 < 23.0.0
- npm

## Local Development

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm test
```

### Run tests in watch mode (TDD)

```bash
npx jest --watch
```

### Start the server

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Running with Docker

### Build the Docker image

```bash
docker build -t event-management-poc .
```

### Run the container

```bash
docker run -p 3000:3000 event-management-poc
```

The API will be available at `http://localhost:3000`.

### Custom port mapping

```bash
docker run -p 8080:3000 event-management-poc
```

Access the API at `http://localhost:8080`.

### Set environment variables

```bash
docker run -p 3000:3000 -e PORT=3000 event-management-poc
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Events

See [design-docs/events-api-contract.md](design-docs/events-api-contract.md) for detailed API documentation.

## Testing the Dockerized Application

```bash
# Health check
curl http://localhost:3000/health

# Create an event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample Event","date":"2026-03-15","location":"Sample Location"}'

# List events
curl http://localhost:3000/api/events
```

## Important Notes

- **Data Persistence**: This POC uses in-memory storage. All data is lost when the container restarts.
- **Security**: Never commit `.env` files or hardcode secrets. Use environment variables via Docker's `-e` flag.
- **Development Mode**: For local development without Docker, use `npm start`.

## Tech Stack

- Node.js (LTS)
- Express (LTS)
- Jest (testing)
- Supertest (API testing)

## License

POC - Internal Use Only
# event-management-poc
