import { createContext, useEffect, useState } from "react";

import Header from "./components/Header";

export const Data = createContext(null);
export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/feedback-data.json")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  return (
    <Data.Provider value={{ data, setData }}>
      <Header />
    </Data.Provider>
  );
}