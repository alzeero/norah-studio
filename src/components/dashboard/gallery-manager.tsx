"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, Upload, X } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImage,
} from "@/lib/actions/content";
import { Input, Label, Textarea, Select, FieldError } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Category, GalleryImage } from "@/lib/types";

export function GalleryManager({
  categories,
  images,
}: {
  categories: Category[];
  images: GalleryImage[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploadCategoryId, setUploadCategoryId] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCaption, setEditCaption] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<Category | null>(null);

  function run(action: () => Promise<void>, onDone?: () => void) {
    setError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        await action();
        onDone?.();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setBusy(false);
      }
    });
  }

  function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    run(() => createCategory(newCategoryName), () => setNewCategoryName(""));
  }

  function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image to upload first.");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    formData.set("category_id", uploadCategoryId);
    formData.set("caption", uploadCaption);
    run(() => uploadGalleryImage(formData), () => {
      setUploadCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function openEdit(image: GalleryImage) {
    setEditingImage(image);
    setEditCategoryId(image.category_id ?? "");
    setEditCaption(image.caption ?? "");
  }

  function saveEdit() {
    if (!editingImage) return;
    run(
      () =>
        updateGalleryImage(editingImage.id, {
          category_id: editCategoryId || null,
          caption: editCaption || null,
        }),
      () => setEditingImage(null)
    );
  }

  return (
    <div className="space-y-10">
      <FieldError>{error}</FieldError>

      {/* Categories */}
      <section>
        <h2 className="text-heading font-medium">Categories</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Create the categories visitors can filter by (Weddings, Portrait, Family…).
        </p>

        <form onSubmit={handleAddCategory} className="mt-4 flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Weddings"
            className="max-w-xs"
          />
          <Button type="submit" size="md" disabled={busy}>
            <Plus size={16} /> Add
          </Button>
        </form>

        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center gap-2 rounded-full border border-border py-1.5 ps-4 pe-2 text-sm"
            >
              {category.name}
              <button
                type="button"
                aria-label={`Delete ${category.name}`}
                onClick={() => setDeleteCategoryTarget(category)}
                className="rounded-full p-1 text-fg-muted hover:bg-red-500/10 hover:text-red-500"
              >
                <X size={13} />
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-fg-muted">No categories yet — add your first one above.</p>
          )}
        </ul>
      </section>

      <div className="h-px bg-border" />

      {/* Upload */}
      <section>
        <h2 className="text-heading font-medium">Upload an image</h2>
        <form onSubmit={handleUpload} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="file">Image file</Label>
            <input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="block w-full text-sm text-fg-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold hover:file:bg-gold/25"
            />
          </div>
          <div>
            <Label htmlFor="upload-category">Category</Label>
            <Select
              id="upload-category"
              value={uploadCategoryId}
              onChange={(e) => setUploadCategoryId(e.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="upload-caption">Caption (optional)</Label>
            <Input id="upload-caption" value={uploadCaption} onChange={(e) => setUploadCaption(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="sm:col-span-2 sm:w-fit">
            <Upload size={16} /> {busy ? "Uploading…" : "Upload image"}
          </Button>
        </form>
      </section>

      <div className="h-px bg-border" />

      {/* Existing images */}
      <section>
        <h2 className="text-heading font-medium">Gallery ({images.length})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => {
            const category = categories.find((c) => c.id === image.category_id);
            return (
              <div key={image.id} className="overflow-hidden rounded-lg border border-border">
                <div className="relative aspect-[4/3] bg-bg-elevated">
                  <Image src={image.url} alt={image.caption ?? ""} fill className="object-cover" />
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-sm text-fg-muted">
                    {category?.name ?? "Uncategorized"}
                    {image.caption ? ` · ${image.caption}` : ""}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      title="Move up"
                      disabled={index === 0 || busy}
                      onClick={() => run(() => reorderGalleryImage(image.id, "up", image.sort_order))}
                      className="rounded p-1.5 text-fg-muted hover:bg-gold/10 hover:text-gold disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      title="Move down"
                      disabled={index === images.length - 1 || busy}
                      onClick={() => run(() => reorderGalleryImage(image.id, "down", image.sort_order))}
                      className="rounded p-1.5 text-fg-muted hover:bg-gold/10 hover:text-gold disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => openEdit(image)}
                      className="rounded p-1.5 text-fg-muted hover:bg-gold/10 hover:text-gold"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => setDeleteTarget(image)}
                      className="ms-auto rounded p-1.5 text-fg-muted hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {images.length === 0 && (
            <p className="text-sm text-fg-muted">No images yet — upload your first one above.</p>
          )}
        </div>
      </section>

      {/* Edit dialog */}
      <Dialog open={!!editingImage} onClose={() => setEditingImage(null)} title="Edit image">
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Select id="edit-category" value={editCategoryId} onChange={(e) => setEditCategoryId(e.target.value)}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-caption">Caption</Label>
            <Textarea id="edit-caption" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditingImage(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={busy}>
              Save changes
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete image confirm */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this image?"
        description="This can't be undone. The file will be permanently removed from storage."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={busy}
            onClick={() =>
              deleteTarget &&
              run(() => deleteGalleryImage(deleteTarget.id, deleteTarget.storage_path), () =>
                setDeleteTarget(null)
              )
            }
          >
            Delete
          </Button>
        </div>
      </Dialog>

      {/* Delete category confirm */}
      <Dialog
        open={!!deleteCategoryTarget}
        onClose={() => setDeleteCategoryTarget(null)}
        title={`Delete "${deleteCategoryTarget?.name}"?`}
        description="Images in this category will become Uncategorized, not deleted."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteCategoryTarget(null)}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={busy}
            onClick={() =>
              deleteCategoryTarget &&
              run(() => deleteCategory(deleteCategoryTarget.id), () => setDeleteCategoryTarget(null))
            }
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
