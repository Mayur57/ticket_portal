# Authenticating.com Assignment
Submission for assignment from [Authenticating.com](https://Authenticating.com) for position of SWE Intern.

### Problem Statement
To Setup a NodeJS server on EC2 to handle ticketing for a bus company. 1 bus, 40 seats. One ticket per seat.

#### Details
Features expected from the server:
- Update the ticket status (open/close + adding user details).
- View ticket status.
- View all closed tickets.
- View all open tickets.
- View details of person owning the ticket.
- Additional API for admin to reset the server (opens up all the tickets).

Use an appropriate database to handle the problem. The server needs to expose the features via APIs based on REST principles and event driven logic to be implemented in every possible situation.

Additionally, write appropriate test cases to simulate practical scenarios that you would want to test the system for. Maintain the code through the course of the development on a version control system.

#### Submission
1. Postman collection for the APIs and relevant credentials to test out
2. Access to the code repository hosted on Gitlab/Bitbucket in a private repo

### Schema
- User object
```
name: String,
age: Number,
phone: { type: String, unique: true },
email: { type: String, unique: true }
```

- Ticket object
```
seat_number: { type: Number, min: 1, max: 40, required: true },
is_booked: { type: Boolean, default: true },
date: { type: Date, default: Date.now() },
passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
```

### Endpoints

 **`GET`** `api/tickets/reserved` – Reserved Tickets
- Use – Responds with the list of tickets that are reserved
- Parameters – None
- Bugs – None

**`GET`** `api/tickets/vacant` – Vacant Tickets
- Use – Responds with the list of tickets that are vacant
- Parameters – None
- Bugs – None

**`POST`** `api/user/add` – Add User (Used for development only)
- Use – Adds a user to the database manually
- Parameters – name, age, phone, email of the user as JSON
Example request:
```       
  {
    "name": "Lone Alone",
    "age": 21,
    "phone": "123409840",
    "email": "kuch1@toh.com"
  }
```
- Bugs – None
- Expected Response:
`User added (61dde1c06521043d72d56c22)`

**`POST`** `api/tickets/reset` – Reset All Tickets
- Use – Resets all the ticket statuses to vacant
- Parameters – Username and password of the admin as JSON
- Example request:
     {
         "username": "user",
         "password": "1234"
     }
- Bugs – None

**`POST`** `api/ticket` – Add a new ticket
- Use – Adds a new ticket and marks it as reserved
- Requirements – Seat number should be in the range [1, 40]
- Parameters – Seat number to be booked and passenger details as JSON
- Example request:
```
{
  "seat_number": 15,
  "passenger": {
    "name": "Crazy Bitch",
    "age": 69,
    "phone": "9123003689",
    "email": "ilovebiryani2@gmail.com"
  }
}
```
- Bugs – None
- Expected Response:
```
{
  "is_booked": true,
  "date": "2022-01-11T20:09:20.693Z",
  "_id": "61dde565c05fe93de7c569ec",
  "seat_number": 15,
  "passenger": "61dde565c05fe93de7c569ed",
  "__v": 0
}
```

**`PUT`** `api/ticket/:ticket_id` – Update Ticket
- Use – Updates a ticket with status and/or passenger
- Parameters – status and passenger details as JSON + ticket_id as path
parameter
- Example request:
```
{
  "is_booked": true,
  "passenger": {
    "name": "Sane Person",
    "age": 42,
    "phone": "0983892819",
    "email": "mewhenthe@gmail.com"
  }
}
```
- Bugs – None

**`PUT`** `api/user/:ticket_id` – Edit User Details
- Use – Updates details of the user associated to the ticket
- Parameters – status and passenger details as JSON + ticket_id as path
parameter
- Example request:
```
{
  "is_booked": true,
  "passenger": {
    "name": "Sane Person",
    "age": 42,
    "phone": "0983892819",
    "email": "mewhenthe@gmail.com"
  }
}
```
- Bugs – None

**`GET`** `api/ticket/details/:ticket_id` – Ticket Details
- Use – Returns the details of person that booked the ticket
- Parameters – Ticket ID as path parameter
- Bugs – None

**`GET`** `api/ticket/:ticket_id` – Ticket Status
- Use – Returns the ticket status
- Parameters – Ticket ID as path parameter
- Bugs – None

### Node Modules
- body-parser v1.19.1
- dotenv v10.0.0
- express v4.17.2
- mongodb v4.3.0
- mongoose-unique-validator v2.0.3
- mongoose v5.13.14
- nodemon v2.0.15
