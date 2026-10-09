import { House, Landmark, Settings, Wallet } from "lucide-react";
import type { TabItem } from "./TabDock.types";

export const TAB_ITEMS: TabItem[] = [
  { to: "/", label: "Accueil", icon: House, end: true },
  { to: "/encaissements", label: "Encaissements", icon: Wallet },
  { to: "/impots", label: "Impôts", icon: Landmark },
  { to: "/reglages", label: "Réglages", icon: Settings },
];
