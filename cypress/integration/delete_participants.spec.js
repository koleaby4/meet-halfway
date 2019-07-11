import { assertModalContent, closeHelpModal } from "../helpers/help-modal";
import { setMobileViewport, clickGetStartedButton, typeName, typeAddress, deleteParticipant, confirmParticipant, assertAddParticipantButtonVisible, assertParticipantPinExists } from "../helpers/common";
import { clickHelpLink } from "../helpers/navbar";

it("When participant is deleted - its pin is removed", () => {
  cy.visit("index.html");
  closeHelpModal()

  clickGetStartedButton()

  typeName('Alina Poltava')
  typeAddress('Moscow, Russia')

  confirmParticipant()
  assertParticipantPinExists('Alina Poltava', true)

  deleteParticipant()
  assertParticipantPinExists('Alina Poltava', false)
});