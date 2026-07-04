# Product Requirements Document (PRD)

**Project Name:** PeopleFlow  
**Product Type:** Human Resource Management System (HRMS)  
**Version:** 1.0  
**Status:** Draft  
**Prepared For:** Odoo × Adamas University Hackathon 2026

---

# 1. Executive Summary

PeopleFlow is a modern Human Resource Management System (HRMS) designed to digitize and simplify everyday HR operations within an organization. The platform provides employees and administrators with a centralized workspace for managing attendance, leave requests, employee profiles, payroll visibility, and approval workflows.

Unlike traditional academic CRUD projects, PeopleFlow aims to simulate a real business application with production-oriented architecture, modular design, secure authentication, and a clean user experience inspired by Odoo's design philosophy.

The project is being developed as part of the Odoo × Adamas University Hackathon 2026, where emphasis is placed on thoughtful architecture, database design, maintainable code, scalability, usability, and meaningful integration of Artificial Intelligence.

---

# 2. Product Vision

To create a clean, scalable, and intelligent Human Resource Management System that reduces manual HR operations while delivering an intuitive experience for both employees and administrators.

The platform should feel like a lightweight SaaS product rather than a classroom assignment.

---

# 3. Problem Statement

Many organizations still perform several HR tasks manually or through disconnected systems.

Examples include:

- Manual attendance recording
- Spreadsheet-based leave tracking
- Offline payroll visibility
- Paper-based employee records
- Email-based leave approvals
- Poor visibility of employee information

These processes become inefficient as organizations grow.

PeopleFlow addresses these issues by providing one centralized platform for HR management.

---

# 4. Goals

The primary goals of PeopleFlow are:

- Digitize core HR operations.
- Reduce manual administrative work.
- Provide role-based access control.
- Improve transparency between employees and HR.
- Maintain accurate attendance records.
- Simplify leave approval workflows.
- Allow employees to securely view payroll information.
- Demonstrate production-ready software engineering practices.
- Showcase clean architecture and scalable backend design.

---

# 5. Non Goals

The following features are intentionally excluded from the project scope:

- Recruitment management
- Job postings
- Interview scheduling
- Performance reviews
- Employee onboarding automation
- Company-wide messaging platform
- Video conferencing
- Multi-company support
- Tax calculation engine
- Accounting integration
- Mobile applications

These features may be considered future enhancements but are not required for the hackathon MVP.

---

# 6. Target Users

The application supports two primary user roles.

## Employee

An employee can:

- Register an account
- Login securely
- View personal profile
- Edit permitted profile fields
- Upload profile photo
- View attendance history
- Check-in
- Check-out
- Apply for leave
- Track leave request status
- View payroll information
- Receive notifications

The employee cannot:

- View other employees' information
- Approve leave
- Modify payroll
- Edit attendance records
- Access administrator tools

---

## Administrator / HR Officer

The administrator has elevated permissions.

An administrator can:

- View all employees
- Manage employee records
- Edit employee information
- View organization attendance
- Approve or reject leave requests
- Add comments to leave requests
- View payroll information
- Modify payroll structure
- Access employee documents
- View organization-wide records

---

# 7. Product Principles

PeopleFlow follows several product principles throughout development.

## Simplicity

The interface should remain minimal and uncluttered.

Every screen should focus on one primary objective.

---

## Consistency

Navigation, colors, spacing, typography, buttons, and layouts should remain consistent throughout the application.

---

## Security

Every request must be authenticated.

Every sensitive action must be authorized.

Passwords should never be stored in plain text.

---

## Reliability

Every important action should provide meaningful user feedback.

Users should never wonder whether an operation succeeded.

---

## Scalability

The architecture should allow additional modules to be added later without requiring major redesign.

---

## Accessibility

Forms should be easy to understand.

Error messages should be descriptive.

Layouts should remain readable across screen sizes.

---

# 8. User Personas

## Persona 1 — Employee

Name:
Priyanshu

Goals:

- Check attendance
- Apply for leave
- View payroll
- Manage profile

Pain Points:

- Manual attendance records
- Slow HR communication
- Difficulty tracking leave

---

## Persona 2 — HR Officer

Name:
Sarah

Goals:

- Manage employees
- Approve leave
- Monitor attendance
- Maintain payroll records

Pain Points:

- Manual spreadsheets
- Duplicate data
- Slow approval process

---

# 9. User Journey

## Employee Journey

Register

↓

Verify account

↓

Login

