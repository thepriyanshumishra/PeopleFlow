# Product Context

**Project Name:** PeopleFlow

**Version:** 1.0

---

# Overview

PeopleFlow is a modern Human Resource Management System (HRMS) built for the Odoo × Adamas University Hackathon.

The application digitizes essential HR operations such as employee management, attendance tracking, leave management, payroll visibility, and administrative approval workflows.

The objective is not to create the largest HRMS possible, but to build a production-quality, modular, scalable, and maintainable application that demonstrates strong software engineering principles.

---

# Project Goal

The project aims to demonstrate:

- Clean software architecture
- Strong relational database design
- Modular backend
- Professional frontend
- Secure authentication
- Production-quality engineering
- Meaningful AI integration

The application should resemble a lightweight enterprise SaaS platform inspired by Odoo.

---

# Target Users

Two user roles exist.

## Employee

An employee can:

- Login
- View profile
- Check attendance
- Apply for leave
- View payroll
- Receive notifications

---

## Administrator

An administrator can:

- Manage employees
- View attendance
- Approve leave
- Manage payroll
- Access organization-wide information

---

# Product Principles

The application should always remain:

- Simple
- Professional
- Modular
- Secure
- Maintainable
- Scalable
- Consistent

Every engineering decision should support these principles.

---

# AI Philosophy

Artificial Intelligence is intended to enhance existing workflows.

The current AI feature focuses on intelligent leave analysis.

AI should assist users rather than replace existing workflows.

Future AI capabilities may be added without changing the overall architecture.

---

# Technology Direction

The project follows a modern three-layer architecture.

Frontend

↓

Backend

↓

Relational Database

Communication occurs through authenticated REST APIs.

Business logic resides in the backend.

The database is the single source of truth.

---

# Documentation Index

The following documents define the project.

01_PRD.md

Defines the product requirements.

---

02_ARCHITECTURE.md

Defines the software architecture.

---

03_DATABASE.md

Defines the database schema and relationships.

---

04_API_CONTRACT.md

Defines frontend-backend communication.

---

05_UI_UX_GUIDE.md

Defines the visual design language.

---

06_AI_GUIDELINES.md

Defines how AI coding agents should contribute.

---

07_ENGINEERING_GUIDE.md

Defines the engineering workflow.

---

08_PRODUCT_CONTEXT.md

Provides high-level context for contributors.

---

# Source of Truth

Whenever conflicting information exists,

follow the documents in the following order.

PRD

↓

Architecture

↓

Database

↓

API Contract

↓

Engineering Guide

↓

UI Guide

↓

AI Guidelines

---

# Success Criteria

The project is considered successful when:

- Core HR workflows are functional.
- Authentication is secure.
- Database relationships are correctly implemented.
- APIs are consistent.
- UI follows the design language.
- AI adds meaningful value.
- Documentation accurately reflects implementation.

---

# Final Note

PeopleFlow should be built as if it were a real enterprise product.

The objective is not to maximize features.

The objective is to maximize software quality.