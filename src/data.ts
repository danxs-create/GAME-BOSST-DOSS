import { AuditItem, ProposedFeature, CodeFile } from './types';

export const auditItems: AuditItem[] = [
  {
    id: 'ml_detection',
    featureName: 'Mobile Legends Automation / Detection',
    status: 'REAL',
    androidApi: 'UsageStatsManager.queryUsageEvents() / UsageStatsManager.getAppStandbyBucket()',
    explanation: 'Sangat realis. Dengan ijin khusus READ_APP_USAGE (melalui Settings OP_GET_USAGE_STATS), aplikasi game booster bisa memantau aplikasi mana yang sedang aktif di foreground secara periodik. Begitu package com.mobile.legends terdeteksi di foreground, booster service langsung aktif otomatis.',
    affectedFiles: ['UsageRepo.kt', 'BoosterForegroundService.kt', 'MainActivity.kt'],
    minAndroidVersion: 'Android 10 - 15 (Api Level 29 - 35)',
  },
  {
    id: 'dnd_mode',
    featureName: 'Do Not Disturb (DND) Mode',
    status: 'REAL',
    androidApi: 'NotificationManager.setInterruptionFilter(INTERRUPTION_FILTER_NONE | INTERRUPTION_FILTER_PRIORITY)',
    explanation: 'Sangat realis. Aplikasi membutuhkan ijin ACCESS_NOTIFICATION_POLICY. Begitu ijin diberikan, aplikasi bisa mengubah status filter gangguan ke "Priority Only" atau "None" saat game dimulai untuk mematikan semua notifikasi yang mengganggu lag MLBB.',
    affectedFiles: ['BoosterForegroundService.kt', 'AndroidManifest.xml'],
    minAndroidVersion: 'Android 10 - 15',
  },
  {
    id: 'network_monitoring',
    featureName: 'Network Latency & Signal Monitoring',
    status: 'REAL',
    androidApi: 'ConnectivityManager.registerNetworkCallback() & NetworkCapabilities & Socket Ping',
    explanation: 'Sangat realis tanpa root. Kita bisa melacak tipe koneksi (Wi-Fi vs Seluler), bandwidth seluler, serta mendeteksi kehilangan paket menggunakan registerNetworkCallback. Selain itu, ping dihitung nyata dengan melakukan lightweight Socket / HTTP HEAD request ke IP server game gantry atau server regional.',
    affectedFiles: ['NetworkRepo.kt'],
    minAndroidVersion: 'Android 10 - 15',
  },
  {
    id: 'storage_cleaner',
    featureName: 'Storage Cache Cleaner',
    status: 'LIMITED',
    androidApi: 'context.cacheDir.deleteRecursively() / StorageManager.getAllocatableBytes()',
    explanation: 'Terbatas tanpa root. Sejak Android 8+, membersihkan cache eksternal milik aplikasi lain (seperti MLBB) langsung melanggar sandboxing keamanan Android dan TIDAK BISA dilakukan tanpa root. Aplikasi hanya bisa membersihkan cache dirinya sendiri ATAU membuka halaman Settings Aplikasi MLBB secara direct menggunakan action Intent agar pengguna mengkliknya secara manual.',
    affectedFiles: ['StorageRepo.kt'],
    alternativeSolution: 'Arahkan pengguna ke halaman Settings MLBB secara langsung lewat `ACTION_APPLICATION_DETAILS_SETTINGS` untuk "Clear Cache" manual dengan sekali klik.',
    minAndroidVersion: 'Android 10 - 15 (Sangat dibatasi)',
  },
  {
    id: 'cpu_usage',
    featureName: 'CPU Usage Monitor (/proc/stat)',
    status: 'LIMITED',
    androidApi: 'membaca file "/proc/stat" atau menggunakan Runtime.getRuntime().availableProcessors()',
    explanation: 'Terbatas sejak Android 10. Membaca data `/proc/stat` secara langsung dibatasi ketat oleh aturan SELinux pada rom modern. Device Android 10+ mengembalikan nilai kosong atau melempar SecurityException jika mencoba mengakses statistik prosesor global.',
    affectedFiles: ['SystemStatsReader.kt'],
    alternativeSolution: 'Gunakan `HardwarePropertiesManager` (jika didukung pabrikan) atau deteksi beban CPU internal dengan memantau runtime tugas berkala di thread latar belakang (atau gunakan API khusus seperti Android Dynamic Performance Framework - ADPF).',
    minAndroidVersion: 'Android 10 - 15 (Sangat dibatasi)',
  },
  {
    id: 'ram_usage',
    featureName: 'RAM Usage Monitor',
    status: 'REAL',
    androidApi: 'ActivityManager.getMemoryInfo(MemoryInfo)',
    explanation: 'Sangat realis tanpa root. Membaca total RAM tersedia, RAM yang digunakan, serta ambang batas low memory (MemoryInfo.lowMemory) adalah API publik resmi yang aman digunakan kapan saja untuk memberikan peringatan memory.',
    affectedFiles: ['SystemStatsReader.kt'],
    minAndroidVersion: 'Android 10 - 15',
  },
  {
    id: 'battery_temp',
    featureName: 'Battery Temperature & Health Track',
    status: 'REAL',
    androidApi: 'BatteryManager broadcast / ACTION_BATTERY_CHANGED intent receiver',
    explanation: 'Sangat realis tanpa root. Kita dapat mendaftarkan BroadcastReceiver non-ekspor dinamis untuk melacak persentase baterai, status charge, tegangan, dan yang paling penting suhu baterai (`BatteryManager.EXTRA_TEMPERATURE`) secara live.',
    affectedFiles: ['BatteryRepo.kt'],
    minAndroidVersion: 'Android 10 - 15',
  },
  {
    id: 'foreground_service',
    featureName: 'Foreground Gaming Service',
    status: 'REAL',
    androidApi: 'Service.startForeground() dengan FOREGROUND_SERVICE_TYPE_SPECIAL_USE atau TYPE_MEDIA_PLAYBACK',
    explanation: 'Sangat realis. Wajib terdaftar di AndroidManifest dengan ijin FOREGROUND_SERVICE. Service ini menjamin agar sistem operasi Android tidak mematikan service monitoring saat game Mobile Legends sedang berjalan.',
    affectedFiles: ['BoosterForegroundService.kt', 'AndroidManifest.xml'],
    minAndroidVersion: 'Android 10 - 15',
  },
  {
    id: 'fps_boosting',
    featureName: 'Direct FPS Optimizer / Config Override',
    status: 'IMPOSSIBLE',
    androidApi: 'Memerlukan hak akses istimewa ROOT atau memodifikasi file MLBB (/data/data/com.mobile.legends/)',
    explanation: 'SANGAT MUSTAHIL TANPA ROOT. Aplikasi pihak ketiga sama sekali tidak memiliki ijin untuk memaksa layar melakukan render lebih cepat dari kemampuan GPU asli, menyuntikkan konfigurasi resolusi game ke file privat MLBB, atau mengaktifkan fitur grafis "Ultra/Super" secara ilegal dari luar Sandbox. App Game Booster yang mengklaim dapat mematikan batasan FPS game dari luar adalah palsu/simulasi.',
    affectedFiles: ['Uninstall / Diabaikan dalam arsitektur nyata'],
    alternativeSolution: 'Gunakan Android GameManager API untuk menyarankan sistem mengalihkan alokasi target frame rate ke performa tertinggi (Android 12+), atau menginstruksikan modul DND & memori optimizer untuk membebaskan RAM agar performa rendering stabil.',
    minAndroidVersion: 'Semua versi Android',
  }
];

