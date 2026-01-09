package com.imdex.utils;

import com.qmetry.qaf.automation.core.ConfigurationManager;

public final class ResourceUtil {
    public static String getValue(String key) {
        return ConfigurationManager.getBundle().getString(key);
    }
}
