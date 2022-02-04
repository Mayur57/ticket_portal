const express = require("express");
const Ticket = require("../models/Ticket");
const { find, findById } = require("../models/User");
const User = require("../models/User");

const router = express.Router();

// Function to revoke a reserved ticket
function revokeTicket(ticket) {
  ticket.is_booked = false;
  ticket
    .save()
    .then(() => console.log(`${ticket._id}: Successfully revoked a ticket`))
    .catch(() => console.log(`${ticket._id}: Error while revoking a ticket`))
}

// Add a user //! Working
router.post("/user/add", (req, res) => {
  const r = RegExp('^[0-9]')
  if (!r.test(req.body.phone)) {
    res.status(400).end("Invalid Phone Number")
  }

  const user = new User({
    name: req.body.name,
    age: req.body.age,
    phone: req.body.phone, // must be unique
    email: req.body.email, // must be unique
  });

  user
    .save()
    .then((usr) => {
      console.log("Successfully added the user");
      res.status(200).send(`User added (${usr._id})`);
    })
    .catch((err) => {
      console.log(err);
      // console.log("Could not add user");
      
    });
});

// Add a ticket //! Working
router.post("/ticket/add", (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    phone: req.body.phone, // must be unique
    email: req.body.email, // must be unique
  });

  user
    .save()
    .then((ticket) => {
      console.log("Successfully added ticket");
      res.sendStatus(200).send(`Ticket booked (${ticket._id})`);
    })
    .catch((err) => {
      console.log(err);
      console.log("Could not add user");
      res.sendStatus(404).send("Could not book ticket :(");
    });
});

// Creating a ticket //! Working
router.post("/ticket", (req, res) => {
  const ticket = new Ticket({ seat_number: req.body.seat_number });
  const user = new User(req.body.passenger);

  // Available seats are in the range [1, 40]
  if (req.body.seat_number > 40 || req.body.seat_number < 1)
    res.status(400).send("Invalid seat number!");
  else {
    user
      .save()
      .then((data) => {
        if (data) {
          ticket.passenger = user._id;
          ticket
            .save()
            .then((data) => res.status(200).json(data))
            .catch((err) => {
              User.findOneAndDelete({ _id: user._id })
                .then(() => res.status(400))
                .catch((err) => res.status(400).json({ message: err }));
            });
        }
      })
      .catch((err) => res.status(404).json({ message: err }));
  }
});

// Get list of all reserved tickets //! Working
router.get("/tickets/reserved", (req, res) => {
  Ticket.find({ is_booked: true }, (err, data) => {
    if (err) res.status(404).json({ message: err });
    if (data) res.status(200).json(data);
  });
});

// Get list of all vacant tickets //! Working
router.get("/tickets/vacant", (req, res) => {
  Ticket.find({ is_booked: false }, (err, data) => {
    if (err) res.status(404).json({ message: err });
    if (data) res.status(200).json(data);
  });
});

// Update a ticket with open/closed status and user_details
router.put("/ticket/:ticket_id", async (req, res) => {
  const { ticket_id } = req.params;
  const request_body = req.body;
  let passenger = null;
  const usr = await User.findOne({ email: req.body.passenger.email });
  console.log(usr);
  Ticket.findById(ticket_id).then((data) => {
    if (
      usr &&
      data.passenger.toString() == usr._id.toString() &&
      data.is_booked == true
    ) {
      data.is_booked = false;
      data.save().then(() => res.status(200).send("Ticket is unbooked."));
    } else if (
      usr &&
      data.passenger.toString() != usr._id.toString() &&
      data.is_booked == true
    ) {
      res.status(200).send("Ticket is already booked.");
    } else if (data.is_booked == false && usr == null) {
      const user = new User({
        name: req.body.passenger.name,
        age: req.body.passenger.age,
        phone: req.body.passenger.phone, // must be unique
        email: req.body.passenger.email, // must be unique
      });
      user.save().then((user_new) => {
        data.is_booked = true;
        data.passenger = user_new._id;
        data
          .save()
          .then(() => res.status(200).send("Ticket booked (for new user)"));
      });
    } else if (data.is_booked == false && usr != null) {
      data.is_booked = true;
      data.save().then(() => {
        res.status(200).send("Ticket booked (for old user)");
      });
    }
  });
});

// Edit user details using ticket ID //!Working
router.put("/user/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;
  const request_body = req.body;

  Ticket.findById(ticket_id, function (err, ticket) {
    if (err) res.status(404);
    if (ticket) {
      var user_id = ticket.passenger;
      User.findById(user_id)
        .then((user) => {
          if ("name" in request_body) user.name = request_body.name;
          if ("email" in request_body) user.email = request_body.email;
          if ("phone" in request_body) user.phone = request_body.phone;
          if ("age" in request_body) user.age = request_body.age;
          user
            .save()
            .then((data) => res.status(202).json(data))
            .catch((err) => res.status(404).json({ message: err }));
        })
        .catch((err) => res.status(404).json({ message: err }));
    }
  });
});

// Get status of a ticket using ticket_id //! Working
router.get("/ticket/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;
  Ticket.findById(ticket_id, function (err, ticket) {
    if (err) res.status(404).json({ message: err });
    if (ticket) res.status(200).json({ status: ticket.is_booked });
  });
});

// View details of a ticket //! Working
router.get("/ticket/details/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;
  Ticket.findById(ticket_id, function (err, ticket) {
    if (err) res.status(404).json({ message: err });
    if (ticket) {
      User.findById(ticket.passenger, function (err, user) {
        if (err) res.status(404).json({ message: err });
        if (user) res.status(200).json(user);
      });
    }
  });
});

// Reset all closed tickets to open //! Working
router.post("/tickets/reset", (req, res) => {
  if (!("username" in req.body) || !("password" in req.body)) {
    res.send("400");
  }

  const username = req.body.username;
  const password = req.body.password;

  console.log(username)
  console.log(password)
  console.log(process.env.PASSWORD);
  console.log(process.env.ADMIN_USER);

  if (password.toString() !== "1234") {
   res.status(400).send("Password is incorrect");
  }

  if (username.toString() !== process.env.ADMIN_USER) {
   res.status(400).send("Username is incorrect"); 
  }
    
  else {
    // console.log(process.env.PASSWORD, process.env.ADMIN_USER);
    Ticket.find({}, (err, data) => {
      if (err) res.status(404).json({ message: err });
      if (data) {
        data.forEach(revokeTicket);
        res.status(200).json({ message: "Successfully opened all tickets" });
      }
    });
  }
});

module.exports = router;
