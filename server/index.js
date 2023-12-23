import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import { MongoClient, ObjectId } from "mongodb";

// import { connect } from "./db.js";

import { BlogCollectionName, PORT, USERCOLLECTION } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

// let connectionString = "mongodb://localhost:27017/testCollection"; // this is not working using 127.0.0.1
let connectionString = "mongodb://127.0.0.1:27017/blog";

const client = new MongoClient(connectionString);

const connect = async () => {
  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database is established");
  } catch (error) {
    console.error("Error occurred when connecting to the database", error);
  }
};

const close = () => {
  client.close();
  console.log("Connection to the database is closed");
};

connect();

app.listen(PORT, () => {
  console.log(`The Server is running on port ${PORT}`);
});

app.get("/", (request, response) => {
  response.end("Connected ");
});

const registerUser = async (collectionName, document) => {
  try {
    const db = client.db();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);
    console.log(`Document inserted with _id: ${result.insertedId}`);
    return true;
  } catch (err) {
    console.error("Error inserting document:", err);
  }
};

app.get("/", (request, response) => {
  response.end("Connected ");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testaccte9@gmail.com",
    pass: "tocu vjch cbqm mvkd",
  },
});

app.post("/register", async (request, response) => {
  const dataFromForm = request.body;
  try {
    const token = jwt.sign(
      {
        email: dataFromForm.email,
        role: dataFromForm.role,
        imageUrl: dataFromForm.imageUrl,
        name: dataFromForm.name,
      },
      "secret_key",
      { expiresIn: "1h" }
    );

    const verificationToken = jwt.sign(
      { email: dataFromForm.email, active: false },
      "email_key",
      { expiresIn: "10m" }
    );

    const status = await registerUser(
      USERCOLLECTION,
      dataFromForm,
      verificationToken
    );
    // Send verification email tocu vjch cbqm mvkd

    const verificationLink = `http://127.0.0.1:7000/verify/${verificationToken}`;
    const mailOptions = {
      from: "testaccte9@gmail.com",
      to: dataFromForm.email,
      subject: "Account Verification",
      text: `Click the following link to verify your account: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Verification email sent:", info.response);
      res.status(200).json({
        message:
          "Registration successful. Please check your email for verification.",
      });
    });

    if (status) {
      return response
        .status(200)
        .json({ statusCode: 201, msg: "User added to database", token });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    response
      .status(500)
      .json({ statusCode: 500, msg: "Internal Server Error" });
  }
});

app.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, "your_secret_key");

    // Find user with the given email

    const user = await collection.findOne({ email: decodedToken.email });

    if (!user || user.active) {
      return res.status(404).json({ error: "User not found or invalid token" });
    }

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(400).json({ error: "Invalid token" });
  }
});

app.get("/register", async (request, response) => {
  try {
    const db = client.db();
    const collection = db.collection(USERCOLLECTION);
    const data = await collection.find().toArray();
    response.json(data);
  } catch (error) {
    console.error("Error fetched  document from DB:", error);
  }
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const db = client.db();
    const collection = db.collection(USERCOLLECTION);
    const user = await collection.findOne({ email: email });

    if (!user) {
      return response
        .status(401)
        .json({ statusCode: 401, msg: "No user found" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
        name: user.name,
      },
      "secret_key",
      { expiresIn: "1h" }
    );

    if (user.password !== password) {
      return response
        .status(401)
        .json({ statusCode: 401, msg: "Invalid email or password" });
    } else {
      response.status(200).json({
        statusCode: 200,
        msg: "Login successful",
        token,
      });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    response
      .status(500)
      .json({ statusCode: 500, msg: "Internal Server Error" });
  }
});

app.post("/profile", async (request, response) => {
  //   const { imageUrl, email, password } = request.body;
  const dataFromForm = request.body;

  try {
    const db = client.db();
    const collection = db.collection(USERCOLLECTION);

    try {
      await collection.updateOne(
        { email: dataFromForm.email },
        {
          $set: {
            ...dataFromForm,
          },
        }
      );
      return response
        .status(201)
        .json({ statusCode: 201, msg: "Profile updated sucessfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    response
      .status(500)
      .json({ statusCode: 500, msg: "Internal Server Error" });
  }
});

app.get("/admin", async (request, response) => {
  try {
    const db = client.db();
    const collection = db.collection(USERCOLLECTION);
    const data = await collection.find().toArray();
    response.json(data);
  } catch (error) {
    console.error("Error fetched  document from DB:", error);
  }
});

app.get("/admin/profile/:id", async (request, response) => {
  const { id } = request.params;
  const profileID = new ObjectId(id);

  try {
    const db = client.db();
    const collection = db.collection(USERCOLLECTION);
    const user = await collection.findOne({ _id: profileID });

    if (!user) {
      return response
        .status(401)
        .json({ statusCode: 401, msg: "No user found" });
    } else {
      response.status(200).json({
        user,
      });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    response
      .status(500)
      .json({ statusCode: 500, msg: "Internal Server Error" });
  }
});

app.post("/admin/profile/:id", async (request, response) => {
  const { id } = request.params;
  const profileID = new ObjectId(id);
  const dataFromForm = request.body;

  try {
    const db = client.db();
    const collection = db.collection(USERCOLLECTION);
    const user = await collection.updateOne(
      { _id: profileID },
      {
        $set: {
          ...dataFromForm,
        },
      }
    );

    if (!user) {
      return response
        .status(401)
        .json({ statusCode: 401, msg: "No user found" });
    } else {
      response.status(200).json({
        user,
      });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    response
      .status(500)
      .json({ statusCode: 500, msg: "Internal Server Error" });
  }
});

app.post("/blogcreate", async (request, response) => {
  //   const { imageUrl, email, password } = request.body;
  const dataFromForm = request.body;

  try {
    const db = client.db();
    const collection = db.collection(BlogCollectionName);
    const result = await collection.insertOne(dataFromForm);
    console.log(`Blog inserted with _id: ${result.insertedId}`);

    return response
      .status(201)
      .json({ statusCode: 201, msg: "Blog posted sucessfully" });
  } catch (err) {
    console.error("Error inserting document:", err);
    return response
      .status(500)
      .json({ statusCode: 500, msg: "Error posting blog" });
  }
});

app.get("/blog", async (request, response) => {
  try {
    const db = client.db();
    const collection = db.collection(BlogCollectionName);
    const blogs = await collection.find().toArray();

    const authorIds = blogs.map((blog) => blog.author);

    const profileCollection = db.collection(USERCOLLECTION);
    const profiles = await profileCollection
      .find(
        { name: { $in: authorIds } },
        { projection: { name: 1, _id: 1, imageUrl: 1 } }
      )
      .toArray();

    const data = blogs.map((blog) => {
      const authorProfile = profiles.find(
        (profile) => profile.name === blog.author
      );
      return {
        ...blog,
        authorProfile,
      };
    });

    response.json(data);
  } catch (error) {
    console.error("Error fetched  document from DB:", error);
  }
});

app.get("/blog/:id", async (request, response) => {
  const { id } = request.params;
  const profileID = new ObjectId(id);

  try {
    const db = client.db();
    const collection = db.collection(BlogCollectionName);
    const blog = await collection.find({ _id: profileID }).toArray();

    response.json(blog);
  } catch (error) {
    console.error("Error fetched  document from DB:", error);
  }
});

app.delete("/blog/:id", async (request, response) => {
  const { id } = request.params;
  const blogID = new ObjectId(id);

  try {
    const db = client.db();
    const collection = db.collection(BlogCollectionName);

    const result = await collection.deleteOne({ _id: blogID });
    console.log(`Blog Deleted with _id: ${result.insertedId}`);

    if (result.deletedCount === 1) {
      response
        .status(201)
        .json({ statusCode: 201, msg: "Blog post deleted successfully." });
    } else {
      response
        .status(404)
        .json({ statusCode: 404, msg: "Blog post not found." });
    }
  } catch (error) {
    console.error("Error deleting document from DB:", error);
    response
      .status(500)
      .json({ statusCode: 500, message: "Internal Server Error" });
  }
});

app.post("/blog/edit/:id", async (request, response) => {
  const { id } = request.params;
  const profileID = new ObjectId(id);
  const dataFromForm = request.body;

  try {
    const db = client.db();
    const collection = db.collection(BlogCollectionName);

    const result = await collection.updateOne(
      { _id: profileID },
      { $set: dataFromForm }
    );

    if (result.matchedCount === 0) {
      return response
        .status(404)
        .json({ statusCode: 404, msg: "No document found" });
    } else {
      response.status(200).json({
        result,
      });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    response
      .status(500)
      .json({ statusCode: 500, msg: "Internal Server Error" });
  }
});
