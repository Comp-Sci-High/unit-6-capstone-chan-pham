
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const AnimalInfo = new mongoose.Schema({
    animalType:  {type: String, required: true},
    appearance : {type: String },
    vaccinated : {type: Boolean, required: true},
    location:    {type: String },
    Breed:       {type: String},
    name: {type: String},
});

const Pet1 = await new Pet1({
 animalType: "Dog",
 appearance: "small dog with long golden fur ",
 vaccinated: true,
   location: "1515 texaz",
   Breed: "folden retriver "
}).save()
 	const users = await User.find({name: "Jayden"});



app.patch("/Pets/:name", async (req, res) => {
const response = await Petstore1.findOneAndUpdate(
{ name: req.params.name }, 
{ description: req.body.description }
)
res.json(response);
});

pp.delete("/planet/:name", async (req, res) => {
const response = await animalstore2.findOneAndDelete({ 
name: req.params.name 
})
res.json(response);
});

