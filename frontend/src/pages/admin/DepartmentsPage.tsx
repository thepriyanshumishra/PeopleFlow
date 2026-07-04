import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Building2, Users, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { departmentsApi } from '@/api/endpoints';
import toast from 'react-hot-toast';

interface DeptFormData {
  name: string;
  description: string;
}

function DeptModal({
  dept,
  onClose,
}: {
  dept?: any;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!dept;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeptFormData>({
    defaultValues: { name: dept?.name || '', description: dept?.description || '' },
  });

  const createMutation = useMutation({
    mutationFn: (data: DeptFormData) => departmentsApi.create(data),
    onSuccess: () => {
      toast.success('Department created successfully!');
      queryClient.invalidateQueries({ queryKey: ['departments-detail'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create department'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: DeptFormData) => departmentsApi.update(dept.id, data),
    onSuccess: () => {
      toast.success('Department updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['departments-detail'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update department'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-md w-full animate-fade-in shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100">
              <Building2 className="w-5 h-5 text-plum-accent" />
            </div>
            <h2 className="text-lg font-bold">
              {isEdit ? 'Edit Department' : 'New Department'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background transition-colors">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((d) =>
            isEdit ? updateMutation.mutate(d) : createMutation.mutate(d)
          )}
          className="space-y-5"
        >
          <div>
            <label className="form-label" htmlFor="dept-name">
              Department Name <span className="text-error">*</span>
            </label>
            <input
              id="dept-name"
              type="text"
              placeholder="e.g. Engineering, Marketing, Finance"
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              {...register('name', {
                required: 'Department name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 80, message: 'Name must be under 80 characters' },
              })}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="dept-desc">
              Description <span className="text-text-secondary font-normal">(Optional)</span>
            </label>
            <textarea
              id="dept-desc"
              rows={3}
              placeholder="Brief description of this department's function…"
              className="form-input resize-none"
              {...register('description', {
                maxLength: { value: 300, message: 'Description must be under 300 characters' },
              })}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-1/2 py-3 bg-plum text-white font-bold text-xs rounded-xl hover:bg-primary-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEdit ? 'Saving…' : 'Creating…'}
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Department'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  dept,
  onClose,
  onConfirm,
  loading,
}: {
  dept: any;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full animate-fade-in shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 border border-red-100">
          <Trash2 className="w-6 h-6 text-error" />
        </div>
        <h2 className="text-lg font-bold mb-2">Delete Department?</h2>
        <p className="text-sm text-text-secondary mb-2">
          You are about to permanently delete{' '}
          <strong className="text-text-primary">"{dept.name}"</strong>.
        </p>
        <p className="text-xs text-text-secondary mb-6">
          This action cannot be undone. Departments with active employees cannot be deleted.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-1/2 py-3 bg-error text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState<any>(null);
  const [deleteDept, setDeleteDept] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['departments-detail'],
    queryFn: () =>
      departmentsApi.getAll().then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentsApi.delete(id),
    onSuccess: () => {
      toast.success('Department deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['departments-detail'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDeleteDept(null);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Failed to delete department'),
  });

  const departments = (data as any[]) || [];

  return (
    <>
      {(showModal || editDept) && (
        <DeptModal
          dept={editDept}
          onClose={() => {
            setShowModal(false);
            setEditDept(null);
          }}
        />
      )}

      {deleteDept && (
        <DeleteConfirmModal
          dept={deleteDept}
          onClose={() => setDeleteDept(null)}
          onConfirm={() => deleteMutation.mutate(deleteDept.id)}
          loading={deleteMutation.isPending}
        />
      )}

      <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              Departments{' '}
              <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">
                divisions
              </span>
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Manage organization departments, headcount, and division descriptions.
            </p>
          </div>
          <button
            id="create-department-btn"
            onClick={() => setShowModal(true)}
            className="bg-plum hover:bg-primary-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Department
          </button>
        </header>

        {/* Grid */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-plum-accent" />
              Division Registry
              {!isLoading && departments.length > 0 && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-primary-50 text-plum-accent rounded-full border border-primary-100 uppercase tracking-wider">
                  {departments.length} departments
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 skeleton rounded-2xl animate-pulse bg-background border border-border"
                />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
              <p className="text-sm text-text-secondary font-semibold mb-1">
                No departments found
              </p>
              <p className="text-xs text-text-secondary mb-5">
                Create your first department to organize your workforce.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-plum hover:bg-primary-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Create First Department
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept: any) => (
                <div
                  key={dept.id}
                  className="p-6 bg-background rounded-2xl border border-border hover:border-plum-accent/30 transition-all hover:shadow-sm flex flex-col justify-between h-44 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 border border-primary-100">
                      <Building2 className="w-5 h-5 text-plum-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-text-primary text-sm truncate">{dept.name}</p>
                      {dept.description && (
                        <p className="text-xs text-text-secondary font-semibold truncate mt-0.5">
                          {dept.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                        <Users className="w-4 h-4 text-plum-accent" />
                        <span>{dept._count?.employees ?? 0} active employees</span>
                      </div>
                      {dept.headEmployee && (
                        <p className="text-xs text-text-secondary font-medium">
                          Manager:{' '}
                          <span className="font-bold text-text-primary">
                            {dept.headEmployee.firstName} {dept.headEmployee.lastName}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Actions — visible on hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditDept(dept)}
                        className="p-2 bg-white border border-border hover:bg-primary-50 rounded-lg text-text-secondary hover:text-plum-accent transition-colors"
                        title="Edit department"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDept(dept)}
                        disabled={deleteMutation.isPending}
                        className="p-2 bg-white border border-border hover:bg-red-50 rounded-lg text-text-secondary hover:text-error transition-colors"
                        title="Delete department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
