const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.json());
// MongoDB CONNECTION
mongoose
  .connect("mongodb+srv://test123:test123@cluster0.okictkx.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

//  CONTACT SCHEMA

const contactSchema = new mongoose.Schema({
    
  fullname: String,
  address: String,
  contactno: String,
  zip: String,
  email: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// USER SCHEMA

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    }
    
  });
  

//  CONTACT MODEL

const Contact = mongoose.model("Contact", contactSchema);

// USER MODEL
const User = mongoose.model("User123", userSchema);




// API to add users
app.post('/api/users', async (req, res) => {
    try {
      const { username } = req.body;
  
      const user = new User({
        username,
        
      });
  
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add user' });
    }
  });



// API to add contacts
app.post("/api/contacts", async (req, res) => {
  try {
    const { fullname, address, contactno, zip, email, created_by } = req.body;

    const contact = new Contact({
      fullname,
      address,
      contactno,
      zip,
      email,
      created_by,
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Failed to add contact details" });
  }
});


  



// API to get contact details with user details
app.get("/api/contacts/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const contact = await Contact.findById(contactId).populate("created_by");
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ contact, user: contact.created_by });
  } catch (error) {
    res.status(500).json({ error: "Failed to get contact details" });
  }
});

// API to get user details with all contacts in a single array
app.get("/api/users/:userId/contacts", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const contacts = await Contact.find({ created_by: userId });

    res.status(200).json({ user, contacts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user details and the contacts" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
