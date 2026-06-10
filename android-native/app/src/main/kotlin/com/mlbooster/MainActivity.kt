package com.mlbooster

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mlbooster.data.repository.BatteryRepo
import com.mlbooster.data.repository.NetworkRepo
import com.mlbooster.data.repository.StorageRepo
import com.mlbooster.data.repository.UsageRepo
import com.mlbooster.service.BoosterForegroundService
import com.mlbooster.utils.SystemStatsReader

class MainActivity : ComponentActivity() {

    private lateinit var batteryRepo: BatteryRepo
    private lateinit var networkRepo: NetworkRepo
    private lateinit var storageRepo: StorageRepo
    private lateinit var usageRepo: UsageRepo
    private lateinit var systemStatsReader: SystemStatsReader

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        batteryRepo = BatteryRepo(this)
        networkRepo = NetworkRepo(this)
        storageRepo = StorageRepo(this)
        usageRepo = UsageRepo(this)
        systemStatsReader = SystemStatsReader(this)

        setContent {
            var activeTab by remember { mutableStateOf("dashboard") }
            
            // Dynamic Stats States
            var batteryTemp by remember { mutableStateOf(0.0) }
            var batteryLevel by remember { mutableStateOf(0f) }
            var isCharging by remember { mutableStateOf(false) }
            var networkType by remember { mutableStateOf("DETECTING...") }
            var pingResult by remember { mutableStateOf(0) }
            var freeStorageGb by remember { mutableStateOf(0.0) }
            var ramUsedMb by remember { mutableStateOf(0L) }
            var ramTotalMb by remember { mutableStateOf(0L) }
            var cpuUsage by remember { mutableStateOf(0.0) }
            var hasUsagePermission by remember { mutableStateOf(false) }
            var isMonitoringRunning by remember { mutableStateOf(false) }

            var showWifiToDataAlert by remember { mutableStateOf(false) }
            var lastWifiToDataAlertTime by remember { mutableStateOf("") }

            DisposableEffect(Unit) {
                networkRepo.startMonitoring(
                    onWifiToDataSwitch = {
                        val currentTime = java.text.SimpleDateFormat(
                            "HH:mm:ss", 
                            java.util.Locale.getDefault()
                        ).format(java.util.Date())
                        lastWifiToDataAlertTime = currentTime
                        showWifiToDataAlert = true
                    },
                    onNetworkTypeChanged = { newType ->
                        networkType = newType
                    }
                )
                onDispose {
                    networkRepo.stopMonitoring()
                }
            }

            // Fetch metrics
            LaunchedEffect(Unit) {
                while(true) {
                    val battery = batteryRepo.getBatteryMetrics()
                    batteryTemp = battery.temperature
                    batteryLevel = battery.percentage
                    isCharging = battery.isCharging

                    pingResult = networkRepo.measureRealPingToMLServer("109.244.60.1", 80, 800)

                    val spaceBytes = storageRepo.getFreeSpaceBytes()
                    freeStorageGb = spaceBytes.toDouble() / (1024.0 * 1024.0 * 1024.0)

                    val ramPair = systemStatsReader.getRealRamUsage()
                    ramUsedMb = ramPair.first
                    ramTotalMb = ramPair.second

                    cpuUsage = systemStatsReader.getCpuUsageReal()
                    hasUsagePermission = usageRepo.hasUsagePermission()
                    
                    kotlinx.coroutines.delay(2500)
                }
            }

            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFF00BFA5),
                    background = Color(0xFF090B11),
                    surface = Color(0xFF131722),
                    onBackground = Color(0xFFE2E8F0),
                    onSurface = Color(0xFFF1F5F9)
                )
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Header panel
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFF030508))
                                .padding(horizontal = 20.dp, vertical = 18.dp)
                        ) {
                            Column {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = "GAME DOSS",
                                        fontWeight = FontWeight.ExtraBold,
                                        fontSize = 20.sp,
                                        color = Color(0xFF00BFA5)
                                    )
                                    Text(
                                        text = "ANDROID 10-15 READY",
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 11.sp,
                                        color = Color(0xFFFF9100),
                                        modifier = Modifier
                                            .background(Color(0xFF2C1A04), RoundedCornerShape(4.dp))
                                            .padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }
                                Text(
                                    text = "Mobile Legends Native Architecture Console",
                                    fontSize = 12.sp,
                                    color = Color.Gray,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }

                        // Tab navigation bar
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFF030508))
                                .padding(horizontal = 10.dp, vertical = 2.dp),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            TabButton("DASHBOARD", activeTab == "dashboard") { activeTab = "dashboard" }
                            TabButton("OPTIMIZER", activeTab == "optimizer") { activeTab = "optimizer" }
                            TabButton("PERMISSIONS", activeTab == "permissions") { activeTab = "permissions" }
                        }

                        if (showWifiToDataAlert) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 8.dp)
                                    .background(Color(0xFF2C1014), RoundedCornerShape(8.dp))
                                    .border(1.5.dp, Color(0xFFFF1744), RoundedCornerShape(8.dp))
                                    .clip(RoundedCornerShape(8.dp))
                                    .padding(14.dp)
                            ) {
                                Column {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(
                                                imageVector = Icons.Default.Warning,
                                                contentDescription = "Warning",
                                                tint = Color(0xFFFF1744),
                                                modifier = Modifier.size(20.dp)
                                            )
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Text(
                                                text = "JARINGAN BERPINDAH KE MOBILE DATA!",
                                                fontWeight = FontWeight.Bold,
                                                color = Color(0xFFFF5252),
                                                fontSize = 12.sp,
                                                fontFamily = FontFamily.Monospace
                                            )
                                        }
                                        Icon(
                                            imageVector = Icons.Default.Close,
                                            contentDescription = "Close Alert",
                                            tint = Color.Gray,
                                            modifier = Modifier
                                                .size(18.dp)
                                                .clickable { showWifiToDataAlert = false }
                                        )
                                    }
                                    Text(
                                        text = "Koneksi beralih dari Wi-Fi ke Seluler pada jam $lastWifiToDataAlertTime. Harap siaga terhadap lonjakan PING secara tiba-tiba dalam game Mobile Legends!",
                                        fontSize = 11.sp,
                                        color = Color(0xFFFCA5A5),
                                        modifier = Modifier.padding(top = 4.dp)
                                    )
                                }
                            }
                        }

                        // Main view area
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth()
                                .padding(16.dp)
                                .verticalScroll(rememberScrollState())
                        ) {
                            when (activeTab) {
                                "dashboard" -> {
                                    DashboardScreen(
                                        batteryTemp = batteryTemp,
                                        batteryLevel = batteryLevel,
                                        isCharging = isCharging,
                                        networkType = networkType,
                                        pingResult = pingResult,
                                        freeStorageGb = freeStorageGb,
                                        ramUsedMb = ramUsedMb,
                                        ramTotalMb = ramTotalMb,
                                        cpuUsage = cpuUsage
                                    )
                                }
                                "optimizer" -> {
                                    OptimizerScreen(
                                        isMonitoring = isMonitoringRunning,
                                        onToggleService = {
                                            isMonitoringRunning = !isMonitoringRunning
                                            if (isMonitoringRunning) {
                                                val intent = Intent(this@MainActivity, BoosterForegroundService::class.java)
                                                startService(intent)
                                            } else {
                                                val intent = Intent(this@MainActivity, BoosterForegroundService::class.java)
                                                stopService(intent)
                                            }
                                        },
                                        onCleanCache = {
                                            storageRepo.cleanAppInternalCache()
                                        },
                                        onMLSettings = {
                                            storageRepo.launchMLDetailsSettings()
                                        }
                                    )
                                }
                                "permissions" -> {
                                    PermissionsScreen(
                                        hasUsage = hasUsagePermission,
                                        onRequestUsage = {
                                            val intent = Intent(android.provider.Settings.ACTION_USAGE_ACCESS_SETTINGS)
                                            startActivity(intent)
                                        },
                                        onRequestDnd = {
                                            val intent = Intent(android.provider.Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS)
                                            startActivity(intent)
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TabButton(text: String, isActive: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 10.dp)
            .border(
                width = 1.dp,
                color = if (isActive) Color(0xFF00BFA5) else Color.Transparent,
                shape = RoundedCornerShape(4.dp)
            )
            .padding(horizontal = 8.dp, vertical = 2.dp)
    ) {
        Text(
            text = text,
            color = if (isActive) Color(0xFF00BFA5) else Color(0xFF94A3B8),
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
fun DashboardScreen(
    batteryTemp: Double,
    batteryLevel: Float,
    isCharging: Boolean,
    networkType: String,
    pingResult: Int,
    freeStorageGb: Double,
    ramUsedMb: Long,
    ramTotalMb: Long,
    cpuUsage: Double
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(
            text = "TELEMETRI HARDWARE REAL-TIME",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF00BFA5),
            fontFamily = FontFamily.Monospace
        )

        // Row of Ping and Status
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .background(Color(0xFF131722))
                    .border(1.dp, Color(0xFF23293F), RoundedCornerShape(8.dp))
                    .padding(14.dp)
            ) {
                Column {
                    Text("TCP Handshake Ping", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        text = if (pingResult > 0) "$pingResult ms" else "ERR/TMO",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (pingResult > 0 && pingResult < 80) Color(0xFF00E676) else Color(0xFFFF1744),
                        fontFamily = FontFamily.Monospace
                    )
                    Text("Server Singapore MLBB IP", fontSize = 10.sp, color = Color.DarkGray)
                }
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .background(Color(0xFF131722))
                    .border(1.dp, Color(0xFF23293F), RoundedCornerShape(8.dp))
                    .padding(14.dp)
            ) {
                Column {
                    Text("Jaringan Terdeteksi", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        text = networkType,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text("Auto monitoring enabled", fontSize = 10.sp, color = Color.DarkGray)
                }
            }
        }

        // Stats rows
        DashboardMetricsCard("Battery Temperature", String.format("%.1f°C", batteryTemp), if (batteryTemp > 38.0) Color(0xFFFF5252) else Color(0xFF00BFA5))
        DashboardMetricsCard("System RAM Memory", "$ramUsedMb MB / $ramTotalMb MB Used", Color.White)
        DashboardMetricsCard("Free Storage Space", String.format("%.2f GB Available", freeStorageGb), Color.White)
        
        DashboardMetricsCard(
            title = "Hardware CPU Load (/proc/stat)",
            value = if (cpuUsage >= 0.0) String.format("%.1f%%", cpuUsage) else "RESTRICTED (SELinux Guard)",
            color = if (cpuUsage >= 0.0) Color(0xFF00BFA5) else Color(0xFFFF9100)
        )
    }
}

@Composable
fun DashboardMetricsCard(title: String, value: String, color: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFF131722))
            .border(1.dp, Color(0xFF23293F), RoundedCornerShape(8.dp))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = title, fontSize = 13.sp, color = Color.Gray)
            Text(
                text = value,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = color,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
fun OptimizerScreen(
    isMonitoring: Boolean,
    onToggleService: () -> Unit,
    onCleanCache: () -> Unit,
    onMLSettings: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text(
            text = "MODUL OPTIMIZATION ENGINE",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF00BFA5),
            fontFamily = FontFamily.Monospace
        )

        // Foreground Service Switch
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF131722))
                .border(1.dp, Color(0xFF23293F), RoundedCornerShape(8.dp))
                .padding(18.dp)
        ) {
            Column {
                Text(
                    text = "Booster Foreground Service Monitor",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color.White
                )
                Text(
                    text = "Menjamin OS tidak membunuh background thread monitoring Anda saat Mobile Legends dimainkan secara berat.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
                )

                Button(
                    onClick = onToggleService,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isMonitoring) Color(0xFFFF1744) else Color(0xFF00BFA5)
                    ),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = if (isMonitoring) "STOP SERVICE MONITORING" else "START FOREGROUND BOOSTER",
                        fontWeight = FontWeight.Bold,
                        color = if (!isMonitoring) Color.Black else Color.White
                    )
                }
            }
        }

        // Storage Clean Advice Bridge
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF131722))
                .border(1.dp, Color(0xFF23293F), RoundedCornerShape(8.dp))
                .padding(18.dp)
        ) {
            Column {
                Text(
                    text = "Hapus Berkas Sampah Storage",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color.White
                )
                Text(
                    text = "Android menolak aplikasi booster menghapus data game MLBB secara paksa tanpa root (sandbox violation). Solusi real: tekan tombol di bawah untuk langsung menuju screen apps settings MLBB, lalu klik Hapus Cache.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onCleanCache,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Clean App Cache", color = Color.White)
                    }

                    Button(
                        onClick = onMLSettings,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00BFA5)),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Open ML Settings", color = Color.Black)
                    }
                }
            }
        }
    }
}

