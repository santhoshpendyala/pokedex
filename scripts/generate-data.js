
const fs = require('fs');
const path = require('path');

async function generateData() {
  const count = 2000;
  const pokemonList = [];
  const types = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'];

  // Fetch names for realism if possible, otherwise generate
  let realNames = [];
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
    const data = await response.json();
    realNames = data.results.map(p => p.name);
  } catch (e) {
    console.error('Failed to fetch real names, using generated ones');
  }

  for (let i = 1; i <= count; i++) {
    const id = i;
    // Use real name if available, else generate
    let name = realNames[i - 1] || `Pokemon ${i}`;
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Random stats
    const hp = Math.floor(Math.random() * 200) + 30; // 30 - 230 HP
    const type1 = types[Math.floor(Math.random() * types.length)];
    const type2 = Math.random() > 0.7 ? types[Math.floor(Math.random() * types.length)] : null;
    
    // Image URL - using the official artwork pattern
    // For IDs > 1025, we might not have real images, so we loop back or use a placeholder
    const imageId = i <= 1025 ? i : (i % 1025) + 1;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${imageId}.png`;

    pokemonList.push({
      id,
      name,
      hp,
      types: type2 ? [type1, type2] : [type1],
      image: imageUrl
    });
  }

  const outputPath = path.join(__dirname, '../public/pokemon.json');
  fs.writeFileSync(outputPath, JSON.stringify(pokemonList, null, 2));
  console.log(`Generated ${count} pokemon in ${outputPath}`);
}

generateData();
