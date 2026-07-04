# Database Design Specification

**Project:** PeopleFlow  
**Document Version:** 1.0  
**Status:** Draft  
**Related Documents:**
- 01_PRD.md
- 02_ARCHITECTURE.md

---

# 1. Purpose

This document defines the logical database design for PeopleFlow.

The database serves as the single source of truth for the application and is responsible for storing all persistent organizational data.

The design emphasizes:

- Data consistency
- Normalization
- Scalability
- Referential integrity
- Maintainability
- Performance

The schema is intentionally designed to support future expansion without major structural modifications.

---

# 2. Database Philosophy

PeopleFlow follows a relational database model.

Core principles include:

- Strong relationships
- Normalized schema
- Foreign key constraints
- Minimal redundancy
- Clear ownership of data
- Predictable naming conventions

The database should prioritize correctness over optimization during the MVP phase.

---

# 3. Database Engine

Preferred Database

PostgreSQL

Alternative

MySQL

The application should remain compatible with any modern relational SQL database with minimal modifications.

---

# 4. Naming Conventions

## Tables

Use plural nouns.

Examples

employees

attendance_records

leave_requests

departments

---

## Primary Keys

Every table contains

id

Integer
Auto Increment
Primary Key

---

## Foreign Keys

Always reference the parent table.

Example

employee_id

department_id

role_id

---

## Timestamp Columns

Every table should include

created_at

updated_at

Whenever applicable

deleted_at

for soft deletion.

---

# 5. Core Entities

The PeopleFlow database consists of the following primary entities.

- Roles
- Departments
- Employees
- Attendance Records
- Leave Types
- Leave Requests
- Payroll
- Documents
- Notifications

---

# 6. Entity Relationship Overview

```
Role
│
└──── Employees
          │
          ├──────── Attendance Records
          │
          ├──────── Leave Requests
          │
          ├──────── Payroll
          │
          ├──────── Documents
          │
          └──────── Notifications

Departments
      │
      └──────── Employees

Leave Types
      │
      └──────── Leave Requests
```

---

# 7. Table Specifications

---

## Roles

Purpose

Defines application roles.

Columns

- id
- name
- description
- created_at
- updated_at

Sample Data

Admin

Employee

Future roles

HR

Manager

Supervisor

---

## Departments

Purpose

Represents company departments.

Columns

- id
- name
- description
- created_at
- updated_at

Example

IT

Finance

Marketing

HR

Sales

Operations

---

## Employees

Purpose

Stores employee information.

Columns

- id
- employee_id
- first_name
- last_name
- email
- password_hash
- phone
- address
- profile_picture
- department_id
- role_id
- joining_date
- designation
- status
- created_at
- updated_at

Relationships

Belongs To

Department

Role

Has Many

Attendance

Leave Requests

Documents

Notifications

Payroll

---

## Attendance Records

Purpose

Stores employee attendance.

Columns

- id
- employee_id
- attendance_date
- check_in
- check_out
- total_hours
- attendance_status
- created_at
- updated_at

Attendance Status

Present

Absent

Half Day

Leave

Late

---

## Leave Types

Purpose

Defines leave categories.

Columns

- id
- leave_name
- description

Examples

Paid Leave

Sick Leave

Unpaid Leave

---

## Leave Requests

Purpose

Stores employee leave applications.

Columns

- id
- employee_id
- leave_type_id
- start_date
- end_date
- reason
- ai_summary
- ai_priority
- status
- admin_comment
- approved_by
- created_at
- updated_at

Status

Pending

Approved

Rejected

---

## Payroll

Purpose

Stores payroll information.

Columns

- id
- employee_id
- basic_salary
- allowances
- deductions
- tax
- net_salary
- salary_month
- salary_year
- updated_by
- created_at
- updated_at

Employees have read-only access.

Administrators have write access.

---

## Documents

Purpose

Stores uploaded employee documents.

Columns

- id
- employee_id
- document_name
- document_type
- file_path
- uploaded_at

Examples

Resume

PAN

Aadhaar

Offer Letter

Certificates

---

## Notifications

Purpose

Stores system notifications.

Columns

- id
- employee_id
- title
- message
- notification_type
- is_read
- created_at

Examples

Leave Approved

Payroll Generated

Attendance Updated

---

# 8. Relationships

Roles

1 → Many Employees

Departments

1 → Many Employees

Employees

1 → Many Attendance Records

Employees

1 → Many Leave Requests

Employees

1 → Many Documents

Employees

1 → Many Notifications

Employees

1 → One Payroll Record (per salary period)

Leave Types

1 → Many Leave Requests

---

# 9. Referential Integrity

Every foreign key must enforce referential integrity.

Deleting parent records should never leave orphan records.

Preferred strategy

Restrict deletion.

Soft delete employees instead of permanently removing records.

---

# 10. Indexing Strategy

Indexes should be created on frequently queried columns.

Recommended indexes

employee_id

email

department_id

role_id

attendance_date

leave_status

salary_month

salary_year

---

# 11. Constraints

Email must be unique.

Employee ID must be unique.

Role cannot be NULL.

Department cannot be NULL.

Attendance status must match predefined values.

Leave status must match predefined values.

Salary cannot be negative.

Check-out time cannot occur before check-in.

Leave start date cannot be after end date.

---

# 12. Audit Fields

Every transactional table should contain

created_at

updated_at

Whenever possible

created_by

updated_by

These fields improve debugging and accountability.

---

# 13. AI Generated Fields

Some data is generated automatically by AI.

Examples

Leave Request

ai_summary

ai_priority

future:

sentiment_score

risk_score

These fields are optional and should never replace user-provided information.

---

# 14. Data Validation

Validation occurs before insertion.

Examples

Valid email

Required fields

Positive salary

Valid dates

Valid attendance status

Valid leave type

The database acts as the final validation layer.

---

# 15. Future Expansion

The schema is intentionally designed to support future modules.

Potential additions include

- Recruitment
- Performance Reviews
- Organization Hierarchy
- Company Assets
- Shift Scheduling
- Employee Training
- Expense Management
- Travel Requests
- Company Announcements

These additions should require minimal changes to existing tables.

---

# 16. Database Security

Sensitive information must never be stored in plaintext.

Passwords must always be hashed.

Personally identifiable information should be protected.

Database credentials must never be committed to source control.

---

# 17. Database Design Principles

The schema follows these principles.

- Third Normal Form (3NF)
- Referential Integrity
- Minimal Redundancy
- Clear Ownership
- Scalable Relationships
- Predictable Naming
- Future Expandability

---

# 18. Definition of Completion

The database specification is considered complete when

- Every entity is defined.
- Every relationship is documented.
- Every foreign key is identified.
- Naming conventions are followed.
- Constraints are specified.
- Future scalability has been considered.
- Documentation matches implementation.

---

# End of Document