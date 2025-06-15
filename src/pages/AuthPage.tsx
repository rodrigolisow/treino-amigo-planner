import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Mail, Lock, User, Chrome } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const signupSchema = z.object({
  displayName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-blue-50 to-fitness-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onLogin = async (data: LoginForm) => {
    setIsSubmitting(true);
    await signIn(data.email, data.password);
    setIsSubmitting(false);
  };

  const onSignup = async (data: SignupForm) => {
    setIsSubmitting(true);
    await signUp(data.email, data.password, data.displayName);
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-blue-50 to-fitness-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 rounded-full">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 bg-clip-text text-transparent">
              Meu APP
            </h1>
          </div>
          <p className="text-fitness-gray-600 text-lg">
            Organize seus treinos de forma inteligente
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-fitness-gray-800">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription>
              Entre na sua conta ou crie uma nova para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-fitness-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-fitness-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 border-fitness-gray-200 focus:border-fitness-blue-500 focus:ring-fitness-blue-500"
                        {...registerLogin('email')}
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="text-sm text-destructive">{loginErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-fitness-gray-700">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-fitness-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-fitness-gray-200 focus:border-fitness-blue-500 focus:ring-fitness-blue-500"
                        {...registerLogin('password')}
                      />
                    </div>
                    {loginErrors.password && (
                      <p className="text-sm text-destructive">{loginErrors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-blue-700 hover:from-fitness-blue-700 hover:to-fitness-blue-800 text-white font-medium py-3"
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-fitness-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-fitness-gray-500">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full border-fitness-gray-200 hover:bg-fitness-gray-50"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-fitness-gray-700">
                      Nome completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-fitness-gray-400" />
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Seu nome"
                        className="pl-10 border-fitness-gray-200 focus:border-fitness-blue-500 focus:ring-fitness-blue-500"
                        {...registerSignup('displayName')}
                      />
                    </div>
                    {signupErrors.displayName && (
                      <p className="text-sm text-destructive">{signupErrors.displayName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-fitness-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-fitness-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 border-fitness-gray-200 focus:border-fitness-blue-500 focus:ring-fitness-blue-500"
                        {...registerSignup('email')}
                      />
                    </div>
                    {signupErrors.email && (
                      <p className="text-sm text-destructive">{signupErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-fitness-gray-700">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-fitness-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-fitness-gray-200 focus:border-fitness-blue-500 focus:ring-fitness-blue-500"
                        {...registerSignup('password')}
                      />
                    </div>
                    {signupErrors.password && (
                      <p className="text-sm text-destructive">{signupErrors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-fitness-gray-700">
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-fitness-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-fitness-gray-200 focus:border-fitness-blue-500 focus:ring-fitness-blue-500"
                        {...registerSignup('confirmPassword')}
                      />
                    </div>
                    {signupErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{signupErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 hover:from-fitness-orange-600 hover:to-fitness-orange-700 text-white font-medium py-3"
                  >
                    {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-fitness-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-fitness-gray-500">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full border-fitness-gray-200 hover:bg-fitness-gray-50"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-fitness-gray-500 mt-6">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" className="text-fitness-blue-600 hover:underline">
            Termos de Uso
          </a>{' '}
          e{' '}
          <a href="#" className="text-fitness-blue-600 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;