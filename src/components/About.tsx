import { Target, Heart, Lightbulb, Award } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    triggerOnce: true
  });

  const { ref: valuesRef, visibleItems: valuesVisible } = useStaggeredAnimation<HTMLDivElement>(4, 150);

  const { ref: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true
  });

  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "To inspire and empower women in engineering through innovative programs, mentorship, and professional development opportunities."
    },
    {
      icon: Heart,
      title: "Vision",
      description: "Creating an inclusive environment where women engineers can thrive, lead, and make significant contributions to technology."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Fostering creativity and technical excellence through workshops, hackathons, and collaborative projects."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining the highest standards in all our initiatives while celebrating achievements and milestones."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          }`}>
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">IEEE×WIE SFIT</span>
          </h2>
          <p className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-200`}>
            The IEEE Women in Engineering (WIE) Student Branch at St. Francis Institute of Technology
            is dedicated to promoting women engineers and scientists, and inspiring girls around the world
            to follow their academic interests in a career in engineering.
          </p>
        </div>

        {/* Values Grid */}
        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-500 card-tilt relative overflow-hidden ${
                valuesVisible[index] ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                  valuesVisible[index] ? 'animate-glow' : ''
                }`}>
                  <value.icon className="w-8 h-8 text-white group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 dark:text-blue-400 transition-colors duration-300">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>

            </div>
          ))}
        </div>

        {/* IEEE WIE Description */}
        <div ref={descriptionRef} className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-700 ${
          descriptionVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'
        }`}>
          {/* Background decorative pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply opacity-30 animate-pulse"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className={`transition-all duration-700 ${
              descriptionVisible ? 'animate-fade-in-left opacity-100' : 'opacity-0 -translate-x-8'
            } animation-delay-200`}>
              <h3 className="text-3xl font-bold text-gray-800 mb-6 animate-text-reveal">
                What is IEEE Women in Engineering?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                IEEE Women in Engineering (WIE) is one of the largest international professional organizations
                dedicated to promoting women engineers and scientists, and inspiring girls around the world
                to follow their academic interests in a career in engineering and science.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Our SFIT chapter focuses on creating opportunities for professional development, networking,
                and technical advancement while fostering an inclusive environment for all students.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { text: 'Professional Development', color: 'blue' },
                  { text: 'Technical Workshops', color: 'purple' },
                  { text: 'Networking Events', color: 'pink' },
                  { text: 'Mentorship Programs', color: 'indigo' }
                ].map((tag, index) => (
                  <span
                    key={tag.text}
                    className={`px-4 py-2 bg-${tag.color}-100 text-${tag.color}-800 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-300 cursor-pointer`}
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
            <div className={`relative transition-all duration-700 ${
              descriptionVisible ? 'animate-fade-in-right opacity-100' : 'opacity-0 translate-x-8'
            } animation-delay-400`}>
              <div className="w-full h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300 group relative overflow-hidden">
                {/* Floating background elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-white dark:bg-slate-900/30 rounded-full animate-float"></div>
                <div className="absolute bottom-6 right-6 w-6 h-6 bg-white dark:bg-slate-900/20 rounded-full animate-float animation-delay-1000"></div>

                <div className="text-center relative z-10">
                  <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300 animate-glow">
                    <Award className="w-12 h-12 text-blue-600 dark:text-blue-400 group-hover:animate-spin transition-transform duration-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 dark:text-blue-400 transition-colors duration-300">Excellence in Engineering</h4>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:text-gray-300 transition-colors duration-300">Empowering the next generation</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
