// Studio-style product artwork drawn in SVG, used until real product photos
// are uploaded (Product.images). One drawing per kind of gear.

const S = '#EBEBF5'; // stroke
const F = '#2B2B2B'; // body fill
const D = '#171717'; // dark detail
const A = '#57B4E5'; // accent

function Camera({ cine }: { cine?: boolean }) {
  return (
    <g>
      {cine ? (
        <>
          <rect x="70" y="92" width="150" height="112" rx="10" fill={F} stroke={S} strokeWidth="2" />
          <rect x="88" y="70" width="70" height="22" rx="4" fill={D} stroke={S} strokeWidth="2" />
          <rect x="196" y="110" width="44" height="76" rx="6" fill={D} stroke={S} strokeWidth="2" />
          <circle cx="104" cy="122" r="5" fill={A} />
          <rect x="92" y="150" width="50" height="8" rx="2" fill={D} />
          <rect x="92" y="164" width="34" height="8" rx="2" fill={D} />
        </>
      ) : (
        <>
          <path d="M70 110 h40 l12 -20 h56 l12 20 h40 a10 10 0 0 1 10 10 v76 a10 10 0 0 1 -10 10 h-160 a10 10 0 0 1 -10 -10 v-76 a10 10 0 0 1 10 -10z" fill={F} stroke={S} strokeWidth="2" />
          <rect x="78" y="120" width="26" height="60" rx="8" fill={D} />
          <circle cx="222" cy="102" r="6" fill={A} />
        </>
      )}
      <circle cx="160" cy="160" r="46" fill={D} stroke={S} strokeWidth="2" />
      <circle cx="160" cy="160" r="34" fill="#0E0E0E" stroke={S} strokeWidth="1.5" />
      <circle cx="160" cy="160" r="18" fill="#101820" stroke={A} strokeWidth="1.5" />
      <circle cx="152" cy="152" r="5" fill={A} opacity="0.7" />
    </g>
  );
}

function Lens() {
  return (
    <g>
      <rect x="95" y="90" width="130" height="130" rx="14" fill={F} stroke={S} strokeWidth="2" transform="rotate(0)" />
      <rect x="95" y="118" width="130" height="16" fill={D} />
      <rect x="95" y="160" width="130" height="22" fill={D} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={100 + i * 10.5} y="163" width="5" height="16" rx="1" fill="#3A3A3A" />
      ))}
      <ellipse cx="160" cy="90" rx="65" ry="16" fill="#0E0E0E" stroke={S} strokeWidth="2" />
      <ellipse cx="160" cy="90" rx="44" ry="10" fill="#101820" stroke={A} strokeWidth="1.5" />
      <rect x="140" y="140" width="40" height="5" rx="2" fill={A} />
    </g>
  );
}

function LightPanel() {
  return (
    <g>
      <rect x="160" y="190" width="6" height="60" fill={S} opacity="0.6" />
      <path d="M130 250 l33 -10 l33 10" stroke={S} strokeWidth="3" fill="none" opacity="0.6" />
      <rect x="80" y="70" width="166" height="120" rx="10" fill={F} stroke={S} strokeWidth="2" />
      <rect x="92" y="82" width="142" height="96" rx="6" fill="#DDEFFA" opacity="0.9" />
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={102 + c * 15.5} cy={92 + r * 15.5} r="3.2" fill="#FFFFFF" />
        )),
      )}
    </g>
  );
}

function LightCob() {
  return (
    <g>
      <path d="M118 225 l42 -20 l42 20" stroke={S} strokeWidth="3" fill="none" opacity="0.6" />
      <rect x="157" y="180" width="6" height="40" fill={S} opacity="0.6" />
      <path d="M130 180 a30 30 0 0 1 60 0" stroke={S} strokeWidth="3" fill="none" />
      <rect x="110" y="96" width="100" height="84" rx="12" fill={F} stroke={S} strokeWidth="2" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={120 + i * 14} y="104" width="6" height="28" rx="2" fill={D} />
      ))}
      <path d="M210 108 l50 -18 v100 l-50 -18z" fill={D} stroke={S} strokeWidth="2" />
      <ellipse cx="262" cy="140" rx="10" ry="50" fill="#FFF6E5" opacity="0.9" />
      <circle cx="128" cy="160" r="5" fill={A} />
    </g>
  );
}

