import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Transaction } from '@/types/transaction';
import type { Category } from '@/types/category';
import { toCents, fromCents } from '@/utils/formatCurrency';

const schema = z.object({
  description: z.string().min(1, 'Descrição obrigatória.').max(200),
  amount: z.number({ invalid_type_error: 'Informe um valor.' }).positive('O valor deve ser maior que zero.'),
  type: z.enum(['1', '2']),
  date: z.string().min(1, 'Data obrigatória.'),
  categoryId: z.string().optional(),
  notes: z.string().max(500).optional(),
  isRecurring: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  transaction?: Transaction | null; // null = criação, preenchido = edição
  categories: Category[];
  isSaving: boolean;
  onSubmit: (data: {
    description: string;
    amountInCents: number;
    type: 1 | 2;
    date: string;
    categoryId: string | null;
    notes: string | null;
    isRecurring: boolean;
  }) => void;
  onCancel: () => void;
}

/**
 * Formulário de criação e edição de transação.
 * Usa React Hook Form + Zod para validação tipada.
 * Converte o valor monetário entre decimal (exibição) e centavos (backend).
 */
const TransactionForm = ({ transaction, categories, isSaving, onSubmit, onCancel }: TransactionFormProps) => {
  const isEditing = transaction != null;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      type: '1',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // watch reage a mudanças dos campos — necessário para refletir seleção visualmente
  const selectedType = watch('type');
  const isRecurring = watch('isRecurring');

  // Preenche o formulário ao editar
  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: fromCents(transaction.amountInCents),
        type: String(transaction.type) as '1' | '2',
        date: transaction.date.split('T')[0],
        categoryId: transaction.categoryId ?? '',
        notes: transaction.notes ?? '',
        isRecurring: transaction.isRecurring ?? false,
      });
    }
  }, [transaction, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      description: data.description,
      amountInCents: toCents(data.amount),
      type: Number(data.type) as 1 | 2,
      date: new Date(data.date + 'T12:00:00').toISOString(),
      categoryId: data.categoryId || null,
      notes: data.notes || null,
      isRecurring: data.isRecurring ?? false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>

        {/* Tipo de transação — watch('type') atualiza selectedType a cada mudança */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['1', '2'] as const).map((value) => {
            const label = value === '1' ? 'Receita' : 'Despesa';
            const color = value === '1' ? '#34D399' : '#F87171';
            const isActive = selectedType === value;
            return (
              <label
                key={value}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1.5px solid ${isActive ? color : 'var(--color-border)'}`,
                  backgroundColor: isActive ? `${color}15` : 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? color : 'var(--color-text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                <input type="radio" value={value} {...register('type')} style={{ display: 'none' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                {label}
              </label>
            );
          })}
        </div>

        <Input
          label="Descrição"
          placeholder="Ex: Supermercado, Salário..."
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />

        <Input
          label="Data"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />

        {/* Categoria */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
            Categoria
          </label>
          <select
            {...register('categoryId')}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 14px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-elevated)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Observações (opcional)"
          placeholder="Detalhes adicionais..."
          error={errors.notes?.message}
          {...register('notes')}
        />

        {/* Toggle de transação recorrente */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '12px',
            border: `1.5px solid ${isRecurring ? 'var(--color-primary)' : 'var(--color-border)'}`,
            backgroundColor: isRecurring ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
              Transação recorrente
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Será repetida automaticamente
            </p>
          </div>
          {/* Toggle visual — input checkbox oculto controlado pelo RHF */}
          <input type="checkbox" {...register('isRecurring')} style={{ display: 'none' }} />
          <div
            style={{
              width: '40px',
              height: '22px',
              borderRadius: '11px',
              backgroundColor: isRecurring ? 'var(--color-primary)' : 'var(--color-border)',
              position: 'relative',
              transition: 'background-color 0.2s',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '3px',
                left: isRecurring ? '21px' : '3px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'white',
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </label>

        {/* Ações */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
          <Button type="button" variant="secondary" onClick={onCancel} style={{ flex: 1 }}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSaving} style={{ flex: 1 }}>
            {isEditing ? 'Salvar alterações' : 'Adicionar transação'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
