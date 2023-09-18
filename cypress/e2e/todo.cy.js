describe('Todo App', () => {
  beforeEach(() => {
    // Visit your application's URL before each test
    cy.visit('http://localhost:3000/v1/user'); // Change the URL to match your app's URL
  });

  it('should add a new todo', () => {
    cy.get('input[name="title"]').type('Play World of Warcraft');
    cy.get('input[name="description"]').type('Buy some medicines at the Store');
    cy.get('button[type="submit"]').click();
    cy.contains('Play World of Warcraft').should('exist');
  });

  it('should mark a todo item as completed', () => {
    // First, locate the "Mark" button for a specific item and click it.
    cy.get('.list-group-item')
      .contains('Play World of Warcraft')
      .parent()
      .find('.btn-success')
      .click();

    // After clicking the button, verify that the item is marked as completed.
    cy.get('.list-group-item').contains('Play World of Warcraft - Completed');
  });

  it('should unmark a todo item as completed', () => {
    // First, locate the "Unmark" button for a specific item and click it.
    cy.get('.list-group-item')
      .contains('Play World of Warcraft')
      .parent()
      .find('.btn-warning')
      .click();

    // After clicking the button, verify that the item is marked as pending.
    cy.get('.list-group-item').contains('Play World of Warcraft - Pending');
  });

  it('should edit a todo item', () => {
    // Locate item to edit
    cy.get('.list-group-item')
      .contains('Play World of Warcraft')
      .parent()
      .find('.btn-info')
      .click();

    cy.get('input[name="newTitle"]').clear().type('World of Warcraft');
    cy.get('input[name="newDescription"]')
      .clear()
      .type('Group up for the raid');
    cy.get('button[type="submit"]').click();
    cy.contains('World of Warcraft').should('exist');
    cy.contains('Group up for the raid').should('exist');
  });

  it('should delete a todo item', () => {
    // Locate specific item to delete
    cy.get('.list-group-item')
      .contains('World of Warcraft')
      .parent()
      .find('.btn-danger')
      .click();

    // After clicking the button verify that the item is deleted
    cy.get('.list-group-item')
      .contains('World of Warcraft')
      .should('not.exist');
  });
});
