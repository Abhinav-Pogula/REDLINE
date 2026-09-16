"use client";

import React from "react";

export const DeviceConnection: React.FC = () => {
  return (
    <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-devices">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>OFFICE KIT CONTINUITY PROTOCOL</span>
            <span>//</span>
            <span>LOCAL PEER LINK</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight font-display">
            Device Connection &amp; Sync Status
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-semibold text-neutral-800 font-mono">PEER CONNECTED</span>
        </div>
      </div>

      {/* Primary Hardware Device Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold">
              📱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-950 font-display">iQOO 13 Pro (Alex Rivera)</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  PRIMARY AI DEVICE
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Hardware Identifier: IQOO-SNAPDRAGON-8-ELITE-0x8894
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 font-mono text-xs font-bold text-neutral-700 transition">
              RE-SYNC LEDGER
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold transition">
              PAIR NEW PHONE
            </button>
          </div>
        </div>

        {/* Technical Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <span className="text-neutral-400 block text-[10px] uppercase">TRANSPORT LAYER</span>
            <span className="text-neutral-900 font-bold">BLE 5.3 + Wi-Fi Direct</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <span className="text-neutral-400 block text-[10px] uppercase">LEDGER SYNC LATENCY</span>
            <span className="text-emerald-600 font-bold">&lt; 4 ms (Air-Gapped)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <span className="text-neutral-400 block text-[10px] uppercase">MERKLE ROOT HASH</span>
            <span className="text-neutral-900 font-bold truncate block">0x8894...99CD</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <span className="text-neutral-400 block text-[10px] uppercase">LAST RECEIVED SESSION</span>
            <span className="text-neutral-900 font-bold">Teams ProdSync (44m)</span>
          </div>
        </div>
      </div>

      {/* Sync Ledger History */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-3">
        <h3 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-wider">
          OFFICE KIT HANDOVER AUDIT LOG
        </h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>10:43:12 PM — Handshake completed via BLE. Session payload: 3 Decisions, 1 Constraint, 1 Conflict.</span>
            </div>
            <span className="text-[10px] text-neutral-400">VERIFIED</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
              <span>10:41:00 PM — Forensic Invariant #104.B received from phone. Conflict Prover updated.</span>
            </div>
            <span className="text-[10px] text-neutral-400">VERIFIED</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
              <span>10:15:22 PM — Cryptographic fingerprint checked: Signature matches on-device enclave key.</span>
            </div>
            <span className="text-[10px] text-neutral-400">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
