class DirectoryPage {

  // ===== URL =====
  baseUrl = "https://opensource-demo.orangehrmlive.com";
  directoryUrl = `${this.baseUrl}/web/index.php/directory/viewDirectory`;

  // ===== LOCATORS =====
  searchInput = 'input[placeholder="Type for hints..."]';
  searchButton = 'button[type="submit"]';
  resetButton = 'button[type="button"]';

  // ===== ACTIONS =====
  visitDirectory() {
    cy.visit(this.directoryUrl);
  }

  searchEmployee(name) {
    cy.get(this.searchInput).clear().type(name);
  }

  searchWithEnter(name) {
    cy.get(this.searchInput).clear().type(`${name}{enter}`);
  }

  clickSearch() {
    cy.contains("button", "Search").click();
  }

  clearSearch() {
    cy.get(this.searchInput).clear();
  }

  refreshPage() {
    cy.reload();
  }

  // ===== ASSERTIONS =====
  visitDirectoryDirect() {
    cy.visit("/web/index.php/directory/viewDirectory");
  }

  verifyDirectoryLoaded() {
    cy.contains("Directory").should("be.visible");
    cy.url().should("include", "/directory");
  }

  verifyEmployeeExist(name) {
    cy.contains(name).should("exist");
  }

  verifyRedirectToLogin() {
    cy.url().should("include", "/auth/login");
  }
}

export default new DirectoryPage();