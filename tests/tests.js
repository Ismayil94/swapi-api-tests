const axios = require("axios");
const assert = require("assert");
const MockAdapter = require("axios-mock-adapter");

const swapiUrl = "https://swapi.dev/api";

describe("Star Wars API Tests", function () {
  // Test Case : Retrieve a list of all Star Wars characters
  it("should retrieve a list of all Star Wars characters", async function () {
    const response = await axios.get(`${swapiUrl}/people`);

    assert.strictEqual(response.status, 200, "Unexpected status code");

    // Verify that at least one character is returned
    assert.ok(response.data.results.length > 0, "No characters returned");
  });

  // Test Case : Retrieve details for a specific Star Wars character
  it("should retrieve details for a specific Star Wars character", async function () {
    const characterName = "Luke Skywalker";
    const response = await axios.get(`${swapiUrl}/people`, {
      params: { search: characterName },
    });
    console.log(response.data.name);

    assert.strictEqual(response.status, 200, "Unexpected status code");

    // Verify that the response includes the correct character details, and only one result is returned
    assert.strictEqual(response.data.count, 1, "Unexpected number of results");
    assert.strictEqual(
      response.data.results[0].name,
      characterName,
      "Incorrect character name"
    );
    assert.equal(
      response.data.results[0].films.length,
      4,
      "Incorrect number of films that character in"
    );
  });

  // Test Case : Retrieve a list of all Star Wars films
  it("should retrieve a list of all Star Wars films", async function () {
    const response = await axios.get(`${swapiUrl}/films`);

    assert.strictEqual(response.status, 200, "Unexpected status code");

    // Verify that at least one film is returned
    assert.ok(response.data.results.length > 0, "No films returned");
  });

  // Test Case : Retrieve details for a specific Star Wars film
  it("should retrieve details for a specific Star Wars film", async function () {
    const filmTitle = "A New Hope";
    const response = await axios.get(`${swapiUrl}/films`, {
      params: { search: filmTitle },
    });
    console.log(response.data.director);

    assert.strictEqual(response.status, 200, "Unexpected status code");

    // Verify that the response includes the correct film details, and only one result is returned
    assert.strictEqual(response.data.count, 1, "Unexpected number of results");
    assert.strictEqual(
      response.data.results[0].title,
      filmTitle,
      "Incorrect film details"
    );
    assert.equal(
      response.data.results[0].director,
      "George Lucas",
      "Incorrect director name"
    );
    assert.equal(
      response.data.results[0].release_date,
      "1977-05-25",
      "Incorrect release date"
    );
  });

  // Edge Case: Search for a character that doesn't exist
  it("should handle the case when searching for a non-existent character", async function () {
    const nonExistentCharacter = "NonExistentCharacter123";
    const response = await axios.get(`${swapiUrl}/people`, {
      params: { search: nonExistentCharacter },
    });

    assert.strictEqual(response.status, 200, "Unexpected status code");

    // Verify that no results are returned for the non-existent character
    assert.strictEqual(response.data.count, 0, "Unexpected number of results");
  });

  // Edge Case: Search for a film that doesn't exist
  it("should handle the case when searching for a non-existent film", async function () {
    const nonExistentFilm = "NonExistentFilm123";
    const response = await axios.get(`${swapiUrl}/films`, {
      params: { search: nonExistentFilm },
    });

    assert.strictEqual(response.status, 200, "Unexpected status code");

    // Verify that no results are returned for the non-existent film
    assert.strictEqual(response.data.count, 0, "Unexpected number of results");
  });

  // Test Case : Retrieve a list of characters with an invalid endpoint URL
  it("should fail to retrieve a list of characters with an invalid endpoint URL", async function () {
    try {
      const response = await axios.get(`${swapiUrl}/invalid-endpoint`);
    } catch (error) {
      // Verify that the response status is an error code (e.g., 404 Not Found)
      assert.strictEqual(error.response.status, 404, "Unexpected status code");
    }
  });

  // Test Case : Retrieve details for a character with an invalid character ID
  it("should fail to retrieve details for a character with an invalid character ID", async function () {
    try {
      // Send a GET request for an invalid character ID
      const response = await axios.get(`${swapiUrl}/people/12345`);
    } catch (error) {
      // Verify that the response status is an error code (e.g., 404 Not Found)
      assert.strictEqual(error.response.status, 404, "Unexpected status code");
    }
  });

  // Test Case: Retrieve a list of films with an invalid endpoint URL
  it("should fail to retrieve a list of films with an invalid endpoint URL", async function () {
    try {
      // Send a GET request to an invalid endpoint URL
      const response = await axios.get(`${swapiUrl}/invalid-endpoint`);
    } catch (error) {
      // Verify that the response status is an error code (e.g., 404 Not Found)
      assert.strictEqual(error.response.status, 404, "Unexpected status code");
    }
  });

  // Test Case: Retrieve details for a film with an invalid film ID
  it("should fail to retrieve details for a film with an invalid film ID", async function () {
    try {
      // Send a GET request to the SWAPI endpoint for an invalid film ID
      const response = await axios.get(`${swapiUrl}/films/12345`);
    } catch (error) {
      // Verify that the response status is an error code (e.g., 404 Not Found)
      assert.strictEqual(error.response.status, 404, "Unexpected status code");
    }
  });

  // Test Case: Send a GET request with an unsupported HTTP method
  it("should fail to send a GET request with an unsupported HTTP method", async function () {
    // Send a GET request to the SWAPI endpoint using an unsupported HTTP method (POST)
    try {
      const response = await axios.post(
        `${swapiUrl}/people`,
        {},
        {
          method: "POST",
        }
      );
    } catch (error) {
      // Verify that the response status is an error code (e.g., 405 Method Not Allowed)
      assert.strictEqual(error.response.status, 405, "Unexpected status code");
    }
  });

  // Edge Case: Simulate a 403 Forbidden response
  it("should handle the case when the API returns a 403 Forbidden response", async function () {
    try {
      const mock = new MockAdapter(axios);

      // Set up mock for a 403 Forbidden response
      mock.onGet(`${swapiUrl}/forbidden`).reply(403, {});

      await axios.get(`${swapiUrl}/forbidden`);
    } catch (error) {
      // Verify that the response status is 403
      assert.strictEqual(error.response.status, 403, "Unexpected status code");
    }
  });

  // Edge Case: Simulate a 503 Service Unavailable response
  it("should handle the case when the API returns a 503 Service Unavailable response", async function () {
    try {
      const mock = new MockAdapter(axios);

      // Set up mock for a 503 Service Unavailable response
      mock.onGet(`${swapiUrl}/unavailable`).reply(503, {});

      await axios.get(`${swapiUrl}/unavailable`);
    } catch (error) {
      // Verify that the response status is 503
      assert.strictEqual(error.response.status, 503, "Unexpected status code");
    }
  });
});
