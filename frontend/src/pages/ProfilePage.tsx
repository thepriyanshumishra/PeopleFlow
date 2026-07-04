import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { User, Camera, Lock, Save, Briefcase, Phone, MapPin, Loader2 } from 'lucide-react';
import { profileApi, authApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const user = useAuthStore(s => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => profileApi.getMyProfile().then(r => r.data.data),
  });

  const { register: regProfile, handleSubmit: handleProfile, formState: { isDirty } } = useForm({
    defaultValues: {
      phone: data?.phone || '',
      address: data?.address || '',
    },
    values: { phone: data?.phone || '', address: data?.address || '' },
  });

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm();

  const updateMutation = useMutation({
    mutationFn: (d: any) => profileApi.updateProfile(d),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const pwdMutation = useMutation({
    mutationFn: (d: any) => authApi.changePassword(d),
    onSuccess: () => {
      toast.success('Password changed successfully');
      resetPwd();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to change password'),
  });

  const employee = data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card p-6 h-48 skeleton" />
        <div className="card p-6 h-64 skeleton" />
      </div>
    );
  }

  const initials = employee
    ? `${employee.firstName[0]}${employee.lastName[0]}`
    : user?.email[0].toUpperCase() || 'U';

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-text-primary">
              {employee ? `${employee.firstName} ${employee.lastName}` : user?.email}
            </h2>
            <p className="text-text-secondary text-sm mt-0.5">{employee?.designation || user?.role}</p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              {employee?.employeeCode && (
                <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Briefcase className="w-3.5 h-3.5" />
                  {employee.employeeCode}
                </span>
              )}
              {employee?.department && (
                <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary rounded-full font-medium">
                  {employee.department.name}
                </span>
              )}
              {employee?.joiningDate && (
                <span className="text-xs text-text-secondary">
                  Joined {format(new Date(employee.joiningDate), 'MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { key: 'profile', label: 'Profile Info', icon: User },
          { key: 'security', label: 'Security', icon: Lock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 animate-fade-in">
          <h3 className="text-base font-semibold mb-5">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {[
              { label: 'First Name', value: employee?.firstName },
              { label: 'Last Name', value: employee?.lastName },
              { label: 'Email', value: employee?.email },
              { label: 'Employee Code', value: employee?.employeeCode },
              { label: 'Designation', value: employee?.designation },
              { label: 'Department', value: employee?.department?.name },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-text-secondary mb-1">{label}</p>
                <p className="text-sm font-medium text-text-primary bg-background rounded-lg px-3 py-2.5">
                  {value || '—'}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleProfile((d) => updateMutation.mutate(d))} className="space-y-4">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                className="form-input"
                {...regProfile('phone')}
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />Address
              </label>
              <textarea
                className="form-input resize-none"
                rows={3}
                placeholder="Your address"
                {...regProfile('address')}
              />
            </div>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary"
            >
              {updateMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card p-6 animate-fade-in">
          <h3 className="text-base font-semibold mb-5">Change Password</h3>
          <form onSubmit={handlePwd((d) => pwdMutation.mutate(d))} className="space-y-4 max-w-sm">
            <div>
              <label className="form-label">Current Password <span className="text-error">*</span></label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                {...regPwd('currentPassword', { required: 'Required' })}
              />
              {pwdErrors.currentPassword && <p className="form-error">{String(pwdErrors.currentPassword.message)}</p>}
            </div>
            <div>
              <label className="form-label">New Password <span className="text-error">*</span></label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                {...regPwd('newPassword', {
                  required: 'Required',
                  minLength: { value: 8, message: 'Min 8 characters' },
                  pattern: { value: /(?=.*[A-Z])(?=.*[0-9])/, message: 'Needs uppercase + number' },
                })}
              />
              {pwdErrors.newPassword && <p className="form-error">{String(pwdErrors.newPassword.message)}</p>}
            </div>
            <button type="submit" disabled={pwdMutation.isPending} className="btn-primary">
              {pwdMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Changing…</>
                : <><Lock className="w-4 h-4" />Change Password</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
