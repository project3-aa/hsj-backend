const express     = require("express");
const router      = express.Router();
const Hop         = require("../models/Hop");
const Skip        = require("../models/Skip")
const mongoose    = require("mongoose");
const ensureLogin = require("connect-ensure-login");

// hey i changed this does it still work????
//YES IT WORKS NOW DELETE ALL THIS

// This maybe creates a new hop
//***I have a feeling that we are going to have to change the skipID from the req.body to a params...... */
router.post('/newHop', (req,res,next)=>{
  //  console.log("starting to create a new hop <<<<<<< ", req.body)
  let skipID = req.body.theSkip
  Hop.create({
    poi: req.body.theAttraction,
    arrivedBy: req.body.theMot,
    description: req.body.hopDescription,
    skipOwner: skipID,
  })
    .then ((response)=>{
      // console.log("The hop was created >>>>>>>>>")
    Skip.findByIdAndUpdate(req.body.theSkip)
    .then(foundSkip => {
      // console.log("This found a skip!!!!!!!!!!!!!");
      foundSkip.hop.push(response._id)
      foundSkip.save()
      .then(updatedSkip => {
        // console.log("this is the info of the updated skip=-=-=-=-=-=-=");
        res.json(updatedSkip)
      }).catch(err => res.json(err))
    }).catch(err => res.json(err))
  }).catch((err)=> res.json(err))
})

  // This lets you edit a Hop
  router.post('/updateHop/:id', (req, res, next)=>{
    Hop.findByIdAndUpdate(req.params.id, {
      poi: req.body.theAttraction,
      arrivedBy: req.body.theMot,
      description: req.body.hopDescription,
    }, {new: true})
    .then((response)=>{
        res.json(response)
    })
    .catch((err)=>{
        res.json(err)
    })
})

// This deletes a Hop
router.post('/deleteHop/:skipId/:hopId', (req, res, next)=>{
  Skip.findById(req.params.skipId)
  .then((theSkipReturned)=>{
    theSkipReturned.hop.pull(req.params.hopId)
    theSkipReturned.save()
    .then(updatedSkip => {
      Hop.findByIdAndRemove(req.params.hopId)
      .then(()=>{res.json(updatedSkip)})
      .catch(err => res.json(err))
    }).catch(err => res.json(err))
  }).catch((err)=>{res.json(err)
  })
})



module.exports = router;