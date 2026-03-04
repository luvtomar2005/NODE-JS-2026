const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://luvtomar2005_db_user:mynameisLuvTomar@cluster0.xaaaxev.mongodb.net/";
const client = new MongoClient(url);

const dbName = "Helloworld";

async function main() {
  await client.connect();
  console.log("Connected succesfully to server");
  const db = client.db(dbName);
  const collection = db.collection("Collection1");
  // read the data
  const data = {
    name: "Madhuri dixit",
    city: "Mumbai",
    region: "Maharastra",
    Aim: "Dancer",
    Type: "Intelligent",
  };
  // read the data
  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);
  const insertResult = await collection.insertMany([data]);
  console.log("Inserted documents =>", insertResult);
  // find all documents with the first name as "Luv"
  const result = await collection.find({firstName : "Luv"}.toArray());
  console.log("result" , result);
  return "done";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
