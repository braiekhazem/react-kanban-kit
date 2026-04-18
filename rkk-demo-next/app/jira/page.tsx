import AppLayout from "@/components/layout/AppLayout";
import JiraBoard from "@/components/boards/JiraBoard";

export default function JiraPage() {
  return (
    <AppLayout activeRoute="/jira">
      <JiraBoard />
    </AppLayout>
  );
}
