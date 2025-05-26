# Event Management & Ticket Booking System 🎟️

## Overview
The **Event Management & Ticket Booking System** is a full-stack MERN application designed to streamline event organization and ticket booking. This platform enables users to browse events, purchase tickets online, and organizers to manage their events efficiently.

## Features

### User Portal
✅ Register/Login using JWT Authentication  
✅ Browse and filter events  
✅ Book tickets and make secure online payments (Stripe/PayPal)  
✅ Receive e-tickets with QR codes  
✅ View booking history and event details  

### Event Organizer Dashboard
✅ Create and manage events  
✅ Set ticket prices and availability  
✅ View registered attendees  
✅ Monitor ticket sales analytics  
✅ Receive notifications for new bookings  

### Admin Panel
✅ Approve/reject event listings  
✅ Monitor user activity and transactions  
✅ Manage users and organizers  
✅ Generate reports and analytics  

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Gateway:** Stripe / PayPal
- **QR Code Generation & Scanning:** qrcode.react

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- MongoDB (local or Atlas)
- Yarn or npm

### Clone the Repository
```sh
git clone https://github.com/MininduBimsara/EventLanka.git
cd EventLanka
```

### Backend Setup
```sh
cd Backend
npm install  # Install dependencies
npm run dev  # Start the backend server
```

### Frontend Setup
```sh
cd Frontend
npm install  # Install dependencies
npm start  # Start the frontend React app
```

## API Endpoints (Sample)
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Authenticate user & get token |
| GET    | `/api/events`        | Fetch all events |
| POST   | `/api/events`        | Create a new event (Organizer only) |
| POST   | `/api/bookings`      | Book a ticket for an event |
| GET    | `/api/bookings/:id`  | Get booking details |

## Contributing
Feel free to contribute by following these steps:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, reach out to minindubim@gmail.com or create an issue in the repository.
