import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomDevTools, DevToolsDemo } from "@/components/dev";
import { devToolsConfig } from "@/config/devtools.config";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/providers/CustomAuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "@/utils/authStorage"; // Importar utilitários de armazenamento de autenticação
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import EducareApp from "./pages/educare-app/EducareApp";
import EducareAuth from "./pages/educare-app/auth/EducareAuth";
import ForgotPasswordPage from "./pages/educare-app/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/educare-app/auth/ResetPasswordPage";
import EducareAppDashboard from "./pages/educare-app/EducareAppDashboard";
import ChildrenManagement from "./pages/educare-app/ChildrenManagement";
import ChildProfile from "./pages/educare-app/ChildProfile";
import ChildForm from "./pages/educare-app/ChildForm";
import EducareActivitiesPage from "./pages/educare-app/ActivitiesPage";
import EducareSettingsPage from "./pages/educare-app/SettingsPage";
import SettingsLayout from "./pages/educare-app/settings/SettingsLayout";
import ChangePasswordPage from "./pages/educare-app/settings/ChangePasswordPage";
import ProfessionalDashboard from "./pages/educare-app/professional/ProfessionalDashboard";
import ChildAnalysis from "./pages/educare-app/professional/ChildAnalysis";
import EducareAppLayout from "./pages/educare-app/EducareAppLayout";
import AprendizadoLanding from "./pages/educare-app/AprendizadoLanding";
import WhatsAppJourneyBotPage from "./pages/WhatsAppJourneyBotPage";

