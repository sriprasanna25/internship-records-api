# Internship Records REST API

A beginner-friendly REST API built with **Node.js, Express, SQLite, and Zod**. It supports CRUD operations, input validation, pagination, filtering, and persistent storage.

## 1. Requirements

- Node.js 18 or later
- npm
- VS Code (recommended)
- Postman, Thunder Client, or curl for API testing

Check your installation:

```bash
node -v
npm -v
```

## 2. Install and run

Open this project folder in VS Code. In the terminal, run:

```bash
npm install
```

Copy `.env.example` to `.env` (on Windows PowerShell):

```powershell
Copy-Item .env.example .env
```

Seed the sample data:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

The API will run at `http://localhost:3000`.

For normal start without auto-reload:

```bash
npm start
```

## 3. Data model

Each internship record contains:

| Field | Type | Required | Rules |
|---|---|---:|---|
| id | integer | generated | Primary key |
| company | string | yes | 2–100 characters |
| role | string | yes | 2–100 characters |
| location | string | yes | 2–100 characters |
| mode | string | yes | Remote, Hybrid, On-site |
| status | string | yes | Applied, Interview, Offered, Rejected, Completed |
| startDate | date string | no | YYYY-MM-DD |
| endDate | date string | no | YYYY-MM-DD; not before startDate |
| stipend | number | no | Zero or greater |
| applicationUrl | URL string | no | Must be a valid URL |
| notes | string | no | Maximum 1,000 characters |
| createdAt / updatedAt | timestamp | generated | Managed by the API |

The API uses SQLite. The database file is created automatically at `data/internships.db`.

## 4. API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose | Success status |
|---|---|---|---:|
| GET | `/health` | Health check | 200 |
| GET | `/api/internships` | List records | 200 |
| GET | `/api/internships/:id` | Get one record | 200 |
| POST | `/api/internships` | Create record | 201 |
| PUT | `/api/internships/:id` | Replace/update record | 200 |
| DELETE | `/api/internships/:id` | Delete record | 200 |

### List, pagination, and filtering

```http
GET /api/internships?page=1&limit=10
GET /api/internships?status=Applied
GET /api/internships?search=developer
GET /api/internships?page=1&limit=5&status=Interview&search=backend
```

`page` defaults to 1. `limit` defaults to 10 and must be between 1 and 100. Search checks company, role, and location.

### Create example

```http
POST /api/internships
Content-Type: application/json
```

```json
{
  "company": "Example Technologies",
  "role": "Node.js Intern",
  "location": "Remote",
  "mode": "Remote",
  "status": "Applied",
  "startDate": "2026-12-01",
  "endDate": "2027-01-01",
  "stipend": 5000,
  "applicationUrl": "https://example.com/apply",
  "notes": "Applied through the company website."
}
```

### Update example

Send all editable fields with `PUT /api/internships/1`. The request body follows the same format as the create example.

### Delete example

```http
DELETE /api/internships/1
```

## 5. Response format

Successful list response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Successful create/detail/update response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "company": "Example Technologies",
    "role": "Node.js Intern",
    "location": "Remote",
    "mode": "Remote",
    "status": "Applied",
    "startDate": "2026-12-01",
    "endDate": "2027-01-01",
    "stipend": 5000,
    "applicationUrl": "https://example.com/apply",
    "notes": "Applied through the company website.",
    "createdAt": "2026-11-17 12:00:00",
    "updatedAt": "2026-11-17 12:00:00"
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "company",
        "message": "String must contain at least 2 character(s)"
      }
    ]
  }
}
```

## 6. Status codes

- `200 OK` — read, update, or delete completed.
- `201 Created` — record created.
- `400 Bad Request` — invalid JSON, query, or input.
- `404 Not Found` — record or route does not exist.
- `500 Internal Server Error` — unexpected server error.

## 7. Test checklist

1. Open `http://localhost:3000/health` and confirm the API responds.
2. List records with `GET /api/internships`.
3. Open a record using its ID.
4. Create a record with valid JSON; expect `201`.
5. Try an invalid `mode` or missing required field; expect `400`.
6. Update an existing record with `PUT`.
7. Delete a record with `DELETE`.
8. Request a missing ID; expect `404`.
9. Test pagination with `?page=1&limit=2`.
10. Stop and restart the server, then list records to confirm SQLite persistence.

## 8. Project structure

```text
internship-records-api/
├── data/
│   └── seed.json
├── docs/
│   └── API_EXAMPLES.md
├── src/
│   ├── app.js
│   ├── db.js
│   ├── routes.js
│   ├── seed.js
│   ├── server.js
│   └── validation.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── schema.sql
```

## 9. Notes

- The sample records are demonstration data. Two records use fictional sample companies.
- The SQLite database is generated locally and excluded from Git.
- Do not commit your `.env` file or private credentials.
- This task is an API/backend deliverable; a separate frontend is not required by the supplied task brief.
