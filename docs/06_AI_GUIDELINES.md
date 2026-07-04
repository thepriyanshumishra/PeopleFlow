# AI Development Guidelines

**Project:** PeopleFlow  
**Version:** 1.0

---

# 1. Purpose

This document defines how Artificial Intelligence coding agents should contribute to the PeopleFlow project.

The goal is not to restrict creativity but to ensure every AI contribution remains consistent with the overall architecture, product vision, engineering standards, and project documentation.

AI should function as a collaborative software engineer rather than a simple code generator.

---

# 2. Core Philosophy

The primary objective is to build a high-quality Human Resource Management System.

Every implementation decision should prioritize:

- Maintainability
- Readability
- Scalability
- Simplicity
- Security
- Consistency

AI should avoid generating unnecessary complexity.

---

# 3. Before Writing Code

Before implementing any feature, always:

1. Read the Product Requirements Document.
2. Read the Architecture Document.
3. Read the Database Specification.
4. Read the API Contract.
5. Read the UI / UX Guide.
6. Understand the requested task.
7. Understand how the requested change affects the rest of the application.

Never start coding without understanding the existing project.

---

# 4. Think Before Implementing

Every implementation should follow the sequence:

Understand

↓

Analyze

↓

Plan

↓

Implement

↓

Validate

↓

Document

↓

Summarize

Avoid immediately generating code without reasoning about the broader impact.

---

# 5. Documentation First

The documentation represents the project's source of truth.

If implementation differs from the documentation, one of them is incorrect.

Whenever architecture, APIs, database design, or product functionality changes, update the corresponding documentation before considering the task complete.

Documentation changes are considered part of the implementation.

---

# 6. Improving the Design

AI is encouraged to improve the project when improvements are technically justified.

Examples include:

- Better API design
- Better database normalization
- Improved folder organization
- Cleaner architecture
- Better security
- Improved validation
- Better scalability

However, improvements must remain aligned with the product goals.

Avoid introducing unnecessary complexity.

---

# 7. Decision Making

Whenever multiple implementation approaches exist, prioritize the option that is:

- Easier to understand
- Easier to maintain
- More scalable
- More secure
- More modular

Avoid clever solutions when simpler alternatives exist.

---

# 8. Coding Principles

Follow these principles consistently.

- Single Responsibility Principle
- Separation of Concerns
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Modular Design
- Reusable Components
- Predictable Naming

---

# 9. Product Scope

Do not introduce unrelated features.

Examples of features that should not be added without explicit approval:

- Chat applications
- Social networking
- Blockchain
- Cryptocurrency
- Gamification
- Large analytics dashboards
- Complex animations

Only build features that support the Human Resource Management workflow.

---

# 10. AI Features

Artificial Intelligence should enhance workflows rather than replace them.

Preferred AI use cases include:

- Leave summarization
- Leave categorization
- Priority estimation
- HR assistance
- Attendance insights

Avoid adding AI where it provides little or no practical value.

---

# 11. Architecture Changes

Architecture changes are permitted.

However, before making architectural modifications, evaluate:

- Does it improve maintainability?
- Does it improve scalability?
- Does it simplify the codebase?
- Does it remain compatible with the project vision?

If the answer is yes, the change may proceed.

All related documentation must be updated.

---

# 12. Database Changes

Database modifications should prioritize data integrity.

When changing the schema:

- Preserve relationships where possible.
- Avoid unnecessary redundancy.
- Maintain referential integrity.
- Update the Database Specification.
- Update affected APIs.

---

# 13. API Changes

API improvements are allowed.

Examples:

- Better endpoint naming
- Better request structures
- Better response structures
- Improved consistency

Whenever APIs change:

- Update API_CONTRACT.md.
- Update dependent frontend code.
- Update backend implementation.
- Ensure backward compatibility where practical.

---

# 14. User Interface

The interface should remain consistent with the design system.

Avoid redesigning pages unless usability significantly improves.

Maintain consistency in:

- Colors
- Typography
- Buttons
- Cards
- Tables
- Navigation
- Forms

---

# 15. Error Handling

Every feature should handle expected failure cases.

Provide meaningful user-facing messages.

Avoid exposing internal implementation details in errors.

---

# 16. Security

Every implementation should consider security.

Examples:

- Input validation
- Authentication
- Authorization
- Password hashing
- SQL injection prevention
- XSS prevention
- Secure API communication

Never sacrifice security for convenience.

---

# 17. Performance

Optimize where appropriate, but do not optimize prematurely.

Prioritize:

- Efficient database queries
- Modular rendering
- Clean API design
- Minimal unnecessary network requests

---

# 18. Dependencies

Before introducing a new dependency, evaluate:

- Is it actively maintained?
- Does it significantly simplify implementation?
- Can the same result be achieved using existing tools?
- Does it increase project complexity?

Prefer fewer dependencies.

---

# 19. Code Reviews

Before considering any task complete, verify:

- Code compiles successfully.
- No existing functionality is broken.
- New functionality works correctly.
- Documentation is updated.
- Naming remains consistent.
- Architecture remains coherent.

---

# 20. Pull Request Checklist

Every completed contribution should satisfy:

- Feature implemented.
- Existing functionality preserved.
- Documentation updated.
- Validation added.
- Error handling included.
- Tests executed where applicable.
- No unnecessary code introduced.

---

# 21. Communication

When completing a task, provide a concise summary including:

- What was implemented.
- What changed.
- Why the change was made.
- Any architectural decisions.
- Documentation updated.
- Potential follow-up work.

This helps future contributors understand the evolution of the project.

---

# 22. Completion Criteria

A task is complete only when:

- Requirements are fully satisfied.
- Documentation reflects the implementation.
- Code follows project standards.
- Architecture remains consistent.
- No critical issues remain.
- The implementation is production-ready within the scope of the project.

---

# End of Document