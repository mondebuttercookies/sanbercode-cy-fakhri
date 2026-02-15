describe("OrangeHRM Login Feature - TC_Login", () => {

  const BASE_URL = "https://opensource-demo.orangehrmlive.com";
  const LOGIN_URL = `${BASE_URL}/web/index.php/auth/login`;
  const DASHBOARD_URL = `${BASE_URL}/web/index.php/dashboard/index`;


  beforeEach(() => {
    cy.visit(LOGIN_URL);
  });

  // TC_LOGIN_001
  it("TC_LOGIN_001 - Login menggunakan username dan password valid", () => {
    cy.login("Admin", "admin123");

    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  });

  // TC_LOGIN_002
  it("TC_LOGIN_002 - Username tidak valid", () => {
    cy.login("AdminSalah", "admin123");

    cy.contains("Invalid credentials").should("be.visible");
  });

  // TC_LOGIN_003
  it("TC_LOGIN_003 - Password tidak valid", () => {
    cy.login("Admin", "salah123");

    cy.contains("Invalid credentials").should("be.visible");
  });

  // TC_LOGIN_004
  it("TC_LOGIN_004 - Login tanpa username", () => {
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    cy.contains("Required").should("be.visible");
  });

  // TC_LOGIN_005
  it("TC_LOGIN_005 - Login tanpa password", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('button[type="submit"]').click();

    cy.contains("Required").should("be.visible");
  });

  // TC_LOGIN_006
  it("TC_LOGIN_006 - Login tanpa input data", () => {
    cy.get('button[type="submit"]').click();

    cy.contains("Required").should("be.visible");
  });

  // TC_LOGIN_007
  it("TC_LOGIN_007 - Login menggunakan username dengan spasi", () => {
    cy.login(" Admin ", "admin123");

    // OrangeHRM akan menganggap invalid
    cy.contains("Invalid credentials").should("be.visible");
  });

  // TC_LOGIN_008
  it("TC_LOGIN_008 - Login menggunakan tombol ENTER", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123{enter}");

    cy.url().should("include", "/dashboard");
  });

  // TC_LOGIN_009
  it("TC_LOGIN_009 - Refresh halaman setelah gagal login", () => {
    cy.login("Admin", "salah123");

    cy.contains("Invalid credentials").should("be.visible");

    cy.reload();

    // error message tidak muncul lagi
    cy.contains("Invalid credentials").should("not.exist");
  });

  // TC_LOGIN_010
  it("TC_LOGIN_010 - Login menggunakan paste password", () => {
    const password = "admin123";

    cy.get('input[name="username"]').type("Admin");

    // simulasi paste
    cy.get('input[name="password"]')
      .invoke("val", password)
      .trigger("input");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
  });

  // TC_LOGIN_011
  it("TC_LOGIN_011 - Login valid redirect ke dashboard", () => {
    cy.url().should("eq", LOGIN_URL);

    cy.login("Admin", "admin123");

    // ✅ VERIFY REDIRECT LINK
    cy.url({ timeout: 10000 }).should("eq", DASHBOARD_URL);

    cy.contains("Dashboard").should("be.visible");
  });


});
