import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LivePresenceBar } from "./components/collaboration/LivePresenceBar";
import { AICopilotDrawer } from "./components/chat/AICopilotDrawer";
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import { DashboardView } from "./components/views/DashboardView";
import { ProjectsView } from "./components/views/ProjectsView";
import { ProjectDetailView } from "./components/views/ProjectDetailView";
import { ImageUploadAIView } from "./components/views/ImageUploadAIView";
import { AnalyticsView } from "./components/views/AnalyticsView";
import { RiskAlertsView } from "./components/views/RiskAlertsView";
import { NotificationCenterView } from "./components/views/NotificationCenterView";
import { MapView } from "./components/views/MapView";
import { ReportsView } from "./components/views/ReportsView";
import { AdminArchitectureView } from "./components/views/AdminArchitectureView";
import { LandingView } from "./components/views/LandingView";
import { VerificationQueueView } from "./components/views/VerificationQueueView";
import { AuditTrailView } from "./components/views/AuditTrailView";
import { SimplePrototypeView } from "./components/views/SimplePrototypeView";
import { WbsTaskDrawer } from "./components/common/WbsTaskDrawer";
import { NewProjectModal } from "./components/NewProjectModal";

const AppContent: React.FC = () => {
  const { activeView, isAuthenticated } = useApp();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Strict session-based authentication guard across all routes
  // Redirect unauthenticated users immediately to the login screen
  if (!isAuthenticated) {
    if (activeView === "signup") {
      return <SignupPage />;
    }
    return <LoginPage />;
  }

  // If authenticated user explicitly opens auth views
  if (activeView === "signup") {
    return <SignupPage />;
  }

  if (activeView === "login") {
    return <LoginPage />;
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case "prototype":
        return <SimplePrototypeView />;
      case "landing":
        return <LandingView />;
      case "dashboard":
        return <DashboardView />;
      case "verification-queue":
        return <VerificationQueueView />;
      case "audit-trail":
        return <AuditTrailView />;
      case "projects":
        return <ProjectsView onOpenNewProject={() => setIsNewProjectModalOpen(true)} />;
      case "project-detail":
        return <ProjectDetailView />;
      case "ai-vision":
        return <ImageUploadAIView />;
      case "analytics":
        return <AnalyticsView />;
      case "alerts":
        return <RiskAlertsView />;
      case "notifications":
        return <NotificationCenterView />;
      case "map":
        return <MapView />;
      case "reports":
        return <ReportsView />;
      case "admin":
        return <AdminArchitectureView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white relative">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header */}
        <Header onOpenNewProject={() => setIsNewProjectModalOpen(true)} />

        {/* Live Multi-User Stakeholder Sync Bar */}
        <LivePresenceBar />

        {/* Dynamic View Component */}
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating AI Engineering Copilot */}
      <AICopilotDrawer />

      {/* Slide-over WBS Task Detail & Evidence Drawer */}
      <WbsTaskDrawer />

      {/* Modal Dialogs */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}


