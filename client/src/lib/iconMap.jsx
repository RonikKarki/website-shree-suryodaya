import {
  LuAward, LuSettings, LuSprout, LuTruck, LuHandshake,
  LuPackage, LuBadgeCheck, LuTarget, LuRocket, LuHeart,
  LuFactory, LuMapPin, LuStar, LuLeaf, LuUsers, LuShield,
  LuGlobe, LuClock, LuChartBar, LuTrendingUp, LuZap,
  LuWrench, LuGem, LuMicroscope, LuFlower2, LuScale,
  LuCircleCheck, LuThumbsUp, LuRefreshCw, LuSun, LuDroplets,
  LuWheat, LuBox, LuTag, LuLayers, LuActivity,
} from 'react-icons/lu';

const MAP = {
  // Awards / quality
  '🏆': LuAward,
  '🥇': LuAward,
  '🏅': LuAward,
  '🌟': LuStar,
  '⭐': LuStar,
  '💎': LuGem,

  // Operations / machinery
  '⚙️': LuSettings,
  '🔧': LuWrench,
  '🔬': LuMicroscope,
  '🏭': LuFactory,

  // Agriculture / nature
  '🌱': LuSprout,
  '🌿': LuLeaf,
  '🌾': LuWheat,
  '🌻': LuFlower2,
  '🌺': LuFlower2,
  '☀️': LuSun,
  '💧': LuDroplets,

  // Logistics / delivery
  '🚚': LuTruck,
  '🚛': LuTruck,
  '📦': LuPackage,
  '📫': LuPackage,
  '📋': LuBox,

  // Trust / people
  '🤝': LuHandshake,
  '👥': LuUsers,
  '💪': LuZap,
  '❤️': LuHeart,
  '♥️': LuHeart,
  '👍': LuThumbsUp,

  // Quality checks
  '✅': LuBadgeCheck,
  '☑️': LuBadgeCheck,
  '✔️': LuCircleCheck,

  // Goals / growth
  '🎯': LuTarget,
  '🚀': LuRocket,
  '📈': LuTrendingUp,
  '📊': LuChartBar,
  '⚡': LuZap,

  // Location / time
  '📍': LuMapPin,
  '⏰': LuClock,
  '🕐': LuClock,

  // Misc
  '🛡️': LuShield,
  '🌍': LuGlobe,
  '🌐': LuGlobe,
  '🔄': LuRefreshCw,
  '⚖️': LuScale,
  '🏷️': LuTag,
  '📌': LuMapPin,
  '🧪': LuMicroscope,
  '📉': LuActivity,
  '🔗': LuLayers,
};

/**
 * Renders the matching Lucide icon for a given emoji string.
 * Returns null if the emoji isn't in the map so missing CMS values are silent.
 */
export default function EmojiIcon({ emoji, className = 'w-6 h-6', strokeWidth = 1.75 }) {
  if (!emoji) return null;
  const key = emoji.trim();
  const Icon = MAP[key] ?? MAP[key[0]];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
