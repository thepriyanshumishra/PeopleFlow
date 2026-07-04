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
            <div className="mb-8 p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-card">
              <img
                className="w-full max-w-sm drop-shadow-sm rounded-xl"
                alt="Office worker sitting at a desk, Odoo-inspired illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAobKscwwYihbvT8m7_fsHe1W5YJ1p5yhQNP4z3HlJoXu8lbLdNBJMphoCPrXua7EXHZpjxHGivV8JytM2i1StpCTeH_gqRSD7pnA93pDiK7HRFt9FArTkQYBlQjkWAfNuqgB1EDTDX0LmLfzIAjVlMjzVWwPRNmfOFQG82Tyj2uFD9XIKZ0ndLjY4iEoED8qrzVE5XpimcfK5qDr81qV2jD9jDz6mJFgtDUaqo0EIouvPa2G-S9WGO7X1DnqPt843JzE5SVlpN-hg"
              />
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white focus:border-brand-purple focus:ring-2 focus:ring-primary-100 transition-all outline-none text-sm ${errors.email ? 'border-error focus:ring-red-100' : ''}`}
                    id="email"
                    placeholder="name@company.com"
                    type="email"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="form-label block mb-0" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-white focus:border-brand-purple focus:ring-2 focus:ring-primary-100 transition-all outline-none text-sm ${errors.password ? 'border-error focus:ring-red-100' : ''}`}
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-plum text-white font-semibold py-3.5 rounded-lg hover:bg-primary-700 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
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
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-lg hover:bg-primary-50 text-text-primary hover:text-plum-accent transition-colors font-semibold text-xs disabled:opacity-50"
                >
                  <Shield className="w-4 h-4 text-plum-accent" />
                  Demo Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('priyanshu@peopleflow.com', 'Employee@1234')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-lg hover:bg-primary-50 text-text-primary hover:text-plum-accent transition-colors font-semibold text-xs disabled:opacity-50"
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
