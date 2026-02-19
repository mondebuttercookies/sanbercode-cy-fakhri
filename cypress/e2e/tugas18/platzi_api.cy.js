describe("Platzi Fake Store API Automation - Extensive Testing", () => {

  const BASE_URL = "https://api.escuelajs.co/api/v1";

  let createdCategoryId;

  
  // TC_API_001 - GET all categories
  
  it("GET all categories", () => {

    cy.request(`${BASE_URL}/categories`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
  });

  
  // TC_API_002 - Validate category structure
  
  it("Validate category object structure", () => {

    cy.request(`${BASE_URL}/categories/1`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("image");
      });
  });

  
  // TC_API_003 - GET single category
  
  it("GET single category", () => {

    cy.request(`${BASE_URL}/categories/2`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.id).to.eq(2);
      });
  });

  
  // TC_API_004 - GET category not found
  
  it("GET category invalid ID", () => {

    cy.request({
      method: "GET",
      url: `${BASE_URL}/categories/999999`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  
  // TC_API_005 - POST create category
  
  it("POST create category", () => {

    cy.request("POST", `${BASE_URL}/categories`, {
      name: "Automation Cypress",
      image: "https://placeimg.com/640/480/tech"
    }).then((res) => {

      expect(res.status).to.eq(201);
      expect(res.body.name).to.eq("Automation Cypress");

      createdCategoryId = res.body.id;
    });
  });

  
  // TC_API_006 - GET created category
  
  it("GET created category", () => {

    cy.request(`${BASE_URL}/categories/${createdCategoryId}`)
      .then((res) => {
        expect(res.status).to.eq(200);
      });
  });

  
  // TC_API_007 - PUT update category
  
  it("PUT update category", () => {

    cy.request("PUT", `${BASE_URL}/categories/${createdCategoryId}`, {
      name: "Updated Automation Category",
      image: "https://placeimg.com/640/480/any"
    }).then((res) => {

      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq("Updated Automation Category");
    });
  });

  
  // TC_API_008 - PATCH update category
  
  it("PATCH update category", () => {

    cy.request("PATCH", `${BASE_URL}/categories/${createdCategoryId}`, {
      name: "Patch Category Cypress"
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq("Patch Category Cypress");
    });
  });

  
  // TC_API_009 - GET all products
  
  it("GET products list", () => {

    cy.request(`${BASE_URL}/products`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.be.greaterThan(0);
      });
  });

  
  // TC_API_010 - Validate product structure
  
  it("Validate product structure", () => {

    cy.request(`${BASE_URL}/products/1`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("category");
      });
  });

  
  // TC_API_011 - GET products with limit
  
  it("GET products with pagination", () => {

    cy.request(`${BASE_URL}/products?offset=0&limit=5`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.length).to.eq(5);
      });
  });

  
  // TC_API_012 - Negative POST (missing field)
  
  it("POST invalid category data", () => {

    cy.request({
      method: "POST",
      url: `${BASE_URL}/categories`,
      failOnStatusCode: false,
      body: {
        name: ""
      }
    }).then((res) => {
      expect(res.status).to.be.oneOf([400,422]);
    });
  });

  
  // TC_API_013 - DELETE category
  
  it("DELETE created category", () => {

    cy.request({
      method: "DELETE",
      url: `${BASE_URL}/categories/${createdCategoryId}`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([200,204]);
    });
  });

  
  // TC_API_014 - Verify deleted category
  
  it("Verify category deleted", () => {

    cy.request({
      method: "GET",
      url: `${BASE_URL}/categories/${createdCategoryId}`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  
  // TC_API_015 - Response time validation
  
  it("Check API response time", () => {

    cy.request(`${BASE_URL}/categories`)
      .then((res) => {
        expect(res.duration).to.be.lessThan(2000);
      });
  });

});
