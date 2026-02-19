"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import * as api from "@/api/pages";
import { Page } from "@/types/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, GlobeLock, Trash2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const role = getCurrentRole();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (role !== "admin" && role !== "super-admin") {
      router.replace("/login");
      return;
    }
    refreshPages();
  }, [role]);

  const refreshPages = () => {
    const res = api.listPages(role);
    if (res.success && res.data) setPages(res.data);
  };

  const handlePublish = (id: string) => {
    const res = api.publishPage(role, id);
    if (res.success) {
      toast.success("Page published");
      refreshPages();
    } else toast.error(res.error);
  };

  const handleUnpublish = (id: string) => {
    const res = api.unpublishPage(role, id);
    if (res.success) {
      toast.success("Page unpublished");
      refreshPages();
    } else toast.error(res.error);
  };

  const handleDelete = (id: string) => {
    const res = api.deletePageById(role, id);
    if (res.success) {
      toast.success("Page deleted");
      refreshPages();
    } else toast.error(res.error);
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Logged in as <Badge variant="outline">{role}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/editor")}>
            Editor View
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
            Switch Role
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Manage Pages</h2>
        {pages.length === 0 && <p className="text-muted-foreground text-sm">No pages yet.</p>}
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="font-medium">{page.title}</p>
                <p className="text-sm text-muted-foreground">
                  /{page.slug} • Created by {page.createdBy}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    page.status === "published"
                      ? "bg-success text-success-foreground"
                      : "bg-warning text-warning-foreground"
                  }
                >
                  {page.status}
                </Badge>
                {page.status === "draft" ? (
                  <Button size="sm" onClick={() => handlePublish(page.id)}>
                    <Globe className="h-4 w-4 mr-1" /> Publish
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleUnpublish(page.id)}>
                    <GlobeLock className="h-4 w-4 mr-1" /> Unpublish
                  </Button>
                )}
                {role === "super-admin" && (
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
