import React from "react";

interface PokemonCardProps {
  name: string;
  image: string;
  type: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, image, type }) => {
  return (
    <div className="pokemon-card">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>Type: {type}</p>
    </div>
  );
};

export default PokemonCard;
