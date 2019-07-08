import { assertModalContent } from "../helpers/help-modal";
import { setMobileViewport } from "../helpers/common";
import { clickHelpLink } from "../helpers/navbar";

describe('Help modal', () => {
    beforeEach(() => {
        cy.visit('')
    })

    it('is shown automatically when page is opened', () => {
        assertModalContent()

        cy.contains('Cool').click()
        setMobileViewport()

        clickHelpLink(true)
        assertModalContent()
    })
})