function Tubes() {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${90 + i * 38} 60)`}>
          <rect width="20" height="180" rx="10" fill={F} stroke={S} strokeWidth="2" />
          <rect x="4" y="12" width="12" height="150" rx="6" fill={['#FF5C8A', A, '#FFD166', '#9B7BFF'][i]} opacity="0.9" />
        </g>
      ))}
    </g>
  );
}

function Mic() {
  return (
    <g>
      <rect x="60" y="138" width="200" height="28" rx="14" fill={F} stroke={S} strokeWidth="2" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={74 + i * 9} y="144" width="4" height="16" rx="2" fill={D} />
      ))}
      <rect x="216" y="142" width="34" height="20" rx="4" fill={D} />
      <rect x="250" y="146" width="18" height="12" rx="3" fill={S} opacity="0.7" />
      <circle cx="232" cy="152" r="3" fill={A} />
    </g>
  );
}

function Wireless() {
  return (
    <g>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${92 + i * 76} 96)`}>
          <rect width="60" height="96" rx="12" fill={F} stroke={S} strokeWidth="2" />
          <circle cx="30" cy="34" r="16" fill={D} stroke={S} strokeWidth="1.5" />
          <rect x="14" y="62" width="32" height="18" rx="3" fill="#0F1A22" stroke={A} strokeWidth="1" />
        </g>
      ))}
      <path d="M190 72 a30 30 0 0 1 30 -10 M196 82 a18 18 0 0 1 18 -6" stroke={A} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Recorder() {
  return (
    <g>
      <rect x="80" y="100" width="160" height="104" rx="12" fill={F} stroke={S} strokeWidth="2" />
      <rect x="96" y="114" width="70" height="44" rx="4" fill="#0F1A22" stroke={A} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={106 + i * 22} cy="182" r="8" fill={D} stroke={S} strokeWidth="1.5" />
      ))}
      <circle cx="200" cy="136" r="16" fill={D} stroke={S} strokeWidth="1.5" />
      <path d="M104 146 l8 -12 l8 8 l8 -16 l8 20 l8 -10 l8 6" stroke={A} strokeWidth="2" fill="none" />
    </g>
  );
}

function Gimbal() {
  return (
    <g>
      <rect x="150" y="170" width="22" height="80" rx="10" fill={F} stroke={S} strokeWidth="2" />
      <path d="M161 170 v-24 h60 v-60" stroke={S} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M161 170 v-24 h60 v-60" stroke={F} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="96" y="70" width="110" height="60" rx="8" fill={D} stroke={S} strokeWidth="2" />
      <circle cx="120" cy="100" r="22" fill="#0E0E0E" stroke={S} strokeWidth="1.5" />
      <circle cx="120" cy="100" r="10" fill="#101820" stroke={A} strokeWidth="1.5" />
      <circle cx="161" cy="192" r="5" fill={A} />
    </g>
  );
}

function Tripod() {
  return (
    <g>
      <path d="M160 110 L96 250 M160 110 L224 250 M160 110 L160 250" stroke={S} strokeWidth="5" strokeLinecap="round" />
      <path d="M160 110 L96 250 M160 110 L224 250 M160 110 L160 250" stroke={F} strokeWidth="2" strokeLinecap="round" />
      <path d="M118 202 h84" stroke={S} strokeWidth="3" opacity="0.6" />
      <rect x="128" y="80" width="64" height="34" rx="8" fill={F} stroke={S} strokeWidth="2" />
      <path d="M192 94 l60 -24" stroke={S} strokeWidth="6" strokeLinecap="round" />
      <rect x="136" y="70" width="48" height="12" rx="3" fill={D} stroke={S} strokeWidth="1.5" />
      <circle cx="160" cy="97" r="5" fill={A} />
    </g>
  );
}

function Drone() {
  return (
    <g>
      {[
        [90, 100],
        [230, 100],
        [90, 200],
        [230, 200],
      ].map(([x, y], i) => (
        <g key={i}>
          <path d={`M160 150 L${x} ${y}`} stroke={S} strokeWidth="8" strokeLinecap="round" />
          <path d={`M160 150 L${x} ${y}`} stroke={F} strokeWidth="4" strokeLinecap="round" />
          <circle cx={x} cy={y} r="8" fill={D} stroke={S} strokeWidth="1.5" />
          <ellipse cx={x} cy={y} rx="34" ry="5" fill={S} opacity="0.35" />
        </g>
      ))}
      <rect x="128" y="124" width="64" height="52" rx="16" fill={F} stroke={S} strokeWidth="2" />
      <circle cx="160" cy="186" r="12" fill={D} stroke={S} strokeWidth="1.5" />
      <circle cx="160" cy="186" r="5" fill={A} />
    </g>
  );
}

function Monitor() {
  return (
    <g>
      <rect x="70" y="90" width="180" height="120" rx="10" fill={F} stroke={S} strokeWidth="2" />
      <rect x="82" y="102" width="156" height="96" rx="4" fill="#0F1A22" />
      <path d="M82 170 q40 -50 78 -10 t78 -20 v58 h-156z" fill={A} opacity="0.35" />
      <circle cx="200" cy="128" r="12" fill="#FFD166" opacity="0.8" />
      <rect x="90" y="108" width="30" height="5" rx="2" fill={S} opacity="0.6" />
      <rect x="150" y="210" width="20" height="24" fill={S} opacity="0.5" />
    </g>
  );
}

