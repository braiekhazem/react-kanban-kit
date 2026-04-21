import AppLayout from "@/components/layout/AppLayout";
import TrelloBoard from "@/components/boards/TrelloBoard";

export default function TrelloPage() {
  return (
    <AppLayout activeRoute="/trello">
      <TrelloBoard />
    </AppLayout>
  );
}
