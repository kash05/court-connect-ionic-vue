# Software Requirements Specification for `<Your App Name>`

> Version: 0.1 (Draft)  
> Date: YYYY-MM-DD  
> Author: Your Name

---

## Table of Contents

1. [Introduction](#introduction)
2. [Overall Description](#overall-description)
3. [User Roles & Flows](#user-roles--flows)
   - [Player Flowchart](#player-flowchart)
   - [Owner Flowchart](#owner-flowchart)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [API Endpoints & Sequence Diagrams](#api-endpoints--sequence-diagrams)
7. [Appendices](#appendices)

---

## Introduction

**Purpose**  
Describe the goal of this SRS and the intended audience.

**Scope**  
Mobile app with two roles: Player and Owner. Covers authentication, core features, data flows.

**Definitions & Acronyms**

- SRS: Software Requirements Specification
- API, UI, MVP, JWT, etc.

---

## Overall Description

- **Product Perspective**: Stand-alone mobile app, integrates with payment gateway & notification service.
- **Operating Environment**: iOS 13+, Android 9+, network required.
- **Design Constraints**: React Native + TypeScript, RESTful JSON APIs, TLS encryption.

---

## User Roles & Flows

### Player Flowchart

```mermaid
flowchart TD
  A[Launch App] --> B{Logged In?}
  B -- No --> C[Show Login/Signup Screen]
  C --> D{Select Role}
  D -- Player --> E[Enter Credentials]
  E --> F[Authenticate via API]
  F --> G{Success?}
  G -- Yes --> H[Show Player Home]
  G -- No --> I[Show Error & Retry]
  B -- Yes --> J{Role == Player?}
  J -- Yes --> H
  J -- No --> K[Show "Invalid Role" Error]
```

```mermaid
flowchart TD
A[Launch App] --> B{Logged In?}
B -- No --> C[Show Login/Signup Screen]
C --> D{Select Role}
D -- Owner --> E[Enter Credentials]
E --> F[Authenticate via API]
F --> G{Success?}
G -- Yes --> H[Show Owner Dashboard]
G -- No --> I[Show Error & Retry]
B -- Yes --> J{Role == Owner?}
J -- Yes --> H
J -- No --> K[Show "Invalid Role" Error]
```
