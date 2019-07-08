import { assertModalContent, closeHelpModal } from "../helpers/help-modal";
import { setMobileViewport } from "../helpers/common";
import { clickHelpLink } from "../helpers/navbar";

describe("Help modal", () => {
  it("is shown automatically when page is opened", () => {
    cy.visit("");

    assertModalContent();

    closeHelpModal().then(() => {
      expect(localStorage.getItem("tutorialWatched")).to.eq("true");
    });

    setMobileViewport();
    clickHelpLink(true);

    assertModalContent();
  });
});
