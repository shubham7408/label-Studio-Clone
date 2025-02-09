import { MongoClient } from 'mongodb';
import fs from 'fs';
import readline from 'readline';

// MongoDB Atlas connection string (Replace with your credentials)
const password = encodeURIComponent('Sase@123');
const uri = `mongodb+srv://sasesudarshan:${password}@cluster0.3mgx9.mongodb.net/LabelStudio?retryWrites=true&w=majority&appName=Cluster0`;

// Database and collection names (Modify as needed)
const dbName = 'LabelStudio';
const collectionName = '9';

// Path to your large JSON file
const jsonFilePath = '../backend/uploads/task.json';

async function uploadJson() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log('Connected to MongoDB Atlas.');

    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create a read stream to read the large JSON file line by line
    const rl = readline.createInterface({
      input: fs.createReadStream(jsonFilePath),
      crlfDelay: Infinity // Recognize all instances of CRLF ('\r\n') as a single newline
    });

    let bulkOps = [];
    let lineCount = 0;

    // Iterate through each line of the file
    for await (const line of rl) {
      if (line.trim()) {  // Skip empty lines
        try {
          // Log the line being parsed for debugging
          console.log(`Parsing line ${lineCount}: ${line}`);

          const jsonDoc = JSON.parse(line); // Parse the JSON line
          bulkOps.push({ insertOne: { document: jsonDoc } });
          lineCount++;
        } catch (err) {
          // Log the error with the problematic line for further debugging
          console.error(`Error parsing JSON on line ${lineCount}:`, err, `Line content: ${line}`);
        }
      }

      // Bulk insert every 1000 documents
      if (bulkOps.length === 1000) {
        try {
          await collection.bulkWrite(bulkOps);
          console.log(`Inserted 1000 documents into ${collectionName}.`);
          bulkOps = []; // Reset bulkOps after insertion
        } catch (err) {
          // Log error if bulk insertion fails
          console.error('Error during bulk insert:', err);
        }
      }
    }

    // Insert any remaining documents after processing all lines
    if (bulkOps.length > 0) {
      try {
        await collection.bulkWrite(bulkOps);
        console.log(`Inserted ${bulkOps.length} remaining documents into ${collectionName}.`);
      } catch (err) {
        // Log error if bulk insertion fails
        console.error('Error during final bulk insert:', err);
      }
    }

    console.log(`Successfully processed ${lineCount} lines.`);
  } catch (err) {
    // Log the overall error if the connection or file reading fails
    console.error('Error uploading JSON:', err);
  } finally {
    try {
      // Close the connection to MongoDB
      await client.close();
      console.log('Connection closed.');
    } catch (err) {
      // Handle any error while closing the connection
      console.error('Error closing connection:', err);
    }
  }
}

uploadJson();
