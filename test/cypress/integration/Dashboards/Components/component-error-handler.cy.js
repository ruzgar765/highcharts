describe('Component error handling', () => {
  before(() => {
    cy.visit('/dashboards/demos/component-error-handler', {});
  })

  it('Component that type does not exist, should throw error', () => {
    // component content
    cy.get('#dashboard-col-0 h1').should('have.class', 'highcharts-dashboards-component-title-error');
  });

  it('HTML Component that has no tagName param, should throw error', () => {
    // component content
    cy.get('#dashboard-col-1 h1').should('have.class', 'highcharts-dashboards-component-title-error');
  });

  it('Highcharts Component that has wrong configuration, should throw error', () => {
    // component content
    cy.get('#dashboard-col-2 h1').should('have.class', 'highcharts-dashboards-component-title-error');
  });
});
