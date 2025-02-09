import fs from 'fs';
import readline from 'readline';

// Path to your large JSON file
const jsonFilePath = './uploads/9.json';
const formattedFilePath = './uploads/9-formatted.json';

// Function to clean and fix missing colons or other common JSON errors
async function cleanJsonString(jsonString) {
  // Step 1: Fix missing colons between property names and values
  jsonString = jsonString.replace(/"([^"]+)"\s*"([^"]+)"/g, '"$1": "$2"'); // Add missing colons
  
  // Step 2: Remove any trailing commas before closing braces (} or ])
  jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
  
  // Step 3: Ensure property names are enclosed in double quotes, replace single quotes if necessary
  jsonString = jsonString.replace(/'([^']+)'/g, '"$1"'); // Convert single quotes to double quotes
  
  // Step 4: Fix missing commas between properties in an object
  jsonString = jsonString.replace(/([^,\{\}\[\]]+)(\s*[^,{}[\]]+)/g, '$1,$2'); // Ensure commas are added

  return jsonString;
}

async function formatLargeJson() {
  try {
    const readStream = fs.createReadStream(jsonFilePath, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream(formattedFilePath);

    // Create a readline interface to read the file line by line
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity, // Recognize all instances of CRLF ('\r\n') as a single newline
    });

    let isFirstLine = true;
    let jsonBuffer = '';
    let totalLines = 0;
    let processedLines = 0;

    // Start the JSON array in the output file
    writeStream.write('[');

    // First, count the total number of lines in the input file
    rl.on('line', () => {
      totalLines++;
    });

    // Process the lines
    for await (const line of rl) {
      if (line.trim()) {
        // Append line to the buffer
        jsonBuffer += line.trim();

        try {
          // Clean and sanitize the JSON string before parsing
          jsonBuffer = await cleanJsonString(jsonBuffer);

          // Check if the buffer can be parsed as a complete JSON object or array
          const jsonDoc = JSON.parse(jsonBuffer);

          // If it's the first valid JSON object, write it as the first element
          if (!isFirstLine) {
            writeStream.write(',');
          }
          isFirstLine = false;

          // Pretty print the JSON object and write to the file
          writeStream.write(JSON.stringify(jsonDoc, null, 2));

          // Reset the buffer for the next chunk
          jsonBuffer = '';
          processedLines++;

          // Show progress after every 100 processed lines
          if (processedLines % 100 === 0) {
            console.log(`Successfully processed and uploaded ${processedLines} lines.`);
          }
        } catch (err) {
          // Log the error and skip this malformed line
          console.error(`Error parsing JSON at line ${processedLines + 1}: ${err.message}`);
          jsonBuffer = ''; // Reset the buffer
          continue; // Skip this line and move to the next
        }
      }
    }

    // End the JSON array in the output file
    writeStream.write(']');

    writeStream.end(() => {
      console.log(`\nJSON file has been formatted successfully. Total lines processed: ${processedLines}`);
    });
  } catch (err) {
    // Handle unexpected errors (e.g., file reading/writing errors)
    console.error('Error occurred during file processing:', err.message);
  }
}

formatLargeJson();
