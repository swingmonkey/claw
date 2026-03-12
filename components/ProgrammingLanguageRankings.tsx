import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

// ============ 常量配置 ============
const BRAND_COLORS = {
  backgroundStart: '#0D1117',
  backgroundEnd: '#161B22',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textHighlight: '#58A6FF',
  languages: {
    Python: '#3776AB',
    JavaScript: '#F7DF1E',
    Java: '#E76F00',
    C: '#555555',
    'C++': '#00599C',
    'C#': '#512BD4',
    Go: '#00ADD8',
    Rust: '#DEA584',
    PHP: '#777BB4',
    Swift: '#FA7343',
    TypeScript: '#3178C6',
    'Visual Basic': '#A23D9E',
    Perl: '#39457E',
    Ruby: '#CC342D',
  },
} as const;

const TYPOGRAPHY = {
  fontFamily: 'Inter, sans-serif',
  heroTitle: {fontSize: 72, fontWeight: 800},
  subtitle: {fontSize: 48, fontWeight: 600},
  yearNumber: {fontSize: 96, fontWeight: 800, fontFamily: 'monospace'},
  barLabel: {fontSize: 32, fontWeight: 600},
  barValue: {fontSize: 28, fontWeight: 500},
  caption: {fontSize: 24, fontWeight: 400},
} as const;

const TIMING = {
  introDuration: 60,
  yearDuration: 75,
  outroDuration: 15,
  yearTransitionDuration: 15,
  barAnimationDuration: 60,
  numberCountDuration: 60,
} as const;

const LAYOUT = {
  safeMargin: 80,
  barHeight: 60,
  barGap: 16,
  maxBarWidth: 1400,
  startYear: 2015,
} as const;

