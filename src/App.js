import React, { useEffect, useRef } from "react";

export default function App() {
  const elementRef = useRef();

  useEffect(_ => {
    let cleanup;
    // lazy load the module that loads the JSAPI
    // and initialize it
    import("./helpers/map").then(
      app => cleanup = app.initialize(elementRef.current)
    );
    return () => cleanup && cleanup();
  }, []);

  // assign elementRef to the ref of our component
  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }} ref={elementRef}></div>
  );
}



