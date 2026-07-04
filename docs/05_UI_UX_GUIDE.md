# UI / UX Design Guide

**Project:** PeopleFlow  
**Document Version:** 1.0  
**Status:** Draft

Related Documents

- PRD
- Architecture
- API Contract

---

# 1. Purpose

This document defines the visual identity, interaction principles, and user experience guidelines for PeopleFlow.

Its purpose is to ensure every screen follows a consistent design language regardless of which developer or AI coding agent implements it.

This document defines **what the interface should feel like**, not how it should be coded.

---

# 2. Design Philosophy

PeopleFlow is inspired by modern enterprise software such as Odoo.

The design should prioritize:

- Simplicity
- Professionalism
- Consistency
- Readability
- Productivity

The application is intended for daily business use.

The interface should reduce cognitive load rather than impress users with animations.

---

# 3. Design Principles

## Minimal First

Every screen should contain only the information required for the current task.

Avoid unnecessary decorations.

---

## Business Focused

The interface should resemble a professional SaaS dashboard rather than a marketing website.

---

## Functional Beauty

Visual design should support usability.

Good design is invisible.

---

## Consistency

Buttons

Cards

Tables

Typography

Spacing

Colors

Navigation

must remain consistent throughout the application.

---

## Accessibility

Text should always remain readable.

Color should never be the only indicator of state.

Buttons should be easily clickable.

Forms should provide clear feedback.

---

# 4. Visual Identity

Overall style

Modern

Professional

Minimal

Enterprise

Soft

Friendly

---

Avoid

Glassmorphism

Neumorphism

Heavy gradients

Excessive shadows

Animated backgrounds

Overly colorful interfaces

---

# 5. Color Palette

## Primary

Odoo Purple

```
#714B67
```

---

## Primary Hover

```
#5D3D55
```

---

## Background

```
#F7F8FA
```

---

## Surface

```
#FFFFFF
```

---

## Primary Text

```
#222222
```

---

## Secondary Text

```
#666666
```

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Error

```
#EF4444
```

---

## Border

```
#E5E7EB
```

---

# 6. Typography

Preferred fonts

Inter

or

Poppins

Fallback

Sans-serif

---

Heading 1

32px

Bold

---

Heading 2

24px

Semi Bold

---

Heading 3

20px

Medium

---

Body

16px

Regular

---

Caption

14px

Regular

---

Buttons

16px

Medium

---

# 7. Spacing System

Use an 8-point spacing system.

Examples

8

16

24

32

40

48

This creates visual consistency.

---

# 8. Border Radius

Cards

12px

Buttons

10px

Input Fields

10px

Modals

16px

---

# 9. Shadows

Use soft shadows.

Example

```
0 4px 12px rgba(0,0,0,0.08)
```

Avoid dramatic shadows.

---

# 10. Icons

Use one consistent icon library.

Preferred

Lucide

Alternative

Heroicons

Avoid mixing icon libraries.

---

# 11. Layout

Desktop-first

Responsive

Centered content

Maximum readable width

Consistent padding

Navigation should remain predictable.

---

# 12. Navigation

Top Navigation

Contains

Logo

Dashboard

Attendance

Leave

Payroll

Profile

Notifications

Avatar

---

Avatar Menu

My Profile

Settings

Logout

---

Navigation should remain visible across the application.

---

# 13. Dashboard

The dashboard is the application's primary workspace.

Employee Dashboard should display

Welcome Message

Quick Actions

Attendance Status

Pending Leave

Recent Activity

Notifications

---

Admin Dashboard should display

Employee Count

Pending Approvals

Attendance Summary

Payroll Summary

Recent Activities

---

# 14. Cards

Cards are the primary UI component.

Every card should include

Title

Content

Optional Action

Optional Status

Avoid overcrowding cards.

---

# 15. Forms

Forms should be simple.

Every form must include

Labels

Placeholders

Validation

Helpful Errors

Success Feedback

Loading State

Required fields should be clearly marked.

---

# 16. Tables

Tables should support

Sorting

Searching

Filtering

Pagination

Responsive Layout

Hover States

---

# 17. Buttons

Primary

Purple Background

White Text

---

Secondary

White Background

Purple Border

---

Danger

Red

---

Disabled

Gray

---

Loading

Spinner

Disabled

---

# 18. Inputs

Inputs should have

Consistent height

Rounded corners

Clear labels

Focus state

Error state

Success state

---

# 19. Status Badges

Present

Green

Absent

Red

Pending

Orange

Approved

Green

Rejected

Red

Late

Yellow

---

# 20. Notifications

Notifications should be

Brief

Actionable

Non-intrusive

Grouped when possible

---

# 21. Empty States

Instead of empty tables

Show

Illustration

Helpful Message

Primary Action

Example

"No leave requests found."

Button

"Apply Leave"

---

# 22. Loading States

Every asynchronous action should display loading feedback.

Examples

Skeleton Cards

Loading Spinner

Progress Indicator

---

# 23. Error States

Error messages should explain

What happened

Why

How to fix it

Avoid generic

"Something went wrong."

---

# 24. Mobile Responsiveness

Although desktop is the priority

The application should remain usable on

Tablets

Mobile devices

Cards should stack vertically.

Navigation may collapse into a drawer.

---

# 25. Animations

Animations should be subtle.

Examples

Hover

Fade

Slide

Avoid

Large transitions

Parallax

Complex motion

---

# 26. Accessibility

Keyboard navigation

Visible focus indicators

Readable contrast

Semantic HTML

Screen reader friendly labels

---

# 27. User Experience Goals

Users should be able to

Find information quickly

Complete tasks efficiently

Understand feedback immediately

Never feel lost

Never encounter ambiguous interactions

---

# 28. Definition of Done

The UI is considered complete when

Every page follows the design system.

Every component is visually consistent.

Responsive layouts function correctly.

Forms provide meaningful validation.

Status indicators are consistent.

The application feels like a cohesive enterprise product.

---

# End of Document