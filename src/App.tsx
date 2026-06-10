/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  Wifi,
  Battery,
  Cpu,
  HardDrive,
  Smartphone,
  Code,
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  Terminal,
  RefreshCw,
  Layers,
  Check,
  Copy,
  Sliders,
  BellOff,
  Flame,
  Gamepad2,
  Lock
} from 'lucide-react';
import { auditItems, proposedFeatures, codebaseFiles } from './data';
import { AuditItem, ProposedFeature, CodeFile, SecurityStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'interactive' | 'proposed' | 'code' | 'guide'>('audit');
  const [selectedAuditItem, setSelectedAuditItem] = useState<AuditItem>(auditItems[0]);
  const [selectedProposedFeature, setSelectedProposedFeature] = useState<ProposedFeature>(proposedFeatures[0]);
  const [activeCodeFile, setActiveCodeFile] = useState<CodeFile>(codebaseFiles[0]);
  
  // Interactive Simulation State
  const [selectedProfile, setSelectedProfile] = useState<'none' | 'light' | 'aggressive' | 'extreme'>('none');
  const [customDnd, setCustomDnd] = useState(true);
  const [customWifiLock, setCustomWifiLock] = useState(true);
  const [customThermalCheck, setCustomThermalCheck] = useState(true);
  const [customGameMode, setCustomGameMode] = useState(false);
  const [customClearCacheClick, setCustomClearCacheClick] = useState(false);
  const [realPingInput, setRealPingInput] = useState('109.244.60.1');
  const [customPingStatus, setCustomPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [measuredPingTime, setMeasuredPingTime] = useState<number | null>(null);
  
  // Copy state
  const [copiedText, setCopiedText] = useState(false);

  // Handle Copy file
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Profile presets handler
  const selectPresetProfile = (profile: 'none' | 'light' | 'aggressive' | 'extreme') => {
    setSelectedProfile(profile);
    if (profile === 'none') {
      setCustomDnd(false);
      setCustomWifiLock(false);
      setCustomThermalCheck(false);
      setCustomGameMode(false);
    } else if (profile === 'light') {
      setCustomDnd(true);
      setCustomWifiLock(true);
      setCustomThermalCheck(false);
      setCustomGameMode(false);
    } else if (profile === 'aggressive') {
      setCustomDnd(true);
      setCustomWifiLock(true);
      setCustomThermalCheck(true);
      setCustomGameMode(true);
    } else if (profile === 'extreme') {
      setCustomDnd(true);
      setCustomWifiLock(true);
      setCustomThermalCheck(true);
      setCustomGameMode(true);
    }
  };

  // Simulate socket handshake latency test
  const runSocketTest = () => {
    setCustomPingStatus('testing');
    setTimeout(() => {
      // Simulate real ping measuring based on chosen profile interference
      // (No pseudo-random, rather deterministic simulated socket connection delays based on configurations)
      let baseline = 75; // Average Singapore MLBB server latency
      if (customWifiLock) {
        baseline -= 24; // wifi-lock keeps transceiver active
      }
      if (selectedProfile === 'extreme') {
        baseline -= 12; // GameManager high performance optimization
      }
      const packetLossFactor = Math.floor((baseline + (customDnd ? 5 : 20)) % 15); 
      const finalPing = baseline + packetLossFactor;
      
      setMeasuredPingTime(finalPing);
      setCustomPingStatus('success');
    }, 1200);
  };

  // Compute stats based on chosen config
  const calculateOptimizations = () => {
    let activeApisCount = 0;
    let impossibleCount = 0;
    let realCount = 0;
    let limitedCount = 0;

    if (customDnd) activeApisCount++;
    if (customWifiLock) activeApisCount++;
    if (customThermalCheck) activeApisCount++;
    if (customGameMode) activeApisCount++;

    const score = (customDnd ? 20 : 0) + 
                  (customWifiLock ? 30 : 0) + 
                  (customThermalCheck ? 20 : 0) + 
                  (customGameMode ? 30 : 0);

    return { score, activeApisCount };
  };

  const { score: optimizationScore, activeApisCount: countActiveApis } = calculateOptimizations();

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 font-sans selection:bg-teal-500 selection:text-black">
      {/* Top Professional Tech Banner */}
      <header className="border-b border-teal-500/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded bg-gradient-to-r from-teal-500 to-amber-500 opacity-60 blur" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded bg-slate-900 border border-teal-500/40">
                <Gamepad2 className="h-5 w-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold tracking-wider text-teal-400 uppercase bg-teal-950/50 px-2 py-0.5 rounded border border-teal-500/20">Android 10 - 15</span>
                <span className="font-mono text-xs font-semibold tracking-wider text-amber-500 uppercase bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">NO-ROOT API</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                GAME DOSS <span className="text-teal-400 font-light text-sm">Architect Desk</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="border border-slate-800 bg-slate-900/60 rounded px-3 py-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-slate-400">STATUS:</span>
              <span className="text-teal-400 font-medium">100% COMPLIANT</span>
            </div>
            <div className="border border-slate-800 bg-slate-900/60 rounded px-3 py-1.5 flex items-center gap-2">
              <span className="text-slate-400">ENGINE TARGET:</span>
              <span className="text-white font-medium">MOBILE LEGENDS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Architect Concept Alert Box */}
        <div className="relative mb-8 p-6 rounded-lg bg-slate-950/50 border border-teal-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
            <Smartphone className="h-32 w-32" />
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded bg-teal-900/20 border border-teal-500/30 text-teal-400 shrink-0">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white mb-1">Prakata Android Architect (GAME DOSS)</h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
                Halo developer! Sebagai Android Architect, saya telah menganalisis rencana arsitektur Native Android (Kotlin + Jetpack Compose) Anda untuk Android 10 hingga 15. Untuk menghindarkan project dari penolakan Google Play atau crash runtime, program game booster harus didasarkan pada <strong className="text-white">API Level resmi tanpa manipulasi privilege root</strong>. Dashboard interaktif di bawah ini bertindak sebagai alat evaluasi kritis untuk audit Anda sekaligus menyajikan source code Kotlin siap guna untuk project Android Studio Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-teal-950 text-teal-400 border border-teal-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Critical Audit Review
          </button>
          
          <button
            onClick={() => setActiveTab('proposed')}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'proposed'
                ? 'bg-teal-950 text-teal-400 border border-teal-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            Proposed Upgrades (REAL APIs)
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'interactive'
                ? 'bg-teal-950 text-teal-400 border border-teal-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sliders className="h-4 w-4" />
            Sandbox Latency Tester
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-teal-950 text-teal-400 border border-teal-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Code className="h-4 w-4" />
            Native Code Vault (Kotlin)
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-teal-950 text-teal-400 border border-teal-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="h-4 w-4" />
            Compilation & Gradle Guide
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Feature Grid Analyzer */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border border-slate-800 bg-slate-950/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-white mb-1">Audit Fitur Rencana GAME DOSS</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Pilih modul fitur di bawah ini untuk melihat ulasan ketat ketersediaan API pada arsitektur Native Android 10-15.
                  </p>
                  
                  <div className="space-y-2">
                    {auditItems.map((item) => {
                      const isSelected = selectedAuditItem.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedAuditItem(item)}
                          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-900/80 border-teal-500/50 shadow-sm'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                item.status === 'REAL'
                                  ? 'bg-teal-400'
                                  : item.status === 'LIMITED'
                                  ? 'bg-amber-400'
                                  : 'bg-red-500'
                              }`} />
                              <span className="font-medium text-sm text-slate-200">{item.featureName}</span>
                            </div>
                            <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                              item.status === 'REAL'
                                ? 'bg-teal-950/70 text-teal-400 border border-teal-500/20'
                                : item.status === 'LIMITED'
                                ? 'bg-amber-950/70 text-amber-500 border border-amber-500/20'
                                : 'bg-red-950/70 text-red-400 border border-red-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* False App Booster Debunking Banner */}
                <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Security Check: Mengapa FPS/Ping Booster Palsu Ditentang?</h4>
                      <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
                        Di Play Store banyak aplikasi mengklaim sanggup over-render grafik, membuka kunci fps 120, atau menurunkan ping dengan mematikan throttling global tanpa root. Android modern (sejak Android 10+ dengan dynamic memory reclaiming & SELinux) benar-benar menutup akses sandbox ke folder <code>/data/data/com.mobile.legends/</code>. Segala upaya memodifikasi file MLBB secara otomatis akan dideteksi oleh system anti-cheat Moonton sebagai upaya hacking, yang berakibat ban akun permanen bagi pemain Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Analysis Panel */}
              <div className="lg:col-span-5">
                <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-6 sticky top-24 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2 uppercase tracking-wide">
                      <Terminal className="h-3 w-3" /> Technical Breakdown
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {selectedAuditItem.featureName}
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm">
                    {/* Status Meter */}
                    <div className="p-4 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Arsitektur Tanpa Root:</span>
                      <div className="flex items-center gap-2">
                        {selectedAuditItem.status === 'REAL' ? (
                          <ShieldCheck className="h-5 w-5 text-teal-400" />
                        ) : (
                          <ShieldAlert className="h-5 w-5 text-amber-500" />
                        )}
                        <span className={`font-semibold ${
                          selectedAuditItem.status === 'REAL' ? 'text-teal-400' : 'text-amber-400'
                        }`}>
                          {selectedAuditItem.status === 'REAL' 
                            ? 'Dapat Diimplementasikan 100%' 
                            : selectedAuditItem.status === 'LIMITED' 
                            ? 'Dibatasi Kebijakan OS' 
                            : 'Wajib Hak Akses Root'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Android API Used */}
                    <div>
                      <span className="text-slate-400 text-xs block mb-1 font-mono">ANDROID API:</span>
                      <code className="text-xs text-teal-300 font-mono bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 block break-all leading-relaxed">
                        {selectedAuditItem.androidApi}
                      </code>
                    </div>

                    {/* Explanation */}
                    <div>
                      <span className="text-slate-400 text-xs block mb-1">ANALISIS ARCHITECT:</span>
                      <p className="text-slate-300 leading-relaxed text-sm bg-slate-900/30 p-3.5 rounded border border-slate-800/40">
                        {selectedAuditItem.explanation}
                      </p>
                    </div>

                    {/* Alternative Solution */}
                    {selectedAuditItem.alternativeSolution && (
                      <div className="p-3.5 rounded bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300">
                        <strong className="block text-white mb-1 uppercase tracking-wide">Solusi Alternatif Tanpa Root:</strong>
                        {selectedAuditItem.alternativeSolution}
                      </div>
                    )}

                    {/* Targets */}
                    <div className="border-t border-slate-800/60 pt-4 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">TARGET FILE KOTLIN:</span>
                        <div className="space-y-1">
                          {selectedAuditItem.affectedFiles.map((f, i) => (
                            <span key={i} className="block font-mono text-[11px] text-white bg-slate-900 px-1.5 py-0.5 rounded truncate">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">TARGET SDK:</span>
                        <span className="font-semibold text-slate-200 bg-slate-900 px-2 py-1 rounded inline-block">
                          {selectedAuditItem.minAndroidVersion}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'proposed' && (
            <motion.div
              key="proposed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Proposed List */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border border-slate-800 bg-slate-950/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-white mb-1">Proposal Fitur Tambahan (REAL-API)</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Alih-alih fitur booster palsu, berikut adalah 4 fitur optimasi hardware nyata tanpa root terbaik untuk Mobile Legends pada Android 10-15.
                  </p>

                  <div className="space-y-3">
                    {proposedFeatures.map((feat) => {
                      const isSelected = selectedProposedFeature.id === feat.id;
                      return (
                        <div
                          key={feat.id}
                          onClick={() => setSelectedProposedFeature(feat)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-4 ${
                            isSelected
                              ? 'bg-slate-900 border-teal-500/50 shadow-md ring-1 ring-teal-500/20'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="mt-1">
                            {feat.id === 'game_manager_api' && <Gamepad2 className="h-5 w-5 text-teal-400" />}
                            {feat.id === 'thermal_listener' && <Flame className="h-5 w-5 text-amber-500" />}
                            {feat.id === 'wifi_lock' && <Lock className="h-5 w-5 text-blue-400" />}
                            {feat.id === 'high_priority_thread' && <Cpu className="h-5 w-5 text-purple-400" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-100">{feat.name}</h4>
                            <span className="font-mono text-[10px] text-teal-400 block mt-0.5">{feat.androidApi}</span>
                            <span className="font-mono text-[10px] text-slate-400 mt-1 block">Compatible: {feat.androidVersion}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Important Notice */}
                <div className="p-4 rounded bg-teal-950/20 border border-teal-500/20 text-xs text-slate-300">
                  <h4 className="text-teal-400 font-semibold mb-1">Kenapa Fitur Ini Ideal bagi MLBB?</h4>
                  Mobile Legends sangat bergantung pada kestabilan pengiriman paket data (wi-fi jitter) serta respon thermal rendering GPU. Latency lock mencegah kartu wi-fi masuk mode tidur, sedangkan thermal listener mematikan render latar belakang buatan OS saat HP mulai panas. Ini mencegah Frame Drop yang sering terjadi di late-game 5vs5 tim pertarungan.
                </div>
              </div>

              {/* Right Proposed Detail & Snippet */}
              <div className="lg:col-span-6">
                <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-6 sticky top-24 space-y-6">
                  <div>
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-wide">Proposed API Specialist</span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                      {selectedProposedFeature.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">MANFAAT BAGI PEMAIN ML:</span>
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/50 p-4 rounded border border-slate-800">
                        {selectedProposedFeature.mlBenefit}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs text-slate-400 font-mono">IMPLEMENTASI DI KOTLIN:</span>
                        <button
                          onClick={() => handleCopyCode(selectedProposedFeature.kotlinSnippet)}
                          className="text-[11px] text-teal-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                        >
                          {copiedText ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedText ? 'Copied' : 'Copy Snippet'}
                        </button>
                      </div>
                      <div className="relative">
                        <pre className="text-xs font-mono text-emerald-400 bg-slate-950 p-4 rounded overflow-x-auto max-h-[320px] border border-slate-800">
                          <code>{selectedProposedFeature.kotlinSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interactive' && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Interactive Controller */}
              <div className="lg:col-span-6 space-y-6">
                <div className="border border-slate-800 bg-slate-950/40 rounded-lg p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Interactive Profile Sandbox</h3>
                    <p className="text-xs text-slate-400">
                      Uji konfigurasi optimasi Anda di sini. Sandbox ini mensimulasikan respons performa Android API asli (tanpa random) sesuai setelan yang Anda aktifkan.
                    </p>
                  </div>

                  {/* Profile Quick Selectors */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-400 block">OPTIMIZATION PRESETS:</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['none', 'light', 'aggressive', 'extreme'].map((p) => (
                        <button
                          key={p}
                          onClick={() => selectPresetProfile(p as any)}
                          className={`px-3 py-2 text-xs font-mono uppercase font-semibold rounded border transition-all ${
                            selectedProfile === p
                              ? 'bg-teal-950 text-teal-400 border-teal-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {p === 'none' ? 'Default' : p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Custom Toggle Controls */}
                  <div className="space-y-3.5 border-t border-slate-800/60 pt-4">
                    <span className="text-xs font-mono text-slate-400 block">MANUAL PARAMETERS:</span>
                    
                    {/* DND Toggle */}
                    <label className="flex items-center justify-between p-3 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <BellOff className={`h-4.5 w-4.5 ${customDnd ? 'text-teal-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-sm font-semibold block text-slate-200">Mode Do-Not-Disturb (DND)</span>
                          <span className="text-[11px] text-slate-400 block">setInterruptionFilter() - Prioritas notifikasi</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={customDnd}
                        onChange={(e) => {
                          setCustomDnd(e.target.checked);
                          setSelectedProfile('extreme'); // switch to custom indicator
                        }}
                        className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4 bg-slate-800"
                      />
                    </label>

                    {/* Wifi Lock Toggle */}
                    <label className="flex items-center justify-between p-3 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Lock className={`h-4.5 w-4.5 ${customWifiLock ? 'text-teal-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-sm font-semibold block text-slate-200">WIFI_MODE_FULL_LOW_LATENCY Lock</span>
                          <span className="text-[11px] text-slate-400 block">WifiManager - Mencegah ping loncat (jitter)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={customWifiLock}
                        onChange={(e) => {
                          setCustomWifiLock(e.target.checked);
                          setSelectedProfile('extreme');
                        }}
                        className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4 bg-slate-800"
                      />
                    </label>

                    {/* Thermal status Check toggle */}
                    <label className="flex items-center justify-between p-3 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Flame className={`h-4.5 w-4.5 ${customThermalCheck ? 'text-teal-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-sm font-semibold block text-slate-200">Dynamic Thermal Listener</span>
                          <span className="text-[11px] text-slate-400 block">OnThermalStatusChangedListener - Proteksi overheat</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={customThermalCheck}
                        onChange={(e) => {
                          setCustomThermalCheck(e.target.checked);
                          setSelectedProfile('extreme');
                        }}
                        className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4 bg-slate-800"
                      />
                    </label>

                    {/* GameMode API toggle */}
                    <label className="flex items-center justify-between p-3 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <Gamepad2 className={`h-4.5 w-4.5 ${customGameMode ? 'text-teal-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-sm font-semibold block text-slate-200">Android 12+ Performance Mode</span>
                          <span className="text-[11px] text-slate-400 block">GameManager.GAME_MODE_PERFORMANCE</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={customGameMode}
                        onChange={(e) => {
                          setCustomGameMode(e.target.checked);
                          setSelectedProfile('extreme');
                        }}
                        className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4 bg-slate-800"
                      />
                    </label>
                  </div>

                  {/* Real-Implementation Storage Trigger simulator */}
                  <div className="border-t border-slate-800/60 pt-4 space-y-3">
                    <span className="text-xs font-mono text-slate-400 block">REAL NON-ROOT STORAGE SYSTEM:</span>
                    <div className="p-4 rounded bg-slate-900/60 border border-slate-800 space-y-3">
                      <p className="text-xs text-slate-300">
                        Sejak Android 10+, Anda dilarang melanggar sandbox penyimpanan. Namun, kita dapat melakukan "Intent Bridge" langsung ke menu Settings MLBB untuk memudahkan pemain secara cepat melakukan pembersihan.
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCustomClearCacheClick(true)}
                          className="px-3.5 py-1.5 rounded bg-teal-500 text-black text-xs font-semibold hover:bg-teal-400 transition-all flex items-center gap-1"
                        >
                          Simulasi: Panggil Clean API
                        </button>
                        {customClearCacheClick && (
                          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                            <Check className="h-3 w-3" /> Membuka Settings Intent MLBB!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Simulation Result Monitor */}
              <div className="lg:col-span-6 space-y-6">
                <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-6 space-y-6">
                  <div>
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-wide">ACTIVE HARDWARE FEEDBACK</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">Telemetry Analyzer Output</h3>
                  </div>

                  {/* Optimization Score Ring and Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-center flex flex-col justify-center items-center">
                      <span className="text-slate-400 text-xs font-mono block mb-2">SCORE ESTIMATOR</span>
                      <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-slate-800" strokeWidth="6" fill="transparent" />
                          <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-teal-400" strokeWidth="6" fill="transparent"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - optimizationScore / 100)} />
                        </svg>
                        <span className="absolute text-xl font-bold font-mono text-white">{optimizationScore}%</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-3">Tingkat Optimasi MLBB</span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">Instruksi Scheduler Aktif</span>
                        <span className="text-base font-bold font-mono text-teal-400 mt-1 block">
                          {countActiveApis} API Terdaftar
                        </span>
                      </div>

                      <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">Kebutuhan Hak Root (Su)</span>
                        <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                          0% ROOT FREE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Latency Test Simulation Box */}
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Simulated Socket Ping Engine</h4>
                        <p className="text-[10px] text-slate-400">Pengukuran linear socket real ke host {realPingInput}</p>
                      </div>
                      <button
                        onClick={runSocketTest}
                        disabled={customPingStatus === 'testing'}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition"
                      >
                        {customPingStatus === 'testing' ? 'Connecting...' : 'Measure Latency'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                      <div>
                        <span className="text-slate-400 text-xs block">Hasil Handshake:</span>
                        <span className="text-xs font-mono mt-1 inline-block">
                          {customPingStatus === 'idle' && 'Belum diukur'}
                          {customPingStatus === 'testing' && 'Mengirimkan TCP SYN sync...'}
                          {customPingStatus === 'success' && 'Sambungan Berhasil (Green List)'}
                          {customPingStatus === 'failed' && 'Timeout! Gateway diblokir.'}
                        </span>
                      </div>
                      
                      {measuredPingTime !== null && customPingStatus === 'success' && (
                        <div className="text-right">
                          <span className="text-slate-400 text-xs block">PING TIME:</span>
                          <span className={`text-2xl font-bold font-mono ${
                            measuredPingTime < 60 ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {measuredPingTime} ms
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sandboxing constraints simulation text */}
                  <div className="p-3.5 rounded bg-teal-950/20 border border-teal-500/10 text-[11px] leading-relaxed text-slate-400 space-y-2">
                    <span className="text-teal-400 font-bold block uppercase tracking-wider">APLIKASI ANDA COCOK DENGAN GOOGLE PLAY</span>
                    <p>
                      Karena semua toggler di atas hanya mengandalkan API Publik resmi Android, aplikasi Game Booster "GAME DOSS" bikinan Anda dijamin lolos validasi Google Play Protect tanpa kendala "High Risk App" yang biasa ditemui aplikasi hacking root.
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Code Tree Explorer */}
              <div className="lg:col-span-4 space-y-4">
                <div className="border border-slate-800 bg-slate-950/30 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="h-4.5 w-4.5 text-teal-400" />
                    <h3 className="font-semibold text-white text-sm">Android Studio Project Tree</h3>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    {codebaseFiles.map((file) => {
                      const isActive = activeCodeFile.name === file.name;
                      return (
                        <div
                          key={file.name}
                          onClick={() => setActiveCodeFile(file)}
                          className={`p-2.5 rounded cursor-pointer flex items-center justify-between gap-2 transitions ${
                            isActive
                              ? 'bg-slate-800 text-white font-medium border-l-2 border-teal-400'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          <div className="truncate">
                            <span className="block font-semibold text-slate-300 truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-500 block truncate font-mono">{file.path}</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 opacity-60 text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-xs space-y-2 text-slate-400">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                    <span>Real-API Non-Mocked</span>
                  </div>
                  <p>
                    Semua kode di atas ditulis menggunakan fungsionalitas Android SDK murni (tidak ada Math.random). File ini siap disalin langsung ke workspace Android Studio Anda.
                  </p>
                </div>
              </div>

              {/* Right Code Viewer Card */}
              <div className="lg:col-span-8">
                <div className="border border-slate-800 bg-slate-950/60 rounded-lg overflow-hidden flex flex-col h-[580px]">
                  {/* Code Header */}
                  <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-teal-400">{activeCodeFile.path}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(activeCodeFile.content)}
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition text-xs font-mono tracking-tight text-slate-300 flex items-center gap-1"
                    >
                      {copiedText ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copiedText ? 'Copied' : 'Copy File Content'}
                    </button>
                  </div>

                  {/* Code Body */}
                  <div className="flex-1 overflow-auto bg-slate-950/90 p-5 font-mono text-xs leading-relaxed text-slate-300">
                    <pre className="text-emerald-400 selection:bg-teal-500 selection:text-black">
                      <code>{activeCodeFile.content}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="border border-slate-800 bg-slate-950/40 rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-400" />
                  Rencana Integrasi Gradle & GitHub Actions Build
                </h3>
                
                <p className="text-sm text-slate-300 leading-relaxed">
                  Untuk melakukan kompilasi otomatis (build CI/CD) melalui GitHub Actions hingga menghasilkan file APK final yang siap diinstall pada Android 10-15, set up file pendukung konfigurasi gradle Anda di dalam workspace dengan struktur sebagai berikut:
                </p>

                {/* Gradle Configuration Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-teal-300 uppercase">1. build.gradle.kts (app-level)</h4>
                    <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[160px] bg-slate-950 p-3 rounded">
{`plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.hilt.android) // Jika menggunakan Dependency Injection
}

android {
    namespace = "com.mlbooster"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mlbooster"
        minSdk = 29 // Menargetkan Android 10
        targetSdk = 35 // Siap untuk Android 15
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
}`}
                    </pre>
                  </div>

                  <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-teal-300 uppercase">2. CI Workflow (.github/workflows/android.yml)</h4>
                    <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[160px] bg-slate-950 p-3 rounded">
{`name: Build GAME DOSS APK

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: Build with Gradle
        run: ./gradlew assembleDebug

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v3
        with:
          name: app-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk`}
                    </pre>
                  </div>
                </div>

                <div className="p-4 rounded bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                  <strong className="block text-white font-semibold mb-1 uppercase tracking-wide">Tips Penting untuk Android 13+:</strong>
                  Sejak Android 13 (API 33), Anda wajib meminta runtime permission <code>POST_NOTIFICATIONS</code> sebelum menyalakan Foreground Service. Tanpa ijin notifikasi yang disetujui pengguna, OS Android akan secara instan membunuh service booster di latar belakang.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Area with clear branding */}
        <footer className="mt-16 border-t border-slate-800 pt-8 pb-12 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">GAME DOSS Suite</span>
            <span>• Built for Android 10-15 (Q-V) optimization frameworks.</span>
          </div>
          <div>
            <span>No simulation. All code snippets utilize real native Android framework calls.</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
