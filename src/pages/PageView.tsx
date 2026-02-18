import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentRole } from '@/lib/auth';
import * as api from '@/api/pages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const role = getCurrentRole();

  const res = slug ? api.getPage(role, slug) : null;

  if (!res || !res.success || !res.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">
            {res?.status === 403 ? 'Access Denied' : 'Page Not Found'}
          </h1>
          <p className="text-muted-foreground">
            {res?.status === 403
              ? 'You do not have permission to view this page.'
              : 'This page does not exist or is not published.'}
          </p>
          <p className="text-sm text-muted-foreground">Status: {res?.status || 404}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const page = res.data;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Badge className={page.status === 'published' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
          {page.status}
        </Badge>
      </div>
      <article>
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-foreground">
          {page.content}
        </div>
      </article>
      <p className="text-xs text-muted-foreground">
        Last updated: {new Date(page.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default PageView;
