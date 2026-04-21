import {
  Target,
  Award,
  Users,
  TrendingUp,
  ShieldCheck,
  Globe,
} from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header Section - Reduced mb-20 to mb-12 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
            The Next Evolution of <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            EduTrack is a high‑performance ecosystem uniting theory with
            industry mastery — empowering institutions and professionals to push
            boundaries and achieve more.
          </p>
        </div>

        {/* Philosophy Card - Reduced mb-24 to mb-16 to pull the following sections closer too */}
        <div className="relative mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

          {/* Compact Padding: p-8 md:p-10 */}
          <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Our Strategic Philosophy
                  </h3>
                </div>

                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  We believe that education must be as dynamic as the markets it
                  serves. EduTrack integrates the **rigorous standards** of
                  traditional academia with the **high-speed agility** of modern
                  technological hubs.
                </p>
                <p className="text-slate-400 text-base leading-relaxed">
                  By facilitating a seamless exchange between global industry
                  experts and academic researchers, we create a fluid learning
                  environment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 w-full">
                <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-colors">
                  <ShieldCheck className="text-emerald-400 w-6 h-6 mb-2" />
                  <div className="text-white font-bold text-sm">
                    Accredited Content
                  </div>
                </div>
                <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-colors">
                  <Globe className="text-teal-400 w-6 h-6 mb-2" />
                  <div className="text-white font-bold text-sm">
                    Global Standards
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Engineering a <span className="text-emerald-400">Superior</span>{" "}
              Experience
            </h3>
          </div>

          {/* Added 'grid-rows-1' and 'items-stretch' logic via h-full */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6 text-emerald-400" />,
                title: "Precision Pathing",
                desc: "Our AI-driven trajectories align academic milestones with real-time market demands for optimized growth.",
                border: "hover:border-emerald-500/30",
                bg: "bg-emerald-500/10",
              },
              {
                icon: <Users className="w-6 h-6 text-teal-400" />,
                title: "Expert Ecosystem",
                desc: "Connect with a global network of specialized educators and industry veterans in an elite marketplace.",
                border: "hover:border-teal-500/30",
                bg: "bg-teal-500/10",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
                title: "Enterprise Scaling",
                desc: "Built on high-availability infrastructure, serving both elite learners and massive global organizations.",
                border: "hover:border-cyan-500/30",
                bg: "bg-cyan-500/10",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative flex flex-col h-full bg-slate-900/40 border border-slate-800 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${feature.border} hover:bg-slate-900/60`}
              >
                {/* Smaller, more refined icon container */}
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                {/* Standardized Title Size */}
                <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h4>

                {/* Controlled text size for a "cleaner" look */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        {/* Stats Grid - Industry Standard Implementation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            {
              label: "Global Integration",
              val: "500+",
              suffix: "Institutions",
              col: "from-emerald-400 to-teal-500",
            },
            {
              label: "Success Rate",
              val: "94%",
              suffix: "Career Pivot",
              col: "from-teal-400 to-cyan-500",
            },
            {
              label: "Infrastructure",
              val: "99.9%",
              suffix: "Uptime SLA",
              col: "from-cyan-400 to-blue-500",
            },
            {
              label: "Expert Network",
              val: "12k+",
              suffix: "Vetted Mentors",
              col: "from-blue-400 to-indigo-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-slate-900/40 border border-slate-800/50 p-6 md:p-8 rounded-2xl transition-all hover:bg-slate-900/80"
            >
              {/* Decorative background glow on hover */}
              <div
                className={`absolute -inset-px bg-gradient-to-r ${stat.col} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div
                  className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.col} bg-clip-text text-transparent mb-1`}
                >
                  {stat.val}
                </div>
                <div className="text-white font-semibold text-sm mb-1">
                  {stat.suffix}
                </div>
                <div className="text-slate-500 font-medium text-[10px] uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>

              {/* Subtle bottom progress-style bar */}
              <div
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${stat.col} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
