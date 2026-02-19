"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getCurrentRole } from "@/lib/auth";
import * as api from "@/api/pages";
import { Page } from "@/types/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Save, Eye, ArrowLeft } from "lucide-react";

export default function EditorPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const role = getCurrentRole();
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!user || (role !== "editor" && role !== "admin" && role !== "super-admin")) {
      router.replace("/login");
      return;
    }
    refreshPages();
  }, [role, user]);

  const refreshPages = () => {
    const res = api.listPages(role);
    if (res.success && res.data) setPages(res.data);
  };

  const handleNew = () => {
    setIsNew(true);
    setEditing(null);
    setTitle("");
    setSlug("");
    setContent("");
  };

  const handleEdit = (page: Page) => {
    setIsNew(false);
    setEditing(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
  };

  const handleSave = () => {
    if (isNew) {
      const res = api.createDraftPage(role!, title, content, slug);
      if (res.success) {
        toast.success("Draft created");
        setIsNew(false);
        setEditing(res.data!);
        refreshPages();
      } else {
        toast.error(res.error || "Failed to create");
      }
    } else if (editing) {
      const res = api.updateDraftPage(role!, editing.id, { title, content });
      if (res.success) {
        toast.success("Draft updated");
        setEditing(res.data!);
        refreshPages();
      } else {
        toast.error(res.error || "Failed to update");
      }
    }
  };

  const handlePreview = () => {
    if (editing) router.push(`/page/${editing.slug}`);
    else if (slug) {
      handleSave();
      setTimeout(() => router.push(`/page/${slug}`), 100);
    }
  };

  const showForm = isNew || editing;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editor Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Logged in as <Badge variant="outline">{role}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
            Switch Role
          </Button>
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-1" /> New Page
          </Button>
        </div>
      </div>
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{isNew ? "Create New Page" : `Editing: ${editing?.title}`}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setIsNew(false); }}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" />
              </div>
              {isNew && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="page-slug" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Content</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your page content here..." rows={12} className="font-mono text-sm" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save Draft</Button>
              <Button variant="outline" onClick={handlePreview}><Eye className="h-4 w-4 mr-1" /> Preview</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">All Pages</h2>
        {pages.length === 0 && <p className="text-muted-foreground text-sm">No pages yet. Create your first page.</p>}
        {pages.map((page) => (
          <Card key={page.id} className="cursor-pointer hover:border-muted-foreground/30 transition-colors" onClick={() => handleEdit(page)}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{page.title}</p>
                <p className="text-sm text-muted-foreground">/{page.slug}</p>
              </div>
              <Badge className={page.status === "published" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>{page.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
