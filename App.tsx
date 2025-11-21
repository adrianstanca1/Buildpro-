import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginView from './views/LoginView';
import ProfileView from './views/ProfileView';
import AIToolsView from './views/AIToolsView';
import ReportsView from './views/ReportsView';
import ScheduleView from './views/ScheduleView';
import ChatView from './views/ChatView';
import LiveView from './views/LiveView';
import DashboardView from './views/DashboardView';
import ProjectsView from './views/ProjectsView';
import ProjectDetailsView from './views/ProjectDetailsView';
import TasksView from './views/TasksView';
import TeamView from './views/TeamView';
import TimesheetsView from './views/TimesheetsView';
import DocumentsView from './views/DocumentsView';
import SafetyView from './views/SafetyView';
import EquipmentView from './views/EquipmentView';
import FinancialsView from './views/FinancialsView';
import TeamChatView from './views/TeamChatView';
import MLInsightsView from './views/MLInsightsView';
import ComplianceView from './views/ComplianceView';
import ProcurementView from './views/ProcurementView';
import CustomDashView from './views/CustomDashView';
import WorkforceView from './views/WorkforceView';
import IntegrationsView from './views/IntegrationsView';
import SecurityView from './views/SecurityView';
import ExecutiveView from './views/ExecutiveView';
import MapView from './views/MapView';
import ClientsView from './views/ClientsView';
import InventoryView from './views/InventoryView';
import DevSandboxView from './views/DevSandboxView';
import MarketplaceView from './views/MarketplaceView';
import ImagineView from './views/ImagineView';
import MyDesktopView from './views/MyDesktopView';
import LiveProjectMapView from './views/LiveProjectMapView';
import ProjectLaunchpadView from './views/ProjectLaunchpadView';
import { Page } from './types';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AuthenticatedApp: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.LOGIN);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Shared State for Marketplace Apps
  const [installedApps, setInstalledApps] = useState<string[]>(['Procore', 'Slack', 'QuickBooks']);

  const toggleAppInstall = (appName: string) => {
    if (installedApps.includes(appName)) {
        setInstalledApps(prev => prev.filter(n => n !== appName));
    } else {
        setInstalledApps(prev => [...prev, appName]);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setPage(Page.PROJECT_DETAILS);
  };

  // If not authenticated, show Login
  if (!user) {
    return <LoginView setPage={setPage} />;
  }

  return (
      <div className="flex h-screen bg-zinc-50 text-zinc-900 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar currentPage={page} setPage={setPage} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          <TopBar setPage={setPage} />
          
          <main className="flex-1 overflow-y-auto bg-zinc-50/50 relative">
              {page === Page.DASHBOARD && <DashboardView setPage={setPage} />}
              {page === Page.EXECUTIVE && <ExecutiveView />}
              {page === Page.LIVE_PROJECT_MAP && <LiveProjectMapView />}
              {page === Page.PROJECT_LAUNCHPAD && <ProjectLaunchpadView setPage={setPage} />}
              {page === Page.PROJECTS && <ProjectsView onProjectSelect={handleProjectSelect} setPage={setPage} />}
              {page === Page.PROJECT_DETAILS && (
                <ProjectDetailsView 
                  projectId={selectedProjectId} 
                  onBack={() => setPage(Page.PROJECTS)} 
                />
              )}
              {page === Page.TASKS && <TasksView />}
              {page === Page.TEAM && <TeamView />}
              {page === Page.TIMESHEETS && <TimesheetsView />}
              {page === Page.DOCUMENTS && <DocumentsView />}
              {page === Page.SAFETY && <SafetyView />}
              {page === Page.EQUIPMENT && <EquipmentView />}
              {page === Page.FINANCIALS && <FinancialsView />}
              {page === Page.TEAM_CHAT && <TeamChatView />}
              {page === Page.AI_TOOLS && <AIToolsView setPage={setPage} />}
              {page === Page.ML_INSIGHTS && <MLInsightsView />}
              {page === Page.COMPLIANCE && <ComplianceView />}
              {page === Page.PROCUREMENT && <ProcurementView />}
              {page === Page.SCHEDULE && <ScheduleView />}
              {page === Page.CUSTOM_DASH && <CustomDashView />}
              {page === Page.REPORTS && <ReportsView />}
              {page === Page.WORKFORCE && <WorkforceView />}
              {page === Page.INTEGRATIONS && <IntegrationsView />}
              {page === Page.SECURITY && <SecurityView />}
              {page === Page.PROFILE && <ProfileView />}
              {page === Page.MAP_VIEW && <MapView />}
              {page === Page.CLIENTS && <ClientsView />}
              {page === Page.INVENTORY && <InventoryView />}
              {page === Page.CHAT && <ChatView setPage={setPage} />}
              {page === Page.LIVE && <LiveView setPage={setPage} />}
              {page === Page.DEV_SANDBOX && <DevSandboxView />}
              {page === Page.MARKETPLACE && (
                  <MarketplaceView 
                      installedApps={installedApps} 
                      toggleInstall={toggleAppInstall} 
                  />
              )}
              {page === Page.IMAGINE && <ImagineView />}
              {page === Page.MY_DESKTOP && (
                  <MyDesktopView 
                      installedApps={installedApps}
                      setPage={setPage}
                  />
              )}
          </main>
        </div>
      </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AuthenticatedApp />
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;