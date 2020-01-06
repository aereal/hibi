import { createRouter, defineRoute } from "type-route";

export const router = createRouter({
  root: defineRoute("/"),
  signIn: defineRoute(
    {
      callbackRoute: "query.param.string.optional",
      callbackParamsJSON: "query.param.string.optional",
    },
    () => "/sign-in"
  ),
  newArticle: defineRoute("/new"),
  diarySettings: defineRoute("/settings"),
});

export const { routes, listen, getCurrentRoute } = router;

export const isWellKnownRouteName = (
  name: string
): name is keyof typeof routes => name in routes;

export const redirectToPreviousPage = async (): Promise<void> => {
  const current = getCurrentRoute();
  if (current.name !== "signIn") {
    return;
  }
  const nextRouteName =
    current.params.callbackRoute !== undefined
      ? current.params.callbackRoute
      : routes.root.name;
  if (!isWellKnownRouteName(nextRouteName)) {
    return;
  }
  let nextRouteParams: { [key: string]: any } | undefined;
  if (current.params.callbackParamsJSON) {
    try {
      nextRouteParams = JSON.parse(current.params.callbackParamsJSON);
    } catch (_) {
      // no-op
    }
  }
  const nextRoute = routes[nextRouteName];
  await nextRoute.push(nextRouteParams);
};
