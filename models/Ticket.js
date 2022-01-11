const mongoose = require("mongoose");
const User = require("../models/User");

const TicketSchema = mongoose.Schema({
  is_booked: { type: Boolean, default: true },
  seat_number: { type: Number, min: 1, max: 40, required: true },
  date: { type: Date, default: Date.now() },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Ticket", TicketSchema);
