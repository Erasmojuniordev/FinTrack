import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { CategoryIcon } from '@/utils/categoryIcons';
import type { Transaction } from '@/types/transaction';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AppLayout from '@/components/layout/AppLayout';
import TransactionForm from '@/components/features/transactions/TransactionForm';

// Nomes dos meses em português para o cabeçalho de cada grupo
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

interface MonthGroup {
  key: string;       // "2026-03" — usado como key React
  label: string;     // "Março 2026"
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

/**
 * Agrupa a lista plana de transações por mês/ano, ordenando do mais recente ao mais antigo.
 * Cada grupo acumula subtotais de receita e despesa para exibir no cabeçalho do mês.
 */
function groupByMonth(transactions: Transaction[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();

  for (const t of transactions) {
    const date = new Date(t.date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // 0-indexed
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: `${MESES[month]} ${year}`,
        transactions: [],
        totalIncome: 0,
        totalExpense: 0,
      });
    }

    const group = map.get(key)!;
    group.transactions.push(t);

    // type vem como número (1=receita, 2=despesa) da API
    if ((t.type as unknown as number) === 1) {
      group.totalIncome += t.amountInCents;
    } else {
      group.totalExpense += t.amountInCents;
    }
  }

  // Ordena grupos do mais recente ao mais antigo
  return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
}

const TransactionsPage = () => {
  const {
    transactions,
    categories,
    summary,
    page,
    totalPages,
    totalCount,
    isLoadingTransactions,
    isSaving,
    fetchTransactions,
    fetchCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setPage,
  } = useTransactionStore();

  // Estado do modal de criação/edição: null = fechado, undefined = criação, Transaction = edição
  const [modalTransaction, setModalTransaction] = useState<Transaction | null | undefined>(undefined);
  const isModalOpen = modalTransaction !== undefined;

  // Estado do modal de confirmação de exclusão
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const handleSubmit = async (data: Parameters<typeof createTransaction>[0]) => {
    const success = modalTransaction
      ? await updateTransaction(modalTransaction.id, data)
      : await createTransaction(data);

    if (success) setModalTransaction(undefined);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteTransaction(deleteId);
    setDeleteId(null);
  };

  const openCreate = () => setModalTransaction(null);
  const openEdit = (t: Transaction) => setModalTransaction(t);
  const closeModal = () => setModalTransaction(undefined);

  const groups = groupByMonth(transactions);

  return (
    <AppLayout>
    <div style={{ backgroundColor: 'var(--color-background)', padding: '32px 40px' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            Transações
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {totalCount} {totalCount === 1 ? 'transação encontrada' : 'transações encontradas'}
          </p>
        </div>
        <Button onClick={openCreate} size="md" style={{ gap: '8px' }}>
          <Plus size={16} strokeWidth={2.5} />
          Nova transação
        </Button>
      </div>

      {/* Cards de resumo do período completo */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            {
              label: 'Receitas',
              value: formatCurrency(summary.totalIncomeInCents),
              icon: TrendingUp,
              color: '#34D399',
              bg: 'rgba(52,211,153,0.08)',
            },
            {
              label: 'Despesas',
              value: formatCurrency(summary.totalExpenseInCents),
              icon: TrendingDown,
              color: '#F87171',
              bg: 'rgba(248,113,113,0.08)',
            },
            {
              label: 'Saldo',
              value: formatCurrency(summary.balanceInCents),
              icon: Wallet,
              color: summary.balanceInCents >= 0 ? '#60A5FA' : '#F87171',
              bg: summary.balanceInCents >= 0 ? 'rgba(96,165,250,0.08)' : 'rgba(248,113,113,0.08)',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '20px 24px',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color, letterSpacing: '-0.02em' }}>{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lista agrupada por mês */}
      {isLoadingTransactions ? (
        <div style={{
          padding: '48px', textAlign: 'center',
          color: 'var(--color-text-secondary)', fontSize: '14px',
          borderRadius: '14px', border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}>
          Carregando...
        </div>
      ) : transactions.length === 0 ? (
        <div style={{
          padding: '64px', textAlign: 'center',
          borderRadius: '14px', border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}>
          <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>Nenhuma transação</p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Clique em "Nova transação" para começar.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {groups.map((group, groupIndex) => {
            const balance = group.totalIncome - group.totalExpense;
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05, duration: 0.3 }}
                style={{
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  overflow: 'hidden',
                }}
              >
                {/* Cabeçalho do mês */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'color-mix(in srgb, var(--color-border) 30%, transparent)',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {group.label}
                  </span>

                  {/* Subtotais do mês */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {group.totalIncome > 0 && (
                      <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 500 }}>
                        + {formatCurrency(group.totalIncome)}
                      </span>
                    )}
                    {group.totalExpense > 0 && (
                      <span style={{ fontSize: '12px', color: '#F87171', fontWeight: 500 }}>
                        − {formatCurrency(group.totalExpense)}
                      </span>
                    )}
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: balance >= 0 ? '#60A5FA' : '#F87171',
                      paddingLeft: '8px',
                      borderLeft: '1px solid var(--color-border)',
                    }}>
                      {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                    </span>
                  </div>
                </div>

                {/* Transações do mês */}
                {group.transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 24px',
                      gap: '16px',
                      borderBottom: index < group.transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    {/* Indicador de tipo */}
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: (transaction.type as unknown as number) === 1 ? '#34D399' : '#F87171',
                      flexShrink: 0,
                    }} />

                    {/* Ícone da categoria */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      backgroundColor: transaction.categoryColor ? transaction.categoryColor + '22' : 'var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <CategoryIcon
                        name={transaction.categoryIcon}
                        size={16}
                        color={transaction.categoryColor ?? 'var(--color-text-secondary)'}
                      />
                    </div>

                    {/* Descrição */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {transaction.description}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {transaction.categoryName ?? 'Sem categoria'} · {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {/* Valor */}
                    <p style={{
                      fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em',
                      color: (transaction.type as unknown as number) === 1 ? '#34D399' : '#F87171',
                      flexShrink: 0,
                    }}>
                      {(transaction.type as unknown as number) === 2 ? '− ' : '+ '}
                      {formatCurrency(transaction.amountInCents)}
                    </p>

                    {/* Ações */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(transaction)} style={{ padding: '6px' }}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(transaction.id)} style={{ padding: '6px', color: 'var(--color-danger)' }}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={16} />
          </Button>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Página {page} de {totalPages}
          </span>
          <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Modal de criação/edição */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)', zIndex: 40,
              }}
            />

            {/* Painel lateral */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
                backgroundColor: 'var(--color-surface)',
                borderLeft: '1px solid var(--color-border)',
                zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}
            >
              <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {modalTransaction ? 'Editar transação' : 'Nova transação'}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal} style={{ padding: '6px' }}>
                  <X size={18} />
                </Button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
                <TransactionForm
                  transaction={modalTransaction}
                  categories={categories}
                  isSaving={isSaving}
                  onSubmit={handleSubmit}
                  onCancel={closeModal}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de confirmação de exclusão */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir transação"
        description="Esta ação não pode ser desfeita. A transação será removida permanentemente."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
    </AppLayout>
  );
};

export default TransactionsPage;
