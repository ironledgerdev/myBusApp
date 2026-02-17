# Soweto Bus Tracker

Real-time bus tracking application for Soweto & Johannesburg. Track buses, get ETAs, and rate your experience.

## Features

- **Real-time Bus Tracking**: View live bus locations on an interactive map.
- **Route Management**: Admin interface to manage routes, stops, and buses.
- **Driver Assignments**: Assign drivers to specific buses and routes.
- **Passenger Feedback**: Rate trips and provide feedback.
- **Admin Dashboard**: Comprehensive control over the entire system.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI, Leaflet (Maps)
- **Backend**: Django, Django REST Framework
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. Run migrations and seed data:
   ```bash
   python setup_backend.py
   ```

5. Start the server:
   ```bash
   python manage.py runserver 0.0.0.0:8001
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:8080`.

## Admin Access

- **URL**: `http://localhost:8001/admin/`
- **Auto-login (Dev only)**: `http://localhost:8001/dev-auto-login/`
