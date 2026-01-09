Feature: V2AF Automation Demo for Imdex
  # Narrative:
  # As a user of the Imdex application,
  # I want to search for information and refine the results using filters,
  # So that I can efficiently find the most relevant data.

  @Smoke
  Scenario: Validate Search and Filter Functionality
    Given the user navigates to the Imdex application
    And the user accepts the cookie consent
    When the user searches for "mining" in the search box
    Then the user should see the "Refine your search" heading on the search results page

    When the user applies the following filters:
      | Type    | Date      | SortBy |
      | Product | Last Year | Newest |

    Then the user should see results updated based on the applied filters

  # Narrative:
  # As a user of the Imdex application,
  # I want to search for information and refine the results using filters,
  # So that I can efficiently find the most relevant data.
  @Smoke
  Scenario Outline: Validate Search and Filter Functionality (Data Driven)
    Given the user navigates to the Imdex application
    And the user accepts the cookie consent
    When the user searches for "${keyword}" in the search box
    Then the user should see the "Refine your search" heading on the search results page

    When the user applies the following filters:
      | Type     | Date     | SortBy |
      | Solution | All Time | Oldest |

    Then the user should see results updated based on the applied filters
    Examples:
      | recid     | keyword             |
      | keyword-1 | mining              |
      | keyword-2 | fluids optimisation |

  # Narrative:
  # As a user of the Imdex application,
  # I want to search for information and refine the results using filters,
  # So that I can efficiently find the most relevant data.
  @Smoke
  Scenario Outline: Validate Search and Filter Functionality (Data Provider)
    Given the user navigates to the Imdex application
    And the user accepts the cookie consent
    When the user searches for "${keyword}" in the search box
    Then the user should see the "Refine your search" heading on the search results page

    When the user applies the following filters:
      | Type    | Date       | SortBy    |
      | Content | Last Month | Relevance |

    Then the user should see results updated based on the applied filters
    Examples: {'datafile':'resources/testdata/keywords.json'}