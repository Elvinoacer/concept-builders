"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import { VideoExtension } from "./VideoExtension";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";

import "./editor.css";
import { useTheme } from "next-themes";
import PreviewModal from "./PreviewModal";


  const InputField = ({
  label,
  value,
  field,
  type = "text",
  textarea = false,
  handleInputChange,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 resize-none"
        rows="3"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
      />
    )}
  </div>
);

export default function TextEditor() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
      "Michael is an architectural historian with over 15 years of experience studying modernist architecture. He has published several books on 20th-century architectural landmarks.",
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
  const [isSaving, setIsSaving] = useState(false);

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
    content: `<p>The Sydney Opera House is more than just an iconic building; it's a symbol of architectural ambition and innovation. Situated on Bennelong Point in Sydney Harbour, this UNESCO World Heritage Site attracts millions of visitors each year, not just for performances but to marvel at its unique design.</p>
<h2>The Visionary Design</h2>
<p>Danish architect Jørn Utzon's winning design in the 1956 international competition was revolutionary. His concept of shell-like structures was unlike anything seen before in large-scale architecture. The design was inspired by natural forms - segments of oranges, palm fronds, and even sailing ships.</p>
<div class="image-grid">
    <div>
        <img src="https://www.thoughtco.com/thmb/EqvppJfCaMdj4H3ba1PmdYCjuR4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/utzonSOH-821907-56aadd173df78cf772b49827.jpg" alt="Opera House shells">
        <p class="caption">The iconic shell structure of the Opera House</p>
    </div>
    <div>
        <img src="https://images.unsplash.com/photo-1540448051910-09cfadd5df61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Opera House interior">
        <p class="caption">The stunning interior of the Concert Hall</p>
    </div>
</div>
<h2>Engineering Challenges</h2>
<p>The construction of the Opera House presented unprecedented engineering challenges. The original shell design proved mathematically impossible to build, requiring Utzon to develop a solution where all shells would be created from sections of a sphere. This innovative approach allowed for the prefabrication of components, though it still required complex calculations and precise execution.</p>
<p>The project faced numerous setbacks, including budget overruns and technical difficulties. The original estimated cost of $7 million ballooned to over $100 million by completion in 1973, a decade later than initially planned.</p>
<blockquote class="quote">
    "The Sydney Opera House is a great architectural work of the 20th century. It represents multiple strands of creativity, both in architectural form and structural design."
</blockquote>
<h2>Architectural Significance</h2>
<p>Utzon's design broke away from the rectangular, International Style boxes that dominated modern architecture. The flowing, organic forms created a building that appears to change shape from different viewpoints, engaging dynamically with its harbor setting.</p>
<img src="https://images.unsplash.com/photo-1565194388949-64569b118e53?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Opera House at night" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin: 20px 0;">
<p class="caption">The Opera House illuminated at night against the Sydney skyline</p>
<h3>Key Design Elements</h3>
<p>The building comprises three groups of interlocking vaulted 'shells' which roof two main performance halls and a restaurant. These shell structures are set upon a vast platform and surrounded by terrace areas that function as pedestrian concourses.</p>
<p>The design successfully integrates various performing arts venues into a single architectural composition while maintaining their individual identities. The largest shell houses the Concert Hall, with excellent acoustics achieved through careful design of the interior surfaces.</p>
<h2>Legacy and Influence</h2>
<p>The Sydney Opera House has become one of the most recognizable buildings of the 20th century and a symbol of both Sydney and Australia. Its design has influenced architects worldwide, demonstrating how expressive forms could be achieved through modern construction techniques.</p>
<p>Despite the controversies during its construction, the Opera House stands as a testament to architectural vision and perseverance. It continues to inspire architects and delight visitors, securing its place as one of the great architectural achievements in modern history.</p>
<div class="image-grid">
    <div>
        <img src="https://www.shutterstock.com/image-photo/sydney-harbour-opera-house-cityscape-260nw-2495680553.jpg" alt="Opera House from water">
        <p class="caption">View of the Opera House from the water</p>
    </div>
    <div>
        <img src="https://media.licdn.com/dms/image/v2/D5612AQGCf_g0RcyY_Q/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1690174056545?e=1759968000&v=beta&t=K3gulPsK74Yu5xrwicmdhLheSmLU4Vk7NKXW_AQz6-o" alt="Opera House details">
        <p class="caption">Detailed view of the tile work on the shells</p>
    </div>
</div>`,
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
    let processedBody = editor
      .getHTML()
      .replace(/<blockquote>/g, '<div class="quote">')
      .replace(/<\/blockquote>/g, "</div>");

    let relatedArticles = "";
    if (articleData.rel1Title) {
      relatedArticles += `
<div class="related-article">
    <img src="${articleData.rel1Img}" alt="Related article">
    <div>
        <h4>${articleData.rel1Title}</h4>
        <p>${articleData.rel1Desc}</p>
    </div>
</div>`;
    }
    if (articleData.rel2Title) {
      relatedArticles += `
<div class="related-article">
    <img src="${articleData.rel2Img}" alt="Related article">
    <div>
        <h4>${articleData.rel2Title}</h4>
        <p>${articleData.rel2Desc}</p>
    </div>
</div>`;
    }

    let tagsHtml = articleData.tags
      .split(",")
      .map((tag) => `<span class="tag">${tag.trim()}</span>`)
      .join("");

    const staticStyles = `
    :root {
      --primary: #2c3e50;
      --secondary: #3498db;
      --accent: #e74c3c;
      --light: #ecf0f1;
      --dark: #2c3e50;
      --text: #34495e;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: var(--text);
      line-height: 1.7;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .article-header {
      text-align: center;
      margin-bottom: 50px;
      background: white;
      padding: 50px 40px;
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      position: relative;
      overflow: hidden;
    }
    .article-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3498db, #e74c3c, #3498db);
    }
    .article-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1.1;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #2c3e50, #3498db);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .article-meta {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 25px;
      font-size: 1rem;
      color: #7f8c8d;
    }
    .article-meta span {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8f9fa;
      padding: 8px 16px;
      border-radius: 25px;
      font-weight: 500;
    }
    .blog-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
    }
    @media (min-width: 1024px) {
      .blog-layout {
        grid-template-columns: 2fr 1fr;
      }
    }
    .article-content {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .article-content:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    .article-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      object-position: center;
    }
    .article-body {
      padding: 50px;
    }
    .article-body h2 {
      color: var(--primary);
      margin: 35px 0 20px;
      font-size: 2rem;
      font-weight: 700;
      position: relative;
      padding-left: 20px;
    }
    .article-body h2::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
      background: linear-gradient(135deg, #3498db, #e74c3c);
      border-radius: 3px;
    }
    .article-body h3 {
      color: var(--primary);
      margin: 30px 0 15px;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .article-body p {
      margin-bottom: 25px;
      font-size: 1.1rem;
      color: #555;
    }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin: 35px 0;
    }
    .image-grid img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 12px;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .image-grid img:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
    .caption {
      font-style: italic;
      font-size: 0.9rem;
      color: #7f8c8d;
      text-align: center;
      margin-top: 10px;
      font-weight: 500;
    }
    .quote {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      margin: 40px 0;
      font-style: italic;
      font-size: 1.3rem;
      border-radius: 15px;
      position: relative;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }
    .quote::before {
      content: '"';
      font-size: 4rem;
      position: absolute;
      top: 10px;
      left: 20px;
      opacity: 0.3;
    }
    .sidebar {
      background: white;
      border-radius: 20px;
      padding: 35px;
      box-shadow: var(--shadow-lg);
      height: fit-content;
      position: sticky;
      top: 30px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    }
    .sidebar h3 {
      color: var(--primary);
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 3px solid #3498db;
      font-size: 1.4rem;
      font-weight: 700;
    }
    .author-info {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 15px;
      transition: transform 0.3s ease;
    }
    .author-info:hover {
      transform: translateX(10px);
    }
    .author-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 20px;
      border: 4px solid #3498db;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    .related-article {
      display: flex;
      margin-bottom: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .related-article:hover {
      transform: translateX(8px);
      background: #e9ecef;
    }
    .related-article img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 10px;
      margin-right: 20px;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }
    .tag {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .tag:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
    }
    `;

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>${staticStyles}</style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <div class="article-header">
            <h1 class="article-title">${articleData.title}</h1>
            <div class="article-meta">
                <span><i class="far fa-calendar"></i> ${articleData.date}</span>
                <span><i class="far fa-clock"></i> ${articleData.readTime}</span>
                <span><i class="far fa-user"></i> ${articleData.author}</span>
            </div>
        </div>

        <div class="blog-layout">
            <main class="article-content">
                <img src="${articleData.mainImage}" alt="${articleData.mainAlt}" class="article-image">
                
                <div class="article-body">
                    ${processedBody}
                </div>
            </main>
            
            <aside class="sidebar">
                <div class="author-info">
                    <img src="${articleData.authorAvatar}" alt="Author" class="author-avatar">
                    <div>
                        <h3>${articleData.author}</h3>
                        <p>${articleData.authorRole}</p>
                    </div>
                </div>
                
                <h3>About the Author</h3>
                <p>${articleData.authorBio}</p>
                
                <h3>Related Articles</h3>
                ${relatedArticles}
                
                <h3>Article Tags</h3>
                <div class="tags">
                    ${tagsHtml}
                </div>
            </aside>
        </div>
    </div>
</body>
</html>`;

    setOutput(html);
    setIsPreviewModalOpen(true);
  };

  

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      data-theme={isMounted ? theme : "light"}
    >
      {/* Collapsible Sidebar */}
      <div
        className={`${
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
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                  Author Information
                </h3>
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
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                  Featured Image
                </h3>
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
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                  Related Articles
                </h3>
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
              </div>

              <InputField
                label="Tags (comma-separated)"
                value={articleData.tags}
                field="tags"
                handleInputChange={handleInputChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Blog Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create stunning blog posts with ease
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={generateHtml}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Preview
              </button>

              <button
                onClick={savePost}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Editor Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6">
                <MenuBar editor={editor} />
              </div>

              {/* Editor Content */}
              <div className="p-8">
                <EditorContent
                  editor={editor}
                  className="tiptap min-h-[500px] prose prose-lg max-w-none dark:prose-invert focus:outline-none"
                />

                {/* Character Count */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {editor && editor.storage.characterCount && (
                      <>
                        <span>
                          {editor.storage.characterCount.characters()} characters
                        </span>
                        <span>
                          {editor.storage.characterCount.words()} words
                        </span>
                        <span>
                          {Math.ceil(
                            editor.storage.characterCount.words() / 200
                          )} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
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

  