export const proposedFeatures: ProposedFeature[] = [
  {
    id: 'game_manager_api',
    name: 'Android 12+ GameManager API Integration',
    androidApi: 'GameManager.getGameMode() / GameManager.setGameState()',
    androidVersion: 'Android 12 - 15 (API level 31 - 35)',
    mlBenefit: 'Menginstruksikan operating system untuk mengaktifkan profile performa tinggi bawaan sistem (Performance Mode) khusus untuk Mobile Legends, yang mengalokasikan prioritas thread CPU dan frekuensi clock GPU maksimal untuk menjamin stabilitas frame rate.',
    kotlinSnippet: `import android.app.GameManager
import android.content.Context
import android.os.Build
import androidx.annotation.RequiresApi

class GameManagerRepo(private val context: Context) {
    private val gameManager = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        context.getSystemService(Context.GAME_SERVICE) as GameManager
    } else {
        null
    }

    @RequiresApi(Build.VERSION_CODES.S)
    fun getActiveGameMode(): Int {
        return gameManager?.gameMode ?: GameManager.GAME_MODE_UNSUPPORTED
    }

    @RequiresApi(Build.VERSION_CODES.S)
    fun isPerformanceModeActive(): Boolean {
        return getActiveGameMode() == GameManager.GAME_MODE_PERFORMANCE
    }
}`
  },
  {
    id: 'thermal_listener',
    name: 'Dynamic Thermal Warning overlay using PowerManager',
    androidApi: 'PowerManager.addOnThermalStatusChangedListener()',
    androidVersion: 'Android 10 - 15 (API level 29 - 35)',
    mlBenefit: 'Mendeteksi suhu internal chip perangkat secara real-time sebelum terjadi "thermal throttling" yang menyebabkan FPS drop mendadak di Mobile Legends. Ketika level THERMAL_STATUS_MODERATE atau SEVERE terdeteksi, berikan push notification atau overlay cerdas menyarankan pemain mengganti performa grafis MLBB demi kestabilan frame.',
    kotlinSnippet: `import android.content.Context
import android.os.Build
import android.os.PowerManager
import androidx.annotation.RequiresApi

class ThermalListener(private val context: Context, private val onStatusChanged: (Int) -> Unit) {
    private val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager

    @RequiresApi(Build.VERSION_CODES.Q)
    fun registerThermalListener() {
        powerManager.addOnThermalStatusChangedListener { status ->
            onStatusChanged(status)
            // status ranges structure:
            // PowerManager.THERMAL_STATUS_NONE (0)
            // PowerManager.THERMAL_STATUS_LIGHT (1)
            // PowerManager.THERMAL_STATUS_MODERATE (2)
            // PowerManager.THERMAL_STATUS_SEVERE (3)
            // PowerManager.THERMAL_STATUS_CRITICAL (4)
        }
    }
}`
  },
  {
    id: 'wifi_lock',
    name: 'Ultra-Low Latency Wi-Fi Lock Binding',
    androidApi: 'WifiManager.createWifiLock(WifiManager.WIFI_MODE_FULL_LOW_LATENCY, "MLBooster_Lock")',
    androidVersion: 'Android 10 - 15 (API level 29 - 35)',
    mlBenefit: 'Secara agresif mengunci modulator Wi-Fi agar tidak pernah masuk ke "Power Save Mode / Sleep Mode" saat Mobile Legends aktif. Fitur ini mengurangi latensi ekstrim dan jitter ping "panah hijau ke merah" saat bermain game secara drastis.',
    kotlinSnippet: `import android.content.Context
import android.net.wifi.WifiManager
import android.os.Build

class WifiLatencyLock(private val context: Context) {
    private val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    private var wifiLock: WifiManager.WifiLock? = null

    fun acquireLowLatencyLock() {
        if (wifiLock == null) {
            val lockType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                WifiManager.WIFI_MODE_FULL_LOW_LATENCY
            } else {
                @Suppress("DEPRECATION")
                WifiManager.WIFI_MODE_FULL_HIGH_PERF
            }
            wifiLock = wifiManager.createWifiLock(lockType, "MLBooster:LowLatencyLock")
        }
        
        if (wifiLock?.isHeld == false) {
            wifiLock?.acquire()
        }
    }

    fun releaseLock() {
        if (wifiLock?.isHeld == true) {
            wifiLock?.release()
        }
    }
}`
  },
  {
    id: 'high_priority_thread',
    name: 'Render Thread Priority Binding',
    androidApi: 'android.os.Process.setThreadPriority(Process.THREAD_PRIORITY_FOREGROUND)',
    androidVersion: 'Android 10 - 15 (API level 29 - 35)',
    mlBenefit: 'Menaikkan prioritas penjadwalan thread milik background service kita sendiri sehingga deteksi ping dan sinkronisasi data performa tidak ditunda oleh scheduler CPU OS saat Mobile Legends memonopoli resource.',
    kotlinSnippet: `import android.os.Process

class ThreadPriorityOptimizer {
    fun elevateCurrentServiceThread() {
        try {
            // Elevate our foreground monitoring thread to avoid OS sleep scheduling
            Process.setThreadPriority(Process.THREAD_PRIORITY_MORE_FAVORABLE)
        } catch (e: SecurityException) {
            Process.setThreadPriority(Process.THREAD_PRIORITY_FOREGROUND)
        }
    }
}`
  }
];

