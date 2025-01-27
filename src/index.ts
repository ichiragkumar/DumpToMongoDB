import { MongoClient, ObjectId } from "mongodb";
import * as fs from "fs";

const uri = process.env.MONGODB_URI || "";
const dbName = "firestore-waw"; 
const collectionName = "chirag-test-business";

async function dumpData() {
  const client = new MongoClient(uri);

  try {
    const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

    const transformedData = data.map(item => {
      if (item._id && item._id.$oid) {
        item._id = new ObjectId(item._id.$oid);
      }
      return item;
    });


    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);


    const result = await collection.insertMany(transformedData);
    console.log(`Inserted ${result.insertedCount} documents`);
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.close();
  }
}

dumpData();
