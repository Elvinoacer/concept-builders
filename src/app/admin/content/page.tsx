'use client';

import { useState, useEffect } from 'react';
import ContentHeader from "@/components/admin/content/ContentHeader";
import ContentTable from "@/components/admin/content/ContentTable";
import ContentTabs from "@/components/admin/content/ContentTabs";

const ContentPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Blog Posts');

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setBlogPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-background text-foreground p-4 md:p-8">
      <ContentHeader />
      <ContentTabs activeTab={activeTab} onTabClick={handleTabClick} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {activeTab === 'Blog Posts' && <ContentTable blogPostsData={blogPosts} />}
          {activeTab === 'Static Pages' && <div>Static Pages Content</div>}
          {activeTab === 'Policies' && <div>Policies Content</div>}
        </>
      )}
    </div>
  );
};

export default ContentPage;