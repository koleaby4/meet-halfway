import { assertModalContent, closeHelpModal } from "../helpers/help-modal";
import { setMobileViewport, clickGetStartedButton, typeName, typeAddress, confirmParticipant, assertAddParticipantButtonVisible, assertParticipantPinExists } from "../helpers/common";
import { clickHelpLink } from "../helpers/navbar";

it("Add participants - happy path", () => {
  cy.visit("index.html");
  closeHelpModal()

  clickGetStartedButton()

  typeName('James Bond')
  typeAddress('Bond Street, London')

  confirmParticipant()
  assertAddParticipantButtonVisible(false)
  assertParticipantPinExists('James Bond', true)
});

it("Add participant button shown when all participants are deleted", () => {
  cy.visit("index.html");
  closeHelpModal()

  clickGetStartedButton()

  typeName('Lilia James')
  typeAddress('Paris')
  confirmParticipant()
  assertAddParticipantButtonVisible(false)
});
