const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

// Constants for maximum items
const MAX_UPDATES = 6;
const MAX_INFO = 8;

// Define schemas
const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  year: { type: String, required: true },
  major: { type: String, required: true },
  image: { type: String, required: true },
  achievement: { type: String, required: true }
});

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  count: { type: Number, required: true }
});

// NEW SCHEMAS FOR UPDATES AND INFO
const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  important: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const infoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const Alumni = mongoose.model("Alumni", alumniSchema, "Alumni");
const College = mongoose.model("College", collegeSchema, "Colleges");
const Update = mongoose.model("Update", updateSchema, "Updates");
const Info = mongoose.model("Info", infoSchema, "ImportantInfo");

// Routes
app.get("/", async (req, res) => {
  try {
    const alumnis = await Alumni.find({});
    res.render("home.ejs", { alumnis });
  } catch (error) {
    console.error(error);
    res.render("home.ejs", { alumnis: [] });
  }
});

app.get("/transcript", async (req, res) => {
  try {
    const alumnis = await Alumni.find({});
    res.render("transcript.ejs", { alumnis });
  } catch (error) {
    console.error(error);
    res.render("transcript.ejs", { alumnis: [] });
  }
});

app.get("/faq", async (req, res) => {
  try {
    const alumnis = await Alumni.find({});
    res.render("faq.ejs", { alumnis });
  } catch (error) {
    console.error(error);
    res.render("faq.ejs", { alumnis: [] });
  }
});

app.get("/alumni", async (req, res) => {
  try {
    const alumnis = await Alumni.find({});
    const colleges = await College.find({});
    res.render("alumni.ejs", { alumnis, colleges });
  } catch (error) {
    console.error(error);
    res.render("alumni.ejs", { alumnis: [], colleges: [] });
  }
});

// Alumni routes
app.patch("/alumni/:_id", async (req, res) => {
  try {
    const response = await Alumni.findOneAndUpdate(
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

app.post("/add/alumni", upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    
    const newAlumni = await new Alumni({
      name: req.body.name,
      college: req.body.college,
      year: req.body.year,
      major: req.body.major,
      image: imagePath,
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
    const response = await Alumni.findOneAndDelete({ _id: req.params._id });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete alumni" });
  }
});

app.patch("/alumni/:_id/image", upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    
    const response = await Alumni.findOneAndUpdate(
      { _id: req.params._id }, 
      { image: imagePath }, 
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update alumni image" });
  }
});

// College routes
app.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find({});
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

app.post("/add/college", upload.single('imageUrl'), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    
    const newCollege = await new College({
      name: req.body.name,
      imageUrl: imagePath,
      count: req.body.count
    }).save();
    res.json(newCollege);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add college" });
  }
});

app.patch("/college/:_id", upload.single('imageUrl'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      count: req.body.count
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const response = await College.findOneAndUpdate(
      { _id: req.params._id },
      updateData,
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update college" });
  }
});

app.delete("/delete/college/:_id", async (req, res) => {
  try {
    const response = await College.findOneAndDelete({ _id: req.params._id });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete college" });
  }
});

// NEW ROUTES FOR UPDATES WITH LIMIT ENFORCEMENT
app.get("/api/updates", async (req, res) => {
  try {
    const updates = await Update.find({}).sort({ createdAt: -1 }).limit(MAX_UPDATES);
    res.json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
});

app.post("/api/updates", async (req, res) => {
  try {
    // First, check current count
    const currentCount = await Update.countDocuments();
    
    // Create new update
    const newUpdate = await new Update({
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      important: req.body.important || false
    }).save();
    
    // If we exceed the limit, remove the oldest ones
    if (currentCount >= MAX_UPDATES) {
      const excessCount = currentCount - MAX_UPDATES + 1;
      const oldestUpdates = await Update.find({})
        .sort({ createdAt: 1 })
        .limit(excessCount);
      
      const idsToDelete = oldestUpdates.map(update => update._id);
      await Update.deleteMany({ _id: { $in: idsToDelete } });
      
      console.log(`Removed ${idsToDelete.length} oldest updates to maintain limit of ${MAX_UPDATES}`);
    }
    
    res.json(newUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add update" });
  }
});

app.patch("/api/updates/:id", async (req, res) => {
  try {
    const response = await Update.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
        important: req.body.important || false
      },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update" });
  }
});

app.delete("/api/updates/:id", async (req, res) => {
  try {
    const response = await Update.findOneAndDelete({ _id: req.params.id });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete update" });
  }
});

// NEW ROUTES FOR IMPORTANT INFO WITH LIMIT ENFORCEMENT
app.get("/api/info", async (req, res) => {
  try {
    const info = await Info.find({}).sort({ createdAt: -1 }).limit(MAX_INFO);
    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch info" });
  }
});

app.post("/api/info", async (req, res) => {
  try {
    // First, check current count
    const currentCount = await Info.countDocuments();
    
    // Create new info
    const newInfo = await new Info({
      title: req.body.title,
      content: req.body.content,
      date: req.body.date
    }).save();
    
    // If we exceed the limit, remove the oldest ones
    if (currentCount >= MAX_INFO) {
      const excessCount = currentCount - MAX_INFO + 1;
      const oldestInfo = await Info.find({})
        .sort({ createdAt: 1 })
        .limit(excessCount);
      
      const idsToDelete = oldestInfo.map(info => info._id);
      await Info.deleteMany({ _id: { $in: idsToDelete } });
      
      console.log(`Removed ${idsToDelete.length} oldest info items to maintain limit of ${MAX_INFO}`);
    }
    
    res.json(newInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add info" });
  }
});

app.patch("/api/info/:id", async (req, res) => {
  try {
    const response = await Info.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        content: req.body.content,
        date: req.body.date
      },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update info" });
  }
});

app.delete("/api/info/:id", async (req, res) => {
  try {
    const response = await Info.findOneAndDelete({ _id: req.params.id });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete info" });
  }
});

async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://SE12:CSH2025@cluster0.pqx7f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected to MongoDB");
    
    app.listen(3000, () => {
      console.log(`Server running on port 3000`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();