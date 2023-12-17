describe("Toevoegen activiteit", () => {
  it("Adds activiteit", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();

    cy.get("[data-cy=activiteit_input]").type("Test activiteit");
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=datum_input]").type("2024-05-05");
    cy.get("[data-cy=beschrijving_input]").type("Test beschrijving");
    cy.get("[data-cy=prijs_input").type("2");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();

    cy.get("[data-cy=activiteit]").eq(4).contains("Test activiteit");
    cy.get("[data-cy=activiteit]").should("have.length", 5);
  });

  it("Should remove activiteit", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=verwijder_activiteit]").eq(4).click();
    cy.get("[data-cy=bevestig_verwijderen]").eq(4).click();
    cy.get("[data-cy=activiteit]").should("have.length", 4);
  });

  it("Should show error message when activiteitnaam is not filled in", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=datum_input]").type("2024-05-05");
    cy.get("[data-cy=beschrijving_input]").type("Test beschrijving");
    cy.get("[data-cy=prijs_input").type("2");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();
    cy.get("[data-cy=activiteitNaam_error]").should(
      "have.text",
      "Activiteitnaam is verplicht!"
    );
  });

  it("Should show error message when datum is not filled in", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();
    cy.get("[data-cy=activiteit_input]").type("Test activiteit");
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=beschrijving_input]").type("Test beschrijving");
    cy.get("[data-cy=prijs_input").type("2");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();
    cy.get("[data-cy=datumString_error]").should(
      "have.text",
      "Datum is verplicht!"
    );
  });

  it("Should show error message when datum is earlier than today", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();
    cy.get("[data-cy=activiteit_input]").type("Test activiteit");
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=datum_input]").type("2023-12-16");
    cy.get("[data-cy=beschrijving_input]").type("Test beschrijving");
    cy.get("[data-cy=prijs_input").type("2");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();
    cy.get("[data-cy=datumString_error]").should(
      "have.text",
      "De datum moet later dan vandaag zijn!"
    );
  });

  it("Should show error message when beschrijving is not filled in", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();
    cy.get("[data-cy=activiteit_input]").type("Test activiteit");
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=datum_input]").type("2024-01-01");
    cy.get("[data-cy=prijs_input").type("2");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();
    cy.get("[data-cy=beschrijving_error]").should(
      "have.text",
      "Beschrijving is verplicht!"
    );
  });

  it("Should show error message when price is not filled in", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();
    cy.get("[data-cy=activiteit_input]").type("Test activiteit");
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=datum_input]").type("2024-12-16");
    cy.get("[data-cy=beschrijving_input]").type("Test beschrijving");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();
    cy.get("[data-cy=prijsString_error]").should("exist");
  });

  it("Should show error message when price is less than 0", () => {
    cy.visit("http://localhost:5173/activiteiten");
    cy.get("[data-cy=maak_activiteit]").click();
    cy.get("[data-cy=activiteit_input]").type("Test activiteit");
    cy.get("[data-cy=leiding_input]").select("Viktor");
    cy.get("[data-cy=datum_input]").type("2024-12-16");
    cy.get("[data-cy=beschrijving_input]").type("Test beschrijving");
    cy.get("[data-cy=prijs_input").type("-2");
    cy.get("[data-cy=moetInschrijven_ja]").click();
    cy.get("[data-cy=submit_activiteit]").click();
    cy.get("[data-cy=prijsString_error]").should(
      "have.text",
      "De prijs moet tussen 0 en 50 euro liggen !"
    );
  });
});
