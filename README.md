# WebhookCenter API

WebhookCenter API is a robust Webhook management system. It allows you to manage and process incoming webhooks in a structured and efficient manner.

## 1. Getting Started

### 1.1 Application and Documentation

You can access the application and its documentation at the following URLs after setup:

- Application: http://localhost:3000/api/v1
- Documentation: http://localhost:3000/documentation

### 1.2 Prerequisites

Before you begin, ensure you have the following software installed on your workstation:

- [Node.js](https://nodejs.org/en/download/package-manager)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/products/docker-desktop) (Optional)

### 1.3 Project Setup

To set up the project on your local machine, follow these steps:

Clone the repository to your local machine:

```sh
git clone https://github.com/emmabraboke/webhook-center
```

Navigate into the project directory:

```sh
cd webhook-center
```

Install the project dependencies:

```sh
npm install
```

Create a `.env` file in the root directory of the project. This file should mirror the `.env.sample` file provided in the repository. Fill in the necessary environment variables.

```sh
cp .env.sample .env
vi .env
```

### 1.4 Running the Application

After setting up the project, you can run the application using Node.js or Docker.

To run the application using Node.js:

```sh
npm run start:prod
```

To run the application using Docker:

First, build the Docker image:

```sh
docker build -t webhook-center .
```

Then, run the Docker container:

```sh
docker run --env-file .env -p 3000:3000 -d webhook-center
```

The application will be accessible at `http://localhost:3000/api/v1` and the documentation at `http://localhost:3000/documentation`.

## 2. Technologies Used

The WebhookCenter API is built with the following technologies:

- Node.js
- NestJS
- PostgreSQL
