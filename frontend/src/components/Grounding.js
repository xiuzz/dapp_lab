import { useState } from "react";
import { groundToMarket } from "../utils/nft";
export default function Grounding({owner}) {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;
    
    groundToMarket(owner, description, price);
    
    setDescription("");
    setPrice("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Choose your tokenId you want to ground in this market😍</h3>
      <input
        type="text"
        placeholder="price"
        value={price}
        onChange={(e) => {
          setDescription(e.target.value);
        }} />

      <input
        type="text"
        placeholder="tokenId.."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }} />
      <button>Add</button>
    </form>
  );
}
