const mongoose = require("mongoose");
const Schema   = mongoose.Schema; 

const hopSchema = new Schema (
  {
    skipOwner: {
      type: Schema.Types.ObjectId,
      ref: "Skip"
    },
    poi: {
      type: String
    },
    arrivedBy: {type: String, enum: ['Car', 'Boat', 'Plane', 'Train', 'Bus', 'Walking']},
    description: {
      type: String
    }
  }
)

const Hop = mongoose.model("Hop", hopSchema);
module.exports = Hop;