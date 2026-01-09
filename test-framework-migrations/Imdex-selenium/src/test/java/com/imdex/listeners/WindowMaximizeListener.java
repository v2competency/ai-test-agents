package com.imdex.listeners;

import org.openqa.selenium.remote.DriverCommand;

import com.qmetry.qaf.automation.core.QAFTestBase;
import com.qmetry.qaf.automation.ui.webdriver.CommandTracker;
import com.qmetry.qaf.automation.ui.webdriver.QAFExtendedWebDriver;
import com.qmetry.qaf.automation.ui.webdriver.QAFWebDriverCommandAdapter;

public class WindowMaximizeListener extends QAFWebDriverCommandAdapter {
    @Override
    public void onInitialize(QAFExtendedWebDriver driver) {
        driver.manage().window().maximize();
    }

    @Override
    public void afterCommand(QAFExtendedWebDriver driver, CommandTracker commandTracker) {
        if (commandTracker.getCommand().equalsIgnoreCase(DriverCommand.GET)) {
            QAFTestBase.pause(5000);
        }
    }

}
