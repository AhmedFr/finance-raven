import { Navigate, Outlet } from "react-router";
import { useAppStore } from "../../store/appStore";

export function RequireOnboarded() {
  const onboarded = useAppStore((s) => s.onboarded);
  return onboarded ? <Outlet /> : <Navigate to="/bienvenue" replace />;
}
