describe("Leidinglijst", () => {
  it("should show leiding", () => {
    cy.intercept("GET", "http://localhost:9000/api/leiding", {
      fixture: "../fixtures/leiding.json",
    });

    cy.visit("http://localhost:5173/leiding");
    cy.get("[data-cy=leiding]").should("have.length", 2);
    cy.get("[data-cy=leiding_naam]").eq(0).contains("Viktor");
  });
});
