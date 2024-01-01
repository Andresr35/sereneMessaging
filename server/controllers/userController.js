const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("../jwt");
const User = require("../models/User");
const Message = require("../models/Message");

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, age, lastUpdated, gender, bio } = req.body;
  if (!email && !name && !password)
    res
      .status(400)
      .json({ status: 400, message: "email, name, or password is missing" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    age,
    lastUpdated,
    gender,
    bio,
  });
  await user.save();
  const token = jwt.generateToken(email);
  res.status(201).json({
    status: 201,
    message: "Signing Up",
    token,
    user: user.toJSON({ useProjection: true }),
  });
});

exports.logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password)
    res.status(400).json({
      message: "Email or password were not provided",
      status: 400,
    });
  const user = await User.findOne({ email }).select("+password").exec();
  if (!user)
    res.status(400).json({
      message: "User was not found",
      status: 400,
    });
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    res.status(400).json({
      message: "Incorrect Password",
      status: 400,
    });
  const token = jwt.generateToken(email);
  res.status(200).json({
    status: 200,
    message: "Logged in",
    token,
    user: user.toJSON({ useProjection: true }),
  });
});

exports.getUserMessages = [
  jwt.authenticateToken,
  asyncHandler(async (req, res, next) => {
    const { userID } = req.params;
    const { recieverID } = req.query;
    if (!recieverID) {
      const messages = await Message.find({ messenger: userID })
        .populate(["messenger", "receiver"])
        .exec();
      res.status(200).json({ message: "Success", status: 200, messages });
    }
    const messages = await Message.find({
      messenger: userID,
      reciever: recieverID,
    })
      .populate(["messenger", "reciever"])
      .exec();

    res.status(200).json({
      message: "Success",
      status: 200,
      messages,
    });
  }),
];

exports.createMessage = [
  jwt.authenticateToken,
  asyncHandler(async (req, res, next) => {
    const { userID } = req.params;
    const { recieverID, message } = req.body;
    if (!recieverID && !message)
      res
        .status(400)
        .json({ status: 400, message: "Recipient or message is missing" });
    const newMessage = await new Message({
      message,
      reciever: recieverID,
      messenger: userID,
    }).populate(["reciever", "messenger"]);
    await newMessage.save();

    res.status(201).json({
      status: 201,
      message: "Message Created",
      data: newMessage,
    });
  }),
];
