import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Users, Copy } from 'lucide-react';


type MemberData = {
  name: string;
  email: string;
  pid: string;
  phone: string;
  gender: string;
  branch: string;
  year: string;
};

const INITIAL_MEMBER: MemberData = {
  name: '',
  email: '',
  pid: '',
  phone: '',
  gender: '',
  branch: '',
  year: '',
};

export default function NavkritiRegistration() {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<MemberData[]>(Array(6).fill({ ...INITIAL_MEMBER }));
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ teamId: string, secret: string, message: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  
  // Generate request ID once when form mounts for idempotency across retries
  const [registrationRequestId] = useState(() => crypto.randomUUID());

  const handleCopy = (text: string, isId: boolean) => {
    navigator.clipboard.writeText(text);
    if (isId) {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const updateMember = (index: number, field: keyof MemberData, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setPaymentFile(null);
        return;
      }
      setPaymentFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!agreedToRules) {
      setError('You must agree to the SIH prescribed PPT template rule.');
      return;
    }

    if (!paymentFile) {
      setError('Please upload the payment screenshot.');
      return;
    }

    const femaleCount = members.filter(m => m.gender === 'Female').length;
    if (femaleCount < 1) {
      setError('Team must have at least one female participant according to SIH rules.');
      return;
    }

    // Check for duplicate emails/PIDs within the form itself
    const emails = members.map(m => m.email);
    const pids = members.map(m => m.pid);
    if (new Set(emails).size !== 6) {
      setError('All 6 members must have unique email addresses.');
      return;
    }
    if (new Set(pids).size !== 6) {
      setError('All 6 members must have unique PIDs.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Prepare FormData for Edge Function
      const formData = new FormData();
      formData.append('registration_request_id', registrationRequestId);
      formData.append('team_name', teamName);
      formData.append('payment_receipt', paymentFile);
      formData.append('participants', JSON.stringify(members));

      // 2. Invoke Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/register-team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
        },
        body: formData,
      });

      let functionData;
      try {
        functionData = await response.json();
      } catch (parseError) {
        throw new Error(`Server Error (${response.status}): Failed to parse response`);
      }

      if (!response.ok) {
        throw new Error(functionData?.error || `Registration failed with status ${response.status}`);
      }
      
      if (functionData?.error) {
        throw new Error(functionData.error);
      }
      
      // Success
      setSuccessData({ 
        teamId: functionData.team_id, 
        secret: functionData.secret, 
        message: functionData.message || 'Registration Successful!'
      });
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-400">{successData.message}</h2>
        <p className="text-lg text-green-700 dark:text-green-300">
          Your team <strong>{teamName}</strong> has been registered.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <div className="bg-white dark:bg-slate-900 border border-green-100 dark:border-green-800/50 p-6 rounded-xl shadow-sm relative group">
            <p className="text-sm text-slate-500 mb-1">Your Official Team ID</p>
            <p className="text-4xl font-extrabold tracking-wider text-slate-900 dark:text-white">{successData.teamId}</p>
            <button 
              onClick={() => handleCopy(successData.teamId, true)}
              className="absolute top-2 right-2 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy Team ID"
            >
              {copiedId ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800/50 p-6 rounded-xl shadow-sm relative group">
            <p className="text-sm text-slate-500 mb-1">Submission Secret</p>
            <p className="text-4xl font-extrabold tracking-wider text-blue-600 dark:text-blue-400">{successData.secret}</p>
            <button 
              onClick={() => handleCopy(successData.secret, false)}
              className="absolute top-2 right-2 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy Secret"
            >
              {copiedSecret ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mt-6 text-sm text-blue-800 dark:text-blue-300">
          <p>
            <strong className="text-red-600 dark:text-red-400">IMPORTANT:</strong> Please save this <strong>Submission Secret</strong> securely! 
            You will need both your Team ID and Secret to upload your PPT on August 25th. Do not share it outside your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Team Registration</h2>
        <p className="text-slate-600 dark:text-slate-400">Fill out the details for all 6 team members. All fields are mandatory.</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Team Details */}
        <section className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Team Details
          </h3>
          <div>
            <label htmlFor="team-name" className="block text-sm font-semibold mb-2">Team Name</label>
            <input
              id="team-name"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Innovators Prime"
            />
          </div>
        </section>

        {/* Members Loop */}
        <div className="space-y-8">
          {members.map((member, index) => (
            <section key={index} className="relative p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase rounded-full tracking-wider border border-blue-200 dark:border-blue-800">
                {index === 0 ? 'Team Leader' : `Member ${index + 1}`}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <div>
                  <label htmlFor={`name-${index}`} className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    id={`name-${index}`}
                    type="text"
                    required
                    value={member.name}
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor={`email-${index}`} className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    id={`email-${index}`}
                    type="email"
                    required
                    value={member.email}
                    onChange={(e) => updateMember(index, 'email', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor={`pid-${index}`} className="block text-sm font-semibold mb-2">PID (College ID)</label>
                  <input
                    id={`pid-${index}`}
                    type="text"
                    required
                    value={member.pid}
                    onChange={(e) => updateMember(index, 'pid', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 211045"
                  />
                </div>
                <div>
                  <label htmlFor={`phone-${index}`} className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    id={`phone-${index}`}
                    type="tel"
                    required
                    value={member.phone}
                    onChange={(e) => updateMember(index, 'phone', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+91 "
                  />
                </div>
                <div>
                  <label htmlFor={`gender-${index}`} className="block text-sm font-semibold mb-2">Gender</label>
                  <select
                    id={`gender-${index}`}
                    required
                    value={member.gender}
                    onChange={(e) => updateMember(index, 'gender', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`branch-${index}`} className="block text-sm font-semibold mb-2">Branch</label>
                    <select
                      id={`branch-${index}`}
                      required
                      value={member.branch}
                      onChange={(e) => updateMember(index, 'branch', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="CMPN">CMPN</option>
                      <option value="INFT">INFT</option>
                      <option value="EXTC">EXTC</option>
                      <option value="ELEC">ELEC</option>
                      <option value="MECH">MECH</option>
                      <option value="ECS">ECS</option>
                      <option value="AIML">AIML</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`year-${index}`} className="block text-sm font-semibold mb-2">Year</label>
                    <select
                      id={`year-${index}`}
                      required
                      value={member.year}
                      onChange={(e) => updateMember(index, 'year', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="FE">FE</option>
                      <option value="SE">SE</option>
                      <option value="TE">TE</option>
                      <option value="BE">BE</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Payment Section */}
        <section className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-6">Payment Proof (₹300)</h3>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 text-center">
              <div className="bg-white p-4 rounded-xl inline-block shadow-sm mb-4 border border-slate-200">
                {/* Placeholder for UPI QR Code */}
                <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-sm border-2 border-dashed border-slate-300">
                  [UPI QR CODE]
                </div>
              </div>
              <p className="text-sm font-medium">Scan to pay ₹300</p>
            </div>
            
            <div className="w-full md:w-2/3">
              <label className="block text-sm font-semibold mb-2">Upload Payment Screenshot</label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 bg-white dark:bg-slate-900">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white dark:bg-slate-900 font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-500 mt-2">PNG, JPG up to 5MB</p>
                  {paymentFile && (
                    <p className="text-sm font-bold text-green-600 mt-4 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {paymentFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agreement */}
        <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/50">
          <label htmlFor="sih-agreement" className="flex items-start gap-3 cursor-pointer">
            <input 
              id="sih-agreement"
              type="checkbox" 
              required
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500" 
            />
            <span className="text-sm text-red-900 dark:text-red-300 font-medium">
              I confirm that our team will strictly use the official SIH prescribed PPT template. I understand that modifying the template structure or rules will lead to immediate disqualification.
            </span>
          </label>
        </section>

        {/* Privacy Notice */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto">
          By submitting this form, you consent to the collection and processing of your team's details for the purpose of the Smart India Hackathon. Your data will be stored securely and will not be shared with third parties.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> Processing Registration...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      </form>
    </div>
  );
}
