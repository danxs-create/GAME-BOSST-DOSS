package com.mlbooster.utils

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
            val load = reader.readLine() // Format baris CPU: cpu 47025 102 12053 ...
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
}
