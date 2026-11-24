import HelpPage from "@/components/help/HelpPage";
import { BRAND } from "@/components/global/brand";

export const metadata = { title: `Help · ${BRAND.app} · ${BRAND.name}` };

export default function Help() {
  return <HelpPage />;
}
