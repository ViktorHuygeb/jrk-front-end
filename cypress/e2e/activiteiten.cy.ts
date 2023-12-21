describe("activiteitenList", () => {
  it("should show activiteiten", () => {
    cy.intercept("GET", "http://localhost:9000/api/activiteiten", {
      fixture: "../fixtures/activiteiten.json",
    });

    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=activiteit]").should("have.length", 1);
    cy.get("[data-cy=activiteit_naam]").eq(0).contains("Test activiteit");
  });

  it("should show a loading indicator for a very slow response", () => {
    cy.intercept("GET", "http://localhost:9000/api/activiteiten", (req) => {
      req.on("response", (res) => {
        res.setDelay(1000);
      });
    }).as("slowResponse");

    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=loading]").should("be.visible");
    cy.wait("@slowResponse");
    cy.get("[data-cy=loading]").should("not.exist");
  });
});
