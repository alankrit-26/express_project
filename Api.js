const axios = require('axios');

const BASE_URL = "http://35.200.185.69:8000";
const VERSIONS = ["v1", "v2", "v3"];
const RATE_LIMIT_DELAY = 300; // Adjust delay to avoid rate limits
const MAX_RETRIES = 3;

// Function to fetch autocomplete results
async function fetchNames(query, version, retries = 0) {
    const url = `${BASE_URL}/${version}/autocomplete?query=${query}`;
    try {
        const response = await axios.get(url);
        return response.data; // Assuming JSON response contains an array of names
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.log(`Rate limited on ${query}. Retrying after delay...`);
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY * (retries + 1)));
            if (retries < MAX_RETRIES) return fetchNames(query, version, retries + 1);
        } else {
            console.log(`Failed for ${query} (${error.message})`);
        }
        return [];
    }
}

// Function to extract all possible names
async function extractAllNames(version) {
    let foundNames = new Set();
    let queryQueue = [...'abcdefghijklmnopqrstuvwxyz']; // Start with single letters

    while (queryQueue.length > 0) {
        let query = queryQueue.shift();
        let results = await fetchNames(query, version);

        results.forEach(name => {
            if (!foundNames.has(name)) {
                foundNames.add(name);
                if (name.length > query.length) {
                    queryQueue.push(name.substring(0, query.length + 1));
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY)); // Delay between requests
    }

    console.log(`Total names found in ${version}: ${foundNames.size}`);
    return foundNames;
}

// Main function to run for all versions
async function main() {
    for (let version of VERSIONS) {
        console.log(`Extracting names from ${version}...`);
        await extractAllNames(version);
    }
}

main();
