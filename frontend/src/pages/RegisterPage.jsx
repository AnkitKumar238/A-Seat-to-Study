import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onNavigate, onRegisterSuccess }) => {
  const { register, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: 'Ankit Singh Rathore',
    studentId: '12513583',
    email: 'ankit@lpu.in',
    department: 'Lovely Professional University — School of Computer Science & Engineering',
    academicStanding: 'Undergraduate',
    password: 'StudySanctuary2025#',
    confirmPassword: 'StudySanctuary2025#',
    linkRfid: true,
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const academicStandings = [
    'Undergraduate',
    "Master's Degree",
    'Doctoral / PhD',
    'Faculty / Postdoc',
  ];

  const departments = [
    'College of Engineering & Technology — Computer Science',
    'Marriott School of Business — Finance & Information Systems',
    'College of Life Sciences — Molecular & Cell Biology',
    'College of Humanities — Philosophy & Comparative Literature',
    'College of Physical & Mathematical Sciences — Applied Mathematics',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStandingSelect = (standing) => {
    setFormData((prev) => ({ ...prev, academicStanding: standing }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!formData.name || !formData.studentId || !formData.email || !formData.password) {
      setValidationError('All required fields must be completed.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (!formData.agreeTerms) {
      setValidationError('You must agree to the Library Sanctuary Fair Use Grace Policy.');
      return;
    }

    setIsSubmitting(true);

    const result = await register({
      name: formData.name,
      studentId: formData.studentId,
      email: formData.email,
      department: formData.department,
      academicStanding: formData.academicStanding,
      password: formData.password,
      rfidCardUid: formData.linkRfid ? `RFID-${formData.studentId.replace(/[^0-9]/g, '').slice(-4) || 'CARD'}` : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      if (onRegisterSuccess) {
        onRegisterSuccess(result.user);
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] fixed top-0 z-50">
        <div className="h-16 max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-lg">
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="font-label-md text-label-md">Sign In</span>
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
        <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-lg">
          {/* Top Navigation & Institutional Breadcrumb */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container-high/30">
            <div className="flex items-center flex-wrap gap-space-sm">
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="inline-flex items-center gap-space-xs text-secondary font-label-md text-label-md hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Return to Student Login
              </button>
              <span className="text-outline-variant font-body-sm text-body-sm">•</span>
              <span className="text-on-surface-variant font-label-md text-label-md">Campus Central Gateway</span>
              <span className="text-outline-variant font-body-sm text-body-sm">•</span>
              <span className="text-on-surface font-label-md text-label-md font-semibold">Institutional Enrollment</span>
            </div>
            
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-high rounded-full font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                Duo Mobile 2FA Ready
              </span>
              <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-high rounded-full font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[15px] text-tertiary-container">lock</span>
                256-Bit TLS SSO
              </span>
            </div>
          </div>

          {/* Main Split Layout Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
            {/* Left Panel: Academic Context & Identity Verification */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-primary-container text-on-primary rounded-xl overflow-hidden shadow-md relative min-h-[640px]">
              {/* Architectural Atrium Background Layer */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
                style={{
                  backgroundImage: `url('/assets/lpu-library-lab-2.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-container/95 to-primary" />

              {/* Content Layer */}
              <div className="relative z-10 p-space-lg flex flex-col gap-space-lg">
                {/* Top Badges */}
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="px-space-sm py-space-xs rounded-full bg-surface-container-lowest/15 backdrop-blur-md font-label-sm text-label-sm text-primary-fixed tracking-wide">
                    Fall 2024 - 2025 Term
                  </span>
                  <span className="px-space-sm py-space-xs rounded-full bg-secondary-container/40 backdrop-blur-md font-label-sm text-label-sm text-on-secondary-container flex items-center gap-space-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed" />
                    RFID Gateway Active
                  </span>
                </div>

                {/* Academic Sanctuary Header */}
                <div className="space-y-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed-dim font-semibold">
                    Institutional Library Core
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-primary tracking-tight font-bold">
                    Your Dedicated Academic Sanctuary
                  </h2>
                  <p className="font-body-md text-body-md text-surface-container-high leading-relaxed">
                    Enroll your university profile to unlock real-time workstation booking, quiet-zone access, and automated RFID desk authentication across 6 library tiers.
                  </p>
                </div>

                {/* Instant Value Proposition Cards */}
                <div className="space-y-space-sm pt-space-xs">
                  <div className="p-space-md rounded-lg bg-surface-container-lowest/10 backdrop-blur-md flex items-start gap-space-md">
                    <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-on-secondary-container">contactless</span>
                    </div>
                    <div className="space-y-space-xs">
                      <h3 className="font-title-md text-title-md text-on-primary font-semibold">Instant 15-Minute Grace Pass</h3>
                      <p className="font-body-sm text-body-sm text-surface-container-high">
                        Desk unlocks immediately via your campus NFC card or Apple/Google Wallet tap upon entry.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-lowest/10 backdrop-blur-md flex items-start gap-space-md">
                    <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-on-secondary-container">volume_off</span>
                    </div>
                    <div className="space-y-space-xs">
                      <h3 className="font-title-md text-title-md text-on-primary font-semibold">Silent Sanctuary Access</h3>
                      <p className="font-body-sm text-body-sm text-surface-container-high">
                        Automatic biometric authorization for Level 2 &amp; 3 Deep Focus pods with calibrated acoustic shielding.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-lowest/10 backdrop-blur-md flex items-start gap-space-md">
                    <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-on-secondary-container">bolt</span>
                    </div>
                    <div className="space-y-space-xs">
                      <h3 className="font-title-md text-title-md text-on-primary font-semibold">Smart Desk Power Unlock</h3>
                      <p className="font-body-sm text-body-sm text-surface-container-high">
                        100W USB-C PD conduits and dual 4K institutional monitors engage upon verified seat reservation check-in.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quota Pill */}
                <div className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest/15 flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">timer</span>
                    <span className="font-label-md text-label-md text-on-primary">Guaranteed Weekly Allocation</span>
                  </div>
                  <span className="font-tabular-numeric text-tabular-numeric text-tertiary-fixed font-bold">25.0 hrs / wk</span>
                </div>
              </div>

              {/* Bottom Testimonial */}
              <div className="relative z-10 p-space-lg bg-primary/70 backdrop-blur-md mt-space-md space-y-space-sm">
                <div className="flex items-center gap-space-sm">
                  <img
                    src="/assets/ankit-singh-rathore.jpg"
                    alt="Ankit Singh Rathore"
                    className="w-11 h-11 rounded-full object-cover border-2 border-secondary shadow-sm shrink-0"
                  />
                  <div>
                    <p className="font-title-md text-title-md text-on-primary font-semibold">Ankit Singh Rathore</p>
                    <p className="font-body-sm text-body-sm text-surface-container-high">Lovely Professional University • B.Tech CSE • ID: 12513583</p>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-surface-container-low italic">
                  “Activating my student RFID pass took 30 seconds. No more running across campus at 8 AM hoping for an empty outlet desk in the atrium.”
                </p>
              </div>
            </div>

            {/* Right Panel: Student Registration Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-xl shadow-md flex flex-col justify-between border border-surface-container-high/30">
              <div className="space-y-space-lg">
                {/* Form Header */}
                <div className="space-y-space-xs">
                  <span className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    NEW STUDENT ENROLLMENT
                  </span>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                    Register Your Student Account
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Link your institutional credentials and campus RFID badge to start reserving library workstations.
                  </p>
                </div>

                {/* Error Banner */}
                {(validationError || error) && (
                  <div className="p-space-sm bg-error-container/40 border border-error/20 rounded-lg flex items-center gap-space-xs text-error">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span className="font-label-sm text-label-sm font-medium">{validationError || error}</span>
                  </div>
                )}

                {/* Registration Form Elements */}
                <form className="space-y-space-md" onSubmit={handleSubmit}>
                  {/* Full Legal Name */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-primary font-semibold flex items-center justify-between" htmlFor="reg-fullName">
                      <span>Full Legal Name</span>
                      <span className="font-body-sm text-body-sm text-outline">As shown on university records</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                        person
                      </span>
                      <input
                        id="reg-fullName"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ankit Singh Rathore"
                        className="w-full h-11 pl-11 pr-space-md bg-surface rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Student ID & Institutional Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="space-y-space-xs">
                      <label className="font-label-md text-label-md text-primary font-semibold flex items-center justify-between" htmlFor="reg-studentId">
                        <span>Student ID / RFID</span>
                        <span className="font-label-sm text-label-sm text-secondary font-medium">Card Front</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                          badge
                        </span>
                        <input
                          id="reg-studentId"
                          name="studentId"
                          type="text"
                          required
                          value={formData.studentId}
                          onChange={handleChange}
                          placeholder="12513583"
                          className="w-full h-11 pl-11 pr-space-md bg-surface rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container shadow-xs"
                        />
                      </div>
                      <p className="font-body-sm text-body-sm text-outline">8-digit alphanumeric badge identifier</p>
                    </div>

                    <div className="space-y-space-xs">
                      <label className="font-label-md text-label-md text-primary font-semibold flex items-center justify-between" htmlFor="reg-email">
                        <span>University Email</span>
                        <span className="inline-flex items-center gap-1 text-tertiary-container font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          .edu verified
                        </span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                          mail
                        </span>
                        <input
                          id="reg-email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.vance@university.edu"
                          className="w-full h-11 pl-11 pr-space-md bg-surface rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container shadow-xs"
                        />
                      </div>
                      <p className="font-body-sm text-body-sm text-outline">Must end with active campus domain</p>
                    </div>
                  </div>

                  {/* Academic Department Dropdown */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-primary font-semibold" htmlFor="reg-department">
                      Academic Department &amp; College
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                        account_balance
                      </span>
                      <select
                        id="reg-department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full h-11 pl-11 pr-space-lg bg-surface rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container shadow-xs appearance-none cursor-pointer"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3.5 text-outline text-[20px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Academic Standing Selector */}
                  <div className="space-y-space-xs">
                    <label className="font-label-md text-label-md text-primary font-semibold">
                      Academic Standing / Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                      {academicStandings.map((standing) => {
                        const isSelected = formData.academicStanding === standing;
                        return (
                          <button
                            key={standing}
                            type="button"
                            onClick={() => handleStandingSelect(standing)}
                            className={`px-space-sm py-space-sm rounded-lg font-label-md text-label-md text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-on-primary shadow-sm font-semibold'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {standing}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Password Setup & Confirmation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="space-y-space-xs">
                      <label className="font-label-md text-label-md text-primary font-semibold" htmlFor="reg-password">
                        Create Portal Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                          lock
                        </span>
                        <input
                          id="reg-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full h-11 pl-11 pr-11 bg-surface rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-outline hover:text-on-surface flex items-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-space-xs">
                      <label className="font-label-md text-label-md text-primary font-semibold" htmlFor="reg-confirmPassword">
                        Confirm Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                          verified
                        </span>
                        <input
                          id="reg-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full h-11 pl-11 pr-11 bg-surface rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 text-outline hover:text-on-surface flex items-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Security Indicators */}
                  <div className="p-space-sm bg-surface-container-low rounded-lg space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Security Complexity Status</span>
                      <span className="font-label-sm text-label-sm text-tertiary-container font-bold">Strong Passphrase (98%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex gap-1">
                      <div className="h-full bg-secondary w-1/4 rounded-full" />
                      <div className="h-full bg-secondary w-1/4 rounded-full" />
                      <div className="h-full bg-secondary w-1/4 rounded-full" />
                      <div className="h-full bg-tertiary-fixed-dim w-1/4 rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-x-space-md gap-y-1 pt-1 font-body-sm text-body-sm text-outline">
                      <span className="inline-flex items-center gap-1 text-tertiary-container">
                        <span className="material-symbols-outlined text-[14px]">check</span> 8+ Characters
                      </span>
                      <span className="inline-flex items-center gap-1 text-tertiary-container">
                        <span className="material-symbols-outlined text-[14px]">check</span> Uppercase &amp; Lowercase
                      </span>
                      <span className="inline-flex items-center gap-1 text-tertiary-container">
                        <span className="material-symbols-outlined text-[14px]">check</span> Special Symbol
                      </span>
                    </div>
                  </div>

                  {/* Preferences & Hardware Sync Checkboxes */}
                  <div className="space-y-space-sm pt-space-xs">
                    <label className="flex items-start gap-space-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="linkRfid"
                        checked={formData.linkRfid}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <p className="font-label-md text-label-md text-primary font-semibold">
                          Link physical campus RFID badge &amp; mobile NFC wallet for tap-to-desk unlock
                        </p>
                        <p className="font-body-sm text-body-sm text-outline">
                          Allows physical touch-in via LPU Central Library turnstiles and desk sensors without manual app check-in.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-space-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <p className="font-label-md text-label-md text-primary font-semibold">
                          I agree to the Library Sanctuary Code of Conduct &amp; 15-Minute Fair Use Grace Policy
                        </p>
                        <p className="font-body-sm text-body-sm text-outline">
                          Seats not occupied within 15 minutes of reservation start are automatically recycled for fellow students.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Primary Submit Action Button */}
                  <div className="pt-space-sm">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-secondary hover:bg-secondary-container text-on-secondary font-title-md text-title-md rounded-lg shadow-md transition-all flex items-center justify-center gap-space-sm active:scale-[0.99] cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                          <span>Activating Profile &amp; RFID Pass...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Registration &amp; Activate Study Pass</span>
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Redirect to Login */}
                <div className="text-center pt-space-xs">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Already have an activated account?
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('login')}
                      className="font-title-md text-title-md text-secondary hover:underline ml-1 cursor-pointer font-semibold"
                    >
                      Sign In to Student Portal
                    </button>
                  </p>
                </div>
              </div>

              {/* Institutional Security Footnote */}
              <div className="mt-space-lg pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-xs font-body-sm text-body-sm text-outline border-t border-surface-container-high/40">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container">shield</span>
                  256-Bit TLS Institutional Encryption
                </span>
                <span className="font-tabular-numeric text-tabular-numeric">Campus SSO Gateway: HBLL-REG-PROD-04</span>
              </div>
            </div>
          </div>

          {/* Bottom Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-sm border border-surface-container-high/30">
              <div className="space-y-space-xs">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">nfc</span>
                </div>
                <h4 className="font-title-md text-title-md text-primary font-semibold">Physical Badge Tap-In</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Your RFID key syncs across all LPU Central Library entry turnstiles and individual study desk sensor beacons in under 3 seconds.
                </p>
              </div>
              <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md">
                <span>NFC Setup Guide</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-sm border border-surface-container-high/30">
              <div className="space-y-space-xs">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <h4 className="font-title-md text-title-md text-primary font-semibold">Weekly 25-Hour Study Quota</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Fair allocation quotas reset every Sunday at midnight. Premium monitors and soundproof study pods automatically reserve time against this balance.
                </p>
              </div>
              <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md">
                <span>Fair Use Protocol</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-sm border border-surface-container-high/30">
              <div className="space-y-space-xs">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <h4 className="font-title-md text-title-md text-primary font-semibold">Need Help Registering?</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Visit the Circulation Desk on Level 3 or call campus IT Services at extension 3583 for immediate student verification.
                </p>
              </div>
              <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md">
                <span>Contact Library IT</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
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
              Campus Helpdesk: support@library.univ.edu • +1 (800) 555-SEAT
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

export default RegisterPage;

