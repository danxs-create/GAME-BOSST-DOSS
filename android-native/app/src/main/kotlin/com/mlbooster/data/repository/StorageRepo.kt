package com.mlbooster.data.repository

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
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:com.mobile.legends")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Jika package tidak valid/tidak diinstall, buka settings umum aplikasi
            val intent = Intent(Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        }
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
}
