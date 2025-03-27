describe('Add Display', () => {
    beforeEach(() => {
        const now = new Date("2025-3-1");

        cy.clock(now);
        cy.visit('add');
    })

    it(`should scale 'Add' and 'Cancel' buttons and darken color when mouse hovers over`, () => {
        const buttonNames = ['.add-button', '.cancel-button'];

        cy.get('.title-input').type('Valid Title');
        cy.get('.date-input').type('3/1/2025');
        
        cy.get(buttonNames[0]).should('have.css', 'background-color', 'rgb(44, 118, 234)');
        cy.get(buttonNames[1]).should('have.css', 'background-color', 'rgb(234, 44, 44)');

        cy.get(buttonNames[0]).realHover().should('have.css', 'background-color', 'rgb(42, 111, 222)');
        cy.get(buttonNames[1]).realHover().should('have.css', 'background-color', 'rgb(222, 42, 42)');

        buttonNames.forEach(button => {
            cy.get(button).realHover().invoke('height').should('be.gt', 40);
        })
    })

});