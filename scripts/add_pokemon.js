
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../public/pokemon.json');

async function fetchPokemonData(id) {
  try {
    // Fetch core data
    const coreRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!coreRes.ok) throw new Error(`Failed to fetch pokemon ${id}`);
    const coreData = await coreRes.json();

    // Fetch species data for description
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!speciesRes.ok) throw new Error(`Failed to fetch species ${id}`);
    const speciesData = await speciesRes.json();

    // Process data
    const name = coreData.name.charAt(0).toUpperCase() + coreData.name.slice(1);
    const types = coreData.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
    const hp = coreData.stats.find(s => s.stat.name === 'hp').base_stat;
    
    // Get English flavor text
    const flavorEntry = speciesData.flavor_text_entries.find(f => f.language.name === 'en');
    const description = flavorEntry 
      ? flavorEntry.flavor_text.replace(/[\n\f]/g, ' ') 
      : "No description available.";

    return {
      id,
      name,
      type: types,
      hp,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      description
    };
  } catch (error) {
    console.error(`Error fetching ${id}:`, error.message);
    return null;
  }
}

async function main() {
  // Read existing data
  let existingData = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  }

  const currentCount = existingData.length;
  // The user asked for 100 *more*. The last ID is likely 41.
  // We want to fetch from 42 to 141.
  // Or just check the max ID and fetch the next 100.
  
  const maxId = existingData.reduce((max, p) => Math.max(max, p.id), 0);
  const startId = maxId + 1;
  const endId = startId + 99; // 100 items

  console.log(`Fetching Pokemon from ${startId} to ${endId}...`);

  const newPokemon = [];
  // Process in chunks to be nice to the API
  const CHUNK_SIZE = 5;
  
  for (let i = startId; i <= endId; i += CHUNK_SIZE) {
    const chunkPromises = [];
    for (let j = i; j < i + CHUNK_SIZE && j <= endId; j++) {
      chunkPromises.push(fetchPokemonData(j));
    }
    
    const results = await Promise.all(chunkPromises);
    results.forEach(p => {
      if (p) newPokemon.push(p);
    });
    
    console.log(`Processed up to ${Math.min(i + CHUNK_SIZE - 1, endId)}`);
    // Small delay
    await new Promise(r => setTimeout(r, 100));
  }

  // Merge and sort
  const finalData = [...existingData, ...newPokemon].sort((a, b) => a.id - b.id);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
  console.log(`Successfully updated ${OUTPUT_FILE}. Total count: ${finalData.length}`);
}

main();
