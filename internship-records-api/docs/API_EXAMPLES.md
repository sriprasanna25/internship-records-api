# Quick API examples

Use `http://localhost:3000` as the base URL.

## Health
```http
GET /health
```

## List
```http
GET /api/internships?page=1&limit=10
```

## Details
```http
GET /api/internships/1
```

## Create
```http
POST /api/internships
Content-Type: application/json

{
  "company": "Northstar Apps",
  "role": "Full Stack Intern",
  "location": "Remote",
  "mode": "Remote",
  "status": "Applied",
  "stipend": 4000,
  "notes": "Sample API request"
}
```

## Update
```http
PUT /api/internships/1
Content-Type: application/json

{
  "company": "Northstar Apps",
  "role": "Full Stack Intern",
  "location": "Remote",
  "mode": "Remote",
  "status": "Interview",
  "stipend": 4000,
  "notes": "Interview scheduled"
}
```

## Delete
```http
DELETE /api/internships/1
```

## Filter
```http
GET /api/internships?status=Applied&search=developer&page=1&limit=5
```
