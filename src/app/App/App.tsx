import { Navigate, Route, Routes } from "react-router";
import { EntriesScreen } from "../../features/entries/EntriesScreen";
import { HomeScreen } from "../../features/home/HomeScreen";
import { OnboardingScreen } from "../../features/onboarding/OnboardingScreen";
import { SettingsScreen } from "../../features/settings/SettingsScreen";
import { TaxesScreen } from "../../features/taxes/TaxesScreen";
import { UpdatePrompt } from "../../pwa/UpdatePrompt";
import { AppLayout } from "../AppLayout";
import { RequireOnboarded } from "../RequireOnboarded";

export function App() {
  return (
    <>
    <Routes>
      <Route path="/bienvenue" element={<OnboardingScreen />} />
      <Route element={<RequireOnboarded />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="encaissements" element={<EntriesScreen />} />
          <Route path="impots" element={<TaxesScreen />} />
          <Route path="reglages" element={<SettingsScreen />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <UpdatePrompt />
    </>
  );
}
