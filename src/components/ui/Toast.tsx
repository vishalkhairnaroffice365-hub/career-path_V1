import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUI, type Toast } from '../../context/UIContext';

const icons = {
  success: <CheckCircle size={16} className="text-success" />,
  error: <AlertCircle size={16} className="text-danger" />,
  info: <Info size={16} className="text-info" />,
  warning: <AlertTriangle size={16} className="text-yellow-400" />,
};

const borderColors = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  info: 'border-blue-500/30',
  warning: 'border-yellow-500/30',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useUI();

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 bg-surface/95 backdrop-blur-xl border ${borderColors[toast.type]} rounded-2xl px-4 py-3.5 shadow-editorial max-w-sm w-full`}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
      <p className="text-sm text-foreground flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-200"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useUI();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
