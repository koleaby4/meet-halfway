export const setMobileViewport = () =>
    cy.viewport('iphone-6')

export const clickGetStartedButton = () => {
    cy.get('[data-test=get-started-button]').should('be.visible').click()
    cy.wait(500)
    cy.get('[name=name]').should('be.visible')

}

export const typeName = name =>
    cy.get('[name=name]').first().type(name)

export const typeAddress = address =>
    cy.get('[name=address]').first().type(address)

export const confirmParticipant = (index = 0) => {
    cy.get('[class~=confirm-participant-button]').eq(index).click()
}

// default to index 1 - so that we delete last added participant
export const deleteParticipant = (index = 1) =>
    cy.get('[class~=delete-participant-button]').eq(index).click()

export const assertAddParticipantButtonVisible = (expectToBeVisible) => {
    cy.get('#addrow').should(expectToBeVisible ? 'be.visible' : 'not.be.visible')
}

export const assertParticipantPinExists = (name, expectToExist) =>
    cy.get(`div[title="${name}"]`).should(expectToExist ? 'exist' : 'not.exist')

