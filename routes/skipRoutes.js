const express = require("express");
const router = express.Router();
const Skip = require("../models/Skip");
const Jump = require("../models/Jump");
const mongoose = require("mongoose");
const ensureLogin = require("connect-ensure-login");


router.post("/newSkip", async (req, res, next) => {
  console.log("body for new skip inthe backend", req.body);
  // let jumpID = req.body.theJump;
  const newSkip = new Skip({
    city: req.body.skipCity,
    arrivedBy: req.body.skipArrive,
    duration: req.body.skipDuration,
    description: req.body.skipDescription,
    jumpOwner: req.body.theJump
  });

  newSkip.save(err => {
    console.log(err);
    console.log("skip saved");
  });
  let thejump = await Jump.findById(req.body.theJump);
  thejump.skip.push(newSkip._id);
  thejump.save().then(updatedJump => {
    console.log("info of updated skip to the jump ---- ", updatedJump);
    res.json(updatedJump);
  });
});

// This lets you edit the Skip
router.post("/updateSkip/:id", (req, res, next) => {
  Skip.findByIdAndUpdate(
    req.params.id,
    {
      city: req.body.skipCity,
      arrivedBy: req.body.skipArrive,
      duration: req.body.skipDuration,
      description: req.body.skipDescription
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

// To delete
router.post("/deleteSkip/:jumpId/:skipId", (req, res, next) => {
  Jump.findById(req.params.jumpId)
    .then(theJumpReturned => {
      theJumpReturned.skip.pull(req.params.skipId);
      theJumpReturned
        .save()
        .then(updatedJump => {
          Skip.findByIdAndRemove(req.params.skipId)
            .then(() => {
              res.json(updatedJump);
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
