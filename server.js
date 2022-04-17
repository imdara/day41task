const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

// defining arrays to store rooms, bookings and dates and duration data
let rooms = [];
let roomNo = 101; // initialising room no as 101 (i.e. the room numbers start from 101)
let bookings = [];
let roomBookingDates = [];
let roomBookingDurations = [];

app.use(express.json()); //  middleware for parsing json data

// getting home page at path "/"
app.get("/", (req, res) => {
  res.send({ status: 200, message: "Welcome to my Hall Booking App" });
});

// getting rooms data at path "/rooms"
app.get("/rooms", (req, res) => res.send(rooms));

// creating rooms at path "/create-room"
app.post("/create-room", (req, res) => {
  // defining room schema
  let room = {
    roomNo: roomNo,
    noOfSeats: req.body.noOfSeats,
    amenities: req.body.amenities,
    price: req.body.price,
    bookings: [],
  };
  if (req.body.noOfSeats && req.body.amenities && req.body.price) {
    rooms.push(room);
    roomNo++;
    res.status(200).send({ message: "Room Created Successfully" });
  } else {
    res.status(400).send({ message: "Invalid/Insufficient data" });
  }
});

// getting bookings at path "/bookings"
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

// creating bookings at path "/create-booking"
app.post("/create-booking", (req, res) => {
  //defining booking schema
  let booking = {
    customerName: req.body.customerName,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    roomId: req.body.roomId,
  };
  if (!req.body.customerName || !req.body.date || !req.body.roomId) {
    res.status(400).send({ message: "Invalid/Insufficient data" });
  }
  let theRoom = rooms.filter((room) => room.roomNo === booking.roomId);
  let theRoomIndex = rooms.findIndex((room) => room.roomNo === booking.roomId);
  if (theRoom.length === 1) {
    if (rooms[theRoomIndex].bookings.length === 0) {
      rooms[theRoomIndex].bookings.push(booking);
      bookings.push(booking);
      res.status(200).send({ message: "Room booked Successfully" });
      roomBookingDates.push(booking.date);
      roomBookingDurations.push({
        start: Number(booking.startTime.replace(":", "")),
        end: Number(booking.endTime.replace(":", "")),
      });
    }
    if (rooms[theRoomIndex].bookings.length >= 1) {
      if (roomBookingDates.includes(booking.date)) {
        let startCheck = roomBookingDurations.every(
          (val) =>
            val.start < Number(booking.startTime.replace(":", "")) ||
            val.start > Number(booking.endTime.replace(":", ""))
        );
        let endCheck = roomBookingDurations.every(
          (val) =>
            val.end < Number(booking.startTime.replace(":", "")) ||
            val.end > Number(booking.endTime.replace(":", ""))
        );
        if (startCheck && endCheck) {
          rooms[theRoomIndex].bookings.push(booking);
          bookings.push(booking);
          res.status(200).send({ message: "Room booked Successfully" });
          roomBookingDates.push(booking.date);
          roomBookingDurations.push({
            start: Number(booking.startTime.replace(":", "")),
            end: Number(booking.endTime.replace(":", "")),
          });
        } else {
          res
            .status(400)
            .send({ message: "Room is booked for this time slot" });
        }
      } else {
        rooms[theRoomIndex].bookings.push(booking);
        bookings.push(booking);
        res.status(200).send({ message: "Room booked Successfully" });
        roomBookingDates.push(booking.date);
        roomBookingDurations.push({
          start: Number(booking.startTime.replace(":", "")),
          end: Number(booking.endTime.replace(":", "")),
        });
      }
    }
  } else {
    res.status(400).send({ message: "This Room does not exist" });
  }
});

// listening on port
app.listen(PORT, () => console.log("listening on port", PORT));
