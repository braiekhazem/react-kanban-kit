import AppLayout from "@/components/layout/AppLayout";
import InfiniteScrollBoard from "@/components/boards/InfiniteScrollBoard";

export default function InfiniteScrollPage() {
  return (
    <AppLayout activeRoute="/infinite-scroll">
      <InfiniteScrollBoard />
    </AppLayout>
  );
}
