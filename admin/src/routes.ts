import { createRouter, defineRoute } from "type-route";

export const { routes, listen, getCurrentRoute } = createRouter({
  root: defineRoute("/"),
  signIn: defineRoute(
    {
      callbackRoute: "query.param.string.optional",
    },
    () => "/sign-in"
  ),
});

export const isWellKnownRouteName = (
  name: string
): name is keyof typeof routes => name in routes;
