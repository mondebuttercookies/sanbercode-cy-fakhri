class LoginPage {

  // ===== URL =====
  baseUrl = "https://opensource-demo.orangehrmlive.com";
  loginUrl = `${this.baseUrl}/web/index.php/auth/login`;
  dashboardUrl = `${this.baseUrl}/web/index.php/dashboard/index`;

  // ===== LOCATORS =====
  usernameInput = 'input[name="username"]';
  passwordInput = 'input[name="password"]';
  loginButton = 'button[type="submit"]';
  errorMessage = ".oxd-alert-content-text";

  // ===== ACTIONS =====
  visitLoginPage() {
    cy.visit(this.loginUrl);
  }

  inputUsername(username) {
    cy.get(this.usernameInput).clear().type(username);
  }

  inputPassword(password) {
    cy.get(this.passwordInput).clear().type(password);
  }

  clickLogin() {
    cy.get(this.loginButton).click();
  }

  login(username, password) {
    this.inputUsername(username);
    this.inputPassword(password);
    this.clickLogin();
  }

  loginWithEnter(username, password) {
    this.inputUsername(username);
    cy.get(this.passwordInput).type(`${password}{enter}`);
  }

  pastePassword(password) {
    cy.get(this.passwordInput)
      .invoke("val", password)
      .trigger("input");
  }

  refreshPage() {
    cy.reload();
  }

  // ===== ASSERTIONS =====
  verifyDashboard() {
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  }

  verifyExactDashboardRedirect() {
    cy.url({ timeout: 10000 }).should("eq", this.dashboardUrl);
  }

  verifyInvalidCredential() {
    cy.contains("Invalid credentials").should("be.visible");
  }

  verifyRequiredField() {
    cy.contains("Required").should("be.visible");
  }

  verifyErrorNotExist() {
    cy.contains("Invalid credentials").should("not.exist");
  }
}

export default new LoginPage();
