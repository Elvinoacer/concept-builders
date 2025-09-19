
import ContentHeader from "@/components/admin/content/ContentHeader";
import ContentTable from "@/components/admin/content/ContentTable";
import ContentTabs from "@/components/admin/content/ContentTabs";

const ContentPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-background text-foreground p-8">
      <ContentHeader />
      <ContentTabs />
      <ContentTable />
    </div>
  );
};

export default ContentPage;
