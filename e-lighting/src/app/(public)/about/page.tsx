import { supabase } from '@/lib/supabase';
import { Target, Eye, Activity, Globe } from 'lucide-react';

export const revalidate = 0;

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Hero Header */}
      <section className="bg-white border-b border-zinc-200 pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="border-l-4 border-zinc-900 pl-8">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-zinc-900">
              Our <br /> <span className="text-zinc-400">Story</span>
            </h1>
            <p className="text-zinc-500 font-mono text-sm mt-6 uppercase tracking-[0.2em] max-w-xl">
              Illuminating South Africa since 2011 with cutting-edge LED solutions.
            </p>
          </header>
        </div>
      </section>

      {/* Origin & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-zinc-900 text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
              Established 2011
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-zinc-900 leading-none">
              Redefining the experience of illumination.
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed font-light">
              eLighting was founded with a vision to illuminate not just spaces, but also lives. 
              Our journey began in 2011 when a group of passionate engineers and enthusiasts 
              addressed the need for eco-friendly lighting alternatives in Southern Africa.
            </p>
            <p className="text-zinc-600 text-lg leading-relaxed font-light">
              With a focus on cutting-edge technology and environmental impact, we embarked 
              on a mission to transform how the continent lights up its surroundings.
            </p>
          </div>
          <div className="relative aspect-video bg-zinc-200 overflow-hidden border border-zinc-300 shadow-sm">
             <img 
               src="/hero-industrial.jpg" 
               className="w-full h-full object-cover grayscale opacity-80"
               alt="Industrial Lighting Warehouse"
             />
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-zinc-200/50 border-y border-zinc-200 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
              <Target className="text-zinc-900" size={32} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Mission</h3>
              <p className="text-zinc-500 text-xs font-mono leading-relaxed uppercase">
                To be a leading force in the lighting industry, enhancing lives through locally manufactured LED solutions.
              </p>
            </div>
            <div className="space-y-4">
              <Eye className="text-zinc-900" size={32} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Our DNA</h3>
              <p className="text-zinc-500 text-xs font-mono leading-relaxed uppercase">
                Innovation is at our core. We constantly push the boundaries of LED technology for efficiency and aesthetics.
              </p>
            </div>
            <div className="space-y-4">
              <Activity className="text-zinc-900" size={32} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">What We Do</h3>
              <p className="text-zinc-500 text-xs font-mono leading-relaxed uppercase">
                From design to production, every stage is permeated with a dedication to accuracy, toughness, and durability.
              </p>
            </div>
            <div className="space-y-4">
              <Globe className="text-zinc-900" size={32} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Responsibility</h3>
              <p className="text-zinc-500 text-xs font-mono leading-relaxed uppercase">
                We contribute to reducing carbon footprints by prioritizing eco-friendly materials and energy-efficient designs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Excellence Text Block */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-8">Quality Control</h2>
        <p className="text-2xl md:text-4xl text-zinc-900 font-bold tracking-tight mb-8">
          "Excellence is the basis for our success."
        </p>
        <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-2xl mx-auto">
          To ensure that they meet and surpass industry standards, our products go through stringent quality control procedures. 
          As a consequence, the lighting solutions we provide are dependable, effective, and long-lasting.
        </p>
      </section>
    </main>
  );
}
