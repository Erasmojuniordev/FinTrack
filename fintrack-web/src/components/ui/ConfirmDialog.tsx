import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

/**
 * Modal de confirmação customizado — substitui o window.confirm() nativo.
 * Controlado por prop `open`, seguindo o padrão de modais do React.
 */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
          }}
        />

        {/*
         * Wrapper fixo cuida do posicionamento central — transform: translate(-50%,-50%)
         * não pode ficar no motion.div porque o Framer Motion sobrescreve a prop transform
         * com suas próprias animações, quebrando o centering.
         */}
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 61,
          width: '360px',
        }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '28px 28px 24px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: description ? '8px' : '24px' }}>
            {title}
          </h3>

          {description && (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="md" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={danger ? 'danger' : 'primary'}
              size="md"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

export default ConfirmDialog;
