import {
  listen,
  routes,
  redirectToPreviousPage,
  getCurrentRoute,
  router,
} from "./routes";
import { Route } from "type-route";

describe("routes", () => {
  describe("redirectToPreviousPage", () => {
    beforeEach(() => {
      router.history.configure({ type: "memory" });
    });

    it("redirects to root page if no parameters given", async () => {
      const histories: Array<Route<typeof routes>> = [getCurrentRoute()];

      const remove = listen(route => {
        histories.push(route);
      });

      const { signIn } = routes;
      await signIn.push();
      await redirectToPreviousPage();

      expect(histories).toStrictEqual([
        { action: "initial", name: "root", params: {} },
        { action: "push", name: "signIn", params: {} },
        { action: "push", name: "root", params: {} },
      ]);

      remove();
    });

    it("redirects to specified page", async () => {
      const histories: Array<Route<typeof routes>> = [getCurrentRoute()];

      const remove = listen(route => {
        histories.push(route);
      });

      const { signIn } = routes;
      await signIn.push({ callbackRoute: "newArticle" });
      await redirectToPreviousPage();

      expect(histories).toStrictEqual([
        { action: "initial", name: "root", params: {} },
        {
          action: "push",
          name: "signIn",
          params: { callbackRoute: "newArticle" },
        },
        { action: "push", name: "newArticle", params: {} },
      ]);

      remove();
    });

    it("redirects to specified page with given parameters", async () => {
      const histories: Array<Route<typeof routes>> = [getCurrentRoute()];

      const remove = listen(route => {
        histories.push(route);
      });

      const { signIn } = routes;
      await signIn.push({
        callbackRoute: "signIn",
        callbackParamsJSON: JSON.stringify({ callbackRoute: "diarySettings" }),
      });
      await redirectToPreviousPage();

      expect(histories).toStrictEqual([
        { action: "initial", name: "root", params: {} },
        {
          action: "push",
          name: "signIn",
          params: {
            callbackRoute: "signIn",
            callbackParamsJSON: JSON.stringify({
              callbackRoute: "diarySettings",
            }),
          },
        },
        {
          action: "push",
          name: "signIn",
          params: { callbackRoute: "diarySettings" },
        },
      ]);

      remove();
    });

    it("redirects to specified page with no parameters if callbackParamsJSON is broken JSON", async () => {
      const histories: Array<Route<typeof routes>> = [getCurrentRoute()];

      const remove = listen(route => {
        histories.push(route);
      });

      const { signIn } = routes;
      await signIn.push({
        callbackRoute: "signIn",
        callbackParamsJSON: "{",
      });
      await redirectToPreviousPage();

      expect(histories).toStrictEqual([
        { action: "initial", name: "root", params: {} },
        {
          action: "push",
          name: "signIn",
          params: {
            callbackRoute: "signIn",
            callbackParamsJSON: "{",
          },
        },
        {
          action: "push",
          name: "signIn",
          params: {},
        },
      ]);

      remove();
    });
  });
});
