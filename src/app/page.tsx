"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentRole } from "@/lib/auth";
import { Role } from "@/types/page";
import * as api from "@/api/pages";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | undefined>(undefined);
  const res = api.listPages(role);
  const pages = res.success && res.data ? res.data : [];

  useEffect(() => {
    setRole(getCurrentRole());
  }, []);

  const publishedPages = pages.filter((p) => p.status === "published");

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Published Pages</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={() => router.push("/login")}>
            {role ? "Dashboard" : "Log In"}
          </Button>
        </div>
      </div>

      {publishedPages.length === 0 && (
        <p className="text-muted-foreground">No published pages yet.</p>
      )}

      {publishedPages.map((page) => (
        <Link key={page.id} href={`/page/${page.slug}`}>
          <Card className="hover:border-muted-foreground/30 transition-colors cursor-pointer mb-3">
            <CardContent className="py-4">
              <p className="font-medium">{page.title}</p>
              <p className="text-sm text-muted-foreground">/{page.slug}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
