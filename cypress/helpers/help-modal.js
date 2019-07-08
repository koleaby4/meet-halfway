export const assertModalContent = () => {
    cy.get('.swal2-container').should('be.visible')

    cy.get('h2').contains('User Guide')
    cy.get('.help-heading').contains('Situation')
    cy.get('.help-heading').contains('Complication')
    cy.get('.help-heading').contains('Resolution').scrollIntoView()

    cy.get('.swal2-container img[alt="chart showing participants and their central location"]').scrollIntoView().should('be.visible')

    cy.contains('Step 2:').scrollIntoView()
    cy.get('.swal2-container img[alt="image showing form for adding names and addresses"]').scrollIntoView().should('be.visible')

    cy.contains('Step 3:').scrollIntoView()
    cy.get('.swal2-container img[alt="image showing form for adding names and addresses"]').scrollIntoView().should('be.visible')


    cy.contains('Step 4:').scrollIntoView()
    cy.get('.swal2-container img[alt="section of google maps zoomed to central pin"]').scrollIntoView().should('be.visible')
}