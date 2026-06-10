package com.mlbooster.service

import android.app.Notification
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.mlbooster.MLBoosterApp
import com.mlbooster.data.repository.UsageRepo
import java.util.Timer
import java.util.TimerTask

class BoosterForegroundService : Service() {

    private var notificationManager: NotificationManager? = null
    private var wifiLock: WifiManager.WifiLock? = null
    
    private lateinit var usageRepo: UsageRepo
    private var monitoringTimer: Timer? = null
    private var originalDndFilter = NotificationManager.INTERRUPTION_FILTER_ALL
    private var isDndActivatedByUs = false

    override fun onCreate() {
        super.onCreate()
        notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        usageRepo = UsageRepo(this)
        
        // Membangun Wi-Fi latency lock bertenaga rendah
        val wifiManager = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        wifiLock = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            wifiManager.createWifiLock(WifiManager.WIFI_MODE_FULL_LOW_LATENCY, "GAME_DOSS_WIFI_LOCK")
        } else {
            @Suppress("DEPRECATION")
            wifiManager.createWifiLock(WifiManager.WIFI_MODE_FULL_HIGH_PERF, "GAME_DOSS_WIFI_LOCK")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val initialNotification = buildForegroundNotification("GAME DOSS Active - Monitoring MLBB Engine")
        startForeground(1337, initialNotification)

        // Mulai periodic monitoring task
        startMonitoringLifecycle()
        return START_STICKY
    }

    private fun startMonitoringLifecycle() {
        monitoringTimer?.cancel()
        monitoringTimer = Timer()
        monitoringTimer?.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                val isMlActive = usageRepo.isMobileLegendsForeground()
                if (isMlActive) {
                    activateGameOptimizations()
                } else {
                    deactivateGameOptimizations()
                }
            }
        }, 0, 3000) // Cek setiap 3 detik sekali
    }

    private fun activateGameOptimizations() {
        // 1. Ambil Wi-Fi Lock untuk performa stabil
        if (wifiLock?.isHeld == false) {
            wifiLock?.acquire()
        }

        // 2. Aktifkan DND untuk memblokir chat/telepon pengganggu MLBB
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && notificationManager?.isNotificationPolicyAccessGranted == true) {
                val currentFilter = notificationManager?.currentInterruptionFilter ?: NotificationManager.INTERRUPTION_FILTER_ALL
                if (currentFilter != NotificationManager.INTERRUPTION_FILTER_PRIORITY && !isDndActivatedByUs) {
                    originalDndFilter = currentFilter
                    notificationManager?.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_PRIORITY)
                    isDndActivatedByUs = true
                    updateNotification("MLBB Live Detected - Low Latency Lock & DND AKTIF!")
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun deactivateGameOptimizations() {
        // Lepas Wi-Fi lock
        if (wifiLock?.isHeld == true) {
            wifiLock?.release()
        }

        // Kembalikan status DND awal
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && isDndActivatedByUs && notificationManager?.isNotificationPolicyAccessGranted == true) {
                notificationManager?.setInterruptionFilter(originalDndFilter)
                isDndActivatedByUs = false
                updateNotification("GAME DOSS Active - Menunggu Mobile Legends...")
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun updateNotification(contentText: String) {
        val notification = buildForegroundNotification(contentText)
        notificationManager?.notify(1337, notification)
    }

    private fun buildForegroundNotification(text: String): Notification {
        return NotificationCompat.Builder(this, MLBoosterApp.CHANNEL_ID)
            .setContentTitle("GAME DOSS Active Optimizer")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build()
    }

    override fun onDestroy() {
        monitoringTimer?.cancel()
        deactivateGameOptimizations()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
