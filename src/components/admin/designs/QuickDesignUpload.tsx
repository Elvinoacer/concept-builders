"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiCheck,
  FiUploadCloud,
  FiImage,
  FiX,
  FiChevronDown,
  FiAlertCircle,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  publicUrl?: string;
  errorMessage?: string;
}

interface DesignCard {
  id: string;
  name: string;
  categoryId: string;
  images: UploadingImage[];
  status: "drafting" | "creating" | "done" | "error";
  errorMessage?: string;
  createdDesignId?: string;
}

interface Category {
  id: string;
  name: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

let cardCounter = 0;
const generateId = () => `card-${Date.now()}-${++cardCounter}`;
let imageCounter = 0;
const generateImageId = () => `img-${Date.now()}-${++imageCounter}`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// ── Upload a single file via presigned URL ─────────────────────────────────────

async function uploadFileToR2(
  file: File,
  onProgress: (percent: number) => void,
  abortSignal?: AbortSignal,
): Promise<string> {
  // Step 1: Get presigned URL from our API
  const res = await fetch("/api/designs/generate-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || "image/jpeg",
      fileTypeCategory: "IMAGE",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to get upload URL: ${errText}`);
  }

  const { signedUrl, publicUrl } = await res.json();

  // Step 2: Upload directly to R2 via XHR (for progress tracking)
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (abortSignal) {
      abortSignal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload aborted"));
      });
    }

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(publicUrl);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", file.type || "image/jpeg");
    xhr.send(file);
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

const QuickDesignUpload = () => {
  const [cards, setCards] = useState<DesignCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Stats
  const totalCreated = cards.filter((c) => c.status === "done").length;
  const totalUploading = cards.reduce(
    (acc, c) => acc + c.images.filter((i) => i.status === "uploading").length,
    0,
  );
  const totalImages = cards.reduce((acc, c) => acc + c.images.length, 0);

  // ── Fetch categories ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(
            Array.isArray(data) ? data : data.categories || [],
          );
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Add a new design card ─────────────────────────────────────────────
  const addCard = useCallback(() => {
    const newCard: DesignCard = {
      id: generateId(),
      name: "",
      categoryId: categories[0]?.id || "",
      images: [],
      status: "drafting",
    };
    setCards((prev) => [newCard, ...prev]);
  }, [categories]);

  // ── Update card field ─────────────────────────────────────────────────
  const updateCard = useCallback(
    (cardId: string, updates: Partial<DesignCard>) => {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
      );
    },
    [],
  );

  // ── Remove card ───────────────────────────────────────────────────────
  const removeCard = useCallback((cardId: string) => {
    // Abort any in-progress uploads
    const controller = abortControllersRef.current.get(cardId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(cardId);
    }
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);

  // ── Handle files selected/dropped ─────────────────────────────────────
  const handleFilesSelected = useCallback(
    (cardId: string, files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );

      if (fileArray.length === 0) {
        toast.error("No image files selected");
        return;
      }

      const newImages: UploadingImage[] = fileArray.map((file) => ({
        id: generateImageId(),
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, images: [...c.images, ...newImages] }
            : c,
        ),
      );

      // Auto-fill name from first file if name is empty
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === cardId && !c.name.trim() && fileArray.length > 0) {
            // Derive name from folder path in filename or the first filename
            const firstName = fileArray[0].name;
            const baseName = firstName
              .replace(/\.(jpg|jpeg|png|webp|avif|gif)$/i, "")
              .replace(/[_-]/g, " ")
              .replace(/\d+$/, "")
              .trim();
            return { ...c, name: baseName || "Untitled Design" };
          }
          return c;
        }),
      );

      // Start uploading each file
      const controller = new AbortController();
      abortControllersRef.current.set(cardId, controller);

      // Upload up to 3 concurrently
      const queue = [...newImages];
      const MAX_CONCURRENT = 3;
      let active = 0;

      const processNext = () => {
        if (queue.length === 0 || controller.signal.aborted) return;

        while (active < MAX_CONCURRENT && queue.length > 0) {
          const img = queue.shift()!;
          active++;

          uploadFileToR2(
            img.file,
            (progress) => {
              setCards((prev) =>
                prev.map((c) =>
                  c.id === cardId
                    ? {
                        ...c,
                        images: c.images.map((i) =>
                          i.id === img.id ? { ...i, progress } : i,
                        ),
                      }
                    : c,
                ),
              );
            },
            controller.signal,
          )
            .then((publicUrl) => {
              setCards((prev) =>
                prev.map((c) =>
                  c.id === cardId
                    ? {
                        ...c,
                        images: c.images.map((i) =>
                          i.id === img.id
                            ? { ...i, status: "done", publicUrl, progress: 100 }
                            : i,
                        ),
                      }
                    : c,
                ),
              );
            })
            .catch((err) => {
              if (err.message === "Upload aborted") return;
              setCards((prev) =>
                prev.map((c) =>
                  c.id === cardId
                    ? {
                        ...c,
                        images: c.images.map((i) =>
                          i.id === img.id
                            ? {
                                ...i,
                                status: "error",
                                errorMessage: err.message,
                              }
                            : i,
                        ),
                      }
                    : c,
                ),
              );
            })
            .finally(() => {
              active--;
              processNext();
            });
        }
      };

      processNext();
    },
    [],
  );

  // ── Remove single image from card ─────────────────────────────────────
  const removeImage = useCallback((cardId: string, imageId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, images: c.images.filter((i) => i.id !== imageId) }
          : c,
      ),
    );
  }, []);

  // ── Create design in database ─────────────────────────────────────────
  const createDesign = useCallback(
    async (cardId: string) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      // Validation
      if (!card.name.trim()) {
        toast.error("Please enter a design name");
        return;
      }
      if (!card.categoryId) {
        toast.error("Please select a category");
        return;
      }

      const uploadedImages = card.images.filter((i) => i.status === "done");
      if (uploadedImages.length === 0) {
        toast.error("Wait for at least one image to finish uploading");
        return;
      }

      const pendingImages = card.images.filter(
        (i) => i.status === "uploading",
      );
      if (pendingImages.length > 0) {
        toast.error(
          `${pendingImages.length} image(s) still uploading — wait or remove them`,
        );
        return;
      }

      updateCard(cardId, { status: "creating" });

      try {
        const res = await fetch("/api/admin/designs/quick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: card.name.trim(),
            categoryId: card.categoryId,
            imageUrls: uploadedImages.map((i) => i.publicUrl!),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed (${res.status})`);
        }

