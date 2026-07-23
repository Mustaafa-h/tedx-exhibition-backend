# TEDxBaghdad Exhibition API

The backend API for the TEDxBaghdad 2025 exhibition booth discovery and reservation platform.

It provides public booth information and reservation workflows alongside protected administration endpoints for managing booths, uploaded company logos, and booking requests.

## Features

- Public exhibition booth listing
- Booth reservation request handling
- MongoDB data storage
- Protected administrator endpoints
- Booth creation, editing, and deletion
- Booking request management
- Company logo uploads
- Google Forms reservation redirection
- Health-check endpoint

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Multer
- REST API

## API Overview

### Public Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check API availability |
| `GET` | `/booths` | Retrieve exhibition booths |
| `POST` | `/booking-requests` | Submit a reservation request |

### Administrator Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/admin/booths` | Retrieve all booths |
| `POST` | `/admin/booths` | Create a booth |
| `PATCH` | `/admin/booths/:id` | Update a booth |
| `DELETE` | `/admin/booths/:id` | Delete a booth |
| `GET` | `/admin/booking-requests` | Retrieve booking requests |
| `POST` | `/admin/upload-logo` | Upload a company logo |

## Running Locally

### Prerequisites

- Node.js
- npm
- MongoDB database or MongoDB Atlas cluster

### Installation

```bash
git clone https://github.com/Mustaafa-h/tedx-exhibition-backend.git
cd tedx-exhibition-backend
npm install
```

Create a `.env` file:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=tedx_exhibition
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
GOOGLE_FORM_BASE_URL=your_google_form_url
```

Start the development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:4000
```

## Related Repository

The deployed Next.js frontend is available here:

[tedx-exhibition-frontend](https://github.com/Mustaafa-h/tedx-exhibition-frontend)

## Project Context

I developed this backend as part of an individual full-stack project supporting the exhibition booth workflow for TEDxBaghdad 2025.

The project demonstrates REST API development, MongoDB integration, file uploads, protected administrative workflows, and deployment of a real event-focused application.

## Author

**Mustafa Haider**

- [LinkedIn](https://linkedin.com/in/mustafa-haider-0b027a2a7)
- [GitHub](https://github.com/Mustaafa-h)
