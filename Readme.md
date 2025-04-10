# Optimized Solana Vanity Address Generator

Generate Solana wallet addresses containing specific text patterns (case-insensitive). This tool searches for Solana addresses that match any of your desired patterns and provides both the public address and private key when matches are found.

## Features

- **Multi-threaded**: Utilizes all available CPU cores for maximum performance
- **Multiple patterns**: Search for multiple text patterns simultaneously
- **Batch processing**: Processes addresses in batches for improved speed
- **Optimized cryptography**: Uses tweetnacl for faster key generation
- **Case-insensitive**: Finds matches regardless of letter case
- **Real-time stats**: Shows search speed and progress updates
- **File saving**: Automatically saves each match to a text file
- **Continuous operation**: Keeps searching for multiple matches

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/solana-vanity-address-generator.git
cd solana-vanity-address-generator
```

2. Install dependencies:
```bash
npm install
```

## Usage

Run the tool with one or more search patterns:

```bash
node solana-vanity-address-generator.js lava moon crypto
```

This will search for Solana addresses containing "lava", "moon", or "crypto" (case-insensitive).

### Example Output

```
Starting 8 worker processes on 8 CPU cores
Searching for Solana addresses containing any of: "lava", "moon", "crypto"
All searches are case-insensitive
Press Ctrl+C to stop the search at any time

Matches will be saved to text files in the current directory

Checked 50,000 addresses (23,450/sec)
Checked 102,000 addresses (24,125/sec)

=== MATCH FOUND (#1) ===
Pattern Matched: moon
Public Address: GVmoONQxJT79HXGYn1JwmfSgW8Pc4LmVMTfUYL8Moonbz
Private Key: 5YMnHfRg67NBmQXeNYLPFKgQfk3rJ5EfmLBS6BsDfK5s
Found after checking ~156,748 addresses
Saved to file: solana-moon-2025-04-10T12-15-32-456Z.txt
Time elapsed: 6.42 seconds

Checked 210,000 addresses (24,567/sec)

=== MATCH FOUND (#2) ===
Pattern Matched: lava
Public Address: 8LaVao5hypeDkBgVJbMdpzUCkW3PTs2LJBEGRXPi6KyM
Private Key: 4eXqL6VrRpMGcnVdVwM9RPGDmqFZpYcQWxZ67KLb46WC
Found after checking ~267,891 addresses
Saved to file: solana-lava-2025-04-10T12-15-40-128Z.txt
Time elapsed: 10.89 seconds
```

## Performance Improvements

This tool has been optimized for performance in several ways:

1. **Direct key generation**: Uses tweetnacl for faster keypair generation
2. **Batch processing**: Processes addresses in batches of 250 for better throughput
3. **Efficient pattern matching**: Converts addresses to lowercase only once
4. **Less frequent progress updates**: Reports progress every 10,000 addresses instead of 1,000
5. **Optimized memory usage**: Pre-allocates buffers to reduce garbage collection overhead

## How It Works

The program generates random Solana keypairs and checks if the resulting public address contains any of your specified patterns. When a match is found, it prints both the public address and private key, and saves them to a timestamped text file.

The search is performed in parallel across all available CPU cores to maximize performance.

## Security Warning

**IMPORTANT**: Addresses generated with this tool should be considered compromised from a security perspective. The private keys are displayed in plain text and should only be used for educational or specific testing purposes. Never transfer significant funds to these addresses.

## License

MIT
