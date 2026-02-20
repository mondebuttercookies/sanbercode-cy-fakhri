import ForgotPasswordPage from "../../pages/ForgotPasswordPage";

describe("OrangeHRM Forgot Password Feature - TC_FORGOT", () => {

  beforeEach(() => {
    ForgotPasswordPage.visitResetPage();
  });

  it("TC_FORGOT_001 - Valid reset request", () => {

    cy.intercept("POST","**/auth/requestPasswordResetCode")
      .as("resetAPI");

    ForgotPasswordPage.inputUsername("Admin");
    ForgotPasswordPage.submitReset();

    cy.wait("@resetAPI")
      .its("response.statusCode")
      .should("be.oneOf",[200,304]);

    ForgotPasswordPage.verifyResetSuccess();
  });

  it("TC_FORGOT_002 - Empty username validation", () => {
    ForgotPasswordPage.submitReset();
    ForgotPasswordPage.verifyRequiredField();
  });

  it("TC_FORGOT_003 - Invalid username handled", () => {
    ForgotPasswordPage.inputUsername("UserTidakAda");
    ForgotPasswordPage.submitReset();
    ForgotPasswordPage.verifyResetSuccess();
  });

  it("TC_FORGOT_004 - Cancel redirect to login", () => {
    ForgotPasswordPage.visit();

    ForgotPasswordPage.clickCancel();

    ForgotPasswordPage.verifyRedirectToLogin();
});

  it("TC_FORGOT_005 - Refresh page stay same", () => {
    ForgotPasswordPage.refreshPage();
    ForgotPasswordPage.verifyStayOnResetPage();
  });

  it("TC_FORGOT_006 - Input field accepts text", () => {
    ForgotPasswordPage.inputUsername("Admin");
    cy.get(ForgotPasswordPage.usernameInput)
      .should("have.value","Admin");
  });

  it("TC_FORGOT_007 - Username with spaces", () => {
    ForgotPasswordPage.inputUsername(" Admin ");
    ForgotPasswordPage.submitReset();
    ForgotPasswordPage.verifyResetSuccess();
  });

  it("TC_FORGOT_008 - Submit using ENTER", () => {
    ForgotPasswordPage.submitWithEnter("Admin");
    ForgotPasswordPage.verifyResetSuccess();
  });

  it("TC_FORGOT_009 - Clear username field", () => {
    ForgotPasswordPage.inputUsername("Admin");
    cy.get(ForgotPasswordPage.usernameInput)
      .clear()
      .should("have.value","");
  });

  it("TC_FORGOT_010 - Verify API request body", () => {

    cy.intercept("POST","**/auth/requestPasswordResetCode")
      .as("resetAPI");

    ForgotPasswordPage.inputUsername("Admin");
    ForgotPasswordPage.submitReset();

    cy.wait("@resetAPI")
      .its("request.body")
      .should("exist");
  });

});