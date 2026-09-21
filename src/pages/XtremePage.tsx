import {
  ExternalLink, Globe, BookOpen, UserCheck, ShieldCheck,
  ArrowRight, Search, Code, GraduationCap, CheckCircle2, ChevronRight, Gift, HelpCircle
} from 'lucide-react';
import Footer from '../components/Footer';
import { xtremeConfig } from '../config/xtremeConfig';
import xtremeLogo from '../assets/xtreme-logo.png';

const XtremePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-blue-500/20 dark:bg-blue-600/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <div className="text-center space-y-6 mb-16 relative z-10 pt-8">
          <div className="flex justify-center mb-6">
            <img
              src={xtremeLogo}
              alt="IEEE Xtreme Logo"
              className="h-24 md:h-32 object-contain drop-shadow-xl invert dark:invert-0"
            />
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm border border-blue-200 dark:border-blue-800 shadow-sm">
            Global 24-Hour Programming Competition
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="text-slate-900 dark:text-white">IEEE Xtreme 2026</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-bold tracking-wide">
            Be Xtreme With Us
          </p>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
            Join thousands of students worldwide in IEEE's premier hackathon. Code, compete, and claim your place on the global leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 flex-wrap">
            <a
              href={xtremeConfig.registration.portalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-105"
            >
              Register on vTools <ExternalLink className="w-5 h-5" />
            </a>
            <a
              href="#guidelines"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Read Guidelines <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://ieeextreme.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Official Site <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>



        {/* Guidelines Anchor */}
        <div id="guidelines" className="scroll-mt-24 space-y-16">

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What is it / Benefits */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                <Globe className="w-6 h-6 text-blue-500" /> What is IEEE Xtreme?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                IEEEXtreme is a global challenge in which teams of IEEE Student members—advised and proctored by an IEEE member—compete in a 24-hour time span against each other. But it's more than just a competition.
              </p>

              <div className="space-y-4">
                {xtremeConfig.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{benefit.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility & Rules */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
                <ShieldCheck className="w-6 h-6 text-green-500" /> Eligibility & Rules
              </h2>
              <div className="mb-6 flex gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-center flex-1 border border-blue-200 dark:border-blue-800">
                  <div className="font-bold text-blue-700 dark:text-blue-400 text-lg">{xtremeConfig.competition.displayDate}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">24 Hours</div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-center flex-1 border border-purple-200 dark:border-purple-800">
                  <div className="font-bold text-purple-700 dark:text-purple-400 text-lg">{xtremeConfig.rules.teamSize}</div>
                  <div className="text-xs text-purple-600 dark:text-purple-500">Per Team</div>
                </div>
              </div>

              <ul className="space-y-4">
                {xtremeConfig.rules.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-sm">{req}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                  ⚠️ <strong>Note:</strong> You will strictly need your active IEEE Membership Number to complete the registration on vTools.
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Prizes Card */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-1 shadow-xl">
              <div className="bg-slate-900 rounded-[22px] p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Gift className="w-6 h-6 text-yellow-400" /> Exciting Prizes
                </h2>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {xtremeConfig.rules.prizes.map((prize, idx) => (
                    <div key={idx} className="snap-center shrink-0 w-72 md:w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
                      <span className="text-4xl mb-4">{prize.split(' ')[0]}</span>
                      <h3 className="font-bold text-lg mb-2">{prize.split(':')[0].substring(2).trim()}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{prize.split(':')[1].trim()}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 text-white/50 text-sm animate-pulse">
                  Swipe to explore prizes →
                </div>
              </div>
            </div>
          </div>

          {/* Proctoring Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-black rounded-3xl p-1 shadow-xl">
            <div className="bg-white dark:bg-slate-900 rounded-[22px] p-8 md:p-12 h-full">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">The Proctoring Guide</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Every team is required to have at least one eligible proctor to supervise their participation and ensure adherence to the competition rules. Here's everything you need to know.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <GraduationCap className="w-5 h-5 text-blue-500" /> Proctor Requirements
                  </h3>
                  <ul className="space-y-3">
                    {xtremeConfig.proctoring.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-2 text-slate-600 dark:text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <Search className="w-5 h-5 text-purple-500" /> How To Find One
                  </h3>
                  <ul className="space-y-3">
                    {xtremeConfig.proctoring.howToFind.map((how, idx) => (
                      <li key={idx} className="flex gap-2 text-slate-600 dark:text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></div>
                        {how}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white flex items-center justify-center gap-3">
              <Code className="w-8 h-8 text-blue-500" /> Practice & Communities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {xtremeConfig.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    {resource.name} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-purple-500" /> Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {xtremeConfig.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{faq.question}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default XtremePage;
