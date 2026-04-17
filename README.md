# Tours & Travels Management System

A comprehensive full-stack web application for managing tours, buses, passengers, seating arrangements, and payment tracking.

## Features

### 🚍 Bus Management
- Add and manage bus details (number, name, type, seats)
- Store bus owner information and contact details
- Support for multiple seating configurations (2x1, 2x2, 3x2, 2x3)
- Reuse bus information for multiple tours

### 📅 Tour Scheduling
- Create and schedule tours with departure and destination locations
- Set dates and pricing per seat
- Assign buses to specific tours
- Track tour status (scheduled, completed, cancelled)
- View total passengers per tour

### 👥 Passenger Management
- Add passenger details (name, email, contact, address, ID information)
- Store complete passenger information
- Assign seats to passengers
- Track special requirements
- View passenger list per tour

### 🪑 Seat Management & Visual Chart
- Interactive visual seating chart for each bus
- Dynamic seat layout based on bus configuration
- Drag-and-drop style seat assignment
- Real-time seat occupancy tracking
- Color-coded seat status (available, occupied, selected)
- Automatic seat numbering

### 💰 Payment Tracking
- Record payments for each passenger
- Support multiple payment methods (cash, card, bank transfer, UPI)
- Track payment status (pending, partial, completed)
- Payment history per passenger
- Automatic calculation of remaining balance
- Comprehensive payment reports with collection statistics

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
Tours-and-Travels/
├── models/
│   ├── Bus.js              # Bus schema
│   ├── Tour.js             # Tour schema
│   ├── Passenger.js        # Passenger schema
│   └── Payment.js          # Payment schema
├── routes/
│   ├── buses.js            # Bus API endpoints
│   ├── tours.js            # Tour API endpoints
│   ├── passengers.js       # Passenger API endpoints
│   └── payments.js         # Payment API endpoints
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── BusManagement.js
│   │   │   ├── TourManagement.js
│   │   │   ├── PassengerManagement.js
│   │   │   ├── PaymentManagement.js
│   │   │   └── SeatChart.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server.js               # Main server file
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
cd Tours-and-Travels
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/tours-travels
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Bus Management
- `GET /api/buses` - Get all buses
- `POST /api/buses` - Create new bus
- `GET /api/buses/:id` - Get specific bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

### Tour Management
- `GET /api/tours` - Get all tours
- `POST /api/tours` - Create new tour
- `GET /api/tours/:id` - Get specific tour with seating layout
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour

### Passenger Management
- `GET /api/passengers/tour/:tourId` - Get all passengers for a tour
- `POST /api/passengers` - Add new passenger
- `GET /api/passengers/:id` - Get specific passenger
- `PUT /api/passengers/:id` - Update passenger
- `PUT /api/passengers/:id/assign-seat` - Assign seat to passenger
- `DELETE /api/passengers/:id` - Delete passenger

### Payment Management
- `GET /api/payments/tour/:tourId` - Get all payments for a tour
- `POST /api/payments` - Record new payment
- `GET /api/payments/:id` - Get specific payment
- `GET /api/payments/passenger/:passengerId` - Get payment summary for passenger

## Usage Guide

### 1. Create a Bus Profile
1. Navigate to "Bus Management" tab
2. Click "Add New Bus"
3. Fill in bus details:
   - Bus Number (unique identifier)
   - Bus Name
   - Select Bus Type (2x1, 2x2, etc.)
   - Total Seats (auto-calculated)
   - Contact Number
   - Bus Owner Name
4. Click "Save Bus"

The bus profile is now saved and can be reused for multiple tours.

### 2. Schedule a Tour
1. Go to "Tour Schedule" tab
2. Click "Create New Tour"
3. Fill in tour details:
   - Tour Name
   - Start and End Dates
   - Select a Bus (previously created)
   - Departure and Destination Locations
   - Price Per Seat
4. Click "Create Tour"

### 3. Add Passengers
1. Navigate to "Passengers" tab
2. Select a tour from the dropdown
3. Click "Add Passenger"
4. Enter complete passenger details:
   - Name, Email, Phone
   - Address and City
   - ID Type and Number
   - Age
   - Special Requirements (optional)
5. Click "Add Passenger"

### 4. Assign Seats
1. In "Passengers" section, click "View Seat Chart"
2. An interactive seating chart will appear
3. Click an available seat (green)
4. Select an unassigned passenger from the list
5. Click "Assign to [Seat Number]"
6. The seat will turn red (occupied) with passenger name

### 5. Record Payments
1. Go to "Payments" tab
2. Select a tour
3. Click "Record Payment"
4. Fill in payment details:
   - Select Passenger
   - Enter Amount
   - Choose Payment Method
   - Add Transaction ID (if applicable)
   - Add Notes
5. Click "Record Payment"

### 6. Generate Payment Reports
1. In Payments section, you can see:
   - Payment Summary Table (shows collection status for each passenger)
   - Payment History Table (all recorded transactions)
2. Click "Download Payment Report" to export as CSV

## Key Features Explained

### Seating Layout
- **2x1**: 2 seats on left, 1 on right (3 seats per row)
- **2x2**: 2 seats on left, 2 on right (4 seats per row)
- **3x2**: 3 seats on left, 2 on right (5 seats per row)
- **2x3**: 2 seats on left, 3 on right (5 seats per row)

### Seat Numbering
Format: `{RowNumber}{Side}{Position}`
Example: `1A1`, `1B2`, `2A1`

### Payment Status
- **Pending**: No payment received
- **Partial**: Payment received but less than ticket price
- **Completed**: Full payment received

## Database Models

### Bus Schema
```javascript
{
  busNumber: String (unique),
  busName: String,
  busType: String (2x1, 2x2, 3x2, 2x3),
  totalSeats: Number,
  contactNumber: String,
  busOwner: String,
  createdAt: Date
}
```

### Tour Schema
```javascript
{
  tourName: String,
  startDate: Date,
  endDate: Date,
  busId: ObjectId (reference to Bus),
  departureLocation: String,
  destinationLocation: String,
  pricePerSeat: Number,
  status: String (scheduled, completed, cancelled),
  totalPassengers: Number,
  seatingLayout: JSON,
  createdAt: Date
}
```

### Passenger Schema
```javascript
{
  tourId: ObjectId (reference to Tour),
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  address: String,
  city: String,
  idType: String (Aadhar, PAN, Passport, License),
  idNumber: String,
  age: Number,
  seatNumber: String,
  amountPaid: Number,
  paymentStatus: String (pending, partial, completed),
  specialRequirements: String,
  createdAt: Date
}
```

### Payment Schema
```javascript
{
  passengerId: ObjectId (reference to Passenger),
  tourId: ObjectId (reference to Tour),
  amount: Number,
  paymentMethod: String (cash, credit_card, debit_card, bank_transfer, upi),
  transactionId: String,
  notes: String,
  paymentDate: Date,
  createdAt: Date
}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check your Atlas connection string
- Update `MONGODB_URI` in `.env` file

### Port Already in Use
- Change the PORT in `.env` or kill the process using the port

### CORS Issues
- Backend CORS is configured to accept requests from `http://localhost:3000`

### Seat Assignment Not Working
- Ensure the tour is selected
- Check that the passenger doesn't already have a seat assigned

## Future Enhancements
- User authentication and authorization
- Email notifications for passengers
- SMS alerts for payment reminders
- Itinerary and route management
- Multi-language support
- Mobile app version
- Payment gateway integration
- Analytics and reporting dashboard

## License
ISC

## Support
For issues or questions, please contact the development team.
