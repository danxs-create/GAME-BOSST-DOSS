package com.mlbooster

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class MLBoosterApp : Application() {
    companion object {
        const val CHANNEL_ID = "GAME_DOSS_MONITOR"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "GAME DOSS Active Optimization Engine",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Channel for background optimization monitoring service"
            }
            
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }
}
