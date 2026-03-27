import React, { useEffect, useState, useRef } from "react";
import {
  CalendarDays, Wallet, Users, Hotel,
  MapPin, Globe, TrendingUp, Backpack,
  ChevronDown, ChevronUp, Cloud, CloudRain,
  Sun, Wind, Info, Sparkles
} from "lucide-react";

/* ═══════════════════════════════════════════
   SMART DEFAULTS  (INR, lower bound estimates)
   Per budget tier × activity category
═══════════════════════════════════════════ */
const SMART_DEFAULTS = {
  Cheap: {
    'Food & Dining':      500,
    'Activities & Entry': 300,
    'Transport':          200,
    'Shopping':           1000,
    'Wellness':           800,
  },
  Moderate: {
    'Food & Dining':      1500,
    'Activities & Entry': 800,
    'Transport':          600,
    'Shopping':           3000,
    'Wellness':           2500,
  },
  Luxury: {
    'Food & Dining':      5000,
    'Activities & Entry': 3000,
    'Transport':          4000,
    'Shopping':           10000,
    'Wellness':           8000,
  },
};

/* ═══════════════════════════════════════════
   CATEGORY CLASSIFIER
═══════════════════════════════════════════ */
function classify(name = '') {
  const s = name.toLowerCase();
  if (/lunch|dinner|brunch|breakfast|restaurant|cafe|food|dining|kitchen|eat|cuisine|cocktail|bar/.test(s))
    return 'Food & Dining';
  if (/spa|massage|wellness|therapy|relax/.test(s))
    return 'Wellness';
  if (/shop|mall|market|palladium|boutique|retail/.test(s))
    return 'Shopping';
  if (/car|drive|transport|taxi|cab|transfer|sea link|cruise|yacht|ferry/.test(s))
    return 'Transport';
  return 'Activities & Entry';
}

/* ═══════════════════════════════════════════
   PRICE PARSER
   Returns { value, isEstimated, isZero }
═══════════════════════════════════════════ */
function parsePrice(str = '', category, budgetTier = 'Moderate') {
  if (!str) return { value: getDefault(category, budgetTier), isEstimated: true };

  const s = str.toLowerCase().trim();

  // Truly free
  if (s === 'free') return { value: 0, isEstimated: false, isZero: true };

  // Vague → use smart default
  if (/varies|included|complimentary|tbd|na|n\/a/.test(s)) {
    return { value: getDefault(category, budgetTier), isEstimated: true };
  }

  // Try to extract numbers
  const nums = str.replace(/[₹,]/g, '').replace(/INR/gi, '')
    .match(/\d+/g)?.map(Number) || [];

  if (!nums.length) {
    return { value: getDefault(category, budgetTier), isEstimated: true };
  }

  return { value: Math.min(...nums), isEstimated: false };
}

function getDefault(category, tier) {
  const tierKey = ['Cheap', 'Moderate', 'Luxury'].includes(tier) ? tier : 'Moderate';
  return SMART_DEFAULTS[tierKey][category] || SMART_DEFAULTS[tierKey]['Activities & Entry'];
}

