import { createContext, useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";
import { getPage } from "./helper";

export const Data = createContext(null);
export const ScreenSize = createContext(null);
export const Route = createContext(null);
export default function App() {
  const [data, setData] = useState(null);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [route, setRoute] = useState(location.hash.substring(1) || "/");

  useEffect(() => {
    fetch("/data/feedback-data.json")
      .then((response) => response.json())
      .then((json) => setData(json));

    window.addEventListener("resize", () => setScreenSize(window.innerWidth));
    window.addEventListener("hashchange", () => setRoute(location.hash.substring(1) || "/"));
  }, []);

  return (
    <Route.Provider value={route}>
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
      <ScreenSize.Provider value={screenSize}>
        <Data.Provider value={{ data, setData }}>
          {data && getPage(route)}
        </Data.Provider>
      </ScreenSize.Provider>
    </Route.Provider>
  );
}
