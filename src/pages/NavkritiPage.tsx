import { useState } from 'react';
import {
  Calendar, Users, Trophy, ChevronRight, FileText,
  Info, AlertCircle, Lightbulb, Phone, CheckCircle2, XCircle, MessageCircle, Eye, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NavkritiRegistration from '../components/NavkritiRegistration';
import Footer from '../components/Footer';
import { navkritiConfig } from '../config/navkritiConfig';

const NavkritiPage = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'register'>('info');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-20">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-4 border border-blue-200 dark:border-blue-800">
            Internal Ideathon for Smart India Hackathon 2026
          </div>

          {/* Title: NAV + stylised script K + RITI '26 — matching brochure */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
            <span className="text-slate-900 dark:text-white">NAV</span>
            <span
              className="text-blue-600 dark:text-blue-400 font-script-logo"
              style={{
                fontSize: '1.4em',
                display: 'inline-block',
                transform: 'rotate(-4deg) translateY(0.05em)',
                margin: '0 -0.04em 0 -0.02em',
                lineHeight: 1,
              }}
            >
              K
            </span>
            <span className="text-slate-900 dark:text-white">RITI</span>
            <span className="text-blue-600 dark:text-blue-500">'26</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 italic font-medium tracking-wide">
            ( नवकृतिः : नवमेषः राष्ट्रहितार्थम् )
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 hover:text-white'
                }`}
            >
              Register Team <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'info'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-600 dark:border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
            >
              Event Details
            </button>
            <Link
              to="/navkriti/portal"
              className="px-8 py-4 rounded-xl font-bold transition-all duration-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:text-purple-600 flex items-center gap-2"
            >
              Portal Login
            </Link>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'info' ? (
          <div className="space-y-10">

            {/* === What is Navkriti === */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                <Info className="w-6 h-6 text-blue-500" /> What is NAVKRITI '26?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                <strong className="text-slate-900 dark:text-white">NAVKRITI '26</strong> is SFIT's college-level internal ideathon and the internal selection round for SFIT's SIH 2026 participation. It gives students a structured platform to tackle real-world challenges, demonstrate engineering ingenuity, and pitch their ideas to industry evaluators — all before competing at the national stage.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-4">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Inculcating Innovation</h4>
                <p className="text-blue-800 dark:text-blue-400 text-sm leading-relaxed">
                  NAVKRITI '26 aims to nurture a culture of product design, collaborative problem-solving, and engineering excellence — empowering SFIT students to build solutions that matter at a national level.
                </p>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong className="text-slate-800 dark:text-slate-200">Edition:</strong> NAVKRITI '26 — qualifier for SIH 2026</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong className="text-slate-800 dark:text-slate-200">Format:</strong> Internal ideathon with screening and evaluation by industry experts</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong className="text-slate-800 dark:text-slate-200">Venue:</strong> St. Francis Institute of Technology (SFIT), Borivali West, Mumbai</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong className="text-slate-800 dark:text-slate-200">Organizers:</strong> TEAM RAW SFIT · IEEExWIE SFIT · IIC SFIT</span></li>
              </ul>
            </div>

            {/* === Eligibility + Important Dates === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Eligibility */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                  <Users className="w-5 h-5 text-purple-500" /> Who Can Participate?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  NAVKRITI '26 is open to all currently enrolled students of SFIT across all branches and years. Teams must be formed with the following composition:
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>Exactly <strong className="text-slate-900 dark:text-white">6 members</strong> per team — no more, no less</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>At least <strong className="text-slate-900 dark:text-white">1 female member</strong> is compulsory (SIH rule)</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>All members must be active enrolled students of SFIT</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>Cross-branch and cross-year teams are permitted</span></li>
                </ul>
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-lg text-xs text-yellow-800 dark:text-yellow-300">
                  Teams not meeting the 6-member or mandatory female participant rule will be disqualified immediately.
                </div>

                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                    <strong className="text-sm text-green-900 dark:text-green-100">Join the Official WhatsApp Group</strong>
                  </div>
                  <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
                    All participants must join the WhatsApp group for important announcements, status updates, queries, etc.
                  </p>
                  <a
                    href={navkritiConfig.contact.whatsappGroupLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Join Group
                  </a>
                </div>
              </div>

              {/* Important Dates */}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Important Dates
                </h2>
                <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {[
                    { date: navkritiConfig.registration.displayDates, label: 'Registration Window', active: true },
                    { date: navkritiConfig.problemStatements.displayDate, label: 'Problem Statement Release', active: false },
                    { date: navkritiConfig.submission.displayDeadline, label: 'Idea PPT Submission Deadline', active: false },
                    { date: navkritiConfig.pitch.displayDate, label: 'Idea Pitch / Presentation Day', active: false },
                  ].map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${item.active ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 ${!item.active ? 'opacity-75' : ''}`}>
                        <div className="font-bold text-slate-900 dark:text-white">{item.date}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === Problem Statements Teaser === */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-3 text-white">
                    <FileText className="w-6 h-6 text-blue-200" /> Problem Statements
                  </h2>
                  <p className="text-blue-100 text-lg mb-2">
                    The official problem statements for Navkriti '26 will be revealed on <strong className="text-white">{navkritiConfig.problemStatements.displayDate}</strong>.
                  </p>
                  <p className="text-blue-200 text-sm">
                    Registered teams will be notified via the portal and WhatsApp group.
                  </p>
                </div>
                <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Status</div>
                  <div className="text-xl font-black text-white flex items-center gap-2 justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-300" /> Dropping Soon
                  </div>
                </div>
              </div>
            </div>

            {/* === How It Works === */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <Lightbulb className="w-6 h-6 text-yellow-500" /> How NAVKRITI '26 Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Register', desc: `Fill the team registration form on the RAW or IEEExWIE SFIT website. Pay the ₹${navkritiConfig.rules.fee} team fee to confirm your slot.` },
                  { step: '02', title: 'Choose a Problem', desc: `On ${navkritiConfig.problemStatements.displayDate}, problem statements are released across a few domains. Pick a domain that fits your team's strengths.` },
                  { step: '03', title: 'Submit Your Idea PPT', desc: `Use the official SIH Idea Presentation Template — no edits to the format. Submit your deck on or before ${navkritiConfig.submission.displayDeadline}.` },
                  { step: '04', title: 'Pitch to Judges', desc: `Present live on ${navkritiConfig.pitch.displayDate}. Top qualifying teams will represent SFIT at Smart India Hackathon ${navkritiConfig.edition}.` },
                ].map((s) => (
                  <div key={s.step} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700">
                    <div className="text-3xl font-black text-blue-100 dark:text-blue-900 mb-2">{s.step}</div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{s.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* === Prize Pool + Registration Note === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Prize Pool */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <Trophy className="w-6 h-6 text-yellow-500" /> Prize Pool: ₹{navkritiConfig.rules.prizePool.toLocaleString()}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { emoji: '🥇', label: '1st Prize', amount: '₹5,000' },
                    { emoji: '🥈', label: '2nd Prize', amount: '₹2,500' },
                    { emoji: '🥉', label: '3rd Prize', amount: '₹1,500' },
                  ].map((p) => (
                    <div key={p.label} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div className="text-3xl mb-2">{p.emoji}</div>
                      <div className="font-bold text-lg text-slate-900 dark:text-white">{p.label}</div>
                      <div className="text-blue-600 dark:text-blue-400 font-extrabold text-xl">{p.amount}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between"><span>Registration Fee:</span><strong className="text-slate-900 dark:text-white">₹{navkritiConfig.rules.fee} per team</strong></div>
                  <div className="flex justify-between"><span>Register via:</span><strong className="text-slate-900 dark:text-white">RAW & IEEE SFIT Websites</strong></div>
                </div>
              </div>

              {/* Registration Note */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                  <FileText className="w-5 h-5 text-blue-500" /> Note for Registrations
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  Registration is a two-step process — fill the online form and pay the fee. Incomplete registrations will not be considered. One team leader submits on behalf of all members.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>Registrations will remain open from <strong className="text-slate-900 dark:text-white">{navkritiConfig.registration.displayDates}</strong> only</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>The team leader registers the entire team in one go</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>Payment confirmation (screenshot or UPI transaction ID) is required to finalize your registration</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span>Problem statements released only to registered teams on {navkritiConfig.problemStatements.displayDate}</span></li>
                </ul>
              </div>
            </div>

            {/* === Strict SIH Guidelines === */}
            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h2 className="text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5" /> Strict SIH Guidelines
              </h2>
              <p className="text-red-700 dark:text-red-300 text-sm mb-3 leading-relaxed">
                NAVKRITI '26 strictly follows SIH 2026 guidelines. Violations result in immediate disqualification with no exceptions:
              </p>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-2 text-sm">
                <li><strong>Exactly 6 members</strong> per team — partial teams will not be accepted.</li>
                <li><strong>Minimum 1 female</strong> participant per team is a mandatory SIH requirement.</li>
                <li>All participants must be active enrolled students of SFIT.</li>
                <li>The official SIH Idea Presentation Template is mandatory — any modification leads to disqualification.</li>
                <li>Submissions will close after the {navkritiConfig.submission.displayDeadline} deadline and will not be accepted under any circumstances.</li>
              </ul>
              
              <div className="mt-5 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">NAVKRITI '26 Idea Presentation Format</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mt-1 uppercase">PDF Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <a href="/Navkriti26-IDEA-Presentation-Format.pdf" target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Eye className="w-4 h-4" /> View
                  </a>
                  <a href="/Navkriti26-IDEA-Presentation-Format.pdf" download className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </div>
            </div>

            {/* === Common Mistakes === */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <XCircle className="w-6 h-6 text-red-400" /> Common Mistakes to Avoid
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { mistake: 'Forming a team with fewer or more than 6 members', fix: 'Exactly 6 — always, no exceptions.' },
                  { mistake: 'No female team member in the group', fix: 'Minimum 1 female is a hard SIH rule.' },
                  { mistake: 'Modifying the official SIH PPT template', fix: 'Use as-is — no font, layout, or design changes.' },
                  { mistake: `Submitting the PPT after ${navkritiConfig.submission.displayDeadline}`, fix: 'Make sure to keep an eye on the deadlines!' },
                  { mistake: 'Registering without paying the fee', fix: 'Fee payment is required to confirm your team.' },
                  { mistake: 'Picking a domain outside the team\'s expertise', fix: 'Choose what you genuinely understand and can solve.' },
                  { mistake: 'Getting carried by one or two team members.', fix: 'Everyone in the team should be equally involved in the event.' },
                  { mistake: 'Plagiarism or copying from other teams', fix: 'Originality is key. Plagiarism might lead to disqualification.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item.mistake}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">✓ {item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === Contact & Queries === */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-slate-900 dark:text-white">
                <Phone className="w-6 h-6 text-blue-500" /> Contact & Queries
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Reach out to any of our coordinators directly for questions about registration, team composition, problem statements, or event logistics.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {navkritiConfig.contact.coordinators.map((contact) => (
                  <div key={contact.name} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{contact.name}</div>
                    <a href={`tel:${contact.phone}`} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">{contact.phone}</a>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl text-sm text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-white">Follow for updates:</strong>{' '}
                Stay tuned to{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">@teamraw.sfit</span>,{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">@ieee.sfit</span>, and{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">@iic.sfit</span>{' '}
                on Instagram for SIH 2026 announcements and NAVKRITI '26 updates.
              </div>
            </div>

          </div>
        ) : (
          <NavkritiRegistration />
        )}

      </div>
      <Footer />
    </div>
  );
};

export default NavkritiPage;
