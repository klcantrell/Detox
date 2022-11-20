package com.wix.detox

import android.content.Context
import android.util.Log
import androidx.test.espresso.Espresso
import com.wix.detox.common.DetoxLog.Companion.LOG_TAG
import com.wix.detox.espresso.UiAutomatorHelper
import com.wix.detox.espresso.registry.IRStatusInquirer
import com.wix.detox.reactnative.ReactNativeExtension
import com.wix.detox.reactnative.idlingresources.asynctask.DetoxBusyResource

class TestEngineFacade {
    fun awaitIdle(): Unit? = Espresso.onIdle {
        Log.i(LOG_TAG, "Wait is over: App is now idle!")
        null
    }
    fun syncIdle() = UiAutomatorHelper.espressoSync() // TODO Check whether this can be replaced with #awaitIdle()
    fun getBusyIdlingResources(): List<DetoxBusyResource> = IRStatusInquirer.INSTANCE.getAllBusyResources()

    // TODO Refactor RN related stuff away
    fun reloadReactNative(appContext: Context) = ReactNativeExtension.reloadReactNative(appContext)
    fun resetReactNative() = ReactNativeExtension.clearAllSynchronization()
}
