describe('Header Display', () => {
    beforeEach(() => cy.visit(''));

    it('should keep the logo visible on all pages', () => {
        cy.get('main').find('take-home-header').find('img').
        should('have.attr', 'src').should('include', 'ScriptionLogo');
        cy.get('[data-testid="add-task"]').click();
        cy.get('h1').contains('Add Task');
        cy.get('main').find('take-home-header').find('img').
        should('have.attr', 'src').should('include', 'ScriptionLogo');
    })

});