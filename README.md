# Financial Support Assistant API

A Node.js and Express RESTful API powered by Google Gemini AI. The application processes user financial queries, dynamically routes intent, retains multi-turn session context, and returns a standardized JSON response envelope.

---

## Architecture Overview

```mermaid
flowchart TD
    A[Client / Postman UI] --> B[Express Application<br/>app.js / server.js]

    B --> C[GET /health & /docs]
    B --> D[POST /api/chat]

    D --> E[Request Validation<br/>Zod Schema]
    E --> F[Chat Controller]

    F --> G[Session Store<br/>InMemory History]
    F --> H[LLM Router<br/>Gemini 1.5 Flash]
    F --> I[Tools & Services<br/>Stock / Fundamentals]

    G --> J[Response]
    H --> J
    I --> J
    J --> A
```

---

## Features

* **LLM Intent Routing:** Classifies incoming user messages into `greeting`, `stock_price`, `fundamentals`, or `knowledge_base`.
* **Tool Execution:** Fetches stock quotes, company fundamentals, or searches knowledge base documentation based on the identified intent.
* **Context Preservation:** Retains conversation history on a per-`sessionId` basis to allow contextual follow-up queries.
* **Schema Validation:** Validates incoming payloads using Zod middleware before controller execution.
* **Standardized JSON Envelope:** Enforces a consistent response structure (`{ "success": boolean, ... }`) across endpoints, including application errors.

---

## Setup & Local Installation

### Prerequisites

* Node.js v18 or higher
* npm or yarn
* Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/MojahidSayad/Financial-Assistant-API.git
cd Financial-Assistant-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
LLM_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-1.5-flash
```

### 4. Start the Application

**Development Mode (with nodemon):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

---

## Live API & Swagger Documentation

The API is deployed and available for live testing.

### Live Swagger Documentation

**Swagger UI:**
https://financial-assistant-api.onrender.com/docs/

The interactive Swagger UI can be used to explore the available endpoints, view request/response schemas, and test the API directly from the browser.

### Test Login Credentials

```text
Email: admin@financial.com
Password: password123
```

> **Note:** These credentials are provided for testing the deployed API only. Do not use production credentials in a public README.

---

## Environment Variables

| **Variable**  | **Description**                                                        | **Default**        |
| ------------- | ---------------------------------------------------------------------- | ------------------ |
| `PORT`        | The port for the Express server to listen on.                          | `3000`             |
| `LLM_API_KEY` | Google Gemini AI API key for intent classification and text synthesis. | Required           |
| `LLM_MODEL`   | Gemini AI model identifier.                                            | `gemini-1.5-flash` |

---

## API Documentation

### Local Swagger Documentation

When running the application locally, interactive Swagger documentation is available at:

```text
http://localhost:3000/docs
```

### Endpoints Summary

| **Method** | **Endpoint** | **Description**                                            |
| ---------- | ------------ | ---------------------------------------------------------- |
| `GET`      | `/health`    | Check server health and operational status.                |
| `POST`     | `/api/chat`  | Process chat requests using context and intent processing. |
| `GET`      | `/docs`      | Open the interactive Swagger API documentation.            |

---

## Example Requests & Responses

### 1. Health Check

**Endpoint:** `GET /health`

**Request:**

```http
GET http://localhost:3000/health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "message": "Server is running!"
}
```

---

### 2. Stock Price Query

**Endpoint:** `POST /api/chat`

**Request Body:**

```json
{
  "sessionId": "postman-flow-101",
  "message": "What is the current stock price of TCS?"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "sessionId": "postman-flow-101",
  "intent": "stock_price",
  "data": {
    "symbol": "TCS",
    "price": 4120.50,
    "currency": "INR"
  },
  "response": "The current market price of Tata Consultancy Services (TCS) is ₹4,120.50."
}
```

---

### 3. Missing Body Parameter

**Endpoint:** `POST /api/chat`

**Request Body:**

```json
{
  "sessionId": "postman-flow-101"
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "message is required and cannot be empty."
  }
}
```

---

## Design Decisions

### Modular Architecture

Express routing, input validation, intent logic, and response formatting are explicitly separated into dedicated modules such as `/routes`, `/middleware`, `/controllers`, and `/services`.

### Zod Middleware Validation

Ensures invalid payloads fail at the HTTP boundary before calling external LLM APIs.

### JSON Output Standardization

Enforces structured output formatting (`{ success, data, error }`) globally through centralized error-handling middleware.

---

## Known Limitations

* **In-Memory Session Store:** Session state and conversation history are stored in memory and reset upon server restart.
* **Mocked Tool Integrations:** Financial stock data and fundamental metrics rely on simulated values rather than live exchange APIs.

---

## License

This project is for educational and development purposes.
