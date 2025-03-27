describe('Task Display', () => {
    beforeEach(() => cy.visit(''));

    it('should set incomplete task background color based on odd or even position in list', () => {
        cy.get('mat-card').should('have.length', 3);
        cy.get('mat-card').contains('Complete take home assignment').parent().
        should('have.css', 'background-color', 'rgb(184, 182, 182)');
        cy.get('mat-card').contains('Use Cypress for Visual Testing').parent().
        should('have.css', 'background-color', 'rgb(245, 245, 245)');
        cy.get('mat-chip-option').eq(1).click();
        cy.get('mat-card').should('have.length', 2);
        cy.get('mat-card').contains('Complete take home assignment').parent().
        should('have.css', 'background-color', 'rgb(245, 245, 245)');
        cy.get('mat-card').contains('Use Cypress for Visual Testing').parent().
        should('have.css', 'background-color', 'rgb(184, 182, 182)');
    })

    it(`should scale 'Done' and 'Delete' buttons and darken color when mouse hovers over`, () => {
        const buttonNames = ['.complete-button', '.delete-button'];
        
        cy.get(buttonNames[0]).should('have.css', 'background-color', 'rgb(44, 118, 234)');
        cy.get(buttonNames[1]).should('have.css', 'background-color', 'rgb(234, 44, 44)');

        cy.get(buttonNames[0]).realHover().should('have.css', 'background-color', 'rgb(42, 111, 222)');
        cy.get(buttonNames[1]).realHover().should('have.css', 'background-color', 'rgb(222, 42, 42)');

        buttonNames.forEach(button => {
            cy.get(button).realHover().invoke('height').should('be.gt', 40);
        })
    })

});