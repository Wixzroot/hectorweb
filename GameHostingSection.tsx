import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import minecraftCover from '../assets/images/minecraft_game_cover_1788180858749.jpg';
import hytaleCover from '../assets/images/hytale_game_cover_1788180878834.jpg';
import palworldCover from '../assets/images/palworld_game_cover_1788180895611.jpg';

interface GameHostingSectionProps {
  activeCurrency?: 'USD' | 'INR' | 'EUR';
}

export const GameHostingSection: React.FC<GameHostingSectionProps> = ({ activeCurrency = 'INR' }) => {
  const getPrice = (inrVal: number) => {
    return `₹${inrVal}`;
  };

  const gameList = [
    {
      id: 'minecraft',
      title: 'Minecraft Hosting',
      image: minecraftCover,
      price: 149,
      status: 'Available',
      description: 'Premium Minecraft hosting with instant setup and modpack support.',
      link: '/plans'
    },
    {
      id: 'hytale',
      title: 'Hytale Hosting',
      image: hytaleCover,
      price: 499,
      status: 'Available',
      description: 'Low latency Hytale hosting with powerful hardware options and automated backups.',
      link: '/plans'
    },
    {
      id: 'palworld',
      title: 'Palworld Hosting',
      image: palworldCover,
      price: 389,
      status: 'Available',
      description: 'High-performance Palworld servers with Ryzen 9 processors and DDoS defense.',
      link: '/plans'
    }
  ];

  return (
    <section className="py-32 bg-bg text-foreground relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bg-alt border border-border text-[10px] font-black tracking-[0.2em] uppercase text-foreground-dim mb-6"
          >
            <Gamepad2 size={13} className="text-accent" />
            <span>Dedicated Game Instance</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground uppercase leading-[1.1] text-balance"
          >
            Infrastructure Built for <br />
            <span className="text-foreground-muted">High-Frequency Play.</span>
          </motion.h2>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {gameList.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-bg flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] mb-4 font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Instance {game.status}
                  </span>
                  <span className="text-foreground-dim">
                    From <span className="text-foreground">{getPrice(game.price)}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                  {game.title}
                </h3>

                <p className="text-foreground-muted text-[13px] leading-relaxed mb-8 flex-1">
                  {game.description}
                </p>

                <Link
                  to={game.link}
                  className="w-full py-3.5 px-6 bg-bg-alt hover:bg-border border border-border text-foreground font-bold rounded text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all"
                >
                  Configure Server
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
