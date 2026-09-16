"use client";

import React, { useState } from "react";
import { Screen } from "../../lib/types";

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
  onShowAlert: (title: string, message: string) => void;
  onHandoffToDesktop?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onShowAlert }) => {
  const [enclaveActive, setEnclaveActive] = useState<boolean>(true);

  const toggleEnclave = () => {
    const nextState = !enclaveActive;
    setEnclaveActive(nextState);
    if (nextState) {
      onShowAlert("Enclave Isolation", "FULL ZERO-INGRESS LOCKED. Local neural inference active.");
    } else {
      onShowAlert("Enclave Isolation", "Relaxed mode activated for developer testing.");
    }
  };

  return (
    <section id="view-profile" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Top Profile Overview */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 text-center shadow-2xs relative overflow-hidden">
        <div className="absolute -top-10 right-0 w-32 h-32 bg-red-50 rounded-full blur-xl pointer-events-none"></div>
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 rounded-full bg-neutral-200 border-2 border-white shadow-sm flex items-center justify-center text-xl font-display font-black text-neutral-800 tracking-wider">
            AR
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center border-2 border-white text-[10px]">
            🛡
          </div>
        </div>
        <h2 className="font-display font-bold text-lg text-neutral-950">Alex Rivera</h2>
        <p className="text-xs text-neutral-500 font-sans">Lead Infrastructure Architect • SecOps</p>

        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-mono text-neutral-600 border border-neutral-200">
          <span>🔑</span>
          <span>DEVICE ID: RDL-7702-X // ED25519 VERIFIED</span>
        </div>
      </div>

      {/* HIGH-PRIORITY PLAIN-ENGLISH PRIVACY CARD */}
      <div className="bg-white border-2 border-neutral-300 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-mono text-brand-red font-bold uppercase tracking-wider block">
              SOVEREIGN STORAGE
            </span>
            <h3 className="font-display font-bold text-base text-neutral-950 leading-snug">
              Your data stays on this phone
            </h3>
          </div>
        </div>
        <p className="text-xs text-neutral-600 font-sans leading-relaxed">
          On-device processing active. Cloud verification is off by default and only used for items you approve — it never sends audio, photos, or documents.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div>
            <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-red"></span> Enclave Isolation
            </span>
            <span className="text-[10px] font-mono text-neutral-500">Local neural inference active</span>
          </div>
          <button
            id="enclaveToggleBtn"
            onClick={toggleEnclave}
            className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center ${
              enclaveActive ? "bg-brand-red" : "bg-neutral-300"
            }`}
          >
            <span
              id="enclaveToggleKnob"
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                enclaveActive ? "translate-x-5 text-brand-red" : "translate-x-0 text-neutral-400"
              }`}
            >
              🛡
            </span>
          </button>
        </div>
        <div className="bg-neutral-50 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
          <span>SECURITY POLICY // ZERO-INGRESS LOCAL ENCLAVE</span>
          <span className="text-emerald-600 font-bold">✓</span>
        </div>
      </div>

      {/* Plain-Language List Rows */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100 shadow-2xs">
        <div
          onClick={() =>
            onShowAlert(
              "Meeting Sources",
              "Google Meet, Zoom, and Teams linked for passive acoustic capture. Air-gapped on-device models parse spoken audio."
            )
          }
          className="p-3.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-mono text-xs">
              🔗
            </span>
            <div>
              <h4 className="font-sans font-semibold text-xs text-neutral-900">Meeting Sources</h4>
              <p className="text-[10px] font-mono text-neutral-500">Google Meet, Zoom, Teams ...</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
              4 LINKED
            </span>
            <span>›</span>
          </div>
        </div>

        <div
          onClick={() =>
            onShowAlert(
              "Your Data Ledger",
              "Local encrypted memory ledger holding 1.2 GB of acoustic indexes and timeline trees. Zero cloud telemetry exfiltration."
            )
          }
          className="p-3.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-mono text-xs">
              💾
            </span>
            <div>
              <h4 className="font-sans font-semibold text-xs text-neutral-900">Your Data</h4>
              <p className="text-[10px] font-mono text-neutral-500">Local encrypted memory ledge...</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="text-[10px] font-mono text-neutral-600">1.2 GB</span>
            <span>›</span>
          </div>
        </div>

        <div
          onClick={() =>
            onShowAlert(
              "Laptop Connection",
              "Office Kit Pairing via local cryptographic handshake (BLE + Local Wi-Fi). Synchronized with laptop client."
            )
          }
          className="p-3.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-mono text-xs">
              💻
            </span>
            <div>
              <h4 className="font-sans font-semibold text-xs text-neutral-900">Laptop Connection</h4>
              <p className="text-[10px] font-mono text-neutral-500">Office Kit Pairing via local crypto...</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="text-[10px] font-mono font-bold text-brand-red flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span> PAIRED
            </span>
            <span>›</span>
          </div>
        </div>

        <div
          onClick={() =>
            onShowAlert(
              "About REDLINE",
              "REDLINE Sovereign Work Memory OS v2.4.1\nEngine: On-Device Neural Prover\nTarget: Defense-Grade Conflict Forensics."
            )
          }
          className="p-3.5 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-mono text-xs">
              ℹ️
            </span>
            <div>
              <h4 className="font-sans font-semibold text-xs text-neutral-900">About REDLINE</h4>
              <p className="text-[10px] font-mono text-neutral-500">Kernel v2.4.1 • Sovereign Work M...</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="text-[10px] font-mono text-neutral-500">v2.4.1</span>
            <span>›</span>
          </div>
        </div>
      </div>

      {/* Utility Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() =>
            onShowAlert(
              "Ledger Verified",
              "Merkle root 0x889...99CD matches ED25519 local hardware signature. All historical decision nodes intact."
            )
          }
          className="w-full py-3 bg-neutral-900 hover:bg-black text-white rounded-2xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-98 transition"
        >
          <span>🛡</span>
          <span>Audit Cryptographic Ledger</span>
        </button>
        <button
          onClick={() =>
            onShowAlert("Cache Cleared", "140 MB of ephemeral acoustic buffers scrubbed from volatile memory.")
          }
          className="w-full py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-2xl font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <span>🧹</span>
          <span>Clear Local Ephemeral Cache</span>
        </button>
      </div>

      {/* Air-gapped runtime badge */}
      <div className="text-center font-mono text-[9px] text-neutral-400 py-2 border-t border-neutral-200">
        <p className="text-brand-red font-bold">REDLINE RUNTIME STATUS</p>
        <p>AIR-GAPPED HARDWARE SANDBOX // ZERO INGRESS GUARANTEE</p>
      </div>
    </section>
  );
};
