import { Target, Heart, Lightbulb, Award, Cpu, Users, Handshake, Sparkles } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    triggerOnce: true
  });

  const { ref: pillarsRef, visibleItems: pillarsVisible } = useStaggeredAnimation<HTMLDivElement>(3, 150);
  const { ref: valuesRef, visibleItems: valuesVisible } = useStaggeredAnimation<HTMLDivElement>(4, 150);

  const pillars = [
    {
      badge: "CAMPUS-WIDE TECHNICAL BODY",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      icon: Cpu,
      iconGradient: "from-blue-500 to-cyan-500",
      title: "IEEE Student Branch",
      subtitle: "Advancing Technology for All",
      description: "As the primary collegiate chapter of IEEE—the world's largest technical professional body—the IEEE SFIT Student Branch serves as the technical launchpad for all students across all engineering branches. We organize flagship hackathons, competitive coding tournaments (IEEE Xtreme), robotics clinics, and hands-on workshops, bridging academic theory with real-world industry engineering.",
      tags: ["Hackathons", "IEEE Xtreme", "Technical Labs", "Industry Connect"]
    },
    {
      badge: "GLOBAL AFFINITY GROUP",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      icon: Users,
      iconGradient: "from-purple-500 to-pink-500",
      title: "WIE Affinity Group",
      subtitle: "Empowering Women in STEM",
      description: "IEEE Women in Engineering (WIE) is an international network dedicated to recruiting, mentoring, and advancing women in technical fields. At SFIT, our WIE Affinity Group curates mentorship programs, leadership summits, and outreach initiatives that inspire female students to break barriers, pursue technical interests, and excel as engineering leaders.",
      tags: ["Mentorship", "Leadership Summits", "Diversity in Tech", "Outreach"]
    },
    {
      badge: "JOINT COLLABORATION",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      icon: Handshake,
      iconGradient: "from-indigo-500 to-blue-600",
      title: "Synergy at SFIT",
      subtitle: "One Community, Infinite Potential",
      description: "At SFIT, IEEE and WIE operate in lockstep as a unified powerhouse. By combining deep technical rigor with an unwavering commitment to diversity and inclusion, we ensure every student—regardless of background or branch—has equal access to mentorship, platforms to innovate, and stages to lead.",
      tags: ["Inclusive Innovation", "Flagship Events", "Equal Opportunity", "Unified Team"]
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "To advance technological excellence across all engineering domains, cultivate student leadership, and foster an inclusive ecosystem in STEM through impactful initiatives."
    },
    {
      icon: Heart,
      title: "Vision",
      description: "An empowered collegiate community where passionate innovators of all backgrounds collaborate to engineer cutting-edge solutions for the benefit of humanity."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Fostering hands-on technical labs, flagship hackathons, and creative problem-solving across emerging technologies."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining the highest professional standards while connecting our students to the global IEEE network of researchers and industry pioneers."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-50 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-50 animate-float animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 dark:bg-slate-800 rounded-full border border-blue-200/60 dark:border-slate-700 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-700 dark:text-blue-300">Who We Are</span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          }`}>
            About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">IEEE & WIE SFIT</span>
          </h2>
          <p className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-200`}>
            St. Francis Institute of Technology's unified student branch, bringing together the global technical excellence of the IEEE Student Branch and the inclusive empowerment of the IEEE WIE Affinity Group.
          </p>
        </div>

        {/* 3-Pillar Narrative: IEEE SB -> WIE Affinity Group -> Unified Synergy */}
        <div ref={pillarsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`group bg-gradient-to-br from-gray-50 to-white dark:from-slate-800/90 dark:to-slate-900/90 p-8 rounded-3xl border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 card-tilt relative flex flex-col justify-between overflow-hidden ${
                pillarsVisible[index] ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Subtle hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Pillar Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.iconGradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <pillar.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Pillar Titles */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {pillar.title}
                </h3>
                <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">
                  {pillar.subtitle}
                </h4>

                {/* Pillar Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              {/* Tags */}
              <div className="relative z-10 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-2">
                {pillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section Sub-Header for Core Values */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Our Core <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Values & Commitments</span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            The guiding principles behind every workshop, competition, and leadership initiative at IEEE×WIE SFIT.
          </p>
        </div>

        {/* Values Grid */}
        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`group bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 card-tilt relative overflow-hidden ${
                valuesVisible[index] ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              <div className="relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                  valuesVisible[index] ? 'animate-glow' : ''
                }`}>
                  <value.icon className="w-7 h-7 text-white group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:text-blue-400 transition-colors duration-300">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
