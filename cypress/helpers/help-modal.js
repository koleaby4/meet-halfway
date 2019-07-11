export const assertModalContent = () => {
  cy.get(".swal2-container").within(modal => {
    cy.get("h2").contains("User Guide");
    cy.get(".help-heading").contains("Situation");
    cy.get(".help-heading").contains("Complication");
    cy.get(".help-heading").contains("Resolution");
  });
};

export const closeHelpModal = () => cy.contains("Cool").click().then(() =>
  cy.get(".swal2-container").should('not.exist')
)
