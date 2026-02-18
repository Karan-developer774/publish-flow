import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCurrentRole, getAllRoles } from '@/lib/auth';
import { Role } from '@/types/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Edit, Eye, Crown } from 'lucide-react';

const ROLE_META: Record<Role, { icon: typeof Shield; description: string; redirect: string }> = {
  'viewer': { icon: Eye, description: 'Can only view published pages', redirect: '/' },
  'editor': { icon: Edit, description: 'Can create and edit draft pages', redirect: '/editor' },
  'admin': { icon: Shield, description: 'Can publish/unpublish pages', redirect: '/admin' },
  'super-admin': { icon: Crown, description: 'Can manage roles + everything', redirect: '/admin' },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);

  const handleLogin = () => {
    if (!selected) return;
    setCurrentRole(selected);
    navigate(ROLE_META[selected].redirect);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CMS Access Control</h1>
          <p className="text-muted-foreground">Select a role to log in (mock authentication)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getAllRoles().map((role) => {
            const meta = ROLE_META[role];
            const Icon = meta.icon;
            const isSelected = selected === role;
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-muted-foreground/30'
                }`}
                onClick={() => setSelected(role)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-4 w-4" />
                    {role}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{meta.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button className="w-full" size="lg" disabled={!selected} onClick={handleLogin}>
          Log in as {selected || '...'}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
