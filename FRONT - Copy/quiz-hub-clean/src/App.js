import React, { useState, useEffect } from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Spinner from "./components/Spinner";
import { checkAndCleanToken } from "./services/authService";
import { mainRoutes } from "./routes/mainRoutes";
import { secondaryRoutes } from "./routes/secondaryRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {mainRoutes}
      {secondaryRoutes}
    </>
  )
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preload = async () => {
      await import("./pages/HomePage");
      checkAndCleanToken();
      setIsLoading(false);
    };
    preload();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <React.Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default App;
