import Header from "./Header";
import { useState } from "react";

export default function Suggestions() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return ( 
    <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
  );
}