// ============ 数据定义 ============
const RANKING_DATA: Record<string, Array<{language: string; score: number}>> = {
  2015: [
    {language: 'Java', score: 18.9},
    {language: 'C', score: 16.8},
    {language: 'C++', score: 7.4},
    {language: 'C#', score: 5.6},
    {language: 'Python', score: 4.8},
    {language: 'PHP', score: 4.4},
    {language: 'JavaScript', score: 3.1},
    {language: 'Visual Basic', score: 2.7},
    {language: 'Perl', score: 1.9},
    {language: 'Ruby', score: 1.7},
  ],
  2016: [
    {language: 'Java', score: 21.2},
    {language: 'C', score: 14.8},
    {language: 'C++', score: 7.9},
    {language: 'Python', score: 5.5},
    {language: 'C#', score: 5.2},
    {language: 'PHP', score: 4.3},
    {language: 'JavaScript', score: 3.6},
    {language: 'Visual Basic', score: 2.8},
    {language: 'Perl', score: 2.1},
    {language: 'Ruby', score: 1.8},
  ],
  2017: [
    {language: 'Java', score: 14.7},
    {language: 'C', score: 10.2},
    {language: 'Python', score: 8.9},
    {language: 'C++', score: 5.9},
    {language: 'C#', score: 4.7},
    {language: 'JavaScript', score: 3.9},
    {language: 'PHP', score: 3.2},
    {language: 'Visual Basic', score: 2.5},
    {language: 'Perl', score: 1.9},
    {language: 'Ruby', score: 1.6},
  ],
  2018: [
    {language: 'Python', score: 15.2},
    {language: 'C', score: 13.1},
    {language: 'Java', score: 11.5},
    {language: 'C++', score: 7.3},
    {language: 'C#', score: 4.5},
    {language: 'JavaScript', score: 3.8},
    {language: 'PHP', score: 2.9},
    {language: 'Swift', score: 2.1},
    {language: 'Ruby', score: 1.5},
    {language: 'Perl', score: 1.3},
  ],
  2019: [
    {language: 'Python', score: 18.5},
    {language: 'Java', score: 15.2},
    {language: 'C', score: 14.3},
    {language: 'C++', score: 8.1},
    {language: 'C#', score: 5.2},
    {language: 'JavaScript', score: 4.1},
    {language: 'PHP', score: 2.7},
    {language: 'Swift', score: 2.3},
    {language: 'Go', score: 1.8},
    {language: 'Ruby', score: 1.4},
  ],
  2020: [
    {language: 'Python', score: 25.4},
    {language: 'Java', score: 16.9},
    {language: 'C', score: 15.3},
    {language: 'C++', score: 9.8},
    {language: 'C#', score: 6.1},
    {language: 'JavaScript', score: 4.7},
    {language: 'PHP', score: 2.9},
    {language: 'Swift', score: 2.4},
    {language: 'Go', score: 2.1},
    {language: 'Rust', score: 1.7},
  ],
  2021: [
    {language: 'Python', score: 27.3},
    {language: 'C', score: 16.5},
    {language: 'Java', score: 15.8},
    {language: 'C++', score: 11.2},
    {language: 'C#', score: 6.4},
    {language: 'JavaScript', score: 5.3},
    {language: 'PHP', score: 3.1},
    {language: 'Go', score: 2.6},
    {language: 'Rust', score: 2.2},
    {language: 'Swift', score: 1.9},
  ],
  2022: [
    {language: 'Python', score: 28.9},
    {language: 'C', score: 15.2},
    {language: 'C++', score: 12.8},
    {language: 'Java', score: 11.7},
    {language: 'C#', score: 6.9},
    {language: 'JavaScript', score: 5.8},
    {language: 'PHP', score: 3.4},
    {language: 'Go', score: 3.1},
    {language: 'Rust', score: 2.8},
    {language: 'TypeScript', score: 2.1},
  ],
  2023: [
    {language: 'Python', score: 30.1},
    {language: 'C', score: 14.3},
    {language: 'C++', score: 13.9},
    {language: 'Java', score: 10.5},
    {language: 'C#', score: 7.2},
    {language: 'JavaScript', score: 6.1},
    {language: 'Go', score: 3.8},
    {language: 'Rust', score: 3.4},
    {language: 'PHP', score: 2.9},
    {language: 'TypeScript', score: 2.6},
  ],
  2024: [
    {language: 'Python', score: 31.5},
    {language: 'C', score: 12.8},
    {language: 'C++', score: 14.5},
    {language: 'Java', score: 9.2},
    {language: 'C#', score: 7.8},
    {language: 'JavaScript', score: 6.9},
    {language: 'Go', score: 4.2},
    {language: 'Rust', score: 3.9},
    {language: 'TypeScript', score: 3.1},
    {language: 'PHP', score: 2.4},
  ],
  2025: [
    {language: 'Python', score: 32.8},
    {language: 'C', score: 11.5},
    {language: 'C++', score: 15.2},
    {language: 'Java', score: 8.7},
    {language: 'C#', score: 8.3},
    {language: 'JavaScript', score: 7.5},
    {language: 'Go', score: 4.8},
    {language: 'Rust', score: 4.3},
    {language: 'TypeScript', score: 3.8},
    {language: 'PHP', score: 1.9},
  ],
};

// ============ 辅助函数 ============
const getLanguageColor = (language: string): string => {
  return (BRAND_COLORS.languages as Record<string, string>)[language] || '#888888';
};

const getCurrentYear = (frame: number): number => {
  const yearIndex = Math.floor((frame - TIMING.introDuration) / TIMING.yearDuration);
  return Math.min(LAYOUT.startYear + yearIndex, 2025);
};

const getYearProgress = (frame: number): number => {
  const yearStart = TIMING.introDuration + (getCurrentYear(frame) - LAYOUT.startYear) * TIMING.yearDuration;
  return (frame - yearStart) / TIMING.yearDuration;
};

