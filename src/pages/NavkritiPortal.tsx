import React, { useState } from 'react';
import { Upload, LogOut, CheckCircle, AlertCircle, FileText, Lock, Layout } from 'lucide-react';

import { supabase } from '../lib/supabaseClient';
import UpdateTeamForm from '../components/UpdateTeamForm';
import { navkritiConfig } from '../config/navkritiConfig';

export default function NavkritiPortal() {
  const [session, setSession] = useState<{ teamId: string, token: string } | null>(() => {
    const saved = sessionStorage.getItem('navkriti_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [teamIdInput, setTeamIdInput] = useState('');
  const [secretInput, setSecretInput] = useState('');
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // New Submission Fields
  const [domain, setDomain] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [psTitle, setPsTitle] = useState('');
  const [category, setCategory] = useState('');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [pptFile, setPptFile] = useState<File | null>(null);

  const now = Date.now();
  const isSubmissionBeforeOpen = now < new Date(navkritiConfig.submission.opens).getTime();
  const isSubmissionAfterClose = now > new Date(navkritiConfig.submission.closes).getTime();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('login-team', {
        body: { team_id: teamIdInput.trim(), secret: secretInput.trim() }
      });
      
      if (functionError) throw new Error(functionError.message);
      if (data?.error) throw new Error(data.error);
      
      // Store session state with secure token
      const sessionData = { teamId: teamIdInput, token: data.token };
      setSession(sessionData);
      sessionStorage.setItem('navkriti_session', JSON.stringify(sessionData));
    } catch (err: any) {
      setError(err.message || 'Invalid Team ID or Secret');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem('navkriti_session');
    setTeamIdInput('');
    setSecretInput('');
    setUploadSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-powerpoint',
          'application/pdf'
      ];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(ppt|pptx|pdf)$/)) {
        setError('Only .ppt, .pptx, or .pdf files are allowed.');
        setPptFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setPptFile(null);
        return;
      }
      setPptFile(file);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pptFile || !session) return;
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('domain', domain);
      formData.append('problem_statement', problemStatement);
      formData.append('ps_title', psTitle);
      formData.append('category', category);
      formData.append('solution_title', solutionTitle);
      formData.append('summary', summary);
      formData.append('ppt_file', pptFile);
      
      const { data, error: functionError } = await supabase.functions.invoke('submit-ppt', {
        body: formData,
        headers: {
            Authorization: `Bearer ${session.token}`
        }
      });

      if (functionError) throw new Error(functionError.message);
      if (data?.error) throw new Error(data.error);

      setUploadSuccess(true);
      setPptFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload presentation');
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
        {/* Modern Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute left-1/4 top-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Team Portal Login</h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8 text-sm">
            Enter your official Team ID and the Submission Secret provided during registration.
          </p>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3 text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span className="text-red-800 dark:text-red-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Team ID</label>
              <input
                type="text"
                required
                value={teamIdInput}
                onChange={(e) => setTeamIdInput(e.target.value)}
                placeholder="e.g. NAV-123456"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Submission Secret</label>
              <input
                type="password"
                required
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Enter your secret"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[400px] w-[800px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Team Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">ID: <strong className="text-blue-600 dark:text-blue-400">{session.teamId}</strong></p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <UpdateTeamForm token={session.token} />

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm mt-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Layout className="w-6 h-6 text-blue-500" /> Project Submission
          </h2>
          
          {isSubmissionBeforeOpen ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-2">Submissions Not Yet Open</h3>
              <p className="text-slate-600 dark:text-slate-400">
                The submission portal will open on {new Date(navkritiConfig.submission.opens).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
              </p>
            </div>
          ) : isSubmissionAfterClose ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-2">Submissions Closed</h3>
              <p className="text-slate-600 dark:text-slate-400">
                The deadline for project submissions has passed.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6 mb-8 text-sm text-blue-800 dark:text-blue-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Upload only the <strong>official SIH 2026 PPT template</strong> in <strong>.pptx</strong> or <strong>.pdf</strong> format (Max 10MB).</li>
                  <li>You can re-upload to overwrite your previous submission until the deadline.</li>
                </ul>
              </div>

              {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3 text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span className="text-red-800 dark:text-red-300">{error}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r flex items-start gap-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <span className="text-green-800 dark:text-green-300">Project details and presentation uploaded successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Theme</label>
                <select
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  <option value="">Select Domain</option>
                  <option value="Smart Automation">Smart Automation</option>
                  <option value="Fitness & Sports">Fitness & Sports</option>
                  <option value="Heritage & Culture">Heritage & Culture</option>
                  <option value="MedTech / BioTech / HealthTech">MedTech / BioTech / HealthTech</option>
                  <option value="Agriculture, FoodTech & Rural Development">Agriculture, FoodTech & Rural Development</option>
                  <option value="Smart Vehicles">Smart Vehicles</option>
                  <option value="Transportation & Logistics">Transportation & Logistics</option>
                  <option value="Robotics and Drones">Robotics and Drones</option>
                  <option value="Clean & Green Technology">Clean & Green Technology</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Renewable / Sustainable Energy">Renewable / Sustainable Energy</option>
                  <option value="Blockchain & Cybersecurity">Blockchain & Cybersecurity</option>
                  <option value="Smart Education">Smart Education</option>
                  <option value="Disaster Management">Disaster Management</option>
                  <option value="Toys and Games">Toys and Games</option>
                  <option value="Space Technology">Space Technology</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">PS Number (ID)</label>
                <input
                  type="text"
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="e.g., 26001"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Problem Statement Title</label>
                <input
                  type="text"
                  required
                  value={psTitle}
                  onChange={(e) => setPsTitle(e.target.value)}
                  placeholder="Enter the full PS Title from SIH Portal"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Solution Title</label>
              <input
                type="text"
                required
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                placeholder="Enter a descriptive title for your solution"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Executive Summary</label>
              <textarea
                required
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe your solution approach..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none"
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Presentation</h3>
              <p className="text-sm text-slate-500 mb-6">Drag and drop your file here, or click to browse</p>
              
              <input 
                type="file" 
                id="ppt-upload" 
                className="hidden" 
                accept=".ppt,.pptx,.pdf" 
                onChange={handleFileChange}
              />
              <label 
                htmlFor="ppt-upload"
                className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                {pptFile ? 'Change File' : 'Select File'}
              </label>

              {pptFile && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> {pptFile.name} ({(pptFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading || !pptFile}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isUploading ? 'Submitting...' : 'Submit Project'}
            </button>
          </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
