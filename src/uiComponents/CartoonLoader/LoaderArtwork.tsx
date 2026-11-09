import type { LoaderShape } from "./loaderCatalog";
import styles from "./LoaderArtwork.module.css";

/** 小尺寸也能辨认的表情；只用于新卡通插画。 */
function Face({ sad = false }: { sad?: boolean }) {
  return (
    <g
      stroke="var(--cl-outline)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    >
      <path d="M39 47v3M59 47v3" />
      <path d={sad ? "M44 61q5-7 10 0" : "M43 57q6 8 12 0"} />
    </g>
  );
}

/** 12 个已确认方案的 SVG 实现。动画受外层 data-animated 和系统减少动画设置控制。 */
export function LoaderArtwork({ shape }: { shape: LoaderShape }) {
  const ink = "var(--cl-outline)";
  const main = "var(--cl-color)";
  const accent = "var(--cl-accent)";
  switch (shape) {
    case "planet":
      return (
        <>
          <circle
            cx="49"
            cy="51"
            r="29"
            fill={main}
            stroke={ink}
            strokeWidth="3"
          />
          <g fill={accent} opacity=".25">
            <ellipse cx="36" cy="32" rx="8" ry="5" />
            <ellipse cx="61" cy="72" rx="9" ry="5" />
          </g>
          <path
            d="M21 48C-4 66 4 80 52 65S102 30 78 36"
            fill="none"
            stroke={ink}
            strokeWidth="8"
          />
          <path
            d="M21 48C-4 66 4 80 52 65S102 30 78 36"
            fill="none"
            stroke="#ffe4a8"
            strokeWidth="4"
          />
          <Face />
          <g className={styles.spinSlow}>
            <circle
              cx="80"
              cy="18"
              r="9"
              fill={accent}
              stroke={ink}
              strokeWidth="2.5"
            />
            <path
              d="M80 4v4M94 18h-4M68 18h-4"
              stroke={ink}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </>
      );
    case "cat-hourglass":
      return (
        <g
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M27 65C1 48 4 91 36 88" fill="none" strokeWidth="9" />
          <path
            d="M27 65C1 48 4 91 36 88"
            fill="none"
            stroke={main}
            strokeWidth="4"
          />
          <path
            d="M25 33L24 10 40 20Q50 16 61 20L77 10 74 36Q86 55 72 68L74 86Q48 97 25 83L28 65Q15 52 25 33Z"
            fill={main}
          />
          <path
            d="M30 18L31 29 39 24M68 24L72 18 71 30"
            fill="#f2a0a1"
            stroke="none"
          />
          <path d="M32 42q4-6 8 0M56 42q4-6 8 0M43 49q5 7 10 0" fill="none" />
          <g>
            <path
              d="M47 58Q47 69 57 72Q47 76 47 87H77Q77 76 67 72Q77 69 77 58Z"
              fill="#e3f6f3"
            />
            <path
              className={styles.sand}
              d="M51 61H73L62 71ZM51 85L62 76 73 85Z"
              fill={main}
              stroke="none"
            />
            <path d="M45 57h34M45 88h34" stroke={accent} strokeWidth="6" />
          </g>
          <ellipse cx="39" cy="68" rx="7" ry="9" fill={main} />
        </g>
      );
    case "rocket":
      return (
        <g
          className={styles.rock}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        >
          <path
            className={styles.flame}
            d="M41 64Q14 68 15 88Q38 88 46 67"
            fill="#ffd585"
            stroke="none"
          />
          <path
            d="M40 35L25 36 19 58 36 56M64 60L64 77 42 83 45 65"
            fill={accent}
          />
          <path d="M33 56Q43 20 81 15Q85 52 49 68Z" fill={main} />
          <path d="M66 20L79 34" fill="none" />
          <circle cx="60" cy="39" r="8" fill="#f5fffd" />
          <path
            d="M34 65L25 75"
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );
    case "mochi":
      return (
        <>
          {[20, 50, 80].map((x, index) => (
            <g
              key={x}
              className={styles.bounce}
              style={{ animationDelay: `${index * -0.18}s` }}
            >
              <path
                d={`M${x - 14} 62Q${x - 15} 38 ${x} 36Q${x + 15} 38 ${x + 14} 62Q${x} 74 ${x - 14} 62Z`}
                fill={index === 0 ? main : index === 1 ? "#ffe7a3" : accent}
                stroke={ink}
                strokeWidth="2.5"
              />
              <path
                d={`M${x - 5} 50v2M${x + 5} 50v2M${x - 3} 57q3 4 6 0`}
                fill="none"
                stroke={ink}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ))}
        </>
      );
    case "bandaged-heart":
      return (
        <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
          <path
            d="M50 86C42 78 10 57 12 34C14 9 42 13 50 29C59 10 88 11 90 34C92 55 65 78 50 86Z"
            fill={main}
          />
          <Face sad />
          <g transform="rotate(35 72 30)">
            <rect x="55" y="21" width="34" height="19" rx="5" fill="#ffe4b4" />
            <path
              d="M67 24v13M77 24v13"
              stroke={accent}
              strokeWidth="2"
              strokeDasharray="2 3"
            />
          </g>
        </g>
      );
    case "lost-envelope":
      return (
        <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
          <rect x="11" y="28" width="77" height="57" rx="10" fill={main} />
          <path
            d="M13 32L50 60 86 32M14 80L36 59M85 80L65 59"
            fill="none"
            opacity=".65"
          />
          <Face sad />
          <circle cx="79" cy="23" r="16" fill={accent} />
          <path
            d="M74 19C74 11 87 14 84 21L79 26M79 32v1"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      );
    case "segmented-ring":
      return (
        <g className={styles.spin}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              x="46"
              y="8"
              width="8"
              height="19"
              rx="4"
              transform={`rotate(${i * 30} 50 50)`}
              fill={main}
              opacity={0.15 + i * 0.075}
            />
          ))}
        </g>
      );
    case "orbit-dots":
      return (
        <>
          <circle
            cx="50"
            cy="50"
            r="33"
            fill="none"
            stroke={main}
            strokeWidth="2.5"
            opacity=".25"
          />
          <g className={styles.spinSlow}>
            <circle cx="50" cy="17" r="10" fill={main} />
            <circle cx="21" cy="67" r="7" fill={main} opacity=".7" />
            <circle cx="79" cy="67" r="5" fill={main} opacity=".4" />
          </g>
        </>
      );
    case "thin-ring":
      return (
        <>
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke={main}
            opacity=".2"
            strokeWidth="6"
          />
          <circle
            className={styles.spin}
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke={main}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="150 64"
          />
        </>
      );
    case "pulse-dots":
      return (
        <>
          {[23, 50, 77].map((x, index) => (
            <circle
              key={x}
              className={styles.pulse}
              style={{ animationDelay: `${index * -0.2}s` }}
              cx={x}
              cy="50"
              r="8"
              fill={main}
            />
          ))}
        </>
      );
    case "alert-circle":
      return (
        <>
          <circle cx="50" cy="50" r="45" fill={main} opacity=".09" />
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke={main}
            strokeWidth="4"
          />
          <path
            d="M50 29v26M50 67v1"
            stroke={main}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      );
    case "broken-link":
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M48 26L59 15C80-3 103 24 83 43L73 53M51 75L40 86C18 103-3 76 17 57L28 46"
            stroke={main}
            strokeWidth="7"
            transform="translate(4 0) scale(.9)"
          />
          <path
            d="M43 42L56 55M27 24L22 18M18 35L10 32M65 72L69 80"
            stroke={main}
            strokeWidth="4"
          />
          <circle
            cx="75"
            cy="72"
            r="17"
            fill={accent}
            stroke="white"
            strokeWidth="2"
          />
          <path d="M69 66L81 78M81 66L69 78" stroke="white" strokeWidth="4" />
        </g>
      );
    default:
      return null;
  }
}
