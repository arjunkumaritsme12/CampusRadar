# Placement Drive Tracker

A modern web application designed to help students track and manage their university placement drives, deadlines, registration statuses, schedules, and recruitment outcomes all in one centralized place.

## Overview

The Placement Drive Tracker solves the problem of scattered placement information by providing a unified dashboard for tracking ongoing and upcoming recruitment processes. Students can securely log in, add companies they are applying to, track critical dates, and monitor their status throughout the entire process (from "Upcoming" to "Selected" or "Rejected"). It also includes features to track rescheduling history and distinguish between full-time roles and internships.

## Key Features

- **Google OAuth Authentication**: Secure login flow using Google accounts via Supabase.
- **Secure Database Storage**: All data is backed by PostgreSQL with strict Row Level Security (RLS) ensuring privacy.
- **Placement Drive CRUD**: Full ability to Add, Edit, and Delete drives.
- **Reschedule Tracking**: Automatically tracks if a drive's date is changed and maintains a reschedule history log.
- **Detailed Status Tracking**: Track statuses including Upcoming, Registered, Registration Error, Rescheduled, Completed, Missed, Rejected, and Selected.
- **Employment Types**: Specialized tracking for both Full Time and Internship roles.
- **Internship Specifics**: Track internship duration, monthly stipend, and post-internship packages.
- **Date Management**: Manage Mail Received Dates, Registration Deadlines, and Scheduled Drive Dates.
- **Multiple Views**: View drives in a comprehensive Dashboard List view or a Calendar/Grid view.
- **Responsive Premium UI**: A highly polished, responsive dark-mode interface built with Tailwind CSS.
- **Form Validation**: Strict client-side and server-side validation using Zod.
- **3D / Animations**: Features a React Three Fiber hero experience and smooth Framer Motion page transitions.

## Tech Stack

- **Next.js** - React framework for server-side rendering and routing
- **React** - Component-based UI library
- **TypeScript** - Strongly typed programming language
- **Tailwind CSS** - Utility-first styling framework
- **Supabase** - Backend-as-a-Service (BaaS) and Authentication
- **PostgreSQL** - Relational database
- **Zod** - Schema declaration and validation
- **Framer Motion** - Animation library for React
- **React Three Fiber** - React reconciler for Three.js
- **Lucide React** - Beautiful and consistent iconography

## Architecture

* **Frontend** → Next.js (App Router) / React
* **Authentication** → Supabase Auth integrated with Google OAuth providers
* **Database** → Supabase PostgreSQL
* **Security** → Database Row Level Security (RLS) restricts data access so users can only view and mutate their own drives.
* **Validation** → Zod schemas ensure data integrity on both the client (react-hook-form) and server.
* **Server-side Operations** → Next.js Server Actions handle secure database mutations and revalidation.
* **3D / Animation** → React Three Fiber manages the 3D hero elements, and Framer Motion handles route transitions and interactive micro-animations.

## Project Structure

```
src/
├── app/
│   ├── auth/callback/    # OAuth callback handler
│   ├── dashboard/        # Authenticated dashboard views (list, calendar, drive details)
│   ├── login/            # Authentication page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # Reusable React components (Forms, 3D Hero, Buttons)
├── lib/                  # Shared utilities and configurations
│   ├── schema.ts         # Zod validation schemas
│   └── supabase/         # Supabase client configurations (server/client/middleware)
```

## Environment Variables

To run this project locally, you must create a local `.env.local` file at the root of the project containing your Supabase project keys.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

> **Note**: Never expose your `service_role` key or database password in public repositories or client-side `.env` variables.
