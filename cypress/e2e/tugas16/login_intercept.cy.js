describe("OrangeHRM Login Feature - TC_Login (With Intercept)", () => {

  const BASE_URL = "https://opensource-demo.orangehrmlive.com";
  const LOGIN_URL = `${BASE_URL}/web/index.php/auth/login`;
  const DASHBOARD_URL = `${BASE_URL}/web/index.php/dashboard/index`;

  beforeEach(() => {
    cy.visit(LOGIN_URL);
  });

  // TC_LOGIN_001 - Valid Login
  it("TC_LOGIN_001 - Login valid", () => {

    cy.intercept("POST", "**/auth/validate").as("loginSuccess");

    cy.login("Admin", "admin123");

    cy.wait("@loginSuccess")
      .its("response.statusCode")
      .should("eq", 302);

    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  });

  // TC_LOGIN_002 - Invalid Username
  it("TC_LOGIN_002 - Username tidak valid", () => {

    cy.intercept("POST", "**/auth/validate").as("invalidUsername");

    cy.login("AdminSalah", "admin123");

    cy.wait("@invalidUsername")
      .its("response.statusCode")
      .should("eq", 302);

    cy.contains("Invalid credentials").should("be.visible");
  });

  // TC_LOGIN_003 - Invalid Password
  it("TC_LOGIN_003 - Password tidak valid", () => {

    cy.intercept("POST", "**/auth/validate").as("invalidPassword");

    cy.login("Admin", "salah123");

    cy.wait("@invalidPassword");

    cy.contains("Invalid credentials").should("be.visible");
  });

  // TC_LOGIN_004 - Tanpa Username
  it("TC_LOGIN_004 - Login tanpa username", () => {

    cy.intercept("POST", "**/auth/validate").as("noUsername");

    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    // request tidak dikirim karena validasi frontend
    cy.get("@noUsername.all").should("have.length", 0);

    cy.contains("Required").should("be.visible");
  });

  // TC_LOGIN_005 - Tanpa Password
  it("TC_LOGIN_005 - Login tanpa password", () => {

    cy.intercept("POST", "**/auth/validate").as("noPassword");

    cy.get('input[name="username"]').type("Admin");
    cy.get('button[type="submit"]').click();

    cy.get("@noPassword.all").should("have.length", 0);

    cy.contains("Required").should("be.visible");
  });

  // TC_LOGIN_006 - Tanpa Input
  it("TC_LOGIN_006 - Login tanpa input data", () => {

    cy.intercept("POST", "**/auth/validate").as("emptyLogin");

    cy.get('button[type="submit"]').click();

    cy.get("@emptyLogin.all").should("have.length", 0);

    cy.contains("Required").should("be.visible");
  });

  // TC_LOGIN_007 - Username dengan spasi
  it("TC_LOGIN_007 - Username pakai spasi", () => {

    cy.intercept("POST", "**/auth/validate").as("spaceUsername");

    cy.login(" Admin ", "admin123");

    cy.wait("@spaceUsername");

    cy.contains("Invalid credentials").should("be.visible");
  });

  // TC_LOGIN_008 - Login pakai ENTER
  it("TC_LOGIN_008 - Login menggunakan ENTER", () => {

    cy.intercept("POST", "**/auth/validate").as("enterLogin");

    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123{enter}");

    cy.wait("@enterLogin")
      .its("request.method")
      .should("eq", "POST");

    cy.url().should("include", "/dashboard");
  });

  // TC_LOGIN_009 - Refresh setelah gagal login
  it("TC_LOGIN_009 - Refresh setelah gagal login", () => {

    cy.intercept("POST", "**/auth/validate").as("failedLogin");

    cy.login("Admin", "salah123");

    cy.wait("@failedLogin");

    cy.contains("Invalid credentials").should("be.visible");

    cy.reload();

    cy.contains("Invalid credentials").should("not.exist");
  });

  // TC_LOGIN_010 - Paste Password
  it("TC_LOGIN_010 - Login menggunakan paste password", () => {

    cy.intercept("POST", "**/auth/validate").as("pastePassword");

    const password = "admin123";

    cy.get('input[name="username"]').type("Admin");

    cy.get('input[name="password"]')
      .invoke("val", password)
      .trigger("input");

    cy.get('button[type="submit"]').click();

    cy.wait("@pastePassword");

    cy.url().should("include", "/dashboard");
  });

  // TC_LOGIN_011 - Verify redirect dashboard
  it("TC_LOGIN_011 - Redirect ke dashboard", () => {

    cy.intercept("GET", "**/dashboard/**").as("dashboardRedirect");

    cy.url().should("eq", LOGIN_URL);

    cy.login("Admin", "admin123");

    cy.wait("@dashboardRedirect");

    cy.url({ timeout: 10000 }).should("eq", DASHBOARD_URL);
    cy.contains("Dashboard").should("be.visible");
  });

});
