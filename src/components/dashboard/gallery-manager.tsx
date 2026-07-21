"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Trash2, Pencil, ArrowUp, ArrowDown, Upload } from "lucide-react";
import {
  createGalleryImageRecord,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImage,
} from "@/lib/actions/content";
import { uploadImageToStorage, removeImageFromStorage } from "@/lib/upload-image";
import { Input, Label, Textarea, FieldError } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { GalleryImage } from "@/lib/types";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadCaption, setUploadCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  async function run(action: () => Promise<void>, onDone?: () => void) {
    setError(null);
    setBusy(true);
    try {
      await action();
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ ما.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("يرجى اختيار صورة للرفع أولاً.");
      return;
    }

    setError(null);
    setBusy(true);

    let uploaded: { path: string; url: string } | null = null;
    try {
      uploaded = await uploadImageToStorage(file, "gallery");
      await createGalleryImageRecord({
        storage_path: uploaded.path,
        url: uploaded.url,
        caption: uploadCaption || null,
      });
      setUploadCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      // If the file made it to storage but the database record failed,
      // don't leave an orphaned file behind.
      if (uploaded) await removeImageFromStorage(uploaded.path).catch(() => {});
      setError(err instanceof Error ? err.message : "حدث خطأ ما.");
    } finally {
      setBusy(false);
    }
  }

  function openEdit(image: GalleryImage) {
    setEditingImage(image);
    setEditCaption(image.caption ?? "");
  }

  function saveEdit() {
    if (!editingImage) return;
    run(
      () => updateGalleryImage(editingImage.id, { caption: editCaption || null }),
      () => setEditingImage(null)
    );
  }

  return (
    <div className="space-y-10">
      <FieldError>{error}</FieldError>

      {/* Upload */}
      <section>
        <h2 className="text-heading font-medium">رفع صورة</h2>
        <p className="mt-1 text-sm text-fg-muted">
          تُرفع الصورة بجودتها ودقتها الأصلية بالكامل — بدون أي ضغط أو تصغير.
        </p>
        <form onSubmit={handleUpload} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="file">ملف الصورة</Label>
            <input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="block w-full text-sm text-fg-muted file:me-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold hover:file:bg-gold/25"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="upload-caption">وصف الصورة (اختياري)</Label>
            <Input id="upload-caption" value={uploadCaption} onChange={(e) => setUploadCaption(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full sm:col-span-2 sm:w-fit">
            <Upload size={16} /> {busy ? "جارٍ الرفع…" : "رفع الصورة"}
          </Button>
        </form>
      </section>

      <div className="h-px bg-border" />

      {/* Existing images */}
      <section>
        <h2 className="text-heading font-medium">المعرض ({images.length})</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={image.id} className="overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-[4/3] bg-bg-elevated">
                <Image src={image.url} alt={image.caption ?? ""} fill className="object-cover" />
              </div>
              <div className="space-y-2 p-3">
                {image.caption && <p className="truncate text-sm text-fg-muted">{image.caption}</p>}
                <div className="flex items-center gap-1.5">
                  <button
                    title="تحريك لأعلى"
                    disabled={index === 0 || busy}
                    onClick={() => run(() => reorderGalleryImage(image.id, "up", image.sort_order))}
                    className="rounded-lg p-2.5 text-fg-muted hover:bg-gold/10 hover:text-gold disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    title="تحريك لأسفل"
                    disabled={index === images.length - 1 || busy}
                    onClick={() => run(() => reorderGalleryImage(image.id, "down", image.sort_order))}
                    className="rounded-lg p-2.5 text-fg-muted hover:bg-gold/10 hover:text-gold disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    title="تعديل"
                    onClick={() => openEdit(image)}
                    className="rounded-lg p-2.5 text-fg-muted hover:bg-gold/10 hover:text-gold"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    title="حذف"
                    onClick={() => setDeleteTarget(image)}
                    className="ms-auto rounded-lg p-2.5 text-fg-muted hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <p className="text-sm text-fg-muted">لا توجد صور بعد — ارفعي أول صورة أعلاه.</p>
          )}
        </div>
      </section>

      {/* Edit dialog */}
      <Dialog open={!!editingImage} onClose={() => setEditingImage(null)} title="تعديل الصورة">
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-caption">وصف الصورة</Label>
            <Textarea id="edit-caption" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setEditingImage(null)}>
              إلغاء
            </Button>
            <Button onClick={saveEdit} disabled={busy}>
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete image confirm */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="هل تريدين حذف هذه الصورة؟"
        description="لا يمكن التراجع عن هذا الإجراء. سيتم حذف الملف نهائيًا من التخزين."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            إلغاء
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
            حذف
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
