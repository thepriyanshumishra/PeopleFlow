# API Contract Specification

**Project:** PeopleFlow  
**Document Version:** 1.0  
**Status:** Draft  
**Related Documents:**
- 01_PRD.md
- 02_ARCHITECTURE.md
- 03_DATABASE.md

---

# 1. Purpose

This document defines the REST API contract between the frontend and backend of PeopleFlow.

The API Contract serves as the single source of truth for all communication between the client application and the backend services.

Both frontend and backend implementations must follow this specification.

If any endpoint, request structure, or response structure changes, this document must be updated immediately.

---

# 2. API Design Principles

The API follows RESTful principles.

Goals:

- Predictable endpoints
- Consistent naming
- Stateless communication
- JSON request/response
- Proper HTTP status codes
- Easy extensibility
- Secure authentication

---

# 3. Base URL

Development

/api/v1

Example

/api/v1/auth/login

---

# 4. Response Format

Every successful response should follow a consistent structure.

```json
{
    "success": true,
    "message": "Operation successful.",
    "data": {}
}
```

---

Every failed request should follow

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": []
}
```

---

# 5. Authentication

Authentication Method

JWT Bearer Token

Header

Authorization: Bearer <token>

Every protected endpoint must validate

- Authentication
- User Role
- Token Validity

---

# 6. Roles

Supported Roles

Employee

Admin

---

# 7. Authentication APIs

---

## Register

POST

/api/v1/auth/register

Authentication Required

No

Purpose

Create new employee account.

Request

```json
{
    "firstName": "",
    "lastName": "",
    "email": "",
    "password": "",
    "employeeId": ""
}
```

Response

```json
{
    "success": true,
    "message": "Registration successful."
}
```

---

## Login

POST

/api/v1/auth/login

Request

```json
{
    "email": "",
    "password": ""
}
```

Response

```json
{
    "success": true,
    "token": "...",
    "user": {
        "id": 1,
        "role": "Employee"
    }
}
```

---

## Logout

POST

/api/v1/auth/logout

Authentication Required

Yes

---

## Get Current User

GET

/api/v1/auth/me

Returns

Current logged-in user.

---

# 8. Employee APIs

---

## Get Profile

GET

/api/v1/profile

Role

Employee

Admin

---

## Update Profile

PUT

/api/v1/profile

Allowed Fields

- phone
- address
- profilePicture

Admin may update additional fields.

---

## Upload Profile Image

POST

/api/v1/profile/image

Multipart Form Data

---

# 9. Attendance APIs

---

## Check In

POST

/api/v1/attendance/check-in

Response

```json
{
    "status":"Present",
    "checkIn":"09:05 AM"
}
```

---

## Check Out

POST

/api/v1/attendance/check-out

---

## Get Attendance

GET

/api/v1/attendance

Query Parameters

date

month

year

status

---

## Get Attendance Summary

GET

/api/v1/attendance/summary

Returns

- Present
- Absent
- Half Day
- Leave

Statistics

---

# 10. Leave APIs

---

## Apply Leave

POST

/api/v1/leave

Request

```json
{
    "leaveType":"Sick Leave",
    "startDate":"",
    "endDate":"",
    "reason":""
}
```

---

Response

```json
{
    "status":"Pending"
}
```

---

## Get My Leave Requests

GET

/api/v1/leave

---

## Get All Leave Requests

GET

/api/v1/admin/leaves

Admin Only

---

## Approve Leave

PUT

/api/v1/admin/leave/{id}/approve

---

## Reject Leave

PUT

/api/v1/admin/leave/{id}/reject

Request

```json
{
    "comment":""
}
```

---

# 11. Payroll APIs

---

## Get Payroll

GET

/api/v1/payroll

Employee

Returns

Own payroll.

---

## Get All Payroll

GET

/api/v1/admin/payroll

Admin Only

---

## Update Payroll

PUT

/api/v1/admin/payroll/{id}

Admin Only

---

# 12. Employee Management APIs

Admin Only

---

## Get Employees

GET

/api/v1/admin/employees

---

## Get Employee

GET

/api/v1/admin/employees/{id}

---

## Update Employee

PUT

/api/v1/admin/employees/{id}

---

## Delete Employee

DELETE

/api/v1/admin/employees/{id}

Soft Delete

---

# 13. Notification APIs

GET

/api/v1/notifications

---

PUT

/api/v1/notifications/read

---

DELETE

/api/v1/notifications/{id}

---

# 14. AI APIs

---

## Analyze Leave

POST

/api/v1/ai/leave-analysis

Purpose

Generate

- Summary
- Suggested Leave Type
- Priority

Request

```json
{
    "reason":""
}
```

Response

```json
{
    "summary":"",
    "suggestedType":"",
    "priority":""
}
```

---

# 15. HTTP Status Codes

200

Success

201

Created

204

No Content

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Error

500

Internal Server Error

---

# 16. Validation Rules

Email

Valid Email

Password

Minimum Length

Employee ID

Unique

Leave

Start Date ≤ End Date

Attendance

Cannot Check Out before Check In

---

# 17. Pagination

Collection endpoints should support

page

limit

search

sort

Example

/api/v1/admin/employees?page=1&limit=20

---

# 18. Filtering

Attendance

status

date

month

Leave

status

leaveType

Payroll

month

year

---

# 19. API Versioning

Current Version

v1

Future versions should not break existing clients.

---

# 20. Security

Every protected endpoint must

Validate JWT

Validate User Role

Validate Ownership

Sanitize Inputs

Prevent SQL Injection

Prevent XSS

---

# 21. Documentation Policy

Whenever an endpoint changes

Update

- API Contract
- Architecture
- Database (if required)

before implementation is considered complete.

---

# 22. Definition of Completion

The API layer is considered complete when

- Every endpoint is documented.
- Request schema is defined.
- Response schema is defined.
- Roles are defined.
- Validation rules are documented.
- Error handling is consistent.
- Documentation matches implementation.

---

# End of Document