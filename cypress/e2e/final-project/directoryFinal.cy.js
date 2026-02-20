import LoginPage from "../../pages/LoginPage";
import DirectoryPage from "../../pages/DirectoryPage";
import DashboardPage from "../../pages/DashboardPage";

describe("OrangeHRM Directory Feature - TC_DIRECTORY", () => {

  let data;

  before(() => {
    cy.fixture("loginData").then(d => data = d);
  });

  beforeEach(() => {

    cy.intercept("POST","**/auth/validate").as("loginAPI");

    // ===== LOGIN =====
    LoginPage.visitLoginPage();

    LoginPage.login(
      data.validUser.username,
      data.validUser.password
    );

    cy.wait("@loginAPI");
    
    LoginPage.verifyDashboard();
  });

  it("TC_DIRECTORY_001 - Open directory page", () => {

    cy.intercept("GET","**/directory/**")
      .as("directoryAPI");

    DashboardPage.openDirectoryMenu();

    cy.wait("@directoryAPI");

    DirectoryPage.verifyDirectoryLoaded();
  });

  it("TC_DIRECTORY_002 - Search valid employee", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.searchEmployee("Linda");
    DirectoryPage.clickSearch();

    DirectoryPage.verifyEmployeeExist("Linda");
  });

  it("TC_DIRECTORY_003 - Search without input", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.clickSearch();
    DirectoryPage.verifyDirectoryLoaded();
  });

  it("TC_DIRECTORY_004 - Unauthorized access", () => {
    cy.clearCookies();

    DirectoryPage.visitDirectoryDirect();
    DirectoryPage.verifyRedirectToLogin();
  });

  it("TC_DIRECTORY_005 - Refresh session", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.refreshPage();
    DirectoryPage.verifyDirectoryLoaded();
  });

  it("TC_DIRECTORY_006 - Partial search", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.searchEmployee("Lin");
    DirectoryPage.clickSearch();

    DirectoryPage.verifyEmployeeExist("Linda");
  });

  it("TC_DIRECTORY_007 - Clear search input", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.searchEmployee("Linda");
    DirectoryPage.clearSearch();
  });

  it("TC_DIRECTORY_008 - Search using ENTER", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.searchWithEnter("Linda");
    DirectoryPage.verifyEmployeeExist("Linda");
  });

  it("TC_DIRECTORY_009 - Reload after search", () => {
    DashboardPage.openDirectoryMenu();

    DirectoryPage.searchEmployee("Linda");
    DirectoryPage.refreshPage();

    DirectoryPage.verifyDirectoryLoaded();
  });

  it("TC_DIRECTORY_010 - Verify directory API response", () => {

    cy.intercept("GET","**/directory/**")
      .as("directoryAPI");

    DashboardPage.openDirectoryMenu();

    cy.wait("@directoryAPI")
      .its("response.statusCode")
      .should("be.oneOf",[200,304]);
  });

});