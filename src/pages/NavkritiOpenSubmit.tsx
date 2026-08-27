import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabaseClient';
import { navkritiConfig } from '../config/navkritiConfig';

export default function NavkritiOpenSubmit() {
  const [error, setError] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Submission Fields
  const [teamName, setTeamName] = useState('');
  const [teamNo, setTeamNo] = useState('');
  const [domain, setDomain] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [psTitle, setPsTitle] = useState('');
  const [category, setCategory] = useState('');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [pptFile, setPptFile] = useState<File | null>(null);

  const now = Date.now();
  const isSubmissionBeforeOpen = now < new Date(navkritiConfig.submission.opens).getTime();
  const isSubmissionAfterClose = now > new Date(navkritiConfig.submission.closes).getTime();

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
    if (!pptFile) return;
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('team_name', teamName);
      formData.append('team_no', teamNo);
      formData.append('domain', domain);
      formData.append('problem_statement', problemStatement);
      formData.append('ps_title', psTitle);
      formData.append('category', category);
      formData.append('solution_title', solutionTitle);
      formData.append('organization', organization);
      formData.append('ppt_file', pptFile);
      
      const { data, error: functionError } = await supabase.functions.invoke('submit-ppt-open', {
        body: formData
      });

      if (functionError) {
        if (functionError.message.includes('non-2xx') || functionError.message.includes('Failed to send')) throw new Error('Network error connecting to the server. Please check your connection and try again.');
        throw new Error(functionError.message);
      }
      if (data?.error) throw new Error(data.error);

      toast.success('Project details and presentation uploaded successfully!');
      setUploadSuccess(true);
      setPptFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload presentation');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[400px] w-[800px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Open Submission Portal</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Direct presentation submission</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-500" /> Project Submission
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
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 rounded-xl p-6 mb-8 text-sm text-amber-800 dark:text-amber-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Please ensure your <strong>Team Name</strong> exactly matches your registered name to avoid issues.</li>
                  <li>Upload only the <strong>official SIH 2026 PPT template</strong> in <strong>.pptx</strong> or <strong>.pdf</strong> format (Max 10MB).</li>
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
                  <span className="text-green-800 dark:text-green-300">Project presentation uploaded successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Team Name</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Your registered team name"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Team No. (from PDF)</label>
                    <input
                      type="text"
                      required
                      value={teamNo}
                      onChange={(e) => setTeamNo(e.target.value)}
                      placeholder="e.g. 14"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
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
                      placeholder="e.g., SIH26041"
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
                      placeholder="Enter the full PS Title"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div>
                    <label className="block text-sm font-semibold mb-2">Theme</label>
                    <select
                      required
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    >
                      <option value="">Select Theme</option>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Organization</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Ministry of Health"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
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
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors mt-6">
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
