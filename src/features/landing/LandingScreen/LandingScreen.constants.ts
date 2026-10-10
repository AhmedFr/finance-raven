import { CalendarClock, Scale, Wallet } from "lucide-react";
import type { LandingPoint } from "./LandingScreen.types";

export const POINTS: LandingPoint[] = [
  { icon: Wallet, title: "Ce qu'il faut garder", text: "L'URSSAF, l'impôt et la CFE déjà dus sur ce que tu as encaissé, en un chiffre." },
  { icon: CalendarClock, title: "Le calendrier URSSAF", text: "Tes déclarations mensuelles ou trimestrielles, avec leurs échéances." },
  { icon: Scale, title: "L'impôt le moins cher", text: "Barème ou versement libératoire : l'option la plus avantageuse est mise en avant." },
];
