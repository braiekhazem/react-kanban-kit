import AppLayout from "@/components/layout/AppLayout";
import ClickUpBoard from "@/components/boards/ClickUpBoard";

export default function ClickUpPage() {
  return (
    <AppLayout activeRoute="/clickup">
      <ClickUpBoard />
    </AppLayout>
  );
}
