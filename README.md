# HostMyShow - Event Management & Ticketing Platform

## Overview

**HostMyShow** is a full-featured event management and ticket booking platform built using the MERN stack. It allows users to explore and book events, while organizers can create and manage their shows. Admins oversee event approvals, ensuring a smooth and trusted experience. The platform includes OTP-based login, role-based access, and a clean, responsive UI using modern design principles like glassmorphism.

---

## Table of Contents

1. [Tech Stack](#tech-stack)  
2. [Features](#features)  
3. [Installation and Setup](#installation-and-setup)  
4. [Project Structure](#project-structure)  
5. [Environment Variables](#environment-variables)  
6. [Known Issues](#known-issues)  
7. [Future Improvements](#future-improvements)  
8. [About Me](#about-me)  
9. [License](#license)

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS (with glassmorphism UI)
- React Router DOM
- Context API for state management
- Lucide React, Radix UI, shadcn/ui

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Axios for HTTP requests

---

## Features

### User
- Browse upcoming events
- Book tickets
- OTP-based login
- View personal bookings

### Organizer
- Register and login as an organizer
- Create and manage event listings
- View booking statistics

### Admin
- Approve or reject new events
- View and manage platform activity

### Common Features
- Role-based routing and dashboard
- Glassmorphism UI with responsive layout
- Toast notifications and smooth navigation

---


## Installation and Setup

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas or local instance

### Steps

1. **Clone the Repository**

```bash
git clone https://github.com/sakshinehe/hostmyshow.git
cd hostmyshow

cd backend
npm install
npm run dev
