import React, { FC, useState, useEffect } from "react";
import { Route } from "type-route";
import { routes, getCurrentRoute, listen } from "./routes";
import { RootPage } from "./pages/RootPage";
import { SignInPage } from "./pages/SignInPage";
import { DefaultAuthenticationProvider } from "./effects/authentication";

const Routing: FC<{ route: Route<typeof routes> }> = ({ route }) => {
  switch (route.name) {
    case routes.root.name:
      return <RootPage />;
    case routes.signIn.name:
      return <SignInPage />;
    default:
      return <>Not Found</>;
  }
};

const App: FC = () => {
  const [route, setRoute] = useState(getCurrentRoute());
  useEffect(() => listen(setRoute), []);

  return (
    <DefaultAuthenticationProvider>
      <Routing route={route} />
    </DefaultAuthenticationProvider>
  );
};

export default App;
