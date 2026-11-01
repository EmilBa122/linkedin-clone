const mongoose = require("mongoose");

const ConnectionSchema = mongoose.Schema(
  {

    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    connect:{
        type: Number,
        required: true,
    }
  }
);

const Connections = mongoose.model('Connections', ConnectionSchema);

module.exports = Connections