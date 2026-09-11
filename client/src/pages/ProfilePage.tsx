import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { 
  User, Mail, Phone, School, GraduationCap, Briefcase, 
  Github, Linkedin, Save, KeyRound, CheckCircle2, 
  Flame, Award, Shield, Code2, Sparkles, Loader2, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  
  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [targetRole, setTargetRole] = useState('Senior Analyst (Exceller)');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('java');
  const [isSaving, setIsSaving] = useState(false);

  // Security form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setCollege(user.college || '');
      setBranch(user.branch || '');
      setGraduationYear(user.graduationYear || '2026');
      setTargetRole(user.targetRole || 'Senior Analyst (Exceller)');
      setBio(user.bio || '');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setDefaultLanguage(user.preferences?.defaultLanguage || 'java');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        name: displayName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        college: college.trim(),
        branch: branch.trim(),
        graduationYear: graduationYear.trim(),
        targetRole: targetRole.trim(),
        bio: bio.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        preferences: {
          defaultLanguage,
          theme: 'paper',
        },
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Banner Card */}
      <div className="bg-surface-paper border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle accent backdrop glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/10 via-accent-mint/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-surface-paper shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-mint border-2 border-white rounded-full flex items-center justify-center shadow-xs" title="Verified Account">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-container" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                  {user?.displayName || user?.name || 'Yusuf Khan'}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container text-white">
                  {user?.role === 'admin' ? 'Administrator' : 'Verified Candidate'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-secondary/10 text-secondary border border-secondary/20">
                  Capgemini 2026/27 Cohort
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                {user?.email || 'admin@capgemini-prep.com'}
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-on-surface-variant flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <School className="w-3.5 h-3.5 text-secondary" />
                  {college || 'Institute Not Specified'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-secondary" />
                  {targetRole}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-cream border border-border-hairline text-xs font-mono">
              <Flame className="w-4 h-4 text-accent-pink" />
              <div>
                <div className="font-bold text-on-surface">12 Days Streak</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Daily Active Cadence</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-cream border border-border-hairline text-xs font-mono">
              <Award className="w-4 h-4 text-amber-500" />
              <div>
                <div className="font-bold text-on-surface">99.4th Percentile</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Capgemini Benchmark</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex border-b border-border-hairline mt-8 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Personal & Academic Info
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preferences'
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            IDE & Language Setup
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Security & Password
          </button>
        </div>
      </div>

      {/* Tab 1: Personal & Academic Details */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-surface-paper border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border-hairline pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-on-surface">Candidate Profile Details</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  Update your display name, academic credentials, and target recruitment role.
                </p>
              </div>
              <span className="text-[11px] font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                [LIVE EDITABLE]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">
                  Display / Account Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant font-medium">This name appears across the dashboard, leaderboards, and reports.</p>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant font-medium">Your primary login and system notification email.</p>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                  />
                </div>
              </div>

              {/* College / University */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">College / University</label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                  />
                </div>
              </div>

              {/* Degree / Branch */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">Degree & Specialization</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                  />
                </div>
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">Graduation Year</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all cursor-pointer"
                >
                  <option value="2024">2024 (Alumni Batch)</option>
                  <option value="2025">2025 (Immediate Batch)</option>
                  <option value="2026">2026 (Target Batch - Exceller)</option>
                  <option value="2027">2027 (Pre-final Batch)</option>
                  <option value="2028">2028+</option>
                </select>
              </div>

              {/* Target Capgemini Role */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-on-surface">Target Capgemini Position</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all cursor-pointer"
                  >
                    <option value="Senior Analyst (Exceller)">Senior Analyst — Exceller Drive (7.5 - 10 LPA Package)</option>
                    <option value="Analyst (Aon/CoCubes)">Analyst — Core On-Campus Drive (4.25 - 5.75 LPA)</option>
                    <option value="Software Engineer (Cloud & AI)">Software Engineer — Cloud & AI Specialized Track</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst Track</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-on-surface">Candidate Summary / Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Share your technical interests, algorithms focus, or career aspirations..."
                  className="w-full p-3 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all resize-none"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">GitHub Profile</label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-border-hairline flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent-mint" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-accent-mint" />
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: IDE & Language Preferences */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-surface-paper border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border-hairline pb-4">
              <h2 className="text-base font-bold text-on-surface">IDE & Language Configuration</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Select your default programming language for coding problems and debugging exercises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'java', title: 'Java (OpenJDK 17 / 23)', desc: 'Standard Capgemini campus choice with Scanner and fast I/O harness.' },
                { id: 'cpp', title: 'C++ (GCC / MinGW 14)', desc: 'High performance STL vectors, unordered maps, and fast competitive execution.' },
                { id: 'python', title: 'Python 3 (3.11 / 3.12)', desc: 'Concise scripting with built-in data structures and rapid prototyping.' },
                { id: 'c', title: 'C (GCC / Clang)', desc: 'Low-level pointer and memory management for fundamental algorithm testing.' },
              ].map((lang) => (
                <div
                  key={lang.id}
                  onClick={() => setDefaultLanguage(lang.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    defaultLanguage === lang.id
                      ? 'bg-secondary/5 border-secondary text-on-surface shadow-xs'
                      : 'bg-surface-cream border-border-hairline hover:bg-surface-paper text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">{lang.title}</span>
                    <input
                      type="radio"
                      name="defaultLanguage"
                      checked={defaultLanguage === lang.id}
                      onChange={() => setDefaultLanguage(lang.id)}
                      className="accent-secondary cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-relaxed">{lang.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border-hairline flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-accent-mint" />}
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="bg-surface-paper border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border-hairline pb-4">
              <h2 className="text-base font-bold text-on-surface">Change Password</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Ensure your account is protected with a secure password containing at least 6 characters.
              </p>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">Current Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-surface-cream border border-border-hairline rounded-xl text-on-surface placeholder:text-zinc-400 focus:outline-none focus:border-secondary focus:bg-surface-paper transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-hairline flex items-center justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent-mint" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-accent-mint" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