export const codebaseFiles: CodeFile[] = [
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mlbooster">

    <!-- REAL PERMISSIONS (Wajib ditawarkan lewat penjelasan UI yang transparan) -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" /> <!-- MLbb Detection -->
    <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" /> <!-- DND Auto-Switch -->
    <uses-permission android:name="android.permission.INTERNET" /> <!-- Real latency check -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" /> <!-- Network capabilities -->
    <uses-permission android:name="android.permission.WAKE_LOCK" /> <!-- Keep Low Latency Lock active -->

    <!-- Required for Android 13+ Notification Prompt -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".MLBoosterApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MLBooster">

        <meta-data
            android:name="android.app.game_service"
            android:resource="@xml/game_service_config" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MLBooster">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Dynamic Foreground Service that does the active monitoring -->
        <service
            android:name=".service.BoosterForegroundService"
            android:foregroundServiceType="specialUse"
            android:exported="false">
            <property 
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE" 
                android:value="Game optimization booster dynamic monitoring for lower active latency" />
        </service>

    </application>
</manifest>`
  },
  {
    name: 'UsageRepo.kt',
    path: 'app/src/main/kotlin/com/mlbooster/data/repository/UsageRepo.kt',
    language: 'kotlin',
    content: `package com.mlbooster.data.repository

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import android.os.Process

class UsageRepo(private val context: Context) {
    private val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    /**
     * Memeriksa apakah ijin READ_APP_USAGE sudah diberikan oleh pemain.
     */
    fun hasUsagePermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    /**
     * Memeriksa apakah Mobile Legends (com.mobile.legends) sedang aktif di layar depan (foreground).
     */
    fun isMobileLegendsForeground(): Boolean {
        if (!hasUsagePermission()) return false
        
        val endTime = System.currentTimeMillis()
        val startTime = endTime - 1000 * 5 // 5 detik ke belakang
        
        val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
        val event = android.app.usage.UsageEvents.Event()
        
        var lastForegroundPackage: String? = null
        
        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event)
            if (event.eventType == android.app.usage.UsageEvents.Event.ACTIVITY_RESUMED) {
                lastForegroundPackage = event.packageName
            }
        }
        
        return lastForegroundPackage == "com.mobile.legends"
    }
}`
  },
  {
    name: 'BoosterForegroundService.kt',
    path: 'app/src/main/kotlin/com/mlbooster/service/BoosterForegroundService.kt',
    language: 'kotlin',
    content: `package com.mlbooster.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.mlbooster.data.repository.UsageRepo
