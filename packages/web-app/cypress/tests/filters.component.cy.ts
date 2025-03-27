describe('Filters Display', () => {
    beforeEach(() => cy.visit(''));

    it('should change from #2c76ea to #cd31a2 when filter button is clicked', () => {
        cy.get('mat-chip-option:first').should('have.css', 'background-color', 'rgb(44, 118, 234)');
        cy.get('mat-chip-option:first').click();
        cy.get('mat-chip-option:first').should('have.css', 'background-color', 'rgb(205, 49, 162)');
    })

});