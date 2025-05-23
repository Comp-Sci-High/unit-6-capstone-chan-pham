const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    college: { type: String, required: true },
    year: { type: String, required: true },
    major: { type: String, required: true },
    image: { type: String, required: true },
    achievement: { type: String, required: true }
  }
);

const alumni = mongoose.model("Alumni", alumniSchema, "Alumni");

app.get("/", async (req, res) => {
  const alumnis = await alumni.find({});
  res.render("home.ejs", { alumnis });
});

app.get("/transcript", async (req, res) => {
  const alumnis = await alumni.find({});
  res.render("transcript.ejs", { alumnis });
});

app.get("/faq", async (req, res) => {
  const alumnis = await alumni.find({});
  res.render("faq.ejs", { alumnis });
});

app.get("/alumni", async (req, res) => {
  const alumnis = await alumni.find({});
  res.render("alumni.ejs", { alumnis });
});

app.post("/add/alumni", async (req, res) => {
  try {
    const newAlumni = await new alumni({
      name: req.body.name,
      college: req.body.college,
      year: req.body.year,
      major: req.body.major,
      image: req.body.image,
      achievement: req.body.achievement, 
    }).save();

    res.json(newAlumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add alumni" });
  }
});

app.delete("/delete/alumni/:_id", async (req, res) => {
  try {
    const response = await alumni.findOneAndDelete({ _id: req.params._id });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete alumni" });
  }
});

app.patch("/alumni/:_id", async (req, res) => {
  try {
    const response = await alumni.findOneAndUpdate(
      { _id: req.params._id }, 
      req.body, 
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update alumni" });
  }
});

// Add your SRV string, make sure that the database is called CSHteachers
async function startServer() {
  await mongoose.connect("mongodb+srv://SE12:CSH2025@cluster0.pqx7f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

  app.listen(3000, () => {
    console.log(`Server running.`);
  });
}

startServer();