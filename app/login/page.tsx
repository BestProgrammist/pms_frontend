'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Train } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
// import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const [jshshir, setJshshir] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login({ jshshir, password });
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Login yoki parol noto\'g\'ri');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Train className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Vagon Ta'mir Tizimi</CardTitle>
          <CardDescription>
            Tizimga kirish uchun login va parolingizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jshshir">Login</Label>
              <Input
                id="jshshir"
                placeholder="admin"
                value={jshshir}
                onChange={(e) => setJshshir(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Kirish...' : 'Kirish'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo: istalgan login va parol bilan kiring
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}