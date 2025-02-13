import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/feedback-data.json")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  return (
    <>
    </>
  );
}