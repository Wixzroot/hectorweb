import minecraftImg from '../assets/images/minecraft_game_cover_1788180858749.jpg';
import palworldImg from '../assets/images/palworld_game_cover_1788180895611.jpg';
import hytaleImg from '../assets/images/hytale_game_cover_1788180878834.jpg';
import rustImg from '../assets/images/rust_game_cover_1788181561811.jpg';
import valheimImg from '../assets/images/valheim_game_cover_1788181581139.jpg';
import enshroudedImg from '../assets/images/enshrouded_game_cover_1788181599150.jpg';
import arkImg from '../assets/images/ark_game_cover_1788181616275.jpg';
import fivemImg from '../assets/images/fivem_game_cover_1788181632786.jpg';

import { GameInfo } from '../components/GameDeployModal';

export const GAME_CATALOG: GameInfo[] = [
  {
    id: 'game-mc-java',
    title: 'MINECRAFT: JAVA',
    category: 'Sandbox',
    image: minecraftImg,
    startingPriceInr: 149,
    platforms: ['PC', 'Mac', 'Linux'],
    badge: 'POPULAR',
    description: 'High clock Ryzen 9 5950X performance hosting for Spigot, Paper, Forge, Fabric & heavy modpacks.',
    ramOptions: [
      { ram: '2 GB', slots: '15 Slots', priceInr: 149, cpu: '100% CPU Core' },
      { ram: '4 GB', slots: '30 Slots', priceInr: 299, cpu: '200% CPU Core' },
      { ram: '8 GB', slots: '60 Slots', priceInr: 599, cpu: '300% CPU Core' },
      { ram: '16 GB', slots: 'Unlimited', priceInr: 1199, cpu: '400% CPU Core' },
    ]
  },
  {
    id: 'game-mc-bedrock',
    title: 'MINECRAFT: BEDROCK',
    category: 'Sandbox',
    image: minecraftImg,
    startingPriceInr: 149,
    platforms: ['PC', 'Xbox', 'PlayStation', 'Mobile'],
    badge: 'CROSSPLAY',
    description: 'Ultra low latency Minecraft Pocket Edition / GeyserMC Bedrock crossplay servers.',
    ramOptions: [
      { ram: '2 GB', slots: '10 Slots', priceInr: 149, cpu: '100% CPU Core' },
      { ram: '4 GB', slots: '25 Slots', priceInr: 299, cpu: '200% CPU Core' },
      { ram: '8 GB', slots: '50 Slots', priceInr: 599, cpu: '300% CPU Core' },
      { ram: '16 GB', slots: '100+ Slots', priceInr: 1199, cpu: '400% CPU Core' },
    ]
  },
  {
    id: 'game-palworld',
    title: 'PALWORLD',
    category: 'Survival',
    image: palworldImg,
    startingPriceInr: 299,
    platforms: ['PC', 'Xbox', 'GamePass'],
    badge: 'TOP SELLER',
    description: 'Optimized high-RAM Palworld multiplayer dedicated hosting with auto memory leak scrubbing.',
    ramOptions: [
      { ram: '8 GB', slots: '16 Players', priceInr: 299, cpu: '200% CPU Core' },
      { ram: '16 GB', slots: '32 Players', priceInr: 599, cpu: '300% CPU Core' },
      { ram: '24 GB', slots: '64 Players', priceInr: 899, cpu: '400% CPU Core' },
      { ram: '32 GB', slots: '100+ Players', priceInr: 1299, cpu: '500% CPU Core' },
    ]
  },
  {
    id: 'game-hytale',
    title: 'HYTALE',
    category: 'Sandbox',
    image: hytaleImg,
    startingPriceInr: 199,
    platforms: ['PC', 'Mac'],
    badge: 'PRE-ORDER READY',
    description: 'Dedicated enterprise infrastructure ready for instant setup upon Hytale server release.',
    ramOptions: [
      { ram: '4 GB', slots: '20 Players', priceInr: 199, cpu: '150% CPU Core' },
      { ram: '8 GB', slots: '45 Players', priceInr: 399, cpu: '250% CPU Core' },
      { ram: '16 GB', slots: '90 Players', priceInr: 799, cpu: '350% CPU Core' },
      { ram: '32 GB', slots: 'Unlimited', priceInr: 1499, cpu: '500% CPU Core' },
    ]
  },
  {
    id: 'game-rust',
    title: 'RUST',
    category: 'Survival',
    image: rustImg,
    startingPriceInr: 299,
    platforms: ['PC', 'PlayStation', 'Xbox'],
    badge: 'OXIDE / UMOD',
    description: 'High tick-rate Rust servers with full uMod/Oxide plugin support and DDoS mitigation.',
    ramOptions: [
      { ram: '6 GB', slots: '50 Players', priceInr: 299, cpu: '200% CPU Core' },
      { ram: '12 GB', slots: '100 Players', priceInr: 599, cpu: '350% CPU Core' },
      { ram: '20 GB', slots: '200 Players', priceInr: 999, cpu: '450% CPU Core' },
      { ram: '32 GB', slots: '300+ Players', priceInr: 1499, cpu: '600% CPU Core' },
    ]
  },
  {
    id: 'game-valheim',
    title: 'VALHEIM',
    category: 'RPG',
    image: valheimImg,
    startingPriceInr: 249,
    platforms: ['PC', 'Xbox', 'Crossplay'],
    badge: 'CROSSPLAY',
    description: 'Viking co-op survival hosting with automatic cloud world saves & Valheim Plus support.',
    ramOptions: [
      { ram: '4 GB', slots: '10 Vikings', priceInr: 249, cpu: '150% CPU Core' },
      { ram: '8 GB', slots: '20 Vikings', priceInr: 499, cpu: '250% CPU Core' },
      { ram: '16 GB', slots: '50 Vikings', priceInr: 899, cpu: '350% CPU Core' },
    ]
  },
  {
    id: 'game-enshrouded',
    title: 'ENSHROUDED',
    category: 'RPG',
    image: enshroudedImg,
    startingPriceInr: 299,
    platforms: ['PC'],
    badge: 'NEW',
    description: '16-player co-op action RPG servers with unthrottled CPU threads and NVMe world loading.',
    ramOptions: [
      { ram: '8 GB', slots: '8 Players', priceInr: 299, cpu: '200% CPU Core' },
      { ram: '16 GB', slots: '16 Players', priceInr: 599, cpu: '350% CPU Core' },
      { ram: '24 GB', slots: '32 Players', priceInr: 899, cpu: '450% CPU Core' },
    ]
  },
  {
    id: 'game-ark',
    title: 'ARK: SURVIVAL',
    category: 'Survival',
    image: arkImg,
    startingPriceInr: 349,
    platforms: ['PC', 'PlayStation', 'Xbox'],
    badge: 'CLUSTER READY',
    description: 'ARK: Survival Evolved & Ascended hosting with cross-server cluster transfer capabilities.',
    ramOptions: [
      { ram: '8 GB', slots: '30 Survivors', priceInr: 349, cpu: '200% CPU Core' },
      { ram: '16 GB', slots: '70 Survivors', priceInr: 699, cpu: '350% CPU Core' },
      { ram: '32 GB', slots: '120 Survivors', priceInr: 1299, cpu: '500% CPU Core' },
    ]
  },
  {
    id: 'game-fivem',
    title: 'FIVEM (GTA V RP)',
    category: 'Simulation',
    image: fivemImg,
    startingPriceInr: 399,
    platforms: ['PC'],
    badge: 'ESX / QBCore',
    description: 'GTA V FiveM roleplay server hosting with TxAdmin panel, MySQL DB, and OneSync support.',
    ramOptions: [
      { ram: '8 GB', slots: '32 Slots', priceInr: 399, cpu: '250% CPU Core' },
      { ram: '16 GB', slots: '64 Slots', priceInr: 799, cpu: '400% CPU Core' },
      { ram: '32 GB', slots: '128 Slots', priceInr: 1399, cpu: '600% CPU Core' },
    ]
  }
];
