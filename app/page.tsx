"use client";

import React from "react";
import { useRedline } from "../hooks/useRedline";
import { Header } from "../components/mobile/Header";
import { Breadcrumb } from "../components/mobile/Breadcrumb";
import { BottomNav } from "../components/mobile/BottomNav";
import { SidebarDrawer } from "../components/mobile/SidebarDrawer";
import { AlertModal } from "../components/mobile/AlertModal";
import { Dashboard } from "../components/mobile/Dashboard";
import { Capture } from "../components/mobile/Capture";
import { PostMeetingResult } from "../components/mobile/PostMeetingResult";
import { ConflictAnalysis } from "../components/mobile/ConflictAnalysis";
import { Timeline } from "../components/mobile/Timeline";
import { Calendar } from "../components/mobile/Calendar";
import { Profile } from "../components/mobile/Profile";
import { DesktopWindowFrame } from "../components/desktop/DesktopWindowFrame";

export default function Home() {
  const redline = useRedline();

  // Next Flow button cyclic navigation on mobile
  const flowSequence: ("dashboard" | "capture" | "result" | "conflict" | "timeline" | "calendar" | "profile")[] = [
    "dashboard",
    "capture",
    "result",
    "conflict",
    "timeline",
    "calendar",
    "profile",
  ];

  const handleNextFlow = () => {
    const currentIndex = flowSequence.indexOf(redline.currentScreen);
    const nextIndex = (currentIndex + 1) % flowSequence.length;
    redline.navigate(flowSequence[nextIndex]);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LAPTOP APPLICATION VIEW (Rendered automatically on Laptop/Desktop screens) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex min-h-screen w-full items-center justify-center p-2 sm:p-6 lg:p-10 select-none bg-[#0b0d11]">
        <DesktopWindowFrame
          conflicts={redline.engineResult.conflicts}
          decisions={redline.decisions}
          constraints={redline.constraints}
          commitments={redline.commitments}
          evidenceList={redline.evidenceList}
          initialTab={redline.selectedConflict ? "conflicts" : "dashboard"}
          isBackendConnected={redline.isBackendConnected}
          onExtractTranscript={redline.extractTranscript}
          isExtracting={redline.isExtracting}
          selectedConflict={redline.selectedConflict}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE APPLICATION VIEW (Rendered automatically on Mobile Phone screens)  */}
      {/* ========================================================================= */}
      <div className="flex lg:hidden min-h-screen w-full items-center justify-center p-0 md:p-6 select-none bg-neutral-950">
        <div className="relative w-full max-w-[430px] h-[100dvh] md:h-[910px] bg-brand-bg md:rounded-[44px] shadow-2xl md:border-[8px] md:border-neutral-800 flex flex-col overflow-hidden">
          {/* Top Hardware Notch / Telemetry Header */}
          <Header
            currentScreen={redline.currentScreen}
            onOpenDrawer={() => redline.setDrawerOpen(true)}
            onGoBack={redline.goBack}
            onNavigate={redline.navigate}
            isBackendConnected={redline.isBackendConnected}
          />

          {/* Quick Breadcrumb Bar */}
          <Breadcrumb currentScreen={redline.currentScreen} onNextFlow={handleNextFlow} />

          {/* Main Scrollable App Screen Viewport */}
          <main id="appViewport" className="flex-1 overflow-y-auto hide-scrollbar relative bg-brand-bg">
            {redline.currentScreen === "dashboard" && (
              <Dashboard
                onNavigate={redline.navigate}
                onRunDemo={redline.runHeroDemo}
                selectedConflict={redline.selectedConflict}
                activeScenarioId={redline.activeScenarioId}
                onSwitchScenario={redline.loadScenario}
                onShowAlert={redline.showAlert}
              />
            )}

            {redline.currentScreen === "capture" && (
              <Capture
                onNavigate={redline.navigate}
                captureStatus={redline.captureStatus}
                setCaptureStatus={redline.setCaptureStatus}
                pipelineStep={redline.pipelineStep}
                setPipelineStep={redline.setPipelineStep}
                onShowAlert={redline.showAlert}
                onExtractTranscript={redline.extractTranscript}
                isExtracting={redline.isExtracting}
              />
            )}

            {redline.currentScreen === "result" && (
              <PostMeetingResult
                onNavigate={redline.navigate}
                decisions={redline.decisions}
                constraints={redline.constraints}
                commitments={redline.commitments}
                selectedConflict={redline.selectedConflict}
                lastExtracted={redline.lastExtracted}
                onShowAlert={redline.showAlert}
              />
            )}

            {redline.currentScreen === "conflict" && (
              <ConflictAnalysis
                onNavigate={redline.navigate}
                selectedConflict={redline.selectedConflict}
                evidenceList={redline.evidenceList}
                onShowAlert={redline.showAlert}
                onHandoffToDesktop={() => redline.showAlert("Office Kit Continuity", "Synced with Laptop Client. When viewed on laptop screen, Desktop Prover displays this exact forensic invariant.")}
              />
            )}

            {redline.currentScreen === "timeline" && (
              <Timeline
                onNavigate={redline.navigate}
                timeline={redline.engineResult.timeline}
                onShowAlert={redline.showAlert}
              />
            )}

            {redline.currentScreen === "calendar" && (
              <Calendar
                onNavigate={redline.navigate}
                onShowAlert={redline.showAlert}
              />
            )}

            {redline.currentScreen === "profile" && (
              <Profile
                onNavigate={redline.navigate}
                onShowAlert={redline.showAlert}
                onHandoffToDesktop={() => redline.showAlert("Laptop Client Paired", "Office Kit pairing verified via local BLE 5.3 + Wi-Fi Direct. Open REDLINE on your laptop to view wide dashboard.")}
              />
            )}
          </main>

          {/* Bottom Dock Navigation */}
          <BottomNav currentScreen={redline.currentScreen} onNavigate={redline.navigate} />

          {/* Slide-in Sidebar Drawer */}
          <SidebarDrawer
            isOpen={redline.drawerOpen}
            onClose={() => redline.setDrawerOpen(false)}
            currentScreen={redline.currentScreen}
            onNavigate={redline.navigate}
            onShowAlert={redline.showAlert}
          />

          {/* Alert Modal */}
          <AlertModal
            isOpen={redline.alertModal.isOpen}
            title={redline.alertModal.title}
            message={redline.alertModal.message}
            onClose={redline.closeAlert}
          />

          {/* Floating Toast Notification */}
          {redline.toastMessage && (
            <div className="absolute top-20 inset-x-4 z-50 flex justify-center pointer-events-none transition-all">
              <div className="bg-neutral-900/95 border border-brand-red/50 text-white px-4 py-2 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                <span>{redline.toastMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
