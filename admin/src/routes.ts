import { createRouter, defineRoute, Route } from "type-route";

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
  editArticle: defineRoute(
    { articleID: "path.param.string" },
    p => `/articles/${p.articleID}`
  ),
  diarySettings: defineRoute("/settings"),
  listArticles: defineRoute("/articles"),
  listDrafts: defineRoute("/drafts"),
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

  if (nextRoute.name === "editArticle") {
    if (nextRouteParams !== undefined && isEditArticleParams(nextRouteParams)) {
      await nextRoute.push(nextRouteParams);
      return;
    } else {
      throw new Error("required parameters not given");
    }
  }

  await nextRoute.push(nextRouteParams);
};

type EditArticleParams = Route<typeof routes.editArticle>["params"];

const isEditArticleParams = (params: {
  [key: string]: any;
}): params is EditArticleParams => "articleID" in params;
