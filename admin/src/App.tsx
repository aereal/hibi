import React, { FC, useState, useEffect } from "react";
import { Route } from "type-route";
import { routes, getCurrentRoute, listen } from "./routes";
import { RootPage } from "./pages/RootPage";

const Routing: FC<{ route: Route<typeof routes> }> = ({ route }) => {
  switch (route.name) {
    case routes.root.name:
      return <RootPage />;
    default:
      return <>Not Found</>;
  }
};

const App: FC = () => {
  const [route, setRoute] = useState(getCurrentRoute());
  useEffect(() => listen(setRoute), []);

  return <Routing route={route} />;
};

export default App;
