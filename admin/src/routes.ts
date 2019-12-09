import { createRouter, defineRoute } from "type-route";

export const { routes, listen, getCurrentRoute } = createRouter({
  root: defineRoute("/"),
  signIn: defineRoute("/sign-in"),
});
