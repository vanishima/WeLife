const MongoClient = require("mongodb").MongoClient;

function momentDB() {
  const momentDB = {};
  const url = process.env.MONGO_URL;
  const DB_NAME = "momentDB";

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
        id: file.id,
        name: file.name,
        title: file.title,
        content: file.content,
        time: new Date(),
        like: 0,
      });
      console.log("Inserted ", files);
      return files;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.getMyOwnFiles = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the db");
      const db = client.db(DB_NAME);
      const files = db.collection("files");
      console.log("Collection ready, finding my own posts: ", query);
      const result = await files.find(query).toArray();
      return result;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.deleteMyOwnFiles = async (id) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the db");
      const db = client.db(DB_NAME);
      console.log("Collection ready, deleting my own posts: ", id);
      const now = await db.collection("files").deleteOne({ id: id.id });
      return now;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.editMyOwnFiles = async (id, content) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the db");
      const db = client.db(DB_NAME);
      console.log("Collection ready, updating my own post: ", id);
      const post = await db.collection("files").updateOne({
        id: id,
        $set: { content: content },
      });
      console.log("Got files ", post);
      return post;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.addLikes = async (id) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the db");
      const db = client.db(DB_NAME);
      console.log(
        "Collection ready, updating the number of likes for the post: ",
        id
      );

      const post = await db.collection("files").updateOne(
        { id: id },
        {
          $inc: { like: 1 },
        }
      );
      console.log("Got files ", post);
      return post;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.findFile = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the db");
      const db = client.db(DB_NAME);
      const files = db.collection("files");
      console.log("Collection ready, finding file: ", query);
      const result = await files.findOne(query);
      return result;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.findUser = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the db");
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      console.log("Collection ready, finding user: ", query);
      const result = await credentials.findOne(query);
      return result;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  momentDB.getPassword = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected to the momentDB");
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      console.log("Collection ready, querying with ", query);
      const pwd = await credentials.findOne(query);
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
        id: credential.id,
        username: credential.username,
        password: credential.password,
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
