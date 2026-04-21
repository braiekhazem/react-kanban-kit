import AppLayout from "@/components/layout/AppLayout";
import OverviewBoard from "@/components/boards/OverviewBoard";

export default function OverviewPage() {
  return (
    <AppLayout activeRoute="/">
      <OverviewBoard />
    </AppLayout>
  );
}
