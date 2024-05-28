import { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";

interface Pokemon {
  name: string;
  image: string;
  type: string;
}
const cacheTime = 3600 * 1000; // 1 hour in milliseconds

const fetchPokemon = async (): Promise<Pokemon[]> => {
  const cachedData = JSON.parse(localStorage.getItem("pokemonData") || "null");
  const cachedTime = localStorage.getItem("pokemonCacheTime");

  if (
    cachedData &&
    cachedTime &&
    new Date().getTime() - parseInt(cachedTime) < cacheTime
  ) {
    console.log("cache", cachedData);
    return cachedData;
  } else {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=151"
    );
    console.log("response ho mero", response);
    const pokemonData = await Promise.all(
      response.data.results.map(
        async (pokemon: { name: string; url: string }) => {
          const details = await axios.get(pokemon.url);
          return {
            name: pokemon.name,
            image: details.data.sprites.front_default,
            type: details.data.types
              .map((t: { type: { name: string } }) => t.type.name)
              .join(", "),
          };
        }
      )
    );
    localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
    localStorage.setItem("pokemonCacheTime", new Date().getTime().toString());
    console.log(pokemonData, "pokemanData");
    return pokemonData;
  }
};

const Page = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchPokemon().then((data) => setPokemon(data));
  }, []);

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("pokemon", pokemon);
  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="pokemon-list">
        {filteredPokemon.map((p) => (
          <PokemonCard
            key={p.name}
            name={p.name}
            image={p.image}
            type={p.type}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
