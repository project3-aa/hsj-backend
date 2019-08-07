const mongoose = require("mongoose");
// mongoose.plugin(schema => { schema.options.usePushEach = true; });
const Schema   = mongoose.Schema; 

const jumpSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    start: {
      type: String
    },
    end: {
      type: String
    },
    skip: [{type: Schema.Types.ObjectId, ref: "Skip"}],
    duration: {
      type: Number
    },
    description: {
      type: String
    },
    rating: {
      type: Number
    },
    image: {
      type: String
    },
  }
)

const Jump = mongoose.model("Jump", jumpSchema);
module.exports = Jump;