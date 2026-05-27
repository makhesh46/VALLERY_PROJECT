import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">The Atelier</h1>
          <p className="text-[#c5a059] uppercase tracking-[0.2em] text-sm">Forging the Future of Agriculture</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg mx-auto"
        >
          <img 
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop" 
            alt="Workshop" 
            className="w-full h-[400px] object-cover rounded-2xl mb-12 border border-white/10"
          />
          
          <p className="text-white/70 leading-relaxed mb-8">
            VALLERY AgriWorks was founded on a singular vision: to redefine modern agriculture through precision-engineered machinery and innovative rural technologies. Our workshop combines rugged fabrication expertise with advanced engineering to create durable solutions built for the future of farming.
          </p>
          
          <p className="text-white/70 leading-relaxed mb-8">
            Every machine that leaves our facility reflects our commitment to performance, reliability, and craftsmanship. We don’t simply manufacture equipment; we engineer tools that empower farmers, increase productivity, and withstand real-world agricultural demands.
          </p>

          <p className="text-white/70 leading-relaxed mb-8">
            From smart farming systems and custom agricultural machinery to heavy-duty field equipment and next-generation rural mobility solutions, our work is defined by uncompromising durability, functional innovation, and a bold engineering identity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-serif text-white mb-4">Our Philosophy</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We believe that true luxury lies in the details. The weight of a handle, the patina of aged brass, the perfect weld—these are the elements that transform the ordinary into the extraordinary.
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-serif text-white mb-4">Our Process</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Each project begins with a dialogue. We work closely with our clients to understand their vision, translating concepts into detailed designs before our master craftsmen bring them to life.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
