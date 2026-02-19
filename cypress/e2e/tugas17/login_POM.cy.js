import LoginPage from "../../pages/LoginPage";

describe("OrangeHRM Login Feature - TC_Login (POM)", () => {

  let data;

  before(() => {
    cy.fixture("loginData").then((loginData) => {
      data = loginData;
    });
  });

  beforeEach(() => {
    LoginPage.visitLoginPage();
  });

  // TC_LOGIN_001
  it("TC_LOGIN_001 - Login valid", () => {
    LoginPage.login(
      data.validUser.username,
      data.validUser.password
    );

    LoginPage.verifyDashboard();
  });

  // TC_LOGIN_002
  it("TC_LOGIN_002 - Username tidak valid", () => {
    LoginPage.login(
      data.invalidUsername.username,
      data.invalidUsername.password
    );

    LoginPage.verifyInvalidCredential();
  });

  // TC_LOGIN_003
  it("TC_LOGIN_003 - Password tidak valid", () => {
    LoginPage.login(
      data.invalidPassword.username,
      data.invalidPassword.password
    );

    LoginPage.verifyInvalidCredential();
  });

  // TC_LOGIN_004
  it("TC_LOGIN_004 - Tanpa username", () => {
    LoginPage.inputPassword(data.validUser.password);
    LoginPage.clickLogin();

    LoginPage.verifyRequiredField();
  });

  // TC_LOGIN_005
  it("TC_LOGIN_005 - Tanpa password", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.clickLogin();

    LoginPage.verifyRequiredField();
  });

  // TC_LOGIN_006
  it("TC_LOGIN_006 - Tanpa input data", () => {
    LoginPage.clickLogin();

    LoginPage.verifyRequiredField();
  });

  // TC_LOGIN_007
  it("TC_LOGIN_007 - Username dengan spasi", () => {
    LoginPage.login(
      data.usernameWithSpace.username,
      data.usernameWithSpace.password
    );

    LoginPage.verifyInvalidCredential();
  });

  // TC_LOGIN_008
  it("TC_LOGIN_008 - Login menggunakan ENTER", () => {
    LoginPage.loginWithEnter(
      data.validUser.username,
      data.validUser.password
    );

    LoginPage.verifyDashboard();
  });

  // TC_LOGIN_009
  it("TC_LOGIN_009 - Refresh setelah gagal login", () => {
    LoginPage.login(
      data.validUser.username,
      data.invalidPassword.password
    );

    LoginPage.verifyInvalidCredential();

    LoginPage.refreshPage();

    LoginPage.verifyErrorNotExist();
  });

  // TC_LOGIN_010
  it("TC_LOGIN_010 - Login dengan paste password", () => {
    LoginPage.inputUsername(data.validUser.username);
    LoginPage.pastePassword(data.validUser.password);
    LoginPage.clickLogin();

    LoginPage.verifyDashboard();
  });

  // TC_LOGIN_011
  it("TC_LOGIN_011 - Verify redirect dashboard", () => {
    cy.url().should("eq", LoginPage.loginUrl);

    LoginPage.login(
      data.validUser.username,
      data.validUser.password
    );

    LoginPage.verifyExactDashboardRedirect();
    LoginPage.verifyDashboard();
  });

});
