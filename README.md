
## Project Overview

A neighborhood/City based platform where users can find local service providers (electrician, plumbers, mechanics, technicians) and confirm completed jobs, as well as rate reliability, punctuality, and pricing honesty. Over time, each service provider earns a trust score based on real work, not fake online reviews.

## Core User Roles

### Regular User:

- Search for service providers
- Views trust scores
- Confirms a completed job
- Leaves a rating

### Service Provider:

- Has a profile
- Offers services
- Accumulates trust score (based on the rating and pricing of the job)

## MVP (Minimum Viable Product)

### Discovery:

- List of service providers
- Filter by service type (plumber, electrician, etc.)
- Location-based search
- Profile page for the provider

### Trust Score System:

- Rating (Reliability, Punctuality, Price Honesty)
- Average trust score (Trust score is calculated as an average (or weighted average) of these ratings)
- Number of completed jobs

### Job Confirmation

- User confirms a job when completed
- Rating can only be left after confirmation

## Technical Scope

- Framework: Next.js
- Routing: File-based routing
- Styling: CSS / Tailwind / UI library
- Backend: Next.js API routes
- Database: MonogoDB

## Features

### Home Page

- What the platform does
- Search for services/ providers

### Services Page

- Contains the list of service providers (Cards that displays brief info about the provider and takes you to their profile upon clicking on it)
- Has Categories: Electrician, Plumber, etc.

### Provider Profile Page

- Name
- Contact info.
- Service type
- Location (City, neighborhood)
- Trust score
- Job history
- Reviews (optional)

### Confirm Job Page

- Select the provider
- Confirm the job completion
- Add rating

### Reviews & Feedback:

- Users can submit a review for a provider
- Review includes a text comment
- Reviews are displayed on the provider’s profile page
