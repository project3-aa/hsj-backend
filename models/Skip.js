const mongoose = require("mongoose");
mongoose.plugin(schema => { schema.options.usePushEach = true; });
const Schema   = mongoose.Schema; 

const skipSchema = new Schema (
  {
    jumpOwner: {
      type: Schema.Types.ObjectId, 
      ref: "Jump"
    },
    city: {
      type: String
    },
    arrivedBy: {type: String, enum: ['Car', 'Boat', 'Plane', 'Train', 'Bus', 'Walking']},
    duration: {
      type: Number
    },
    description: {
      type: String
    },
    hop: [{type: Schema.Types.ObjectId, ref: "Hop"}],
  }
)

const Skip = mongoose.model("Skip", skipSchema);
module.exports = Skip;