// Admin Pages
import OwnerDashboard from "./pages/admin/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import SubscriptionPlansManagement from "./pages/admin/SubscriptionPlansManagement";
import UserManagement from "./pages/admin/UserManagement";
import AdminProfessionals from "./pages/admin/AdminProfessionals";
import TeamsManagement from "./pages/admin/TeamsManagement";
import GlobalChildrenManagementPage from "./pages/admin/GlobalChildrenManagement";
import { AllChatsView } from "./components/educare-app/admin/AllChatsView";
import ProfessionalOnlyGuard from "./components/auth/ProfessionalOnlyGuard";
import JourneyQuestionsManagement from "./pages/admin/JourneyQuestionsManagement";
import MediaResourcesManagement from "./pages/admin/MediaResourcesManagement";
import RAGMetricsDashboard from "./pages/admin/RAGMetricsDashboard";
import KnowledgeBaseManagement from "./pages/admin/KnowledgeBaseManagement";
import CommunicationPage from "./pages/educare-app/CommunicationPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import TitiNautaJourney from "./pages/educare-app/TitiNautaJourney";
import LojaPage from "./pages/educare-app/LojaPage";
import SupportPage from "./pages/educare-app/SupportPage";
import MaterialApoioPage from "./pages/educare-app/MaterialApoioPage";
import WelcomeHub from "./pages/educare-app/WelcomeHub";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="educare-theme">
        <HelmetProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Main Route - Redirect to Official Landing Page */}
              <Route path="/" element={<Navigate to="/educare-app" replace />} />
              
              {/* Contact Page */}
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog/category/:category" element={<BlogPage />} />
              
              {/* Official Educare App Landing Page */}
              <Route path="/educare-app" element={<EducareApp />} />
              <Route path="/educare-app/auth" element={<EducareAuth />} />
              <Route path="/educare-app/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/educare-app/auth/reset-password" element={<ResetPasswordPage />} />
              
              {/* Welcome Hub - First screen after login */}
              <Route path="/educare-app/welcome" element={<WelcomeHub />} />
              
              {/* Protected Educare App Routes */}
              <Route path="/educare-app" element={<EducareAppLayout />}>
                <Route path="dashboard" element={<EducareAppDashboard />} />
                <Route path="titinauta" element={<TitiNautaJourney />} />
                <Route path="children" element={<ChildrenManagement />} />
                <Route path="child/:id" element={<ChildProfile />} />
                <Route path="child/new" element={<ChildForm />} />
                <Route path="child/:id/edit" element={<ChildForm />} />
                <Route path="communication" element={<CommunicationPage />} />
                <Route path="journey-bot-whatsapp/:childId" element={<WhatsAppJourneyBotPage />} />
                <Route path="titinauta-journey" element={<TitiNautaJourney />} />
                <Route path="titinauta-journey/:childId" element={<TitiNautaJourney />} />
                <Route path="activities" element={<EducareActivitiesPage />} />
                <Route path="material-apoio" element={<MaterialApoioPage />} />
                <Route path="settings" element={<SettingsLayout />}>
                  <Route index element={<EducareSettingsPage />} />
                  <Route path="change-password" element={<ChangePasswordPage />} />
                </Route>
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="subscription/success" element={<SubscriptionPage />} />
                <Route path="subscription/cancel" element={<SubscriptionPage />} />
                
                {/* Professional Routes - Protected */}
                <Route path="professional/dashboard" element={
                  <ProfessionalOnlyGuard>
                    <ProfessionalDashboard />
                  </ProfessionalOnlyGuard>
                } />
                <Route path="professional/analysis/:childId" element={
                  <ProfessionalOnlyGuard>
                    <ChildAnalysis />
                  </ProfessionalOnlyGuard>
                } />
                
                {/* Admin Routes */}
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="admin/professionals" element={<AdminProfessionals />} />
                <Route path="admin/teams" element={<TeamsManagement />} />
                <Route path="admin/children" element={<GlobalChildrenManagementPage />} />
                <Route path="admin/plans" element={<SubscriptionPlansManagement />} />
                <Route path="admin/journey-questions" element={<JourneyQuestionsManagement />} />
                <Route path="admin/media-resources" element={<MediaResourcesManagement />} />
                <Route path="owner/dashboard" element={<OwnerDashboard />} />
                <Route path="owner/users" element={<UserManagement />} />
                <Route path="owner/professionals" element={<AdminProfessionals />} />
                <Route path="owner/teams" element={<TeamsManagement />} />
                <Route path="owner/children" element={<GlobalChildrenManagementPage />} />
                <Route path="owner/chats" element={<AllChatsView />} />
                <Route path="owner/plans" element={<SubscriptionPlansManagement />} />
                <Route path="owner/subscriptions" element={<AdminSubscriptions />} />
                <Route path="owner/media-resources" element={<MediaResourcesManagement />} />
                <Route path="owner/rag-metrics" element={<RAGMetricsDashboard />} />
                <Route path="owner/kb-management" element={<KnowledgeBaseManagement />} />
                
                {/* Professional Routes - Gestão de Crianças */}
                <Route path="professional/children" element={
                  <ProfessionalOnlyGuard>
                    <GlobalChildrenManagementPage />
                  </ProfessionalOnlyGuard>
                } />
                <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
              </Route>
              
              {/* Academia Educare+ Routes */}
              <Route path="/educare-app/academia" element={<AprendizadoLanding />} />
              <Route path="/educare-app/academia/*" element={<Navigate to="/educare-app/academia" replace />} />
              
              {/* Existing Aprendizado routes (keeping for backward compatibility) */}
              <Route path="/educare-app/aprendizado" element={<AprendizadoLanding />} />
              
              {/* Loja Educare+ */}
              <Route path="/educare-app/loja" element={<LojaPage />} />
              
              {/* Suporte */}
              <Route path="/educare-app/support" element={<SupportPage />} />
              
              {/* DevTools Demo - apenas em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <Route path="/dev/tools" element={<DevToolsDemo />} />
              )}
              
              {/* Catch all - redirect to official landing */}
              <Route path="*" element={<Navigate to="/educare-app" replace />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </HelmetProvider>
        {/* Renderizar DevTools apenas em ambiente de desenvolvimento */}
        {process.env.NODE_ENV === 'development' && devToolsConfig.enabled && (
          <CustomDevTools 
            initialIsOpen={devToolsConfig.reactQuery.initialIsOpen} 
            position={devToolsConfig.reactQuery.position} 
            buttonPosition={devToolsConfig.reactQuery.buttonPosition} 
          />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
