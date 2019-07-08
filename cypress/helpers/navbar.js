export const clickHelpLink = (mobile = false) => {
    if (mobile) {
        cy.get('.navbar-toggler[type=button]').click()
    }
    cy.get('a.nav-link').contains('Help?').click()

}