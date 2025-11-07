"use client";

import { useState, useEffect } from "react";
import ContentHeader from "@/components/admin/content/ContentHeader";
import ContentTable from "@/components/admin/content/ContentTable";
import ContentTabs from "@/components/admin/content/ContentTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const ContentPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Blog Posts");
  const [retryCount, setRetryCount] = useState(0);

  const fetchPosts = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/posts");

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      setBlogPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [retryCount]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Enhanced loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {/* Table Header Skeleton */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );

  // Error state component
  const renderError = () => (
    <div className="space-y-6">
      <Alert variant="destructive" className="border-l-4 border-l-red-500">
        <FiAlertCircle className="h-5 w-5" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="flex-1">{error}</span>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"
          >
            <FiRefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </AlertDescription>
      </Alert>

      {/* Fallback content */}
      <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold mb-2">Unable to Load Content</h3>
        <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
          We're having trouble loading the content. Please check your connection
          and try again.
        </p>
      </div>
    </div>
  );

  // Empty state component
  const renderEmptyState = () => (
    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="text-4xl mb-4">
        {activeTab === "Blog Posts"
          ? "📝"
          : activeTab === "Static Pages"
            ? "📄"
            : "📋"}
      </div>
      <h3 className="text-lg font-semibold mb-2">
        No {activeTab.toLowerCase()} found
      </h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
        {activeTab === "Blog Posts"
          ? "Get started by creating your first blog post."
          : activeTab === "Static Pages"
            ? "Create static pages for your website."
            : "Set up policies for your store and customers."}
      </p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Blog Posts":
        return blogPosts.length === 0 && !loading ? (
          renderEmptyState()
        ) : (
          <ContentTable blogPostsData={blogPosts} />
        );
      case "Static Pages":
        return (
          <div className="text-center py-12">
            Static Pages Content - Coming Soon
          </div>
        );
      case "Policies":
        return (
          <div className="text-center py-12">
            Policies Content - Coming Soon
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-background text-foreground p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <ContentHeader />

      {/* Tabs Section */}
      <div className="mt-6 sm:mt-8">
        <ContentTabs activeTab={activeTab} onTabClick={handleTabClick} />
      </div>

      {/* Content Area */}
      <div className="mt-6 sm:mt-8">
        {error ? (
          renderError()
        ) : loading ? (
          renderSkeleton()
        ) : (
          <div className="animate-in fade-in duration-300">
            {renderTabContent()}
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
          <span className="text-lg font-semibold">+</span>
        </button>
      </div>

      {/* Performance and Connection Indicator */}
      {!loading && !error && (
        <div className="fixed bottom-4 left-4 z-30">
          <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-1 text-xs text-muted-foreground">
            {blogPosts.length} items
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