import java.util.Timer
import java.util.TimerTask

class BoosterForegroundService : Service() {

    private val CHANNEL_ID = "com.mlbooster.SERVICE_CHANNEL"
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
        createNotificationChannel()
        startForeground(1337, buildForegroundNotification("GAME DOSS Active - Monitoring MLBB Engine"))

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
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("GAME DOSS System Service")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.stat_sys_warning) // Gunakan logo icon yang sesuai
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Booster Service Channel",
                NotificationManager.IMPORTANCE_LOW
            )
            notificationManager?.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        monitoringTimer?.cancel()
        deactivateGameOptimizations()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`
  },
  {
    name: 'NetworkRepo.kt',
    path: 'app/src/main/kotlin/com/mlbooster/data/repository/NetworkRepo.kt',
    language: 'kotlin',
    content: `package com.mlbooster.data.repository

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import java.io.IOException
import java.net.InetSocketAddress
import java.net.Socket

class NetworkRepo(private val context: Context) {
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    /**
     * Membaca tipe jaringan aktif. Mengembalikan "WIFI", "MOKEL_CELLULAR", atau "UNKNOWN CURRENT"
     */
    fun getActiveNetworkType(): String {
        val activeNetwork = connectivityManager.activeNetwork ?: return "NO CONNECTION"
        val caps = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return "NO CONNECTION"
        
        return when {
            caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "WIFI (High Speed)"
            caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "CELLULAR (LTE/5G)"
            caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "ETHERNET"
            else -> "UNKNOWN INTERNET"
        }
    }

