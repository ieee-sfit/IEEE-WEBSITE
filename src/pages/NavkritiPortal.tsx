import React, { useState } from 'react';
import { Upload, LogOut, CheckCircle, AlertCircle, FileText, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NavkritiPortal() {
  // Runtime memory only authentication
  const [session, setSession] = useState<{ teamId: string, secret: string } | null>(null);
  const [teamIdInput, setTeamIdInput] = useState('');
  const [secretInput, setSecretInput] = useState('');
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    
    try {
      // In a real secure app, this goes to an Edge Function /login
      // which checks against bcrypt hash and issues HttpOnly cookie.
      // Since we don't have custom auth fully wired, we'll verify via a direct edge function call.
      
      const { data, error } = await supabase.functions.invoke('login-team', {
        body: { team_id: teamIdInput, secret: secretInput }
      });
      
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      
      // Store credentials strictly in runtime memory React State
      setSession({ teamId: teamIdInput, secret: secretInput });
      
    } catch (err: any) {
      setError(err.message || 'Invalid Team ID or Secret');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setTeamIdInput('');
    setSecretInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.pptx')) {
        setError('Only .pptx files are allowed.');
        setPptFile(null);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError('File size must be less than 15MB');
        setPptFile(null);
        return;
      }
      setPptFile(file);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!pptFile || !session) return;
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('team_id', session.teamId);
      formData.append('secret', session.secret);
      formData.append('ppt_file', pptFile);
      
      const { data, error } = await supabase.functions.invoke('submit-ppt', {
        body: formData,
      });

      if (error) throw new Error(error.message);
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
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
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
                placeholder="e.g. NAV-1234"
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
                placeholder="Enter your 6-character secret"
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
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> Idea PPT Submission
          </h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6 mb-8 text-sm text-blue-800 dark:text-blue-300">
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload only the <strong>official SIH PPT template</strong> in <strong>.pptx</strong> format.</li>
              <li>Maximum file size is <strong>15MB</strong>.</li>
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
              <span className="text-green-800 dark:text-green-300">PPT uploaded successfully! Your submission is recorded.</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Presentation</h3>
            <p className="text-sm text-slate-500 mb-6">Drag and drop your .pptx file here, or click to browse</p>
            
            <input 
              type="file" 
              id="ppt-upload" 
              className="hidden" 
              accept=".pptx" 
              onChange={handleFileChange}
            />
            <label 
              htmlFor="ppt-upload"
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Select File
            </label>

            {pptFile && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {pptFile.name} ({(pptFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Submit Presentation'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
