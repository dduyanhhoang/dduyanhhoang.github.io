// Each entry: [symbol, left%, top%, size(rem), duration(s), delay(s)]
// Curated mix of quantum, linear-algebra, and calculus notation
const SYMBOLS = [
  ['ψ',  6,  14, 3.4, 22,  0 ],
  ['∑',  88, 22, 2.6, 27, -5 ],
  ['∂',  14, 68, 2.0, 19, -8 ],
  ['∇',  76, 58, 2.9, 25, -13],
  ['λ',  44, 82, 2.2, 23, -6 ],
  ['∫',  91, 74, 3.1, 29, -2 ],
  ['σ',   3, 48, 1.9, 17, -10],
  ['θ',  58,  9, 2.5, 31, -16],
  ['⊗',  29, 38, 2.7, 20, -3 ],
  ['π',  18, 28, 2.0, 26, -9 ],
  ['Ω',  81, 43, 3.0, 21, -14],
  ['φ',  50, 53, 2.3, 18, -4 ],
  ['α',   7, 88, 2.5, 30, -11],
  ['β',  94,  8, 2.0, 21, -1 ],
  ['ε',  66, 78, 1.8, 24, -7 ],
  ['μ',  35, 62, 2.1, 16, -12],
  ['⟨',  72, 32, 3.5, 28, -18],
  ['⟩',  24, 95, 3.5, 28, -18],
];

export default function FloatingSymbols() {
  return (
    <div className="float-symbols" aria-hidden="true">
      {SYMBOLS.map(([sym, left, top, size, dur, delay], i) => (
        <span
          key={i}
          className="float-sym"
          style={{
            left:              `${left}%`,
            top:               `${top}%`,
            fontSize:          `${size}rem`,
            animationDuration: `${dur}s`,
            animationDelay:    `${delay}s`,
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
