package com.mlbooster.data.repository

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import java.io.IOException
import java.net.InetSocketAddress
import java.net.Socket

class NetworkRepo(private val context: Context) {
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    private var onWifiToDataSwitchListener: (() -> Unit)? = null
    private var onNetworkTypeChangedListener: ((String) -> Unit)? = null
    private var lastWasWifi: Boolean? = null
    private var isCallbackRegistered = false

    private val networkCallback = object : ConnectivityManager.NetworkCallback() {
        override fun onCapabilitiesChanged(network: Network, networkCapabilities: NetworkCapabilities) {
            val isWifi = networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
            val isCellular = networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
            
            val currentType = when {
                isWifi -> "WIFI (High Speed)"
                isCellular -> "CELLULAR (LTE/5G)"
                networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "ETHERNET"
                else -> "UNKNOWN INTERNET"
            }

            onNetworkTypeChangedListener?.invoke(currentType)

            // Detect transition from Wifi to Cellular Data
            if (lastWasWifi == true && isCellular) {
                onWifiToDataSwitchListener?.invoke()
            }

            // Update state representation
            if (isWifi) {
                lastWasWifi = true
            } else if (isCellular) {
                lastWasWifi = false
            }
        }

        override fun onLost(network: Network) {
            onNetworkTypeChangedListener?.invoke("NO CONNECTION")
            lastWasWifi = null
        }
    }

    /**
     * Memulai monitoring jaringan real-time menggunakan ConnectivityManager.NetworkCallback.
     * Mencegah unexpected ping spikes di Mobile Legends dengan mendeteksi handoff interface.
     */
    fun startMonitoring(
        onWifiToDataSwitch: () -> Unit,
        onNetworkTypeChanged: (String) -> Unit
    ) {
        onWifiToDataSwitchListener = onWifiToDataSwitch
        onNetworkTypeChangedListener = onNetworkTypeChanged
        
        // Cek inisiasi pertama
        val activeNetwork = connectivityManager.activeNetwork
        val caps = connectivityManager.getNetworkCapabilities(activeNetwork)
        if (caps != null) {
            lastWasWifi = caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
        }

        if (!isCallbackRegistered) {
            try {
                connectivityManager.registerDefaultNetworkCallback(networkCallback)
                isCallbackRegistered = true
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    /**
     * Mematikan callback monitoring untuk mencegah memory leaks.
     */
    fun stopMonitoring() {
        if (isCallbackRegistered) {
            try {
                connectivityManager.unregisterNetworkCallback(networkCallback)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            isCallbackRegistered = false
        }
        onWifiToDataSwitchListener = null
        onNetworkTypeChangedListener = null
        lastWasWifi = null
    }

    /**
     * Membaca tipe jaringan aktif. Mengembalikan "WIFI", "CELLULAR", dll.
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
     * Melakukan pengukuran PING NYATA TANPA MATH.RANDOM ke server game regional (singapore).
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
            -1 // Timeout/Gagal ping
        } finally {
            try {
                socket?.close()
            } catch (e: Exception) { }
        }
    }
}
