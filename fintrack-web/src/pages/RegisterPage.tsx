import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter ao menos 2 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({ name, email, password }: RegisterFormData) =>
    registerUser({ name, email, password });

  return (
    <AuthLayout title="Criar sua conta" subtitle="Comece a controlar suas finanças hoje.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          autoComplete="name"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmar senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repita sua senha"
          autoComplete="new-password"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Mensagem de erro da API */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-lg px-4 py-3"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full" loading={isLoading}>
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Já tem uma conta?{' '}
        <Link
          to="/login"
          className="text-[var(--color-primary)] font-medium hover:underline transition-colors"
        >
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