const interpolateScore = (frame: number, language: string): number => {
  const currentYear = getCurrentYear(frame);
  const progress = getYearProgress(frame);

  const currentData = RANKING_DATA[currentYear];
  const prevData = RANKING_DATA[currentYear - 1];

  const currentEntry = currentData?.find((d) => d.language === language);
  const prevEntry = prevData?.find((d) => d.language === language);

  if (!currentEntry) return 0;
  if (!prevEntry) return currentEntry.score;

  return interpolate(
    progress,
    [0, 1],
    [prevEntry.score, currentEntry.score],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
};

// ============ 组件 ============
const BarRow: React.FC<{
  language: string;
  score: number;
  rank: number;
  frame: number;
}> = ({language, score, rank, frame}) => {
  const barWidth = (score / 35) * LAYOUT.maxBarWidth;
  const countUpProgress = Math.min(
    getYearProgress(frame) / (TIMING.barAnimationDuration / TIMING.yearDuration),
    1
  );
  const displayedScore = interpolate(countUpProgress, [0, 1], [score * 0.9, score]);
  const scoreString = displayedScore.toFixed(1) + '%';

  const rankColors = {
    1: '#FFD700',
    2: '#C0C0C0',
    3: '#CD7F32',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: LAYOUT.barGap,
        height: LAYOUT.barHeight,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: rankColors[rank as keyof typeof rankColors] || '#484F58',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 18,
          fontWeight: 700,
          marginRight: 16,
          flexShrink: 0,
        }}
      >
        {rank}
      </div>
      <div
        style={{
          width: 200,
          fontSize: TYPOGRAPHY.barLabel.fontSize,
          fontWeight: TYPOGRAPHY.barLabel.fontWeight,
          color: BRAND_COLORS.textPrimary,
          fontFamily: TYPOGRAPHY.fontFamily,
          flexShrink: 0,
        }}
      >
        {language}
      </div>
      <div
        style={{
          width: barWidth * Math.min(countUpProgress / 0.8, 1),
          height: '100%',
          backgroundColor: getLanguageColor(language),
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: TYPOGRAPHY.barValue.fontSize,
            fontWeight: TYPOGRAPHY.barValue.fontWeight,
            color: 'white',
            fontFamily: TYPOGRAPHY.fontFamily,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          {scoreString}
        </div>
      </div>
    </div>
  );
};

const YearFlipCard: React.FC<{year: number; frame: number}> = ({year, frame}) => {
  const yearIndex = year - LAYOUT.startYear;
  const transitionFrame = TIMING.introDuration + yearIndex * TIMING.yearDuration;
  const relativeFrame = frame - transitionFrame;

  const flipProgress = Math.min(relativeFrame / TIMING.yearTransitionDuration, 1);
  const scale = interpolate(
    flipProgress,
    [0, 0.5, 1],
    [1, 0.01, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const opacity = interpolate(
    flipProgress,
    [0, 0.2, 0.8, 1],
    [1, 0.2, 0.2, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 100,
        transform: `scaleY(${scale})`,
        opacity,
        transformOrigin: 'center',
        fontFamily: TYPOGRAPHY.yearNumber.fontFamily,
        fontSize: TYPOGRAPHY.yearNumber.fontSize,
        fontWeight: TYPOGRAPHY.yearNumber.fontWeight,
        color: BRAND_COLORS.textHighlight,
        textShadow: `0 0 30px ${BRAND_COLORS.textHighlight}40`,
      }}
    >
      {year}
    </div>
  );
};

const IntroScene: React.FC<{frame: number}> = ({frame}) => {
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
      }}
    >
      <h1
        style={{
          fontSize: TYPOGRAPHY.heroTitle.fontSize,
          fontWeight: TYPOGRAPHY.heroTitle.fontWeight,
          fontFamily: TYPOGRAPHY.fontFamily,
          color: BRAND_COLORS.textPrimary,
          margin: 0,
          opacity: titleOpacity,
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        Programming Language Trends
      </h1>
      <h2
        style={{
          fontSize: TYPOGRAPHY.subtitle.fontSize,
          fontWeight: TYPOGRAPHY.subtitle.fontWeight,
          fontFamily: TYPOGRAPHY.fontFamily,
          color: BRAND_COLORS.textSecondary,
          margin: '30px 0 0',
          opacity: subtitleOpacity,
        }}
      >
        Top 10 Programming Languages 2015-2025
      </h2>
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          fontSize: TYPOGRAPHY.caption.fontSize,
          fontWeight: TYPOGRAPHY.caption.fontWeight,
          fontFamily: TYPOGRAPHY.fontFamily,
          color: BRAND_COLORS.textSecondary,
          opacity: captionOpacity,
        }}
      >
        Data Source: TIOBE Index
      </div>
    </div>
  );
};