↓

Dashboard

↓

Choose one of:

- Profile
- Attendance
- Leave
- Payroll

↓

Logout

---

### Attendance Flow

Dashboard

↓

Check In

↓

Work Day

↓

Check Out

↓

Attendance History Updated

---

### Leave Flow

Dashboard

↓

Leave Page

↓

Select Leave Type

↓

Select Date Range

↓

Enter Reason

↓

Submit

↓

Pending Approval

↓

Admin Decision

↓

Approved / Rejected

---

## Administrator Journey

Login

↓

Admin Dashboard

↓

Employees

↓

Attendance

↓

Leave Requests

↓

Payroll

↓

Logout

---

# 10. Core Modules

The application consists of the following major modules.

1. Authentication
2. Dashboard
3. Employee Profile
4. Attendance Management
5. Leave Management
6. Payroll
7. Notifications
8. AI Assistance

---

# 11. Authentication Module

Features:

- User Registration
- Login
- Logout
- Password Validation
- Email Validation
- Role Selection
- JWT Authentication
- Session Management

Expected Behaviour:

Only authenticated users may access the application.

---

# 12. Dashboard Module

Employee Dashboard displays:

- Welcome message
- Quick Action Cards
- Attendance Status
- Pending Leave Requests
- Notifications

Admin Dashboard displays:

- Employee Overview
- Pending Leave Requests
- Attendance Overview
- Payroll Summary

---

# 13. Profile Module

Employees can:

- View profile
- Edit limited fields
- Upload profile picture

Administrators can:

- Edit all employee information
- View employee documents
- Update job details

---

# 14. Attendance Module

Employee Features:

- Check In
- Check Out
- Daily View
- Weekly View
- Attendance History

Administrator Features:

- View all attendance
- Filter attendance
- Search employee
- Monitor attendance status

Attendance Status:

- Present
- Absent
- Half Day
- Leave

---

# 15. Leave Management Module

Employee:

- Apply Leave
- Select Leave Type
- Choose Date Range
- Enter Reason
- Track Status

Administrator:

- View Requests
- Approve
- Reject
- Add Comment

Leave Types:

- Paid Leave
- Sick Leave
- Unpaid Leave

Statuses:

- Pending
- Approved
- Rejected

---

# 16. Payroll Module

Employee:

Read-only payroll information.

Administrator:

- View payroll
- Update salary structure
- Maintain payroll records

---

# 17. AI Features

Artificial Intelligence should provide meaningful assistance instead of acting as a generic chatbot.

Planned AI capabilities include:

## AI Leave Assistant

When an employee submits a leave request, AI analyzes the reason and generates:

- Short summary
- Suggested leave category
- Priority level
- Administrative recommendation

Example:

Employee Input:

"I have a viral fever and need three days of rest."

AI Output:

Summary:
Medical leave request due to illness.

Suggested Type:
Sick Leave

Priority:
High

Recommendation:
Medical documentation may be required.

---

Additional AI features may include:

- Attendance insights
- Employee profile summarization
- HR assistance
- Notification generation

AI should always enhance workflows rather than replace them.

---

# 18. Success Metrics

The project will be considered successful if it satisfies the following objectives:

- Complete authentication flow
- Functional employee dashboard
- Functional administrator dashboard
- Attendance tracking
- Leave approval workflow
- Payroll visibility
- Responsive interface
- Secure authentication
- Clean database structure
- Production-quality architecture
- Meaningful AI integration

---

# 19. Constraints

Project constraints include:

- Limited hackathon development time
- Team-based parallel development
- Modular architecture
- Production-quality code
- PostgreSQL/MySQL relational database
- Minimal third-party dependencies
- AI integration should provide real value

---

# 20. Future Enhancements

Potential future improvements include:

- Recruitment Module
- Employee Performance Reviews
- Organization Charts
- Shift Scheduling
- Multi-company Support
- Email Notifications
- Mobile Applications
- Analytics Dashboard
- Payroll Automation
- Calendar Integration
- Face Recognition Attendance
- HR Chat Assistant
- Employee Self-Service Portal

---

# 21. Definition of Done

The project shall be considered complete when:

- All core modules are functional.
- Authentication is secure.
- Role-based access is enforced.
- Database relationships are correctly implemented.
- APIs are fully operational.
- UI follows a consistent design language.
- AI features function as expected.
- Documentation remains synchronized with implementation.
- The application can be demonstrated end-to-end without critical failures.

---

# End of Document