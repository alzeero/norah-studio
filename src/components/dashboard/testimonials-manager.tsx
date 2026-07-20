"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/content";
import { Input, Label, Textarea, FieldError } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Testimonial } from "@/lib/types";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [editName, setEditName] = useState("");
  const [editComment, setEditComment] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  function run(action: () => Promise<void>, onDone?: () => void) {
    setError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        await action();
        onDone?.();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ ما.");
      } finally {
        setBusy(false);
      }
    });
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    run(() => createTestimonial(name, comment), () => {
      setName("");
      setComment("");
    });
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setEditName(t.customer_name);
    setEditComment(t.comment);
  }

  function saveEdit() {
    if (!editing) return;
    run(() => updateTestimonial(editing.id, editName, editComment), () => setEditing(null));
  }

  return (
    <div className="space-y-10">
      <FieldError>{error}</FieldError>

      <section>
        <h2 className="text-heading font-medium">إضافة رأي عميل</h2>
        <p className="mt-1 text-sm text-fg-muted">الصقي رأي العميل الحقيقي — يمكن كتابته بالعربية أو الإنجليزية.</p>
        <form onSubmit={handleAdd} className="mt-4 max-w-lg space-y-4">
          <div>
            <Label htmlFor="t-name">اسم العميل</Label>
            <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="t-comment">التعليق</Label>
            <Textarea id="t-comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy}>
            <Plus size={16} /> إضافة الرأي
          </Button>
        </form>
      </section>

      <div className="h-px bg-border" />

      <section>
        <h2 className="text-heading font-medium">جميع الآراء ({testimonials.length})</h2>
        <div className="mt-4 space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gold">{t.customer_name}</p>
                <p className="mt-1 truncate text-sm text-fg-muted">{t.comment}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="rounded p-1.5 text-fg-muted hover:bg-gold/10 hover:text-gold"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(t)}
                  className="rounded p-1.5 text-fg-muted hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <p className="text-sm text-fg-muted">لا توجد آراء بعد.</p>}
        </div>
      </section>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="تعديل الرأي">
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-t-name">اسم العميل</Label>
            <Input id="edit-t-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-t-comment">التعليق</Label>
            <Textarea id="edit-t-comment" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
            <Button onClick={saveEdit} disabled={busy}>
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="هل تريدين حذف هذا الرأي؟"
        description="لا يمكن التراجع عن هذا الإجراء."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            إلغاء
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={busy}
            onClick={() =>
              deleteTarget && run(() => deleteTestimonial(deleteTarget.id), () => setDeleteTarget(null))
            }
          >
            حذف
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