const RankingScene: React.FC<{frame: number; year: number}> = ({frame, year}) => {
  const currentData = RANKING_DATA[year];
  const progress = getYearProgress(frame);

  // 对当前年的数据排序
  const sortedData = [...currentData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div
      style={{
        padding: `0 ${LAYOUT.safeMargin}px`,
        paddingTop: 150,
      }}
    >
      {sortedData.map((item, index) => (
        <BarRow
          key={item.language}
          language={item.language}
          score={interpolateScore(frame, item.language)}
          rank={index + 1}
          frame={frame}
        />
      ))}
    </div>
  );
};

const OutroScene: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(frame, [885, 900], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [885, 900], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalRanking = RANKING_DATA['2025'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
      }}
    >
      <h2
        style={{
          fontSize: TYPOGRAPHY.subtitle.fontSize,
          fontWeight: TYPOGRAPHY.subtitle.fontWeight,
          fontFamily: TYPOGRAPHY.fontFamily,
          color: BRAND_COLORS.textHighlight,
          margin: '0 0 40px',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        2025 Final Ranking
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          marginBottom: 60,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {finalRanking.slice(0, 5).map((item, index) => (
          <div
            key={item.language}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor:
                  index === 0
                    ? '#FFD700'
                    : index === 1
                      ? '#C0C0C0'
                      : index === 2
                        ? '#CD7F32'
                        : '#484F58',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {index + 1}
            </div>
            <span
              style={{
                width: 150,
                fontSize: 28,
                fontWeight: 600,
                color: BRAND_COLORS.textPrimary,
                fontFamily: TYPOGRAPHY.fontFamily,
              }}
            >
              {item.language}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: getLanguageColor(item.language),
                fontFamily: TYPOGRAPHY.fontFamily,
              }}
            >
              {item.score.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          fontFamily: TYPOGRAPHY.fontFamily,
          color: BRAND_COLORS.textHighlight,
          textAlign: 'center',
          maxWidth: 800,
          lineHeight: 1.5,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        Python 连续 8 年霸榜,占据编程语言主导地位
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          fontFamily: TYPOGRAPHY.fontFamily,
          color: BRAND_COLORS.textSecondary,
          marginTop: 20,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        C++ 复苏,TypeScript 快速崛起
      </div>
    </div>
  );
};

// ============ 主组件 ============
export const ProgrammingLanguageRankings: React.FC = () => {
  const frame = useCurrentFrame();

  const backgroundGradient = `linear-gradient(180deg, ${BRAND_COLORS.backgroundStart} 0%, ${BRAND_COLORS.backgroundEnd} 100%)`;

  let content;
  if (frame < TIMING.introDuration) {
    content = <IntroScene frame={frame} />;
  } else if (frame < TIMING.introDuration + 11 * TIMING.yearDuration) {
    const year = getCurrentYear(frame);
    content = (
      <>
        <YearFlipCard year={year} frame={frame} />
        <RankingScene frame={frame} year={year} />
      </>
    );
  } else {
    content = <OutroScene frame={frame} />;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: backgroundGradient,
        color: BRAND_COLORS.textPrimary,
        fontFamily: TYPOGRAPHY.fontFamily,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {content}
    </div>
  );
};
