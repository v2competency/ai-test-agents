package com.imdex.steps;

import static com.imdex.utils.ResourceUtil.*;
import static com.qmetry.qaf.automation.step.CommonStep.*;
import java.util.Map;
import com.qmetry.qaf.automation.core.QAFTestBase;
import com.qmetry.qaf.automation.step.QAFTestStep;

public class StepsLibrary {

    // Navigates to the Imdex application home page
    @QAFTestStep(description = "the user navigates to the Imdex application")
    public static void navigateToNaturalRetreatPage() {
        get("/"); // Opens the application's root URL
    }

    // Accepts the cookie consent
    @QAFTestStep(description = "the user accepts the cookie consent")
    public static void acceptAllCookies() {
        click("imdex.home.lnk.acceptAllCookies"); // Clicks on the 'Accept All Cookies' button
    }

    // Searches for a specified keyword in the search box
    @QAFTestStep(description = "the user searches for {keyword} in the search box")
    public static void searchKeyword(String keyword) {
        // Check the platform channel to determine whether the search is performed on
        // mobile or desktop
        if (getValue("platform").equalsIgnoreCase("mobile")) {
            // For mobile: Open the navigation menu
            click("imdex.home.mobile.navigation");
            // Enter the keyword into the search input field
            sendKeys(keyword, "imdex.mobile.txt.searchInput");
            // Submit the search using the mobile-specific submit button
            click("imdex.mobile.btn.searchSubmit");
        } else {
            // For desktop: Focus on the search input box
            click("imdex.home.btn.searchInput");
            // Enter the keyword into the search input field
            sendKeys(keyword, "imdex.home.txt.searchInput");
            // Submit the search using the desktop-specific submit button
            click("imdex.home.btn.searchSubmit");
        }
    }

    // Verifies that the specified title is displayed on the search results page
    @QAFTestStep(description = "the user should see the {title} heading on the search results page")
    public static void verifySearchResultPage(String title) {
        // Verifies the presence of the heading
        verifyPresent(String.format(getValue("imdex.search.tl.heading"), title));
    }

    // Applies filters to the search results based on the provided filter parameters
    @SuppressWarnings("rawtypes") // Suppress warnings for raw type usage
    @QAFTestStep(description = "the user applies the following filters:{0}")
    public void theUserAppliesTheFollowingFilters(Object[] filters) {
        // Log the filter object for debugging
        System.out.println("Filters: " + filters[0]);

        // Select and apply the "Filter by type"
        click(String.format(getValue("imdex.search.lst.filter"), "Filter by type"));
        // Opens the "Filter by type" dropdown
        click(String.format(getValue("imdex.search.lst.filter.option"), "Filter by type",
                ((Map) filters[0]).get("Type")));

        // Select and apply the "Filter by date"
        click(String.format(getValue("imdex.search.lst.filter"), "Filter by date"));
        click(String.format(getValue("imdex.search.lst.filter.option"), "Filter by date",
                ((Map) filters[0]).get("Date")));

        // Select and apply the "Sort by" option
        click(String.format(getValue("imdex.search.lst.filter"), "Sort by"));
        click(String.format(getValue("imdex.search.lst.filter.option"), "Sort by", ((Map) filters[0]).get("SortBy")));
    }

    // Verifies that the search results are updated based on the applied filters
    @QAFTestStep(description = "the user should see results updated based on the applied filters")
    public static void verifySearchResults() {
        verifyPresent("imdex.search.results.heading"); // Verifies the presence of the search results heading
        QAFTestBase.pause(3000);
    }
}
