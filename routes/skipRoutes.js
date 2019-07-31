const express     = require("express");
const router      = express.Router();
const Skip        = require("../models/Skip");
const Jump        = require("../models/Jump");
const mongoose    = require("mongoose");
const ensureLogin = require("connect-ensure-login");

// This maybe gets the skips - might not need to we 
// just have to popluate in the jump route
// router.get('/allSkips', (req, res, next)=>{
//   let jumpId = req.body.jumpId
//   Skip.find({ jumpOwner: jumpId})
//   .then((theSkip)=>{
//       res.json(theSkip)
//   })
//   .catch((err)=>{
//       res.json(err);
//   })
// })

// This lets you create a new Skip
// This ties the skip to the jump
// line 92 MSPointerEvent.js- marcos github
//***I have a feeling that we are going to have to change the jumpID from the req.body to a params...... */
router.post('/newSkip', (req, res, next)=>{
  console.log("starting to create a new skip <<<<<<< ", req.body)
  let jumpID = req.body.theJump;
  Skip.create({
      city:  req.body.skipCity,
      arrivedBy: req.body.skipArrive,
      duration: req.body.skipDuration,
      description: req.body.skipDescription,
      jumpOwner: jumpID,
  })
    .then((response)=>{
      // console.log("created skip >>>>> ", response, "99090909090909090909090 ", jumpID);
      Jump.findById(req.body.theJump)
      .then(foundJump => {
        // console.log("found a jump ------------ ", foundJump)
        foundJump.skip.push(response._id)
        foundJump.save()
        .then(updatedJump => {
          // console.log("info of updated skip to the jump ---- ", updatedJump);
          res.json(updatedJump)
        }).catch(err => res.json(err))
      }).catch(err => res.json(err))
    }).catch((err)=> res.json(err))
  })


  // This lets you edit the Skip
  router.post('/updateSkip/:id', (req, res, next)=>{
    Skip.findByIdAndUpdate(req.params.id, {
      city: req.body.skipCity,
      arrivedBy: req.body.skipArrive,
      duration: req.body.skipDuration,
      description: req.body.skipDescription
    }, {new: true})
    .then((response)=>{
        res.json(response)
    })
    .catch((err)=>{
        res.json(err)
    })
})

// To delete
router.post('/deleteSkip/:jumpId/:skipId', (req, res, next)=>{
  Jump.findById(req.params.jumpId)
  .then((theJumpReturned)=>{
    theJumpReturned.skip.pull(req.params.skipId)
    theJumpReturned.save()
    .then(updatedJump => {
      Skip.findByIdAndRemove(req.params.skipId)
      .then(()=>{res.json(updatedJump)})
      .catch(err => res.json(err))
    }).catch(err => res.json(err))
  }).catch((err)=>{res.json(err)
  })
})



module.exports = router;