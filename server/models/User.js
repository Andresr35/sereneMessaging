const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, select: false },
  password: { type: String, trim: true, required: true, select: false },
  age: { type: Number, min: 0, max: 110 },
  lastUpdated: { type: Date, default: Date.now },
  gender: { type: String, trim: true, enum: ["male", "female", "other"] },
  bio: { type: String, trim: true, maxLength: 100 },
});

module.exports = mongoose.model("User", UserSchema);