        const design = await res.json();
        updateCard(cardId, {
          status: "done",
          createdDesignId: design.id,
        });
        toast.success(`"${card.name}" created with ${uploadedImages.length} images`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Creation failed";
        updateCard(cardId, { status: "error", errorMessage: msg });
        toast.error(msg);
      }
    },
    [cards, updateCard],
  );

  // ── Drag/Drop handlers ────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (cardId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelected(cardId, e.dataTransfer.files);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Top Status Bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {totalCreated} created
            </span>
          </div>
          {totalUploading > 0 && (
            <div className="flex items-center gap-2">
              <CgSpinner className="animate-spin text-blue-500" size={14} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {totalUploading} uploading
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FiImage className="text-gray-400" size={14} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalImages} total images
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={addCard}
          disabled={loadingCategories}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
        >
          <FiPlus size={18} />
          Add Design
        </motion.button>
      </motion.div>

      {/* ── Empty State ─────────────────────────────────────────────── */}
      {cards.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 sm:py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900"
        >
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-xl">
              <FiUploadCloud className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Design Upload
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6 px-4">
            Rapidly create designs by uploading images in bulk. Just name it,
            pick a category, drop your images, and hit create. No other
            details required — edit them later.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCard}
            disabled={loadingCategories}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 font-semibold disabled:opacity-50"
          >
            <FiPlus size={18} />
            {loadingCategories ? "Loading categories…" : "Add First Design"}
          </motion.button>
        </motion.div>
      )}

      {/* ── Design Cards ────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <DesignCardComponent
            key={card.id}
            card={card}
            categories={categories}
            onUpdateCard={updateCard}
            onRemoveCard={removeCard}
            onFilesSelected={handleFilesSelected}
            onRemoveImage={removeImage}
            onCreateDesign={createDesign}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Design Card Sub-component ──────────────────────────────────────────────────

interface DesignCardComponentProps {
  card: DesignCard;
  categories: Category[];
  onUpdateCard: (cardId: string, updates: Partial<DesignCard>) => void;
  onRemoveCard: (cardId: string) => void;
  onFilesSelected: (cardId: string, files: FileList | File[]) => void;
  onRemoveImage: (cardId: string, imageId: string) => void;
  onCreateDesign: (cardId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (cardId: string, e: React.DragEvent) => void;
}

const DesignCardComponent = ({
  card,
  categories,
  onUpdateCard,
  onRemoveCard,
  onFilesSelected,
  onRemoveImage,
  onCreateDesign,
  onDragOver,
  onDrop,
}: DesignCardComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadedCount = card.images.filter((i) => i.status === "done").length;
  const uploadingCount = card.images.filter(
    (i) => i.status === "uploading",
  ).length;
  const errorCount = card.images.filter((i) => i.status === "error").length;
  const allDone = card.images.length > 0 && uploadingCount === 0;

  const isDone = card.status === "done";
  const isCreating = card.status === "creating";
  const isError = card.status === "error";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDone
          ? "border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/10"
          : isError
            ? "border-red-300 dark:border-red-700 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-900/20 dark:to-rose-900/10"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 shadow-sm hover:shadow-md"
      }`}
    >
      {/* ── Card Header ─────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Status Indicator */}
          <div
            className={`flex-shrink-0 p-2.5 rounded-xl ${
              isDone
                ? "bg-emerald-100 dark:bg-emerald-800/30"
                : isCreating
                  ? "bg-blue-100 dark:bg-blue-800/30"
                  : isError
                    ? "bg-red-100 dark:bg-red-800/30"
                    : "bg-indigo-100 dark:bg-indigo-800/30"
            }`}
          >
            {isDone ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <FiCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
            ) : isCreating ? (
              <CgSpinner className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
            ) : isError ? (
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : (
              <FiImage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>

          {/* Name & Category Inputs */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              value={card.name}
              onChange={(e) =>
                onUpdateCard(card.id, { name: e.target.value })
              }
              placeholder="Design name…"
              disabled={isDone || isCreating}
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <div className="relative w-full sm:w-56">
              <select
                value={card.categoryId}
                onChange={(e) =>
                  onUpdateCard(card.id, { categoryId: e.target.value })
                }
                disabled={isDone || isCreating}
                className="w-full appearance-none px-4 py-2.5 pr-9 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Select category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Delete Card Button */}
          <button
            onClick={() => onRemoveCard(card.id)}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Remove this design card"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        {/* Error message */}
        {isError && card.errorMessage && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            <FiAlertCircle size={14} />
            {card.errorMessage}
            <button
              onClick={() => onUpdateCard(card.id, { status: "drafting", errorMessage: undefined })}
              className="ml-auto text-xs font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success message */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg"
          >
            <FiCheck size={14} />
            Design created successfully with {uploadedCount} image{uploadedCount !== 1 ? "s" : ""}
          </motion.div>
        )}
      </div>

      {/* ── Drop Zone & Images ──────────────────────────────────── */}
      {!isDone && (
        <div className="p-4 sm:p-5">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              onDragOver(e);
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              setIsDragOver(false);
              onDrop(card.id, e);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.01]"
                : "border-gray-300 dark:border-gray-600 bg-gray-50/30 dark:bg-gray-700/20 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesSelectedLocal(e.target.files);
                  e.target.value = ""; // Reset so same files can be re-selected
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-3 rounded-full transition-colors ${
                  isDragOver
                    ? "bg-indigo-100 dark:bg-indigo-800/30"
                    : "bg-gray-100 dark:bg-gray-700/50"
                }`}
              >
                <FiUploadCloud
                  className={`w-7 h-7 ${
                    isDragOver
                      ? "text-indigo-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragOver ? "Drop images here" : "Drag & drop images here"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  or <span className="text-indigo-500 font-medium">browse files</span>
                  {" "} • No size limit • Multiple files
                </p>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          {card.images.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Images ({uploadedCount}/{card.images.length})
                  {uploadingCount > 0 && (
                    <span className="ml-2 text-blue-500 text-xs">
                      {uploadingCount} uploading…
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="ml-2 text-red-500 text-xs">
                      {errorCount} failed
                    </span>
                  )}
                </h4>
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                <AnimatePresence mode="popLayout">
                  {card.images.map((img) => (
                    <ImageThumbnail
                      key={img.id}
                      image={img}
                      cardId={card.id}
                      onRemove={onRemoveImage}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Create Button */}
          {card.images.length > 0 && (
            <div className="mt-5 flex justify-end">
              <motion.button
                whileHover={allDone && !isCreating ? { scale: 1.03 } : {}}
                whileTap={allDone && !isCreating ? { scale: 0.97 } : {}}
                onClick={() => onCreateDesign(card.id)}
                disabled={!allDone || isCreating || uploadedCount === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  allDone && uploadedCount > 0
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {isCreating ? (
                  <>
                    <CgSpinner className="animate-spin" size={16} />
                    Creating…
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Create Design ({uploadedCount} image
                    {uploadedCount !== 1 ? "s" : ""})
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* ── Done state image preview ────────────────────────────── */}
      {isDone && card.images.length > 0 && (
        <div className="p-4 sm:p-5 pt-0 sm:pt-0">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {card.images
              .filter((i) => i.status === "done")
              .slice(0, 8)
              .map((img) => (
                <div
                  key={img.id}
                  className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-emerald-200 dark:border-emerald-800"
                >
                  <img
                    src={img.publicUrl || URL.createObjectURL(img.file)}
                    alt={img.file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            {uploadedCount > 8 && (
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                +{uploadedCount - 8}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );

  function handleFilesSelectedLocal(files: FileList) {
    onFilesSelected(card.id, files);
  }
};

// ── Image Thumbnail Sub-component ──────────────────────────────────────────────

interface ImageThumbnailProps {
  image: UploadingImage;
  cardId: string;
  onRemove: (cardId: string, imageId: string) => void;
}

const ImageThumbnail = ({ image, cardId, onRemove }: ImageThumbnailProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(image.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image.file]);

  const isUploading = image.status === "uploading";
  const isDone = image.status === "done";
  const isError = image.status === "error";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative aspect-square rounded-lg overflow-hidden group"
    >
      {/* Image Preview */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt={image.file.name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isUploading ? "brightness-75" : isDone ? "" : "brightness-50"
          }`}
          loading="lazy"
        />
      )}

      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          {/* Circular Progress */}
          <svg className="w-10 h-10" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${image.progress}, 100`}
              className="transition-all duration-300"
            />
          </svg>
          <span className="text-white text-xs font-bold mt-1">
            {image.progress}%
          </span>
        </div>
      )}

      {/* Done Indicator */}
      {isDone && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 left-1.5 p-1 bg-emerald-500 rounded-full shadow-lg"
        >
          <FiCheck className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Error Indicator */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/40">
          <FiAlertCircle className="w-6 h-6 text-white" />
        </div>
      )}

      {/* File Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-[10px] truncate" title={image.file.name}>
          {image.file.name}
        </p>
        <p className="text-white/70 text-[10px]">
          {formatFileSize(image.file.size)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(cardId, image.id);
        }}
        className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
        title="Remove image"
      >
        <FiX size={12} />
      </button>
    </motion.div>
  );
};

export default QuickDesignUpload;