    /**
     * Melakukan pengukuran PING NYATA TANPA MATH.RANDOM ke server game regional (singapore/indonesia).
     * Melakukan koneksi TCP Socket handshake ringan ke alamat IP MLBB gateway.
     */
    fun measureRealPingToMLServer(host: String = "109.244.60.1", port: Int = 80, timeoutMs: Int = 1000): Int {
        val startTime = System.currentTimeMillis()
        var socket: Socket? = null
        return try {
            socket = Socket()
            // Mengukur durasi koneksi socket linear murni
            socket.connect(InetSocketAddress(host, port), timeoutMs)
            val diff = (System.currentTimeMillis() - startTime).toInt()
            if (diff == 0) 1 else diff
        } catch (e: IOException) {
            -1 // Timeout/Gagal ping (Mengindikasikan packet loss 100% atau firewall port gantry)
        } finally {
            try {
                socket?.close()
            } catch (e: Exception) { }
        }
    }
}`
  },
  {
    name: 'SystemStatsReader.kt',
    path: 'app/src/main/kotlin/com/mlbooster/utils/SystemStatsReader.kt',
    language: 'kotlin',
    content: `package com.mlbooster.utils

import android.app.ActivityManager
import android.content.Context
import java.io.RandomAccessFile

class SystemStatsReader(private val context: Context) {

    /**
     * Mengukur utilisasi RAM perangkat secara real tanpa data simulasi.
     * Mengembalikan pair of (RAM Terpakai Mb, Total RAM Mb).
     */
    fun getRealRamUsage(): Pair<Long, Long> {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memoryInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memoryInfo)
        
        val totalRamMb = memoryInfo.totalMem / (1024 * 1024)
        val availableRamMb = memoryInfo.availMem / (1024 * 1024)
        val usedRamMb = totalRamMb - availableRamMb
        
