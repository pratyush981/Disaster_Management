const fs = require('fs');
const { PythonShell } = require('python-shell');
const csv = require('csv-parser');

function processCSV(inputFile, outputFile, callback) {
  // Run the Python script to process the data
  PythonShell.run('process_model.py', null, (err) => {
    if (err) return callback(err);

    // Read the processed output CSV
    const results = [];
    fs.createReadStream(outputFile)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Write the JSON data to output.json
        fs.writeFileSync(outputFile.replace('.csv', '.json'), JSON.stringify(results, null, 2));
        callback(null);
      });
  });
}

module.exports = { processCSV };
