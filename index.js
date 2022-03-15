const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {
  return mongoose.connect(
    "mongodb://localhost:27017/books"
  );
};    

app.listen(5500, async () => {
  try{
    await connect();
    console.log("Listening on port 5500");
  }catch(err){
    console.log(err);
  }
 
});

//----------------------------------------------CRUD Section-----------------------------------------------------
//2. create schema for section
const sectionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    checked : {type : Boolean},
    Books: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
    Author : {type : mongoose.Schema.Types.ObjectId, ref : "author"},
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const userschema = new mongoose.Schema(
  {
    
    firstName: { type: String, required: true },
    lastName : { type: String, required: true},
    age:{ type:Number,required:true},
    email:{type:String , required:true}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const User = mongoose.model("user", userschema);

app.get("/users", async (req, res) => {
  try {
  
    const user = await User.find().lean().exec();
    return res.status(200).send({user:user});
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


//3. Create model for section schema
// in schema the first parameter is Collection name  and second parameter is schema name
const Section = mongoose.model("section", sectionSchema);


//Post method for section
app.post("/section", async (req, res) => {
  try {
    const section = await Section.create(req.body);
    return res.status(201).send(section);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//.Get method for route /section to get all object
app.get("/section", async (req, res) => {
  try {
    const filter = {};
    filter.checked = {$eq : req.query.checked};
    const section = await Section.find(filter)
      .populate({ path: "Books", select: ["name", "price"] })
      .populate({path : "Author"})
      .lean()
      .exec();
    return res.send(section);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
app.get("/sectionAuthor/:id", async (req, res) => {
  try {

    const section = await Section.find(filter)
      .populate({ path: "Books", select: ["name", "price"]})
      .populate({path : "Author"})
      .lean()
      .exec();

    return res.send(section);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//Get method for getting single item
let arr = [];
app.get("/section/:id", async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate({ path: "Books", select: ["name", "price"] })
      .lean()
      .exec();
    section.Books.map((elem) => {
      let obj = { Name: elem.name, Price: elem.price };
      arr.push(obj);
    });
    return res.send(arr);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//Get method to get books from a particular sections
app.get("/section_book/:id", async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate({ path: "Books", select: ["name", "price"] })
      .lean()
      .exec();
    return res.send(section);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Patch method for editing the existing object of section
app.patch("/section/:id", async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(201).send(section);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//Delete method for section
app.delete("/section/:id", async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    return res.send(section);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//------------------------------------------------CRUD Author------------------------------------------------------
// Author schema
const authorSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    Books: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
//Auhtor Model
const Author = mongoose.model("author", authorSchema);
//Post methor for author
app.post("/author", async (req, res) => {
  try {
    const author = await Author.create(req.body);
    return res.status(201).send(author);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Get all author method
app.get("/author", async (req, res) => {
  try {
    const author = await Author.find().lean().exec();
    return res.send(author);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Get particular author by id
app.get("/author/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).lean().exec();
    return res.send(author);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});
//get method to get all book belongs to author
app.get("/author_book/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
      .populate({ path: "Books", select: ["name", "price"] })
      .lean()
      .exec();
    return res.send(author);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//Patch method for author
app.patch("/author/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(201).send(author);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Delete method for author
app.delete("/author/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    return res.send(author);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//---------------------------------------------CRUD Books-------------------------------------------------
//Books schema
const bookSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sec_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
    auth_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author",
      required: true,
    },
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
//Books model
const Book = mongoose.model("book", bookSchema);

//Post method for book
app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).send(book);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//Get method to get all books
app.get("/books", async (req, res) => {
  try {
    const book = await Book.find()
      .populate({ path: "sec_id", select: "type" })
      .populate({ path: "auth_id", select: "name" })
      .lean()
      .exec();
    return res.send(book);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Get method to et single book object
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({ path: "sec_id", select: "type" })
      .populate({ path: "auth_id", select: "name" })
      .lean()
      .exec();
    return res.send(book);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Patch method to update Books object
app.patch("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.send(book);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});

//Delete method for Books object
app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    return res.send(book);
  } catch (er) {
    return res.status(500).send(er.message);
  }
});