        return Pair(usedRamMb, totalRamMb)
    }

    /**
     * Mengukur utilisasi CPU melalui pembacaan /proc/stat.
     * CATATAN ARSITEK: Pada Android 10+, SELinux membatasi akses ke file ini.
     * Jika terjadi Security/Access Exception, model mendeteksi limitasi dan mengembalikan data -1
     * (menggunakan real API tanpa random buffer).
     */
    fun getCpuUsageReal(): Double {
        return try {
            val reader = RandomAccessFile("/proc/stat", "r")
            val load = reader.readLine() // Format baris CPU: cpu 47025 102 12053 52108 ...
            reader.close()
            
            val toks = load.split("\\s+".toRegex())
            if (toks.size >= 5) {
                val idle1 = toks[4].toLong()
                val cpu1 = toks[1].toLong() + toks[2].toLong() + toks[3].toLong() + toks[6].toLong() + toks[7].toLong() + toks[8].toLong()
                
                // Tidur sejenak untuk interval sampling
                Thread.sleep(150)
                
                val reader2 = RandomAccessFile("/proc/stat", "r")
                val load2 = reader2.readLine()
                reader2.close()
                
                val toks2 = load2.split("\\s+".toRegex())
                val idle2 = toks2[4].toLong()
                val cpu2 = toks2[1].toLong() + toks2[2].toLong() + toks2[3].toLong() + toks2[6].toLong() + toks2[7].toLong() + toks2[8].toLong()
                
                val totalCpu = cpu2 - cpu1
                val totalIdle = idle2 - idle1
                val total = totalCpu + totalIdle
                
                if (total > 0) {
                    (totalCpu.toDouble() / total.toDouble()) * 100.0
                } else {
                    0.0
                }
            } else {
                -1.0
            }
        } catch (ex: Exception) {
            // Android 10+ SELinux menghentikan ini secara default.
            // Mengembalikan -1.0 menandakan deteksi pembatasan sistem operasi Android riil, tidak disimulasi.
            -1.0
        }
    }
}`
  },
  {
    name: 'BatteryRepo.kt',
    path: 'app/src/main/kotlin/com/mlbooster/data/repository/BatteryRepo.kt',
    language: 'kotlin',
    content: `package com.mlbooster.data.repository

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager

class BatteryRepo(private val context: Context) {

    /**
     * Mengambil telemetry status baterai nyata dan suhu internal sel baterai.
     * Suhu baterai di Android berformat Int (342 berarti 34.2 derajat Celcius).
     */
    fun getBatteryMetrics(): BatteryStatsSummary {
        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus = context.registerReceiver(null, filter)
        
        val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val percent = if (level >= 0 && scale > 0) {
            (level.toFloat() / scale.toFloat()) * 100f
        } else {
            -1f
        }
        
        val rawTemp = batteryStatus?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0
        val actualTempCelsius = rawTemp / 10.0 // Konversi ke derajat Celsius murni

        val status = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL

        return BatteryStatsSummary(
            percentage = percent,
            temperature = actualTempCelsius,
            isCharging = isCharging
        )
    }
}

data class BatteryStatsSummary(
    val percentage: Float,
    val temperature: Double,
    val isCharging: Boolean
)`
  },
  {
    name: 'StorageRepo.kt',
    path: 'app/src/main/kotlin/com/mlbooster/data/repository/StorageRepo.kt',
    language: 'kotlin',
    content: `package com.mlbooster.data.repository

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.StatFs
import android.provider.Settings
import java.io.File

class StorageRepo(private val context: Context) {

    /**
     * Membaca total sisa penyimpanan internal yang tersedia (Bytes).
     */
    fun getFreeSpaceBytes(): Long {
        val path: File = context.filesDir
        val stat = StatFs(path.path)
        val blockSize = stat.blockSizeLong
        val availableBlocks = stat.availableBlocksLong
        return availableBlocks * blockSize
    }

    /**
     * Membersihkan file cache internal milik aplikasi GAME DOSS sendiri.
     * Mengembalikan jumlah MB yang terhapus.
     */
    fun cleanAppInternalCache(): Double {
        val cacheDir = context.cacheDir
        val sizeBefore = getFolderSize(cacheDir)
        cacheDir.deleteRecursively()
        val sizeAfter = getFolderSize(cacheDir)
        return (sizeBefore - sizeAfter).toDouble() / (1024.0 * 1024.0)
    }

    /**
     * Tanpa ROOT, kita dilarang keras menghapus cache aplikasi lain (seperti Mobile Legends) secara programmatik!
     * Solusi terbaik yang REAL: Arahkan pemain secara instan ke settings detail Mobile Legends untuk menekan tombol 'Hapus Cache'.
     */
    fun launchMLDetailsSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:com.mobile.legends")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    private fun getFolderSize(file: File): Long {
        var size: Long = 0
        if (file.isDirectory) {
            val files = file.listFiles()
            if (files != null) {
                for (child in files) {
                    size += getFolderSize(child)
                }
            }
        } else {
            size = file.length()
        }
        return size
    }
}`
  }
];
