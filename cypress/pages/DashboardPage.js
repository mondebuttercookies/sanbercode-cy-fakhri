class DashboardPage {

  directoryMenu = 'a[href*="directory"]';

  openDirectoryMenu() {
    cy.contains(".oxd-main-menu-item", "Directory")
      .should("be.visible")
      .click();
  }

}

export default new DashboardPage();