@Composable
fun PermissionsScreen(
    hasUsage: Boolean,
    onRequestUsage: () -> Unit,
    onRequestDnd: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text(
            text = "DOKUMENTASI KUNCI PERMISSION",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF00BFA5),
            fontFamily = FontFamily.Monospace
        )

        // Read app usage ops
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF131722))
                .border(
                    width = 1.dp,
                    color = if (hasUsage) Color(0xFF00E676) else Color(0xFFFF9100),
                    shape = RoundedCornerShape(8.dp)
                )
                .padding(18.dp)
        ) {
            Column {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("PACKAGE_USAGE_STATS", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                    Text(
                        text = if (hasUsage) "GRANTED" else "REQUIRED",
                        color = if (hasUsage) Color(0xFF00E676) else Color(0xFFFF9100),
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp
                    )
                }
                Text(
                    text = "Dibutuhkan agar booster dapat mendeteksi saat Mobile Legends dijalankan di foreground secara otomatis.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 6.dp, bottom = 12.dp)
                )

                if (!hasUsage) {
                    Button(
                        onClick = onRequestUsage,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00BFA5)),
                        shape = RoundedCornerShape(4.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Grant Usage Access", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Notification Policy DND
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF131722))
                .border(1.dp, Color(0xFF23293F), RoundedCornerShape(8.dp))
                .padding(18.dp)
        ) {
            Column {
                Text("ACCESS_NOTIFICATION_POLICY (DND)", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                Text(
                    text = "Dibutuhkan agar sistem dapat membungkam pesan masuk pengganggu secara otomatis saat Mobile Legends berjalan.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 6.dp, bottom = 12.dp)
                )

                Button(
                    onClick = onRequestDnd,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Grant DND Policy Access", color = Color.White)
                }
            }
        }
    }
}
