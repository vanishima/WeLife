const MongoClient = require("mongodb").MongoClient;

function momentDB() {
  const momentDB = {};
  const url = process.env.MONGO_URL;
  const DB_NAME = "momentDB";

  momentDB.getFiles = async (query = {}) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const filesCol = db.collection("files");
      const files = await filesCol.find(query).toArray();
      return files;
    } finally {
      client.close();
    }
  };

  momentDB.createFile = async (file) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const filesCol = db.collection("files");
      const files = await filesCol.insertOne({
        id: file.id,
        name: file.name,
        title: file.title,
        content: file.content,
        time: new Date(),
        like: 0,
      });
      return files;
    } finally {
      client.close();
    }
  };

  momentDB.getMyOwnFiles = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const files = db.collection("files");
      const result = await files.find(query).toArray();
      return result;
    } finally {
      client.close();
    }
  };

  momentDB.deleteMyOwnFiles = async (id) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const now = await db.collection("files").deleteOne({ id: id.id });
      return now;
    } finally {
      client.close();
    }
  };

  momentDB.editMyOwnFiles = async (id, content) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const post = await db.collection("files").updateOne({
        id: id,
        $set: { content: content },
      });
      return post;
    } finally {
      client.close();
    }
  };

  momentDB.addLikes = async (id) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const post = await db.collection("files").updateOne(
        { id: id },
        {
          $inc: { like: 1 },
        }
      );
      return post;
    } finally {
      client.close();
    }
  };

  momentDB.findFile = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const files = db.collection("files");
      const result = await files.findOne(query);
      return result;
    } finally {
      client.close();
    }
  };

  momentDB.findUser = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      const result = await credentials.findOne(query);
      return result;
    } finally {
      client.close();
    }
  };

  momentDB.getPassword = async (query) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      const pwd = await credentials.findOne(query);
      return pwd;
    } finally {
      client.close();
    }
  };

  momentDB.createCredential = async (credential) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const credentials = db.collection("credentials");
      await credentials.insertOne({
        id: credential.id,
        username: credential.username,
        password: credential.password,
        firstname: credential.firstname,
        lastname: credential.lastname,
      });
      return "Success";
    } finally {
      client.close();
    }
  };

  return momentDB;
}

module.exports = momentDB();
