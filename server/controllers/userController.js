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
    return res.status(400).json({
      message: "Email or password were not provided",
      status: 400,
    });
  const user = await User.findOne({ email }).select("+password").exec();
  if (!user)
    return res.status(400).json({
      message: "User was not found",
      status: 400,
    });
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({
      message: "Incorrect Password",
      status: 400,
    });
  const token = jwt.generateToken(email);
  delete user._doc.password;
  res.status(200).json({
    status: 200,
    message: "Logged in",
    token,
    user,
  });
});

exports.getUserMessages = [
  jwt.authenticateToken,
  asyncHandler(async (req, res, next) => {
    const { userID } = req.params;
    const { recieverID } = req.query;
    const user = await User.findById(userID).exec();
    if (!user)
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    if (!recieverID) {
      const messages = await Message.find({
        $or: [{ messenger: userID }, { reciever: userID }],
      })
        .populate(["messenger", "reciever"])
        .exec();
      return res
        .status(200)
        .json({ message: "Success", status: 200, messages, user });
    }
    const messages = await Message.find({
      $or: [
        { messenger: userID, reciever: recieverID },
        { messenger: recieverID, reciever: userID },
      ],
    })
      .populate(["messenger", "reciever"])
      .exec();

    res.status(200).json({
      message: "Success",
      status: 200,
      messages,
      user,
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

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();
  res.status(200).json({
    message: "Attatched are the users",
    users,
    status: 200,
  });
});
