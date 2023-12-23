// import { MongoClient, ObjectId } from "mongodb";

// let connectionString = "mongodb://127.0.0.1:27017/blog";

// const client = new MongoClient(connectionString);

// /*Connecting to the MongoDb */

// const connect = async ({ collectionName }) => {
//   try {
//     console.log("Connecting to the database...");
//     await client.connect();
//     const db = client.db();
//     const collection = db.collection(collectionName);
//     console.log("Connected to the database is established");
//     return collection;
//   } catch (error) {
//     console.error("Error occurred when connecting to the database", error);
//   }
// };

// const close = () => {
//   client.close();
//   console.log("Connection to the database is closed");
// };

// export { connect, close };