/* ═══════════════════════════════════════════
   BUILD BUDGET DATA
═══════════════════════════════════════════ */
function buildBudgetData(trip) {
  const days      = trip?.tripData?.itinerary || [];
  const budgetTier = trip?.userSelection?.budget || 'Moderate';
  const buckets   = {};

  days.forEach(day => {
    (day.activities || []).forEach(act => {
      const cat   = classify(act.activityName || '');
      const { value, isEstimated, isZero } = parsePrice(act.ticketPrice, cat, budgetTier);

      if (!buckets[cat]) buckets[cat] = { total: 0, items: [], estimatedCount: 0 };
      buckets[cat].total += value;
      if (isEstimated) buckets[cat].estimatedCount++;
      buckets[cat].items.push({
        name:        act.activityName,
        price:       act.ticketPrice,
        parsed:      value,
        isEstimated,
        isZero,
      });
    });
  });

  const grandTotal     = Object.values(buckets).reduce((s, b) => s + b.total, 0);
  const estimatedTotal = Object.values(buckets).reduce((s, b) =>
    s + b.items.filter(i => i.isEstimated).reduce((a, i) => a + i.parsed, 0), 0);

  const categories = Object.entries(buckets)
    .map(([label, data]) => ({
      label,
      total:          data.total,
      items:          data.items,
      estimatedCount: data.estimatedCount,
      pct:            grandTotal > 0 ? Math.round((data.total / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return { categories, grandTotal, estimatedTotal, budgetTier };
}

function fmtINR(n) {
  if (n === 0) return 'Free';
  return '₹' + n.toLocaleString('en-IN');
}

/* ═══════════════════════════════════════════
   COLORS
═══════════════════════════════════════════ */
const CAT_COLORS = {
  'Food & Dining':      { bar: 'bg-amber-400',   soft: 'bg-amber-50   text-amber-700  border-amber-100',   dot: 'bg-amber-400'   },
  'Activities & Entry': { bar: 'bg-indigo-500',  soft: 'bg-indigo-50  text-indigo-700 border-indigo-100',  dot: 'bg-indigo-500'  },
  'Transport':          { bar: 'bg-sky-500',      soft: 'bg-sky-50     text-sky-700    border-sky-100',     dot: 'bg-sky-500'     },
  'Shopping':           { bar: 'bg-pink-500',     soft: 'bg-pink-50    text-pink-700   border-pink-100',    dot: 'bg-pink-500'    },
  'Wellness':           { bar: 'bg-emerald-500',  soft: 'bg-emerald-50 text-emerald-700 border-emerald-100',dot: 'bg-emerald-500' },
};
const fallback = { bar: 'bg-violet-500', soft: 'bg-violet-50 text-violet-700 border-violet-100', dot: 'bg-violet-500' };
const getColor = cat => CAT_COLORS[cat] || fallback;

/* ═══════════════════════════════════════════
   BUDGET CHART
═══════════════════════════════════════════ */
function BudgetChart({ trip }) {
  const [animated, setAnimated] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const ref = useRef(null);

  const { categories, grandTotal, estimatedTotal, budgetTier } = buildBudgetData(trip);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (!categories.length) return null;

  const hasEstimates = estimatedTotal > 0;
  const estimatedPct = grandTotal > 0 ? Math.round((estimatedTotal / grandTotal) * 100) : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm" ref={ref}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">Budget Breakdown</h3>
        <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-semibold">
          Live data
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4 ml-9">
        Parsed from itinerary · <span className="text-indigo-400 font-medium">{budgetTier}</span> tier estimates for "Varies"
      </p>

      {/* Grand total card */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl px-4 py-3 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">Estimated Total</p>
            <p className="text-2xl font-bold text-indigo-700 mt-0.5 leading-none">{fmtINR(grandTotal)}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[10px] text-gray-400">Lower bound · excl. hotel</p>
            {hasEstimates && (
              <p className="text-[10px] text-amber-500 font-medium">
                ~{fmtINR(estimatedTotal)} estimated ({estimatedPct}%)
              </p>
            )}
          </div>
        </div>

        {/* Mini stacked bar */}
        <div className="mt-3 flex h-1.5 rounded-full overflow-hidden gap-px">
          {categories.map(cat => (
            <div
              key={cat.label}
              className={`${getColor(cat.label).bar} transition-all duration-1000`}
              style={{ width: animated ? `${cat.pct}%` : '0%' }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {categories.map(cat => (
            <div key={cat.label} className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${getColor(cat.label).dot}`} />
              <span className="text-[10px] text-gray-400">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category bars */}
      <div className="space-y-3">
        {categories.map(cat => {
          const c      = getColor(cat.label);
          const isOpen = expanded === cat.label;

          return (
            <div key={cat.label}>
              <button className="w-full text-left" onClick={() => setExpanded(isOpen ? null : cat.label)}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                    <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${c.soft}`}>
                      {cat.pct}%
                    </span>
                    {cat.estimatedCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-amber-50 text-amber-600 border-amber-100 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {cat.estimatedCount} estimated
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-800">{fmtINR(cat.total)}</span>
                    {isOpen
                      ? <ChevronUp   className="w-3 h-3 text-gray-400" />
                      : <ChevronDown className="w-3 h-3 text-gray-400" />}
                  </div>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.bar} transition-all duration-1000 ease-out`}
                    style={{ width: animated ? `${cat.pct}%` : '0%' }}
                  />
                </div>
              </button>

              {/* Expanded items */}
              {isOpen && (
                <div className="mt-2 ml-4 space-y-1.5 pb-1">
                  {cat.items.map((item, i) => (
                    <div key={i} className={`flex items-start justify-between gap-2 rounded-lg px-3 py-2 border
                      ${item.isEstimated
                        ? 'bg-amber-50/60 border-amber-100'
                        : item.isZero
                        ? 'bg-emerald-50/60 border-emerald-100'
                        : 'bg-gray-50 border-gray-100'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 font-medium leading-snug truncate">{item.name}</p>
                        {item.isEstimated && (
                          <p className="text-[10px] text-amber-500 mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Estimated · original: "{item.price || 'not specified'}"
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold flex-shrink-0
                        ${item.isZero ? 'text-emerald-600' : item.isEstimated ? 'text-amber-600' : 'text-gray-800'}`}>
                        {item.isZero ? 'Free' : fmtINR(item.parsed)}
                        {item.isEstimated && <span className="text-[9px] ml-0.5 opacity-60">est.</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-start gap-1.5 mt-4 pt-3 border-t border-gray-50">
        <Info className="w-3 h-3 text-gray-300 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Prices marked <span className="text-amber-500 font-medium">estimated</span> use{' '}
          <span className="font-medium text-gray-500">{budgetTier}</span>-tier defaults
          for "Varies" / "Included" entries. Hotel stays, tips & incidentals excluded.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COUNT UP
═══════════════════════════════════════════ */
function CountUp({ end, duration = 900 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = end / (duration / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [end]);
  return <>{count}</>;
}

/* ═══════════════════════════════════════════
   RING
═══════════════════════════════════════════ */
function Ring({ pct, color, size = 44, stroke = 4 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - pct / 100)), 120);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════ */
const STAT_STYLES = [
  { iconBg: 'bg-indigo-500',  ringColor: '#6366f1' },
  { iconBg: 'bg-violet-500',  ringColor: '#8b5cf6' },
  { iconBg: 'bg-sky-500',     ringColor: '#0ea5e9' },
  { iconBg: 'bg-emerald-500', ringColor: '#10b981' },
];

function StatCard({ item, index, maxVal }) {
  const Icon  = item.icon;
  const style = STAT_STYLES[index % STAT_STYLES.length];
  const isNum = typeof item.value === 'number';
  const pct   = isNum && maxVal ? Math.min((item.value / maxVal) * 100, 100) : 75;

  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-5 ${style.iconBg}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {isNum && (
          <div className="relative flex-shrink-0">
            <Ring pct={pct} color={style.ringColor} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-400">
              {Math.round(pct)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">
        {isNum ? <CountUp end={item.value} /> : item.value}
      </h3>
      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WEATHER + PACKING
═══════════════════════════════════════════ */
const PACKING_RULES = [
  { condition: w => w.temp > 28,  icon: '🕶️', label: 'Sunglasses',           cat: 'Hot weather'  },
  { condition: w => w.temp > 28,  icon: '🧴', label: 'Sunscreen SPF 50+',    cat: 'Hot weather'  },
  { condition: w => w.temp > 28,  icon: '💧', label: 'Water bottle',          cat: 'Hot weather'  },
  { condition: w => w.temp < 15,  icon: '🧥', label: 'Warm jacket',           cat: 'Cold weather' },
  { condition: w => w.temp < 15,  icon: '🧣', label: 'Scarf & gloves',        cat: 'Cold weather' },
  { condition: w => w.rain > 40,  icon: '☂️', label: 'Compact umbrella',      cat: 'Rainy'        },
  { condition: w => w.rain > 40,  icon: '🥾', label: 'Waterproof shoes',      cat: 'Rainy'        },
  { condition: w => w.wind > 25,  icon: '🧢', label: 'Windproof cap',         cat: 'Windy'        },
  { condition: () => true,        icon: '💊', label: 'First aid kit',          cat: 'Essentials'   },
  { condition: () => true,        icon: '📱', label: 'Power bank',             cat: 'Essentials'   },
  { condition: () => true,        icon: '📷', label: 'Camera / memory card',  cat: 'Essentials'   },
  { condition: () => true,        icon: '🪪', label: 'ID & travel docs',      cat: 'Essentials'   },
  { condition: w => w.temp > 20,  icon: '👕', label: 'Light breathable tops', cat: 'Clothing'     },
  { condition: w => w.temp <= 20, icon: '🧤', label: 'Layered clothing',      cat: 'Clothing'     },
];

function WeatherPacking({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);
  const [showAll, setShowAll] = useState(false);
  const city = destination?.label || destination?.value || '';

  useEffect(() => {
    if (!city) return;
    setLoading(true); setError(false);
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then(r => r.json())
      .then(data => {
        const cur = data?.current_condition?.[0];
        setWeather({
          temp:      parseInt(cur?.temp_C        || 24),
          feelsLike: parseInt(cur?.FeelsLikeC    || 24),
          humidity:  parseInt(cur?.humidity      || 60),
          wind:      parseInt(cur?.windspeedKmph || 15),
          rain:      parseInt(data?.weather?.[0]?.hourly?.[4]?.chanceofrain || 20),
          desc:      cur?.weatherDesc?.[0]?.value || '',
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [city]);

  const wData       = weather || { temp: 24, rain: 20, wind: 15 };
  const suggestions = PACKING_RULES.filter(r => r.condition(wData));
  const visible     = showAll ? suggestions : suggestions.slice(0, 6);

  const WeatherIcon = !weather ? Cloud : weather.rain > 50 ? CloudRain : weather.temp > 28 ? Sun : weather.wind > 30 ? Wind : Cloud;
  const weatherBg   = !weather ? 'from-sky-400 to-sky-600'
    : weather.rain > 50        ? 'from-slate-500 to-slate-700'
    : weather.temp > 30        ? 'from-orange-400 to-rose-500'
    : weather.temp > 20        ? 'from-sky-400 to-blue-500'
    : weather.temp < 10        ? 'from-blue-600 to-indigo-700'
    : 'from-sky-400 to-teal-500';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className={`bg-gradient-to-br ${weatherBg} p-5 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold opacity-70 uppercase tracking-widest mb-1">Live Weather</p>
            <p className="text-sm font-semibold opacity-90 truncate max-w-[180px]">{city || 'Destination'}</p>
          </div>
          <WeatherIcon className="w-10 h-10 opacity-80" />
        </div>
        {loading && (
          <div className="mt-3 flex items-center gap-2 text-xs opacity-75">
            <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Fetching live weather…
          </div>
        )}
        {error && <p className="mt-2 text-xs opacity-70">Live weather unavailable. Showing general suggestions.</p>}
        {weather && !loading && (
          <div className="mt-3 flex items-end gap-4 flex-wrap">
            <div>
              <span className="text-4xl font-bold">{weather.temp}°</span>
              <span className="text-sm opacity-70 ml-1">C</span>
            </div>
            <div className="space-y-0.5 text-xs opacity-80">
              <p>Feels like {weather.feelsLike}°C</p>
              <p>Humidity {weather.humidity}%</p>
              <p>Wind {weather.wind} km/h · Rain {weather.rain}%</p>
            </div>
          </div>
        )}
        {weather?.desc && <p className="mt-1.5 text-xs opacity-60 capitalize">{weather.desc}</p>}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Backpack className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Packing Suggestions</h3>
          <span className="ml-auto text-xs text-gray-400">{suggestions.length} items</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {visible.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-3 py-2 transition-colors">
              <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{item.label}</p>
                <p className="text-[10px] text-gray-400">{item.cat}</p>
              </div>
            </div>
          ))}
        </div>
        {suggestions.length > 6 && (
          <button
            onClick={() => setShowAll(s => !s)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 py-2 rounded-xl transition-colors"
          >
            {showAll
              ? <><ChevronUp className="w-3.5 h-3.5" />Show less</>
              : <><ChevronDown className="w-3.5 h-3.5" />Show {suggestions.length - 6} more</>}
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI INSIGHT BANNER
═══════════════════════════════════════════ */
function InsightBanner({ days, budget }) {
  const pace =
    days <= 2
      ? {
          emoji: "⚡",
          title: "Short & action-packed",
          sub: "Focus on must-sees — skip long queues.",
          color: "from-amber-400 to-orange-500",
        }
      : days <= 5
      ? {
          emoji: "✨",
          title: "Balanced pace",
          sub: "Great mix of sightseeing and downtime.",
          color: "from-indigo-500 to-purple-600",
        }
      : {
          emoji: "🌍",
          title: "Deep explorer",
          sub: "Room to wander off the beaten path.",
          color: "from-emerald-500 to-teal-600",
        };

  const budgetNote =
    budget === "Luxury"
      ? "Luxury experiences unlocked — go premium."
      : budget === "Cheap"
      ? "Stretch every rupee — hostels & street food FTW."
      : "Perfect balance of comfort and cost.";

  return (
    <div
      className={`relative bg-gradient-to-br ${pace.color} rounded-2xl p-5 text-white shadow-lg`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-md">
          {pace.emoji}
        </div>

        {/* Text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
            AI Insight
          </p>

          <h3 className="text-lg font-bold mt-1 leading-tight">
            {pace.title}
          </h3>

          <p className="text-sm mt-1 text-white/90">
            {pace.sub}
          </p>

          <p className="text-xs mt-3 bg-white/20 inline-block px-3 py-1 rounded-full font-medium">
            {budgetNote}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOCATION CARD
═══════════════════════════════════════════ */
function LocationCard({ trip }) {
  const dest = trip?.userSelection?.destination?.label || 'Unknown location';
  const note = trip?.tripData?.tripNote;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
          <Globe className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">Destination</h3>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-gray-900 truncate">{dest}</p>
      </div>
      {note && (
        <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-3 leading-relaxed line-clamp-4">
          {note}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
function TripStats({ trip }) {
  if (!trip) return null;

  const days     = Number(trip?.userSelection?.noOfDays || 0);
  const hotels   = trip?.tripData?.hotelsOptions?.length || trip?.tripData?.hotels?.length || 0;
  const budget   = trip?.userSelection?.budget   || 'Moderate';
  const traveler = trip?.userSelection?.traveler || '—';
  const dest     = trip?.userSelection?.destination;

  const stats = [
    { label: 'Days',      value: days,     icon: CalendarDays },
    { label: 'Budget',    value: budget,   icon: Wallet       },
    { label: 'Travelers', value: traveler, icon: Users        },
    { label: 'Hotels',    value: hotels,   icon: Hotel        },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((item, i) => (
          <StatCard key={i} item={item} index={i} maxVal={days || 10} />
        ))}
      </div>
      <InsightBanner days={days} budget={budget} />
      <LocationCard trip={trip} />
      <BudgetChart trip={trip} />
      <WeatherPacking destination={dest} />
    </div>
  );
}

export default TripStats;