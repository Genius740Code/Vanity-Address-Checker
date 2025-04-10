// solana-vanity-address-generator.js
const crypto = require('crypto');
const { PublicKey, Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const os = require('os');
const cluster = require('cluster');
const fs = require('fs');
const path = require('path');

// Check if required packages are installed
try {
  require('@solana/web3.js');
  require('bs58');
} catch (err) {
  console.error('Required packages not found. Please install them using:');
  console.error('npm install @solana/web3.js bs58');
  process.exit(1);
}

// Main function for worker processes
function startWorker(searchPattern) {
  const searchTextLower = searchPattern.toLowerCase();
  let count = 0;
  let lastReported = 0;
  
  console.log(`[Worker ${process.pid}] Started searching for "${searchPattern}"`);
  
  // Main search loop
  while (true) {
    // Generate a new keypair
    const keypair = Keypair.generate();
    
    // Get the public key address in base58
    const publicKey = keypair.publicKey.toString();
    
    // Check if the address contains the search pattern (case insensitive)
    if (publicKey.toLowerCase().includes(searchTextLower)) {
      // Extract private key
      const privateKeyBytes = keypair.secretKey.slice(0, 32);
      const privateKey = bs58.encode(privateKeyBytes);
      
      // Report the match
      process.send({
        type: 'match',
        publicKey,
        privateKey,
        count
      });
      
      // Continue searching for more matches
    }
    
    count++;
    
    // Report progress every 1000 addresses
    if (count - lastReported >= 1000) {
      process.send({ type: 'progress', count });
      lastReported = count;
    }
  }
}

// Save match to text file
function saveMatchToFile(match, searchText) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const filename = `solana-${searchText}-${timestamp}.txt`;
  
  const data = `
===============================================
Solana Vanity Address Match
===============================================
Search Text: ${searchText}
Found At: ${now.toLocaleString()}
-----------------------------------------------
Public Address: ${match.publicKey}
Private Key: ${match.privateKey}
===============================================
`;

  fs.writeFileSync(filename, data);
  return filename;
}

// Main function for primary process
function main() {
  if (cluster.isPrimary) {
    // Get the search text from command line arguments
    const searchText = process.argv[2];
    if (!searchText) {
      console.error('Please provide a search pattern as a command line argument');
      console.error('Example: node solana-vanity-address-generator.js lava');
      process.exit(1);
    }
    
    // Determine number of workers (use number of CPU cores)
    const numCPUs = os.cpus().length;
    console.log(`Starting ${numCPUs} worker processes on ${numCPUs} CPU cores`);
    
    // Track total progress
    let totalChecked = 0;
    const startTime = Date.now();
    let matchesFound = 0;
    
    // Create results directory if it doesn't exist
    const resultsDir = 'results';
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir);
    }
    
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork();
      
      // Handle messages from workers
      worker.on('message', (msg) => {
        if (msg.type === 'progress') {
          totalChecked += msg.count;
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          const addressesPerSecond = Math.floor(totalChecked / elapsedSeconds);
          console.log(`Checked ${totalChecked.toLocaleString()} addresses (${addressesPerSecond.toLocaleString()}/sec)`);
        } 
        else if (msg.type === 'match') {
          matchesFound++;
          // Save match to a text file
          const filename = saveMatchToFile(msg, searchText);
          
          console.log('\x1b[32m%s\x1b[0m', `\n=== MATCH FOUND (#${matchesFound}) ===`);
          console.log(`Public Address: ${msg.publicKey}`);
          console.log(`Private Key: ${msg.privateKey}`);
          console.log(`Found after checking ${(totalChecked + msg.count).toLocaleString()} addresses`);
          console.log(`Saved to file: ${filename}`);
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          console.log(`Time elapsed: ${elapsedSeconds.toFixed(2)} seconds\n`);
        }
      });
      
      // Send search pattern to worker
      worker.send(searchText);
    }
    
    // Handle worker messages
    cluster.on('message', (worker, message) => {
      if (message === 'ready') {
        worker.send(searchText);
      }
    });
    
    console.log(`Searching for Solana addresses containing "${searchText}" (case-insensitive)`);
    console.log('Press Ctrl+C to stop the search at any time\n');
    console.log('Matches will be saved to text files in the current directory\n');
    
  } else {
    // This is a worker process
    process.on('message', (searchText) => {
      startWorker(searchText);
    });
    
    // Tell the primary we're ready
    process.send('ready');
  }
}

main();
