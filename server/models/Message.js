const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  created: { type: Date, required: true, default: Date.now },
  messenger: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reciever: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, maxLength: 300, trim: true, required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
