import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaMinus,
  FaUndo,
  FaRedo,
  FaImage,
  FaVideo,
  FaPalette,
  FaLink,
  FaEllipsisH,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [_, setForceUpdate] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setForceUpdate(Math.random());
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
    setActiveDropdown(null);
    setShowMoreMenu(false);
  };

  const addVideo = () => {
    const url = window.prompt("Enter video URL");
    if (url) {
      editor?.chain().focus().setVideo({ src: url }).run();
    }
    setActiveDropdown(null);
    setShowMoreMenu(false);
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    setActiveDropdown(null);
    setShowMoreMenu(false);
  };

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setActiveDropdown(null);
    setShowMoreMenu(false);
  };

  const MenuButton = ({
    onClick,
    disabled = false,
    active = false,
    children,
    tooltip,
    variant = "default",
    size = "default",
  }: {
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
    tooltip: string;
    variant?: "default" | "danger" | "success";
    size?: "default" | "small";
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group p-2 xs:p-3 rounded-lg xs:rounded-xl font-semibold transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        ${
          variant === "default"
            ? `bg-gradient-to-br ${
                active
                  ? "from-blue-500 to-purple-500 text-white shadow-lg"
                  : "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
              }`
            : variant === "danger"
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
              : "bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed grayscale"
            : "hover:shadow-md"
        }
        border border-gray-200 dark:border-gray-600
        ${size === "small" ? "text-sm" : "text-base"}
      `}
    >
      <div
        className={`flex items-center justify-center ${size === "small" ? "text-base" : "text-lg"}`}
      >
        {children}
      </div>

      {/* Tooltip - Hidden on mobile */}
      <div className="hidden sm:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {tooltip}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>

      {/* Active indicator */}
      {active && (
        <div className="absolute bottom-1 xs:bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
      )}
    </button>
  );

  const DropdownMenu = ({
    children,
    isOpen,
    onClose,
    position = "left",
  }: {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    position?: "left" | "right";
  }) => {
    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div
          className={`absolute top-full ${
            position === "right" ? "right-0" : "left-0"
          } mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 xs:p-4 min-w-[160px] xs:min-w-[200px] backdrop-blur-lg bg-white/95 dark:bg-gray-800/95`}
        >
          {children}
        </div>
      </>
    );
  };

  // Mobile More Menu Content
  const MobileMoreMenu = () => (
    <div className="sm:hidden absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[200px] backdrop-blur-lg">
      <div className="space-y-2">
        {/* Lists & Blockquote */}
        <div className="grid grid-cols-2 gap-2">
          <MenuButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
            tooltip="Bullet List"
            size="small"
          >
            <FaListUl />
          </MenuButton>

          <MenuButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            tooltip="Numbered List"
            size="small"
          >
            <FaListOl />
          </MenuButton>

          <MenuButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive("blockquote")}
            tooltip="Blockquote"
            size="small"
          >
            <FaQuoteLeft />
          </MenuButton>

          <MenuButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            tooltip="Horizontal Rule"
            size="small"
          >
            <FaMinus />
          </MenuButton>
        </div>

        {/* History */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <MenuButton
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}
            tooltip="Undo"
            size="small"
          >
            <FaUndo />
          </MenuButton>

          <MenuButton
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}
            tooltip="Redo"
            size="small"
          >
            <FaRedo />
          </MenuButton>
        </div>
      </div>
    </div>
  );

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-4 xs:p-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl xs:rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-gray-500 dark:text-gray-400 text-sm xs:text-lg font-semibold">
          Loading Editor...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl xs:rounded-2xl p-3 xs:p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 xs:gap-2 relative">
        {/* Text Formatting - Always visible */}
        <div className="flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            tooltip="Bold (Ctrl+B)"
          >
            <FaBold />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            tooltip="Italic (Ctrl+I)"
          >
            <FaItalic />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            tooltip="Strikethrough"
          >
            <FaStrikethrough />
          </MenuButton>

          {/* Code button hidden on mobile */}
          <div className="hidden xs:block">
            <MenuButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              active={editor.isActive("code")}
              tooltip="Inline Code"
            >
              <FaCode />
            </MenuButton>
          </div>
        </div>

        {/* Headings & Paragraph */}
        <div className="hidden sm:flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm">
          <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            tooltip="Paragraph"
          >
            <FaParagraph />
          </MenuButton>

          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            tooltip="Heading 1"
          >
            <div className="flex items-center gap-1">
              <FaHeading className="text-sm" />
              <span className="text-xs font-bold">1</span>
            </div>
          </MenuButton>

          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            tooltip="Heading 2"
          >
            <div className="flex items-center gap-1">
              <FaHeading className="text-sm" />
              <span className="text-xs font-bold">2</span>
            </div>
          </MenuButton>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm relative">
          <MenuButton
            onClick={() =>
              setActiveDropdown(activeDropdown === "media" ? null : "media")
            }
            tooltip="Insert Media"
          >
            <div className="flex items-center gap-1">
              <FaImage />
              <span className="hidden xs:inline text-xs">▾</span>
            </div>
          </MenuButton>

          <MenuButton onClick={addLink} tooltip="Add Link">
            <FaLink />
          </MenuButton>

          <DropdownMenu
            isOpen={activeDropdown === "media"}
            onClose={() => setActiveDropdown(null)}
          >
            <div className="space-y-2">
              <button
                onClick={addImage}
                className="w-full flex items-center gap-3 p-2 xs:p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 transition-colors text-sm xs:text-base"
              >
                <FaImage className="text-blue-500 text-base xs:text-lg" />
                <span>Insert Image</span>
              </button>
              <button
                onClick={addVideo}
                className="w-full flex items-center gap-3 p-2 xs:p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 transition-colors text-sm xs:text-base"
              >
                <FaVideo className="text-purple-500 text-base xs:text-lg" />
                <span>Insert Video</span>
              </button>
            </div>
          </DropdownMenu>
        </div>

        {/* Colors */}
        <div className="hidden xs:flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm relative">
          <MenuButton
            onClick={() =>
              setActiveDropdown(activeDropdown === "colors" ? null : "colors")
            }
            tooltip="Text Color"
          >
            <FaPalette />
          </MenuButton>

          <DropdownMenu
            isOpen={activeDropdown === "colors"}
            onClose={() => setActiveDropdown(null)}
          >
            <div className="grid grid-cols-4 gap-2">
              {[
                { color: "hsl(var(--foreground))", name: "Foreground" },
                { color: "hsl(var(--destructive))", name: "Destructive" },
                { color: "hsl(var(--chart-2))", name: "Success" },
                { color: "hsl(var(--chart-1))", name: "Primary" },
                { color: "hsl(var(--chart-4))", name: "Accent" },
                { color: "var(--gold)", name: "Gold" },
                { color: "hsl(var(--chart-5))", name: "Info" },
                { color: "hsl(var(--muted-foreground))", name: "Muted" },
              ].map(({ color, name }) => (
                <button
                  key={color}
                  onClick={() => setColor(color)}
                  className="w-6 h-6 xs:w-8 xs:h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: color }}
                  title={name}
                />
              ))}
            </div>
          </DropdownMenu>
        </div>

        {/* Mobile More Menu */}
        <div className="sm:hidden flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm relative">
          <MenuButton
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            tooltip="More Options"
          >
            <FaEllipsisH />
          </MenuButton>

          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMoreMenu(false)}
              />
              <MobileMoreMenu />
            </>
          )}
        </div>

        {/* Desktop Utilities */}
        <div className="hidden sm:flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm">
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            tooltip="Horizontal Rule"
          >
            <FaMinus />
          </MenuButton>
        </div>

        {/* Desktop History */}
        <div className="hidden sm:flex items-center gap-1 p-1 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl shadow-sm">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            tooltip="Undo (Ctrl+Z)"
          >
            <FaUndo />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            tooltip="Redo (Ctrl+Y)"
          >
            <FaRedo />
          </MenuButton>
        </div>

        {/* Active State Indicator - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-end">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {editor.isActive("heading", { level: 1 }) && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 xs:px-3 py-1 rounded-full font-medium text-xs xs:text-sm">
                H1
              </span>
            )}
            {editor.isActive("heading", { level: 2 }) && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 xs:px-3 py-1 rounded-full font-medium text-xs xs:text-sm">
                H2
              </span>
            )}
            {editor.isActive("bold") && (
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 xs:px-3 py-1 rounded-full font-medium text-xs xs:text-sm">
                Bold
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Active State Bar */}
      <div className="sm:hidden mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
          {editor.isActive("heading", { level: 1 }) && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Heading 1
            </span>
          )}
          {editor.isActive("heading", { level: 2 }) && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Heading 2
            </span>
          )}
          {editor.isActive("bold") && (
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Bold
            </span>
          )}
          {editor.isActive("italic") && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Italic
            </span>
          )}
        </div>
      </div>

      {/* Mobile Help Tip */}
      <div className="sm:hidden mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 text-xs">
          <span className="font-semibold">💡 Tip:</span>
          Tap buttons to format text
        </div>
      </div>

      {/* Desktop Help Tip */}
      <div className="hidden sm:block mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300 text-sm">
          <span className="font-semibold">💡 Pro Tip:</span>
          Use keyboard shortcuts for faster editing - Ctrl+B for bold, Ctrl+I
          for italic
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
