package com.imdex.listeners;

import com.epam.healenium.PageAwareBy;
import com.epam.healenium.SelfHealingDriver;
import com.epam.healenium.model.Context;
import com.epam.healenium.model.LastHealingDataDto;
import com.epam.healenium.treecomparing.Node;
import com.qmetry.qaf.automation.core.ConfigurationManager;
import com.qmetry.qaf.automation.ui.webdriver.CommandTracker;
import com.qmetry.qaf.automation.ui.webdriver.QAFExtendedWebDriver;
import com.qmetry.qaf.automation.ui.webdriver.QAFWebDriverCommandAdapter;
import com.qmetry.qaf.automation.util.JSONUtil;
import com.qmetry.qaf.automation.util.LocatorUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DriverCommand;

import java.util.*;

public class HealeniumListener extends QAFWebDriverCommandAdapter {

    private static final String SELF_HEALING_MODE = "heal-enabled";

    private static final Map<String, Object> byToString = JSONUtil.toMap(
            "{'ByCssSelector':'css selector','ByClassName':'class name','ByXPath':'xpath','ByPartialLinkText':'partial link text','ById':'id','ByLinkText':'link text','ByName':'name'}");

    @Override
    public void afterCommand(QAFExtendedWebDriver driver, CommandTracker commandTracker) {
        if (ConfigurationManager.getBundle().getBoolean(SELF_HEALING_MODE, false)) {
            this.saveElementsForHealing(driver, commandTracker);
        }
    }

    @Override
    public void onFailure(QAFExtendedWebDriver driver, CommandTracker commandTracker) {
        if (ConfigurationManager.getBundle().getBoolean(SELF_HEALING_MODE, false)) {
            this.healNewLocator(driver, commandTracker);
        }
    }

    private void saveElementsForHealing(QAFExtendedWebDriver driver, CommandTracker commandTracker) {
        if (DriverCommand.FIND_ELEMENT.equalsIgnoreCase(commandTracker.getCommand())
                || DriverCommand.FIND_ELEMENTS.equalsIgnoreCase(commandTracker.getCommand())
                || DriverCommand.FIND_CHILD_ELEMENT.equalsIgnoreCase(commandTracker.getCommand())
                || DriverCommand.FIND_CHILD_ELEMENTS.equalsIgnoreCase(commandTracker.getCommand())) {

            Map<String, Object> parameters = commandTracker.getParameters();

            if (parameters != null && parameters.containsKey("using") && parameters.containsKey("value")) {

                By by = LocatorUtil.getBy(String.format("%s=%s", parameters.get("using"), parameters.get("value")));

                SelfHealingDriver selfHealingDriver = SelfHealingDriver.create(driver);

                Object result = commandTracker.getResponce().getValue();

                @SuppressWarnings("unchecked")
                List<WebElement> webElements = List.class.isAssignableFrom(result.getClass()) ? (List<WebElement>) result : Collections.singletonList((WebElement) result);

                try {
                    selfHealingDriver.getCurrentEngine().saveElements(new PageAwareBy(selfHealingDriver.getTitle(), by), webElements);
                } catch (Exception ex) {
                    commandTracker.setRetry(true);
                }

            }
        }
    }

    private void healNewLocator(QAFExtendedWebDriver driver, CommandTracker commandTracker) {

        Map<String, Object> parameters = commandTracker.getParameters();

        if (parameters != null && parameters.containsKey("using") && parameters.containsKey("value")) {

            By by = LocatorUtil.getBy(String.format("%s=%s", parameters.get("using"), parameters.get("value")));

            PageAwareBy pageAwareBy = new PageAwareBy(driver.getTitle(), by);

            SelfHealingDriver selfHealingDriver = SelfHealingDriver.create(driver);

            String targetPage = selfHealingDriver.getPageSource();

            Node destination = selfHealingDriver.getCurrentEngine().parseTree(targetPage);

            try {

                Optional<LastHealingDataDto> lastValidDataDto = selfHealingDriver.getCurrentEngine().getClient()
                        .getLastHealingData(pageAwareBy.getBy(), selfHealingDriver.getCurrentEngine().getCurrentUrl());

                if (lastValidDataDto.isPresent() && lastValidDataDto.map(LastHealingDataDto::getPaths).isPresent()) {
                    List<Node> paths = lastValidDataDto.map(LastHealingDataDto::getPaths).get().get(0);
                    Context context = new Context();
                    selfHealingDriver.getCurrentEngine().getHealingService().findNewLocations(paths, destination, context);
                    By newBy = context.getHealingResults().get(0).getHealedElements().get(0).getScored().getValue();
                    commandTracker.getParameters().putAll(toParams(newBy));
                    commandTracker.setRetry(true);
                }
            } catch (Exception ignored) {
            }
        }
    }

    private static Map<String, String> toParams(By by) {
        Map<String, String> map = new HashMap<String, String>();
        String val = by.toString().split(":", 2)[1].trim();
        map.put("using", byToString.get(by.getClass().getSimpleName()).toString());
        map.put("value", val);
        return map;
    }
}