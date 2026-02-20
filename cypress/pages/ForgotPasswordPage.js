class ForgotPasswordPage {

  // ===== URL =====
  baseUrl = "https://opensource-demo.orangehrmlive.com";
  resetUrl = `${this.baseUrl}/web/index.php/auth/requestPasswordResetCode`;
  loginUrl = `${this.baseUrl}/web/index.php/auth/login`;

  // ===== LOCATORS =====
  usernameInput = 'input[name="username"]';
  submitButton = 'button[type="submit"]';
  cancelButton = 'button[type="button"]';

  // ===== ACTIONS =====
  visitResetPage() {
    cy.visit(this.resetUrl);
  }

  inputUsername(username) {
    cy.get(this.usernameInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(username);
  }

  submitReset() {
    cy.get(this.submitButton).click();
  }

  submitWithEnter(username) {
    cy.get(this.usernameInput).clear().type(`${username}{enter}`);
  }

  clickCancel() {
  cy.get('button[type="button"]', { timeout: 10000 })
    .contains("Cancel")
    .click();
}

  refreshPage() {
    cy.reload();
  }

  resetPassword(username) {
    this.inputUsername(username);
    this.submitReset();
  }

  // ===== ASSERTIONS =====
  verifyResetSuccess() {
    cy.contains("Reset Password link sent successfully")
      .should("be.visible");
  }

  verifyRequiredField() {
    cy.contains("Required").should("be.visible");
  }

  verifyRedirectToLogin() {
    cy.url().should("eq", this.loginUrl);
  }

  verifyStayOnResetPage() {
    cy.url().should("eq", this.resetUrl);
  }
}

export default new ForgotPasswordPage();