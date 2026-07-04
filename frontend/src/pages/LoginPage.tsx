import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft, Sparkles, Shield, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/endpoints';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      const { accessToken, refreshToken, user } = res.data.data;
      setAuth(accessToken, refreshToken, user);
      toast.success(`Welcome back, ${user.employee?.firstName || user.email}!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    onSubmit({ email, password: pass });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary selection:bg-primary-50 selection:text-plum-accent">
      <main className="flex-grow flex min-h-screen">
        {/* Left Side: Illustration & Brand Atmosphere */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-8 border-r border-border">
          {/* Atmospheric Decorations */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/30 via-white to-primary-100/20 pointer-events-none" />
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
            <div className="mb-8 p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-card flex items-center justify-center">
              <svg viewBox="0 0 320 220" className="w-full max-w-sm drop-shadow-sm rounded-xl" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background */}
                <rect width="320" height="220" rx="16" fill="#F5F0F7"/>
                {/* Desk */}
                <rect x="40" y="140" width="240" height="12" rx="4" fill="#D4C5DC"/>
                <rect x="60" y="152" width="12" height="50" rx="4" fill="#C4B5D5"/>
                <rect x="248" y="152" width="12" height="50" rx="4" fill="#C4B5D5"/>
                {/* Monitor */}
                <rect x="90" y="70" width="140" height="90" rx="8" fill="#3D2B47"/>
                <rect x="98" y="78" width="124" height="74" rx="4" fill="#F5F0F7"/>
                {/* Screen content */}
                <rect x="108" y="88" width="60" height="6" rx="3" fill="#714b67" opacity="0.7"/>
                <rect x="108" y="100" width="80" height="4" rx="2" fill="#C4B5D5"/>
                <rect x="108" y="110" width="70" height="4" rx="2" fill="#C4B5D5"/>
                <rect x="108" y="120" width="50" height="4" rx="2" fill="#C4B5D5"/>
                {/* Chart on screen */}
                <rect x="185" y="100" width="6" height="30" rx="2" fill="#714b67" opacity="0.6"/>
                <rect x="196" y="108" width="6" height="22" rx="2" fill="#714b67" opacity="0.4"/>
                <rect x="207" y="95" width="6" height="35" rx="2" fill="#714b67" opacity="0.8"/>
                {/* Monitor stand */}
                <rect x="148" y="160" width="24" height="10" rx="3" fill="#4A3355"/>
                <rect x="135" y="168" width="50" height="6" rx="3" fill="#4A3355"/>
                {/* Keyboard */}
                <rect x="95" y="175" width="100" height="14" rx="4" fill="#E0D8E8"/>
                {/* Coffee cup */}
                <rect x="240" y="125" width="22" height="28" rx="5" fill="white" stroke="#C4B5D5" strokeWidth="1.5"/>
                <path d="M262 135 Q272 135 272 145 Q272 155 262 155" stroke="#C4B5D5" strokeWidth="1.5" fill="none"/>
                <ellipse cx="251" cy="128" rx="10" ry="3" fill="#DDD6E5"/>
                {/* Steam */}
                <path d="M245 115 Q247 108 245 102" stroke="#C4B5D5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                <path d="M251 115 Q253 108 251 102" stroke="#C4B5D5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                {/* Plant */}
                <rect x="55" y="130" width="10" height="15" rx="2" fill="#8B6A7A"/>
                <circle cx="60" cy="118" r="14" fill="#16A34A" opacity="0.6"/>
                <circle cx="52" cy="123" r="10" fill="#16A34A" opacity="0.7"/>
                <circle cx="68" cy="120" r="11" fill="#22C55E" opacity="0.5"/>
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-plum-accent mb-3">
              Manage your team with ease.
            </h1>
            <p className="text-text-secondary text-base max-w-md">
              PeopleFlow brings your payroll, benefits, and employee directory into one intelligent, beautiful workspace.
            </p>
            {/* Floating Insight Mockup */}
            <div className="mt-8 bg-white p-4 rounded-xl shadow-card border border-border flex items-center gap-3 animate-bounce shadow-lg" style={{ animationDuration: '4s' }}>
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-plum-accent">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-plum-accent uppercase tracking-wider">AI Suggestion</p>
                <p className="text-sm text-text-primary font-semibold">94% Confidence Score</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="absolute top-8 left-8 flex items-center gap-2 text-sm text-text-secondary hover:text-plum-accent transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="w-full max-w-md">
            {/* Mobile Branding (Hidden on Desktop) */}
            <div className="lg:hidden mb-8 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-plum flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">PF</span>
              </div>
              <span className="font-display text-xl font-bold text-plum-accent">PeopleFlow</span>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-text-primary mb-3">
                <span className="hand-drawn-underline">Welcome back!</span>
              </h2>
              <p className="text-text-secondary text-sm">
                Enter your credentials to access your HR portal.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label className="form-label block" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 transition-all outline-none text-sm ${errors.email ? 'border-error focus-visible:ring-red-300' : ''}`}
                    id="email"
                    placeholder="name@company.com"
                    type="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="form-error" id="email-error">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="form-label block mb-0" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 transition-all outline-none text-sm ${errors.password ? 'border-error focus-visible:ring-red-300' : ''}`}
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register('password')}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded p-0.5"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="form-error" id="password-error">{errors.password.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-plum text-white font-semibold py-3.5 rounded-lg hover:bg-primary-700 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
                type="submit"
                id="login-submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </button>

              {/* Quick Demo Logins Section */}
              <div className="relative my-8 flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="px-4 text-xs font-bold text-text-secondary uppercase tracking-widest bg-white">Demo Access</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@peopleflow.com', 'Admin@1234')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-lg hover:bg-primary-50 text-text-primary hover:text-plum-accent transition-colors font-semibold text-xs disabled:opacity-50 min-h-[44px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                >
                  <Shield className="w-4 h-4 text-plum-accent" />
                  Demo Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('priyanshu@peopleflow.com', 'Employee@1234')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-lg hover:bg-primary-50 text-text-primary hover:text-plum-accent transition-colors font-semibold text-xs disabled:opacity-50 min-h-[44px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                >
                  <User className="w-4 h-4 text-plum-accent" />
                  Demo Employee
                </button>
              </div>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-xs text-text-secondary">
                © 2026 PeopleFlow · Odoo × Adamas University Hackathon
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
