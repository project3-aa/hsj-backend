const express = require("express");
const router = express.Router();
const Hop = require("../models/Hop");
const Skip = require("../models/Skip");
const mongoose = require("mongoose");
const ensureLogin = require("connect-ensure-login");

// hey i changed this does it still work????
//YES IT WORKS NOW DELETE ALL THIS

// This maybe creates a new hop
//***I have a feeling that we are going to have to change the skipID from the req.body to a params...... */

router.post("/newHop", async (req, res, next) => {
  console.log('trying to create new hop here!!!', req.body)
  const newHop = new Hop({
    poi: req.body.poi,
    arrivedBy: req.body.arrivedBy,
    description: req.body.description,
    skipOwner: req.body.hopOwner
  });

  console.log(newHop);
  newHop.save(err => {
    console.log(err);
    console.log("hop saved");
  });
  let theskip = await Skip.findById(req.body.hopOwner);
  theskip.hop.push(newHop._id);
  theskip.save().then(updatedSkip => {
    console.log("info of updated hop to the skip ---- ", updatedSkip);
    res.json(updatedSkip);
  });
  // res.json({test:'test'});
});

// This lets you edit a Hop
router.post("/updateHop/:id", (req, res, next) => {
  console.log(req.body);
  Hop.findByIdAndUpdate(
    req.params.id,
    {
      poi: req.body.poi,
      arrivedBy: req.body.arrivedBy,
      description: req.body.description,
    },
    { new: true }
  )
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

// This deletes a Hop
router.post("/deleteHop/:skipId/:hopId", (req, res, next) => {
  Skip.findById(req.params.skipId)
    .then(theSkipReturned => {
      theSkipReturned.hop.pull(req.params.hopId);
      theSkipReturned
        .save()
        .then(updatedSkip => {
          Hop.findByIdAndRemove(req.params.hopId)
            .then(() => {
              res.json(updatedSkip);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
