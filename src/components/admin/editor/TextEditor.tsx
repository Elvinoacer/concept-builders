"use client";

import CharacterCount from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import { Image } from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import MenuBar from "./MenuBar";
import { VideoExtension } from "./VideoExtension";

import { useTheme } from "next-themes";
import {
  FiChevronDown,
  FiEye,
  FiMenu,
  FiSidebar,
  FiSmartphone,
  FiX,
} from "react-icons/fi";
import "./editor.css";
import PreviewModal from "./PreviewModal";

// Mobile-optimized Input Field Component
const InputField = ({
  label,
  value,
  field,
  type = "text",
  textarea = false,
  handleInputChange,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 xs:px-4 py-2 xs:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg xs:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 resize-none text-sm xs:text-base"
        rows="3"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 xs:px-4 py-2 xs:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg xs:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 text-sm xs:text-base"
      />
    )}
  </div>
);

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg xs:rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm xs:text-base">
          {title}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-3 xs:p-4 space-y-3 xs:space-y-4 bg-white dark:bg-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

export default function TextEditor() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("editor"); // 'editor' | 'preview'
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Close mobile sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial state data
  const [articleData, setArticleData] = useState({
    title: "The Sydney Opera House: An Architectural Masterpiece",
    date: "June 15, 2023",
    readTime: "8 min read",
    author: "Michael Anderson",
    authorRole: "Architectural Historian",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    authorBio:
      "Michael is an architectural historian with over 15 years of experience studying modernist architecture.",
    mainImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    mainAlt: "Sydney Opera House",
    rel1Title: "Frank Gehry's Guggenheim Museum",
    rel1Desc: "Exploring the deconstructivist masterpiece in Bilbao",
    rel1Img:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    rel2Title: "The Evolution of Skyscraper Design",
    rel2Desc: "From early steel frames to sustainable towers",
    rel2Img:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    tags: "Architecture,Modernism,Design,Sydney,UNESCO,Engineering",
  });

  const [output, setOutput] = useState("");

  const handleInputChange = (field, value) => {
    setArticleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      VideoExtension,
      CharacterCount,
      TextStyle,
      Color,
    ],
    content: `<p>The Sydney Opera House is more than just an iconic building; it's a symbol of architectural ambition and innovation. Situated on Bennelong Point in Sydney Harbour, this UNESCO World Heritage Site attracts millions of visitors each year.</p>`,
    immediatelyRender: false,
  });

  const savePost = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: articleData.title,
          content: editor.getHTML(),
          excerpt: editor.getText().substring(0, 150) + "...",
          image: articleData.mainImage,
          author: articleData.author,
        }),
      });

      if (response.ok) {
        alert("Post saved successfully!");
      } else {
        alert("Error saving post.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateHtml = () => {
    if (!editor) return;
    // ... existing generateHtml logic ...
    setIsPreviewModalOpen(true);
  };

  // Mobile Header Actions
  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blog Editor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setActiveView(activeView === "editor" ? "preview" : "editor")
            }
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiEye className="w-5 h-5" />
          </button>
          <button
            onClick={savePost}
            disabled={isSaving}
            className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-sm disabled:opacity-50"
          >
            {isSaving ? "..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div
      className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setMobileSidebarOpen(false)}
      />
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Blog Settings</h2>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <SidebarContent />
        </div>
      </div>
    </div>
  );

  // Sidebar Content Component
  const SidebarContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Date"
          value={articleData.date}
          field="date"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Read Time"
          value={articleData.readTime}
          field="readTime"
          handleInputChange={handleInputChange}
        />
      </div>

      <InputField
        label="Article Title"
        value={articleData.title}
        field="title"
        handleInputChange={handleInputChange}
      />

      <CollapsibleSection title="Author Information">
        <InputField
          label="Author Name"
          value={articleData.author}
          field="author"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Author Role"
          value={articleData.authorRole}
          field="authorRole"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Author Avatar URL"
          value={articleData.authorAvatar}
          field="authorAvatar"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Author Bio"
          value={articleData.authorBio}
          field="authorBio"
          textarea
          handleInputChange={handleInputChange}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Featured Image">
        <InputField
          label="Main Image URL"
          value={articleData.mainImage}
          field="mainImage"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Alt Text"
          value={articleData.mainAlt}
          field="mainAlt"
          handleInputChange={handleInputChange}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Related Articles">
        <InputField
          label="Related 1 Title"
          value={articleData.rel1Title}
          field="rel1Title"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Related 1 Description"
          value={articleData.rel1Desc}
          field="rel1Desc"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Related 1 Image URL"
          value={articleData.rel1Img}
          field="rel1Img"
          handleInputChange={handleInputChange}
        />

        <InputField
          label="Related 2 Title"
          value={articleData.rel2Title}
          field="rel2Title"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Related 2 Description"
          value={articleData.rel2Desc}
          field="rel2Desc"
          handleInputChange={handleInputChange}
        />
        <InputField
          label="Related 2 Image URL"
          value={articleData.rel2Img}
          field="rel2Img"
          handleInputChange={handleInputChange}
        />
      </CollapsibleSection>

      <InputField
        label="Tags (comma-separated)"
        value={articleData.tags}
        field="tags"
        handleInputChange={handleInputChange}
      />
    </div>
  );

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      data-theme={isMounted ? theme : "light"}
    >
      <MobileHeader />
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block ${
          sidebarCollapsed ? "w-20" : "w-80"
        } transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {!sidebarCollapsed && (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog Editor
              </h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiSidebar className="w-5 h-5" />
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <SidebarContent />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Blog Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm lg:text-base">
                Create stunning blog posts with ease
              </p>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={generateHtml}
                className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg lg:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm lg:text-base"
              >
                Preview
              </button>

              <button
                onClick={savePost}
                disabled={isSaving}
                className="px-4 lg:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg lg:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Post"
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center justify-center mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveView("editor")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === "editor"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiSmartphone className="w-4 h-4 inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveView("preview")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === "preview"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiEye className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Editor/Preview Content */}
            <div
              className={`${activeView === "editor" ? "block" : "hidden"} lg:block`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Editor Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 lg:p-6">
                  <MenuBar editor={editor} />
                </div>

                {/* Editor Content */}
                <div className="p-4 lg:p-8">
                  <EditorContent
                    editor={editor}
                    className="tiptap min-h-[300px] lg:min-h-[500px] prose prose-sm lg:prose-lg max-w-none dark:prose-invert focus:outline-none"
                  />

                  {/* Character Count */}
                  <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg lg:rounded-xl">
                    <div className="flex flex-col xs:flex-row justify-between gap-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {editor && editor.storage.characterCount && (
                        <>
                          <span>
                            {editor.storage.characterCount.characters()}{" "}
                            characters
                          </span>
                          <span>
                            {editor.storage.characterCount.words()} words
                          </span>
                          <span>
                            {Math.ceil(
                              editor.storage.characterCount.words() / 200
                            )}{" "}
                            min read
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Preview Placeholder */}
            {activeView === "preview" && (
              <div className="lg:hidden bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <FiEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Preview Mode</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Use the desktop version for full preview functionality or
                  click below to generate HTML.
                </p>
                <button
                  onClick={generateHtml}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Generate HTML Preview
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {isPreviewModalOpen && (
        <PreviewModal
          htmlContent={output}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
}
