import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigate, onLoginSuccess }) => {
  const { login, quickDemoLogin, error, clearError } = useAuth();
  
  const [identifier, setIdentifier] = useState('ankit@lpu.in');
  const [password, setPassword] = useState('StudySanctuary2025#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setIsSubmitting(true);
    clearError();

    const result = await login(identifier, password);
    setIsSubmitting(false);

    if (result.success) {
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      } else if (onNavigate) {
        onNavigate(result.user.role === 'ADMIN' ? 'admin' : 'dashboard');
      }
    }
  };

  const handleSSO = () => {
    setSsoLoading(true);
    setTimeout(() => {
      quickDemoLogin('STUDENT');
      setSsoLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({ role: 'STUDENT', name: 'Ankit Singh Rathore' });
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    }, 1000);
  };

  const handleDemoAdmin = () => {
    quickDemoLogin('ADMIN');
    if (onLoginSuccess) {
      onLoginSuccess({ role: 'ADMIN', name: 'Dr. Arthur Pendelton' });
    } else if (onNavigate) {
      onNavigate('admin');
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top Navigation Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] fixed top-0 z-50">
        <div className="h-16 max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-lg">
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="font-label-md text-label-md">Return to Hub</span>
            </button>
            <div className="hidden md:flex items-center gap-space-sm pl-space-md border-l border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[22px]">local_library</span>
              <span className="font-title-md text-title-md text-primary tracking-tight font-bold">A Seat to Study</span>
              <span className="text-outline-variant">|</span>
              <span className="font-label-md text-label-md text-on-surface-variant">University Library Services</span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low rounded-lg">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">LPU Central Library:</span>
              <span className="font-tabular-numeric text-tabular-numeric text-primary font-semibold">342 Desks Available</span>
              <span className="text-outline-variant font-label-sm text-label-sm">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">99.8% IoT Grid Sync</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1 flex flex-col items-center justify-center px-margin-mobile py-space-xl">
        <div className="w-full max-w-7xl mx-auto py-space-md lg:py-space-lg">
          {/* Breadcrumb & Top Status Rail */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg px-space-xs">
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-secondary transition-colors font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Return to Campus Portal</span>
              </button>
              <span className="text-outline-variant font-label-md">/</span>
              <span className="font-label-md text-label-md text-primary font-semibold">Institutional Student Authentication</span>
            </div>
            
            <div className="flex items-center gap-space-md">
              <div className="hidden sm:inline-flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-low rounded-full">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Auth Node: <strong className="text-primary font-medium">HBLL-SSO-West Gateway</strong>
                </span>
              </div>
              <div className="inline-flex items-center gap-space-xs px-space-sm py-1 bg-surface-container rounded-full text-secondary">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span className="font-label-sm text-label-sm font-semibold">Duo MFA Enforced</span>
              </div>
            </div>
          </div>

          {/* Main Authentication Split Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            {/* Visual Atmosphere Panel (Left / 7 Cols on Large Displays) */}
            <div className="relative lg:col-span-7 flex flex-col justify-between p-space-md md:p-space-lg lg:p-space-xl overflow-hidden min-h-[460px] lg:min-h-full">
              {/* Background Architectural Atmosphere Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url('/assets/lpu-library-lab-2.jpg')`,
                }}
              />
              {/* Layered Gradient Scrims for Flawless Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/75 to-primary/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />

              {/* Blueprint Grid Dot Matrix */}
              <div className="absolute top-6 right-6 w-32 h-32 opacity-15 pointer-events-none">
                <svg className="w-full h-full text-surface-container-highest" fill="currentColor" viewBox="0 0 100 100">
                  {[10, 30, 50, 70, 90].map((x) =>
                    [10, 30, 50, 70, 90].map((y) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />
                    ))
                  )}
                </svg>
              </div>

              {/* Top Panel Header & Telemetry Pills */}
              <div className="relative z-10 space-y-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-lowest/15 backdrop-blur-md text-on-primary shadow-xs">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
                  </span>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-primary tracking-tight font-bold">
                      LPU Central Library
                    </p>
                    <p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                      Sanctuary Reservation Grid • Lovely Professional University
                    </p>
                  </div>
                </div>

                {/* Frosted Live Telemetry Floating Badges */}
                <div className="flex flex-wrap gap-space-xs pt-space-xs">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-lowest/20 backdrop-blur-md text-on-primary shadow-sm hover:bg-surface-container-lowest/25 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
                    <span className="material-symbols-outlined text-[15px] text-tertiary-fixed">volume_down</span>
                    <span className="font-label-sm text-label-sm">
                      Level 02 Sanctuary: <strong className="text-tertiary-fixed">32 dB</strong> (Whisper Quiet)
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-lowest/20 backdrop-blur-md text-on-primary shadow-sm hover:bg-surface-container-lowest/25 transition-colors">
                    <span className="material-symbols-outlined text-[15px] text-primary-fixed">chair</span>
                    <span className="font-label-sm text-label-sm">
                      Live Desks: <strong className="text-surface-bright">342 Free</strong> (63% Capacity)
                    </span>
                  </div>
                  <div className="hidden sm:inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-lowest/20 backdrop-blur-md text-on-primary shadow-sm hover:bg-surface-container-lowest/25 transition-colors">
                    <span className="material-symbols-outlined text-[15px] text-secondary-fixed">contactless</span>
                    <span className="font-label-sm text-label-sm">
                      RFID Turnstile 04: <span className="text-secondary-fixed">Synced</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Mid/Bottom Content: Student Endorsement & Feature Highlights */}
              <div className="relative z-10 mt-space-xl space-y-space-md">
                {/* Student Quote Endorsement Card */}
                <div className="bg-surface-container-lowest/15 backdrop-blur-md p-space-md rounded-xl text-on-primary shadow-lg max-w-xl">
                  <div className="flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-secondary-fixed text-[26px] shrink-0 mt-0.5">
                      format_quote
                    </span>
                    <div className="space-y-space-xs">
                      <p className="font-body-md text-body-md text-on-primary leading-relaxed italic">
                        “Reserving my dual-monitor desk before leaving my dorm transformed my study routine during midterms. No frantic walking up four flights of stairs looking for a plug.”
                      </p>
                      <div className="flex items-center gap-space-sm pt-space-xs">
                        <img
                          src="/assets/ankit-singh-rathore.jpg"
                          alt="Ankit Singh Rathore"
                          className="w-9 h-9 rounded-full object-cover border-2 border-secondary shadow-sm shrink-0"
                        />
                        <div>
                          <p className="font-title-md text-body-md font-semibold text-surface-bright leading-tight">
                            Ankit Singh Rathore
                          </p>
                          <p className="font-label-sm text-label-sm text-primary-fixed-dim">
                            Lovely Professional University (LPU) • B.Tech CSE • ID: 12513583
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Institutional Guarantees / Badges Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-xs">
                  <div className="flex items-center gap-space-xs p-space-xs bg-surface-container-lowest/10 backdrop-blur-sm rounded-lg text-surface-container-low">
                    <span className="material-symbols-outlined text-primary-fixed text-[18px]">timer</span>
                    <span className="font-label-sm text-label-sm">15-Min Grace Pass</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs bg-surface-container-lowest/10 backdrop-blur-sm rounded-lg text-surface-container-low">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px]">power</span>
                    <span className="font-label-sm text-label-sm">100W USB-C Desks</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs bg-surface-container-lowest/10 backdrop-blur-sm rounded-lg text-surface-container-low">
                    <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">lock_clock</span>
                    <span className="font-label-sm text-label-sm">24/7 Silent Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Form Panel (Right / 5 Cols on Large Displays) */}
            <div className="lg:col-span-5 bg-surface-container-lowest flex flex-col justify-between p-space-md md:p-space-lg lg:p-space-xl">
              <div>
                {/* Header Branding & Page Title */}
                <div className="space-y-space-xs">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-low text-secondary rounded-full">
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                      Academic Portal Access
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight pt-space-xs font-bold">
                    Student Sign In
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Access real-time seat reservation, active desk passes, and library telemetry maps.
                  </p>
                </div>

                {/* Primary University SSO Button (Fast Auth) */}
                <div className="mt-space-lg space-y-space-sm">
                  <button
                    onClick={handleSSO}
                    disabled={ssoLoading}
                    type="button"
                    className="w-full flex items-center justify-center gap-space-sm py-3 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high active:scale-[0.99] text-primary transition-all shadow-sm font-title-md text-title-md group cursor-pointer"
                  >
                    {ssoLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        <span className="font-title-md text-title-md">Contacting Canvas / Okta SSO...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-md bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-[17px]">domain_verification</span>
                        </div>
                        <span className="font-title-md text-title-md tracking-tight font-semibold">Sign in with University SSO</span>
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm text-center">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    <span>Supported: Canvas, Okta, Shibboleth &amp; Entra ID</span>
                  </div>
                </div>

                {/* Visual Divider: Or Sign In With Credentials */}
                <div className="relative flex items-center justify-center my-space-lg">
                  <div className="w-full h-px bg-surface-container-high" />
                  <span className="absolute bg-surface-container-lowest px-space-sm font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                    Or sign in with University ID
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-space-md p-space-sm bg-error-container/40 border border-error/20 rounded-lg flex items-center gap-space-xs text-error">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span className="font-label-sm text-label-sm">{error}</span>
                  </div>
                )}

                {/* Standard Credentials Form */}
                <form className="space-y-space-md" onSubmit={handleSubmit}>
                  {/* University Email or ID Field */}
                  <div className="space-y-space-xs">
                    <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="student-identifier">
                      University Email or Student ID
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                        alternate_email
                      </span>
                      <input
                        id="student-identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. ankit@lpu.in or 12513583"
                        className="w-full h-11 pl-11 pr-space-md bg-surface-container-low/60 text-on-surface font-body-md text-body-md rounded-lg outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container"
                      />
                    </div>
                  </div>

                  {/* Password Field with Toggle */}
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="student-password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered institutional address.')}
                        className="font-label-sm text-label-sm text-secondary hover:text-secondary-container transition-colors font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                        lock
                      </span>
                      <input
                        id="student-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter institutional password"
                        className="w-full h-11 pl-11 pr-11 bg-surface-container-low/60 text-on-surface font-body-md text-body-md rounded-lg outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors p-1 flex items-center justify-center cursor-pointer"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Utility Row: Remember Workstation Checkbox */}
                  <div className="pt-space-xs">
                    <label className="flex items-start gap-space-xs cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-secondary bg-surface-container-low accent-secondary focus:ring-secondary cursor-pointer"
                      />
                      <div>
                        <span className="font-body-md text-body-md text-on-surface font-medium group-hover:text-primary transition-colors">
                          Remember this workstation for 30 days
                        </span>
                        <p className="font-body-sm text-body-sm text-outline">
                          Do not select on public shared library kiosks or open lab computers.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Submit Action CTA Button */}
                  <div className="pt-space-xs">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-space-sm h-12 rounded-lg bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary transition-all shadow-md hover:shadow-lg font-title-md text-title-md cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating with Duo MFA...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">login</span>
                          <span>Sign In to Study Portal</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Instant Evaluation Demo Shortcuts */}
                <div className="mt-space-md p-space-sm bg-surface-container-low/70 rounded-lg border border-surface-container flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    ⚡ Quick Test Profiles:
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('ankit@lpu.in');
                        setPassword('StudySanctuary2025#');
                      }}
                      className="px-2 py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-secondary font-label-sm text-label-sm border border-outline-variant/40 transition-colors"
                      title="Load Student Ankit Singh Rathore (12513583)"
                    >
                      Ankit Singh Rathore (Student)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('admin@library.univ.edu');
                        setPassword('StudySanctuary2025#');
                      }}
                      className="px-2 py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-primary font-label-sm text-label-sm border border-outline-variant/40 transition-colors"
                      title="Load Admin Profile"
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* New Student Activation Link */}
                <div className="mt-space-sm p-space-sm bg-surface-container-low rounded-lg text-center">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    New to campus?
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('register')}
                      className="font-label-md text-label-md text-secondary hover:text-secondary-container font-semibold transition-colors underline underline-offset-2 ml-1 cursor-pointer"
                    >
                      Activate your RFID badge &amp; student account
                    </button>
                  </p>
                </div>
              </div>

              {/* Bottom Role Switcher & Institutional Security Badges */}
              <div className="mt-space-lg pt-space-md space-y-space-sm bg-surface-container-lowest border-t border-surface-container-high/50">
                {/* Administrator / Faculty Link */}
                <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">admin_panel_settings</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Library administrator or facility staff?</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoAdmin}
                    className="font-label-sm text-label-sm text-primary font-semibold hover:text-secondary transition-colors inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Staff &amp; Admin Portal</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>

                {/* Bottom Security Status Micro-Bar */}
                <div className="flex items-center justify-between text-outline font-label-sm text-label-sm px-space-xs pt-space-xs">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />
                    256-Bit TLS Institutional Encryption
                  </span>
                  <span>Gateway ID: 884-HBLL-PROD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help & Operational Status Under-Card Footer Grid */}
          <div className="mt-space-lg grid grid-cols-1 md:grid-cols-3 gap-space-md px-space-xs">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-start gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px]">contactless</span>
              </div>
              <div className="space-y-space-xs">
                <p className="font-title-md text-body-md font-semibold text-primary">Physical Badge Tap-In</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Forgot credentials? You can tap your physical campus ID card at any entrance turnstile or desk beacon to confirm your booking.
                </p>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-start gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px]">auto_stories</span>
              </div>
              <div className="space-y-space-xs">
                <p className="font-title-md text-body-md font-semibold text-primary">Quiet Zone Code of Conduct</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Level 02 &amp; 03 are classified Silent Sanctuaries. Headphones required; cell phone conversations strictly limited to atrium stairwells.
                </p>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-start gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px]">help_center</span>
              </div>
              <div className="space-y-space-xs">
                <p className="font-title-md text-body-md font-semibold text-primary">IT Helpdesk Support</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Encountering Duo MFA issues? Visit the Level 01 Circulation Desk or dial campus ext. <strong className="text-primary">ext. 3583</strong> for live identity verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] border-t border-surface-container-high/30">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">support_agent</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              LPU Library Helpdesk: support@lpu.in • Lovely Professional University
            </span>
          </div>
          <div className="flex items-center gap-space-lg">
            <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Terms of Service</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Privacy Policy</span>
            <span className="font-body-sm text-body-sm text-outline">© 2024 Institutional Library Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;

