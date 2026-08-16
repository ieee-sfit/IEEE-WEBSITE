import React, { useState, useEffect } from 'react';
import { Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

type MemberData = {
  id?: string;
  is_leader?: boolean;
  name: string;
  email: string;
  pid: string;
  phone: string;
  gender: string;
  branch: string;
  year: string;
};

export default function UpdateTeamForm({ token }: { token: string }) {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error: fetchError } = await supabase.functions.invoke('get-team', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (fetchError) throw new Error(fetchError.message);
        if (data?.error) throw new Error(data.error);
        
        // Sort to ensure leader is always index 0
        const sortedMembers = data.participants.sort((a: any, b: any) => (b.is_leader ? 1 : 0) - (a.is_leader ? 1 : 0));
        setMembers(sortedMembers);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team members');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [token]);

  const updateMember = (index: number, field: keyof MemberData, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const femaleCount = members.filter(m => m.gender === 'Female').length;
      if (femaleCount < 1) {
        throw new Error('Team must have at least one female participant according to SIH rules.');
      }

      const { data, error: functionError } = await supabase.functions.invoke('update-team', {
        headers: { Authorization: `Bearer ${token}` },
        body: { participants: members }
      });

      if (functionError) throw new Error(functionError.message);
      if (data?.error) throw new Error(data.error);

      setSuccess('Team details updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update team details');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-500" /> Update Team Details
      </h2>
      
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3 text-sm">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <span className="text-red-800 dark:text-red-300">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r flex items-start gap-3 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <span className="text-green-800 dark:text-green-300">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {members.map((member, index) => (
            <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase rounded-full tracking-wider border border-blue-200 dark:border-blue-800/50">
                  {index === 0 ? 'Team Leader' : `Member ${index + 1}`}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={member.name}
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={member.email}
                    onChange={(e) => updateMember(index, 'email', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">PID</label>
                  <input
                    type="text"
                    required
                    value={member.pid}
                    onChange={(e) => updateMember(index, 'pid', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={member.phone}
                    onChange={(e) => updateMember(index, 'phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Gender</label>
                  <select
                    required
                    value={member.gender}
                    onChange={(e) => updateMember(index, 'gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Branch</label>
                    <select
                      required
                      value={member.branch}
                      onChange={(e) => updateMember(index, 'branch', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
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
                    <label className="block text-xs font-semibold mb-1">Year</label>
                    <select
                      required
                      value={member.year}
                      onChange={(e) => updateMember(index, 'year', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="FE">FE</option>
                      <option value="SE">SE</option>
                      <option value="TE">TE</option>
                      <option value="BE">BE</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isSaving ? 'Saving Changes...' : 'Save Team Details'}
        </button>
      </form>
    </div>
  );
}
