const MongoClient = require("mongodb").MongoClient;

function momentDB() {
  const momentDB = {};
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  const DB_NAME = "momentFiles";

  momentDB.getFiles = async (query = {}) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the momentDB");
      const db = client.db(DB_NAME);
      const filesCol = db.collection("files");
      console.log("Collection ready, querying with ", query);
      const files = await filesCol.find(query).toArray();
      console.log("Got files: ", files);
      return files;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.deleteFile = async (file) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the momentDB");
      const db = client.db(DB_NAME);
      const filesCol = db.collection("files");
      console.log("Collection ready, deleting ", file);
      const files = await filesCol.deleteOne({
        name: file.name,
        time: file.time,
      });
      console.log("Got files ", files);
      return files;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.createFile = async (file) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the momentDB");
      const db = client.db(DB_NAME);
      const filesCol = db.collection("files");
      console.log("Collection ready, inserting ", file);
      const files = await filesCol.insertOne({
        name: file.name,
        title: file.title,
        content: file.content,
        image: file.image,
        time: file.time,
      });
      console.log("Inserted ", files);
      return files;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.getPassword = async (query = {}) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the momentDB");
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      console.log("Collection ready, querying with ", query);
      const pwd = await credentials.findOne(query).toArray();
      console.log("Found");
      return pwd;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.createCredential = async (credential) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the momentDB");
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      console.log("Collection ready, inserting ", credential);
      await credentials.insertOne({
        username: credential.username,
        hash: credential.hash,
        firstname: credential.firstname,
        lastname: credential.lastname,
      });
      console.log("Successfully inserted");
      return "Success";
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  return momentDB;
}

module.exports = momentDB();
