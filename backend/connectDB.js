// import { MongoClient } from 'mongodb';

// // // Commented out MongoDB Atlas connection
// // /*
// // const password = encodeURIComponent('Sase@123');
// // // 
const mongoUrl = `mongodb+srv://sasea:7BeUNMWRU4sk2jD1@cluster0.ymmxu.mongodb.net/`;

// // const mongoUrl = 'mongodb://127.0.0.1:27017';; 

// const dbName = 'LabelStudio';

// const client = new MongoClient(mongoUrl);

// export default async function connectToDatabase() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     return client.db(dbName);
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   } 
// }



import { MongoClient } from 'mongodb';

// const mongoUrl = `mongodb+srv://neerajp:vSV8QB16Xi5ARaN5@cluster0.9paog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const dbName = 'LabelStudio';

const client = new MongoClient(mongoUrl);

export default async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    client.close();
    throw error;
  } 
}
