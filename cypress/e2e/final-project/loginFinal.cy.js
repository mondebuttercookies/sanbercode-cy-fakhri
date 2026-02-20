import LoginPage from "../../pages/LoginPage";

describe("OrangeHRM Login Feature - TC_LOGIN (POM)", () => {

  let data;

  before(() => {
    cy.fixture("loginData").then((loginData) => {
      data = loginData;
    });
  });

  beforeEach(() => {
    LoginPage.visitLoginPage();
  });

  // =============================
  // POSITIVE LOGIN
  // =============================

  it("TC_LOGIN_001 - Login valid", () => {

    cy.intercept("POST", "**/auth/validate").as("loginRequest");

    LoginPage.login(
      data.validUser.username,
      data.validUser.password
    );

    cy.wait("@loginRequest")
      .its("response.statusCode")
      .should("eq", 302);

    LoginPage.verifyDashboard();
  });

  // =============================
  // NEGATIVE SCENARIOS
  // =============================

  it("TC_LOGIN_002 - Username tidak valid", () => {
    LoginPage.login(
      data.invalidUsername.username,
      data.invalidUsername.password
    );
    LoginPage.verifyInvalidCredential();
  });

  it("TC_LOGIN_003 - Password tidak valid", () => {
    LoginPage.login(
      data.invalidPassword.username,
      data.invalidPassword.password
    );
    LoginPage.verifyInvalidCredential();
  });

  it("TC_LOGIN_004 - Tanpa username", () => {
    LoginPage.inputPassword(data.validUser.password);
    LoginPage.clickLogin();
    LoginPage.verifyRequiredField();
  });

  it("TC_LOGIN_005 - Tanpa password", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.clickLogin();
    LoginPage.verifyRequiredField();
  });

  it("TC_LOGIN_006 - Tanpa input data", () => {
    LoginPage.clickLogin();
    LoginPage.verifyRequiredField();
  });

  it("TC_LOGIN_007 - Username dengan spasi", () => {
    LoginPage.login(
      data.usernameWithSpace.username,
      data.usernameWithSpace.password
    );
    LoginPage.verifyInvalidCredential();
  });

  // =============================
  // INPUT BEHAVIOR
  // =============================

  it("TC_LOGIN_008 - Login menggunakan ENTER", () => {
    LoginPage.loginWithEnter(
      data.validUser.username,
      data.validUser.password
    );
    LoginPage.verifyDashboard();
  });

  it("TC_LOGIN_009 - Refresh setelah gagal login", () => {
    LoginPage.login(
      data.validUser.username,
      data.invalidPassword.password
    );

    LoginPage.verifyInvalidCredential();
    LoginPage.refreshPage();
    LoginPage.verifyErrorNotExist();
  });

  it("TC_LOGIN_010 - Login dengan paste password", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.pastePassword(data.validUser.password);
    LoginPage.clickLogin();

    LoginPage.verifyDashboard();
  });

  // =============================
  // REDIRECT & SESSION
  // =============================

  it("TC_LOGIN_011 - Verify redirect dashboard", () => {

    cy.url().should("eq", LoginPage.loginUrl);

    LoginPage.login(
      data.validUser.username,
      data.validUser.password
    );

    LoginPage.verifyExactDashboardRedirect();
    LoginPage.verifyDashboard();
  });

  it("TC_LOGIN_012 - Refresh setelah login tetap di dashboard", () => {

    LoginPage.login(
      data.validUser.username,
      data.validUser.password
    );

    cy.reload();
    LoginPage.verifyDashboard();
  });

  it("TC_LOGIN_013 - Akses dashboard tanpa login", () => {

    cy.visit(LoginPage.dashboardUrl);
    cy.url().should("include", "/auth/login");
  });

});
