import { AlertTriangle, Trash2, LogOut, CheckCircle, Info, XCircle, Clock } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

export function GlobalModals() {
  const { modal, closeModal } = useUiStore();

  if (!modal.open || !modal.type) return null;

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
    closeModal();
  };

  // Select icons based on modal type
  const getIcon = () => {
    switch (modal.type) {
      case 'delete':
        return (
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-error border border-red-100 shadow-inner">
            <Trash2 size={24} />
          </div>
        );
      case 'logout':
        return (
          <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-plum border border-primary-100 shadow-inner">
            <LogOut size={24} />
          </div>
        );
      case 'unsaved':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-warning border border-amber-100 shadow-inner">
            <AlertTriangle size={24} />
          </div>
        );
      case 'timeout':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-warning border border-amber-100 shadow-inner animate-pulse">
            <Clock size={24} />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shadow-inner">
            <CheckCircle size={24} />
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-error border border-red-100 shadow-inner">
            <XCircle size={24} />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner">
            <Info size={24} />
          </div>
        );
    }
  };

  const isDanger = modal.type === 'delete' || modal.type === 'error';

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-surface rounded-2xl max-w-sm w-full border border-border shadow-modal p-6 text-center space-y-5 animate-fade-in">
          {/* Decorative Icon */}
          <div className="flex justify-center">{getIcon()}</div>

          {/* Details */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {modal.title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {modal.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="btn-secondary w-full text-xs py-2 rounded-xl border-border"
            >
              {modal.cancelText || 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className={`w-full text-xs py-2 rounded-xl font-bold transition-all text-white ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200'
                  : 'bg-plum hover:bg-plum/90 shadow-sm shadow-plum-200'
              }`}
            >
              {modal.confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
