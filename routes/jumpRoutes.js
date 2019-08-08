const express     = require("express");
const router      = express.Router();
const Jump        = require("../models/Jump");
const uploadMagic = require('../config/cloudinary');
const mongoose    = require("mongoose");
const ensureLogin = require("connect-ensure-login");

//this route will return all the Jumps in the database
router.get( '/allJumps', (req, res, next) => {
  Jump.find()
    .then(allJumps => {
      res.json(allJumps)
    })
    .catch(err => {
      res.json(err);
    });
});


// find details of a jump
router.get('/details/:jumpId', (req, res, next) => {
  Jump.findById(req.params.jumpId).populate('skip').populate({path: 'skip', populate: {path: 'hop'}})
  .then(jumpFromDB => {
    // console.log("this is the jump info with everything populated >>>>>>>>>>>>> ", jumpFromDB)
    res.status(200).json(jumpFromDB)
  }).catch(err => res.status(400).json(err))
});



//this route will return only the Jumps for a particular user
router.get('/userJumps/:userId', (req, res, next) => {
  Jump.find({ ownerId: req.params.userId })
    .then(userJumps =>{
      res.json(userJumps)
    })
  .catch(err => {
      res.json(err)
   });
});

//this route will create a new Jump
router.post("/newJump", uploadMagic.single('theImageParameter'), (req, res, next) => {

  let theImage;

  // console.log(req.file.url)
  if(req.file){
    theImage = req.file.url
  } else{
    theImage = 'http://getwallpapers.com/wallpaper/full/e/1/2/41252.jpg'
  } 

  Jump.create({
    ownerId: req.user._id,
    start: req.body.startCity,
    end: req.body.endCity,
    duration: req.body.jumpDuration,
    description: req.body.jumpDescription,
    rating: req.body.jumpRating,
    image: theImage,
  })
    .then(newJump => {
      console.log()
      res.json(newJump);
    })
    .catch(err => {
      console.log("We hit an error")
      res.json(err);
    }); 
});

//this route will update any data in an existing Jump
router.post("/updateJump/:id", uploadMagic.single('theImageParameter'), (req, res, next) => {
   
  let theUpdate= {};
  theUpdate.start = req.body.startCity;
  theUpdate.end = req.body.endCity;
  theUpdate.duration = req.body.jumpDuration;
  theUpdate.description = req.body.jumpDescription;

  if(req.file){
    theUpdate.image = req.file.url
  }

  // const data = {
  //   start: req.body.startCity,
  //   end: req.body.endCity,
  //   duration: req.body.jumpDuration,
  //   description: req.body.jumpDescription,
  //   rating: req.body.jumpRating
  // };

  Jump.findByIdAndUpdate(req.params.id, theUpdate, {new: true})
    .then((response) => {
      res.json(response)
    })
    .catch(err => {
      res.json(err);
    });
});
//this route will delete a speficic Jump with the given ID
router.post("/deleteJump/:id", (req, res, next) => {
  Jump.findByIdAndRemove(req.params.id)
    .then((response) => {
      console.log("successfuly deleted")
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});





module.exports = router;