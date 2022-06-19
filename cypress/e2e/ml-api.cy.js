describe('ml spec', () => {
  beforeEach(() => {
    cy.visit('https://mercadolibre.com.ar')
    
  })
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  
  it('.search() - search an item name on nav search bar', () => {
    cy.get('.nav-search-input').type('Macbook Pro', {release:true}).should('have.value', 'Macbook Pro')
    cy.wait(3000)
    cy.get('.nav-search-btn').click({ force: true })
    cy.wait(1000)
    cy.get('.ui-search-layout__item').should('have.length.at.least', 1).first().click()
    cy.wait(1000)
    cy.get('.andes-button--quiet').contains("Agregar al carrito").click()
  })
})
