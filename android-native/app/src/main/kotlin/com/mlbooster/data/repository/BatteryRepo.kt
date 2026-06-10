package com.mlbooster.data.repository

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
)