function Battery() {
  return (
    <g>
      <rect x="96" y="80" width="128" height="150" rx="14" fill={F} stroke={S} strokeWidth="2" />
      <rect x="110" y="96" width="100" height="18" rx="4" fill={D} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={116 + i * 23} y="194" width="16" height="10" rx="2" fill={i < 3 ? A : D} />
      ))}
      <path d="M166 130 l-18 30 h14 l-6 26 l20 -32 h-14z" fill={A} />
    </g>
  );
}

function Card() {
  return (
    <g>
      <path d="M100 80 h100 l20 20 v130 a8 8 0 0 1 -8 8 h-112 a8 8 0 0 1 -8 -8 v-142 a8 8 0 0 1 8 -8z" fill={F} stroke={S} strokeWidth="2" />
      <rect x="110" y="120" width="100" height="60" rx="4" fill={A} opacity="0.85" />
      <text x="160" y="158" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0A0A0A" fontFamily="Arial">CFexpress</text>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={114 + i * 13} y="200" width="7" height="22" rx="1" fill="#C9A227" />
      ))}
    </g>
  );
}

function Stand() {
  return (
    <g>
      <path d="M160 90 v150 M160 240 l-60 14 M160 240 l60 14 M160 232 l-8 22" stroke={S} strokeWidth="5" strokeLinecap="round" />
      <path d="M160 100 h90" stroke={S} strokeWidth="5" strokeLinecap="round" />
      <circle cx="160" cy="100" r="9" fill={F} stroke={S} strokeWidth="2" />
      <circle cx="160" cy="170" r="7" fill={F} stroke={S} strokeWidth="2" />
      <circle cx="250" cy="100" r="6" fill={A} />
    </g>
  );
}

function Reflector() {
  return (
    <g>
      <circle cx="160" cy="155" r="88" fill="#D9D9D9" stroke={S} strokeWidth="2" />
      <path d="M160 67 a88 88 0 0 1 0 176z" fill="#C9A227" opacity="0.9" />
      <circle cx="160" cy="155" r="88" fill="none" stroke={F} strokeWidth="6" />
    </g>
  );
}

function Backdrop() {
  return (
    <g>
      <path d="M80 70 v180 M240 70 v180" stroke={S} strokeWidth="4" />
      <path d="M76 70 h168" stroke={S} strokeWidth="6" strokeLinecap="round" />
      <path d="M86 74 h148 v150 q-74 30 -148 0z" fill="#1F9D55" opacity="0.9" />
    </g>
  );
}

function Slider() {
  return (
    <g>
      <rect x="50" y="170" width="220" height="16" rx="8" fill={F} stroke={S} strokeWidth="2" />
      <rect x="140" y="148" width="50" height="24" rx="6" fill={D} stroke={S} strokeWidth="2" />
      <rect x="150" y="120" width="30" height="28" rx="4" fill={F} stroke={S} strokeWidth="2" />
      <path d="M60 186 l-10 40 M260 186 l10 40" stroke={S} strokeWidth="4" strokeLinecap="round" />
      <circle cx="165" cy="160" r="4" fill={A} />
    </g>
  );
}

const drawings: Record<string, () => React.ReactElement> = {
  camera: () => <Camera />,
  'cinema-camera': () => <Camera cine />,
  lens: Lens,
  'light-panel': LightPanel,
  'light-cob': LightCob,
  tubes: Tubes,
  mic: Mic,
  wireless: Wireless,
  recorder: Recorder,
  gimbal: Gimbal,
  tripod: Tripod,
  drone: Drone,
  monitor: Monitor,
  battery: Battery,
  card: Card,
  stand: Stand,
  reflector: Reflector,
  backdrop: Backdrop,
  slider: Slider,
};

export function ProductArt({ art, label, className = '' }: { art: string; label: string; className?: string }) {
  const Draw = drawings[art] ?? drawings.camera;
  return (
    <svg viewBox="0 0 320 300" role="img" aria-label={label} className={className}>
      <defs>
        <radialGradient id="studio" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#2A2A2A" />
          <stop offset="60%" stopColor="#151515" />
          <stop offset="100%" stopColor="#0C0C0C" />
        </radialGradient>
      </defs>
      <rect width="320" height="300" fill="url(#studio)" />
      <ellipse cx="160" cy="262" rx="120" ry="10" fill="#000" opacity="0.45" />
      <Draw />
    </svg>
  );
}

export function ProductImage({
  product,
  className = '',
}: {
  product: { images: string[]; art: string; name: string };
  className?: string;
}) {
  if (product.images[0]) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.images[0]} alt={product.name} className={`h-full w-full object-cover ${className}`} />;
  }
  return <ProductArt art={product.art} label={product.name} className={`h-full w-full ${className}`} />;
}
