describe("open website", () => {
  it("opens the website", () => {
    cy.visit("http://localhost:5173");
  });

  it("should login and logout", () => {
    cy.login("viktorhuygebaert04@gmail.com", "12345678");
    cy.logout();
  });
});
