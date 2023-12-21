describe("Filter leden", () => {
  beforeEach(() => {
    cy.login("viktorhuygebaert04@gmail.com", "12345678");
  });

  it("should show all leden", () => {
    cy.visit("http://localhost:5173/leden");
    cy.get("[data-cy=lid]").should("have.length", 2);
  });

  it("Should show 1 lid when inschrijven on '3e activiteit'", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=inschrijven_activiteit]").eq(0).click();
    cy.get("[data-cy=inschrijven_Oskar]").click();
    cy.get("[data-cy=bevestig_inschrijven]").click();

    cy.visit("http://localhost:5173/leden");
    cy.get("[data-cy=filter_input]").select("3e Activiteit");
    cy.get("[data-cy=lid]").should("have.length", 1);
  });

  it("Should show 1 lid when filtering on '3e Activiteit'", () => {
    cy.visit("http://localhost:5173/leden");
    cy.get("[data-cy=filter_input]").select("3e Activiteit");
    cy.get("[data-cy=lid]").should("have.length", 1);
  });

  it("Should show 'Geen inschrijvingen' when deleting inschrijving", () => {
    cy.visit("http://localhost:5173/leden");
    cy.get("[data-cy=filter_input]").select("3e Activiteit");
    cy.get("[data-cy=verwijder_inschrijving]").click();
    cy.get("[data-cy=bevestig_verwijderen]").click();
    cy.get("[data-cy=inschrijving]").should("have.text", "Geen inschrijvingen");
  });
});
