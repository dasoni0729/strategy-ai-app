import { useState } from "react";

const C = {
  navy: "#0D1B2E",
  navyMid: "#1B2A4A",
  gold: "#C9A84C",
  goldLight: "#F0D88A",
  cream: "#FAF7F2",
  gray300: "#D0D0D8",
  gray500: "#8A8A9A",
  gray700: "#3A3A4A",
};

const STRATEGIES = [
  {
    id: "position",
    emoji: "🗺️",
    label: "포지셔닝",
    short: "내가 점유할 콘텐츠 코너",
    color: "#7C5CBF",
    questions: [
      "최근 올린 콘텐츠 3개 제목을 알려주세요",
      "지금 내 콘텐츠를 보는 사람은 누구인가요? (타깃 고객)",
      "경쟁자 또는 비슷한 분야 크리에이터가 있다면 누구인가요?",
    ],
    buildPrompt: (u) => ({
      system: `당신은 퍼스널 브랜딩 전략가입니다. 창작자가 완전히 점유할 수 있는 콘텐츠 코너를 설계합니다.
사용자 정보: ${u}
아래 순서로 분석하세요:
# 콘텐츠 지형도
(내 분야에서 누가 어떤 포지션을 차지하는지, 포화 지점과 공백 지점)
# 현재 vs 점유 가능 포지션 차이
(솔직하게—현재 콘텐츠와 점유 가능한 위치의 간극)
# 핵심 콘텐츠 코너
(전문성 + 고객 문제 + 시장 블라인드 스팟이 만나는 단 하나의 포지션)
# 3개 콘텐츠 기둥
(매주 반복할 기둥—각각 구체적인 주제 예시 포함)
# 줄일 것 (제거 주제)
(포지션을 흐리게 만드는 주제—취향 아닌 전략 기준으로)
규칙: 공백은 "더 진정성 있게" 같은 말 금지. 구체적으로. 한국어로.`,
      user: `위 정보를 바탕으로 내 콘텐츠 포지셔닝 전략을 분석해주세요.`,
    }),
  },
  {
    id: "value",
    emoji: "💎",
    label: "가치 전략",
    short: "무료 콘텐츠로 신뢰 구축",
    color: "#C9A84C",
    questions: [
      "현재 유료 오퍼 (강의/서비스/상품)를 구체적으로 알려주세요",
      "청중이 가장 자주 묻는 질문 TOP 3는?",
      "지금 무료로 공개하는 콘텐츠는 어떤 것들인가요?",
    ],
    buildPrompt: (u) => ({
      system: `당신은 콘텐츠 가치 전략가입니다. 무료로 공개해도 유료 오퍼 가치를 오히려 높이는 구조를 설계합니다.
사용자 정보: ${u}
아래 순서로 분석하세요:
# 고객 지불 가치 지도
(고객이 현재 돈 내고 배우는 것—구체적으로)
# 공개 vs 숨긴 가치 차이
(대부분 엉뚱한 것을 보호함—명확하게 지적)
# 무료 제공 자산 5개
(유료 오퍼 잠식 없이, 실제 도움이 되는 것—각각 유료 오퍼와 연결 지점 명시)
# 가장 공유될 리소스 1개
(프레임워크/시스템/분해표—디자이너에게 브리핑 가능한 수준으로 구체적으로)
# 30일 배포 캘린더
(주차별 무엇을 언제 올릴지)
규칙: 물 탄 미리보기 금지. 한국어로.`,
      user: `위 정보를 바탕으로 무료 콘텐츠 가치 전략을 설계해주세요.`,
    }),
  },
  {
    id: "offer",
    emoji: "🎯",
    label: "오퍼 전략",
    short: "거절하면 손해인 구조 설계",
    color: "#E05C5C",
    questions: [
      "현재 오퍼 이름과 가격은?",
      "가장 자주 듣는 반대 의견 TOP 3는?",
      "지금 제공 중인 보너스나 보장이 있나요?",
    ],
    buildPrompt: (u) => ({
      system: `당신은 오퍼 전략가입니다. 가격 인하 없이 전환율을 높이는 제안 구조를 설계합니다.
사용자 정보: ${u}
아래 순서로 분석하세요:
# 구매자 위험·마찰 지도
(구매까지 느끼는 모든 의심·두려움·마찰 요소)
# 체감 가치 vs 제공 가치 차이
(구매자 시선에서—내 시선 아님)
# 반대 의견 해소 계획
(할인 없이—보장·보너스·리프레이밍으로 해결)
# 재구성된 오퍼 구조
(무엇을 어떻게 묶고 제시할지)
# 실제 제안 문구
(세일즈 대화나 랜딩페이지에 바로 쓸 수 있는 문구)
규칙: 반대 의견은 카피 아닌 구조로 해결. 보장은 구체적으로. 한국어로.`,
      user: `위 정보를 바탕으로 오퍼 구조를 재설계해주세요.`,
    }),
  },
  {
    id: "viral",
    emoji: "🔥",
    label: "공유성 분석",
    short: "팔로워 밖으로 퍼지는 구조",
    color: "#E07B2A",
    questions: [
      "최근 콘텐츠 5개 제목과 형식(카드뉴스/릴스/블로그 등)을 알려주세요",
      "그 중 가장 반응 좋았던 것과 이유(짐작되는 것)는?",
      "현재 주로 쓰는 플랫폼과 주간 발행 수는?",
    ],
    buildPrompt: (u) => ({
      system: `당신은 콘텐츠 공유성 분석가입니다. 낯선 사람이 멈추고 공유하는 구조를 설계합니다.
사용자 정보: ${u}
아래 순서로 분석하세요:
# 잘 된 콘텐츠 분석
(훅·구조·인사이트·감정 기준으로—무엇이 퍼지게 만들었는지)
# 기존 팔로워 vs 신규 공유형 간극
(지금 콘텐츠가 누구를 위한 것인지 명확하게)
# 빠진 공유 트리거 3개
(뭉뚱그리지 말고 각각 구체적으로)
# 형식 전환 제안
(현재 역량 안에서 지속 가능한 것)
# 다음 게시물용 훅
(바로 다음 게시물에 붙여 쓸 수 있게—완성형으로)
규칙: 트리거는 구체적으로. 한국어로.`,
      user: `위 정보를 바탕으로 콘텐츠 공유성을 분석해주세요.`,
    }),
  },
  {
    id: "expand",
    emoji: "🚀",
    label: "확장 전략",
    short: "1개 → 7개 OSMU 시스템",
    color: "#3A7BD5",
    questions: [
      "이번 주 만든 콘텐츠 주제 1-2개를 알려주세요",
      "주간 콘텐츠 제작에 쓸 수 있는 시간은 총 몇 시간인가요?",
      "지금 가장 성과가 아쉬운 플랫폼은 어디인가요?",
    ],
    buildPrompt: (u) => ({
      system: `당신은 퍼스널 브랜드 확장 전략가입니다. 새로 더 만들지 않고 누적 성장 시스템을 설계합니다.
사용자 정보: ${u}
OSMU 체인 기준: 주제 1개 → ①카드뉴스/블로그(원본) → ②숏폼 클립 → ③스레드/트윗 → ④롱폼 블로그(SEO) → ⑤뉴스레터/카톡 → ⑥인용 카드 → ⑦파생 Q&A 콘텐츠
아래 순서로 설계하세요:
# 플랫폼·포맷 지도
(사용자의 플랫폼별 고객 행동 패턴)
# 단일 제작 vs 확장 도달 간극
(지금 얼마나 손해 보고 있는지 수치로)
# 콘텐츠 재가공 체인
(사용자의 주력 포맷 기준으로—일반론 금지)
# 놓친 채널 1개
(유행 아닌 실제 고객 행동 기준)
# 주간 실행 시스템
(입력된 가용 시간 안에 맞춰서)
# 90일 성과 마일스톤
('참여도 증가' 아닌 구체적 숫자로)
규칙: 한국어로.`,
      user: `위 정보를 바탕으로 콘텐츠 확장 전략을 설계해주세요.`,
    }),
  },
];

// ── 샘플 예시 데이터 ─────────────────────────────────────
const SAMPLES = [
  {
    label: "📱 11년차 마케터",
    desc: "부업으로 월 100만원 추가 수입",
    info: {
      name: "김마케터",
      job: "11년차 마케터 · 네이버 블로그 SEO & 인스타그램 전문",
      offer: "부업 자동화 강의 29만원, 블로그 컨설팅 1회 15만원",
      platforms: "인스타그램, 네이버 블로그, 유튜브",
      audience: "부업으로 월 100만원 추가 수입을 원하는 직장인",
    },
  },
  {
    label: "🎈 풍선장식 사장님",
    desc: "오프라인 → 온라인 전환",
    info: {
      name: "다소니쌤",
      job: "풍선장식 & AI 블로그 마케팅 교육 · 5-6년 경력",
      offer: "AI 블로그 자동화 강의 30만원, 블로그 대행 월 50만원",
      platforms: "네이버 블로그, 인스타그램, 카카오톡 채널",
      audience: "블로그/마케팅이 어려운 50-60대 소상공인 사장님",
    },
  },
  {
    label: "🍳 요리 크리에이터",
    desc: "레시피 → 클래스 판매",
    info: {
      name: "쿡쌤",
      job: "가정식 요리 크리에이터 · 건강한 한식 전문",
      offer: "온라인 요리 클래스 월 1기 19만원, 레시피북 전자책 9,900원",
      platforms: "유튜브, 인스타그램, 네이버 블로그",
      audience: "바쁜 직장인 & 육아맘 · 건강한 집밥을 빠르게 만들고 싶은 분",
    },
  },
];

// ── 온보딩 화면 ──────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [info, setInfo] = useState({ name: "", job: "", offer: "", platforms: "", audience: "" });
  const [showSamples, setShowSamples] = useState(false);

  const fields = [
    { key: "name", label: "이름 또는 브랜드명", placeholder: "예: 다소니쌤 / 김마케팅" },
    { key: "job", label: "업종 / 전문 분야", placeholder: "예: AI 블로그 마케팅 교육, 풍선장식 대행" },
    { key: "offer", label: "현재 유료 오퍼", placeholder: "예: AI 자동화 강의 30만원, 블로그 대행 월 50만원" },
    { key: "platforms", label: "운영 중인 플랫폼", placeholder: "예: 네이버 블로그, 인스타그램, 유튜브" },
    { key: "audience", label: "타깃 고객", placeholder: "예: 50-60대 소상공인, 초보 블로거" },
  ];

  const filled = Object.values(info).filter((v) => v.trim()).length;
  const canStart = filled >= 2;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.navy}, ${C.navyMid})`, fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ padding: "28px 20px 0", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, background: C.gold, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26, color: C.navy, margin: "0 auto 16px" }}>S</div>
        <div style={{ color: C.gold, fontWeight: 900, fontSize: 22, letterSpacing: "-0.5px" }}>퍼스널 브랜드 전략 AI</div>
        <div style={{ color: C.gray500, fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>내 정보를 입력하면<br />5가지 전략을 맞춤 분석해드려요</div>
      </div>

      <div style={{ padding: "20px 20px", flex: 1 }}>

        {/* 샘플 예시 버튼 */}
        <button
          onClick={() => setShowSamples(!showSamples)}
          style={{ width: "100%", padding: "11px", background: "transparent", border: `1px dashed ${C.gold}88`, borderRadius: 10, color: C.gold, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          ✨ 실전 예시로 채워보기 {showSamples ? "▲" : "▼"}
        </button>

        {/* 샘플 카드 */}
        {showSamples && (
          <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInfo(s.info); setShowSamples(false); }}
                style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <div style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>{s.label}</div>
                  <div style={{ color: C.gray500, fontSize: 11, marginTop: 2 }}>{s.desc}</div>
                </div>
                <span style={{ color: C.gold, fontSize: 18 }}>→</span>
              </button>
            ))}
            <div style={{ color: C.gray500, fontSize: 11, textAlign: "center", marginTop: 4 }}>예시를 선택하면 자동으로 채워져요 · 수정 후 시작 가능</div>
          </div>
        )}

        {/* 입력 폼 */}
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <div style={{ color: C.cream, fontWeight: 700, fontSize: 13, marginBottom: 7 }}>{f.label}</div>
            <input
              value={info[f.key]}
              onChange={(e) => setInfo({ ...info, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              style={{ width: "100%", background: C.navyMid, border: `1px solid ${info[f.key] ? C.gold + "66" : C.gray700}`, borderRadius: 10, padding: "11px 14px", color: C.cream, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border 0.2s" }}
            />
          </div>
        ))}

        {/* 진행 바 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: C.gray500, fontSize: 11 }}>입력 완성도</span>
            <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{filled} / {fields.length}</span>
          </div>
          <div style={{ background: C.gray700, borderRadius: 99, height: 4 }}>
            <div style={{ background: C.gold, height: 4, borderRadius: 99, width: `${(filled / fields.length) * 100}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        <button
          onClick={() => canStart && onComplete(info)}
          style={{ width: "100%", padding: "15px", background: canStart ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : C.gray700, border: "none", borderRadius: 13, color: canStart ? C.navy : C.gray500, fontWeight: 800, fontSize: 16, cursor: canStart ? "pointer" : "default", transition: "all 0.2s" }}
        >
          {canStart ? "🚀 전략 분석 시작" : "2개 이상 입력해주세요"}
        </button>

        <div style={{ textAlign: "center", marginTop: 14, color: C.gray500, fontSize: 11 }}>입력한 정보는 AI 분석에만 사용되며 저장되지 않아요</div>

        {/* 핵심 팁 */}
        <div style={{ marginTop: 20, background: `${C.gold}15`, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ color: C.gold, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>⭐ 품질을 높이는 팁</div>
          <div style={{ color: C.gray300, fontSize: 12, lineHeight: 1.8 }}>
            매출, 팔로워 수, 실제 댓글 수 등<br />
            <span style={{ color: C.cream, fontWeight: 700 }}>구체적인 숫자와 실제 사례</span>를 넣을수록<br />
            AI 분석 품질이 급격히 올라가요.<br />
            <span style={{ color: C.gray500 }}>"대충" 답하면 "대충" 나옵니다 😅</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── 전략 탭 버튼 ─────────────────────────────────────────
function Tab({ s, active, done, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "12px 6px", background: active ? C.navyMid : "transparent", border: `2px solid ${active ? s.color : "transparent"}`, borderRadius: 12, cursor: "pointer", position: "relative" }}>
      {done && <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: "#4CAF50", borderRadius: "50%" }} />}
      <span style={{ fontSize: 20 }}>{s.emoji}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: active ? s.color : C.gray500, textAlign: "center", lineHeight: 1.3 }}>{s.label}</span>
    </button>
  );
}

// ── 질문 폼 ──────────────────────────────────────────────
function QuestionForm({ s, userInfo, onStart }) {
  const [answers, setAnswers] = useState({});

  const buildUserContext = () => {
    const base = `이름/브랜드: ${userInfo.name || "미입력"} | 업종: ${userInfo.job || "미입력"} | 유료오퍼: ${userInfo.offer || "미입력"} | 플랫폼: ${userInfo.platforms || "미입력"} | 타깃: ${userInfo.audience || "미입력"}`;
    const qa = s.questions.map((q, i) => `Q: ${q}\nA: ${answers[i] || "(미입력)"}`).join("\n\n");
    return `${base}\n\n${qa}`;
  };

  return (
    <div style={{ padding: "20px 0 40px" }}>
      <div style={{ background: `${s.color}18`, border: `1px solid ${s.color}44`, borderRadius: 14, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>{s.emoji}</span>
          <div>
            <div style={{ color: s.color, fontWeight: 800, fontSize: 15 }}>{s.label}</div>
            <div style={{ color: C.gray300, fontSize: 12 }}>{s.short}</div>
          </div>
        </div>
      </div>

      <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, marginBottom: 14 }}>📋 추가 질문 (선택)</div>

      {s.questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ color: C.cream, fontSize: 13, fontWeight: 600, marginBottom: 7, lineHeight: 1.5 }}>Q{i + 1}. {q}</div>
          <textarea
            value={answers[i] || ""}
            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
            placeholder="비워도 괜찮아요 — 기본 정보로 분석해드려요"
            rows={2}
            style={{ width: "100%", background: C.navyMid, border: `1px solid ${C.gray700}`, borderRadius: 10, padding: "10px 12px", color: C.cream, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 }}
          />
        </div>
      ))}

      <button
        onClick={() => onStart(buildUserContext())}
        style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${s.color}, ${C.goldLight})`, border: "none", borderRadius: 12, color: C.navy, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 6 }}
      >
        {s.emoji} 분석 시작
      </button>
    </div>
  );
}

// ── 결과 뷰 ──────────────────────────────────────────────
function ResultView({ content, s, onReset }) {
  const lines = content.split("\n");
  return (
    <div style={{ paddingTop: 16, paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.emoji} 분석 완료</span>
        <button onClick={onReset} style={{ background: "transparent", border: `1px solid ${s.color}`, borderRadius: 8, color: s.color, fontSize: 12, padding: "4px 12px", cursor: "pointer" }}>다시 분석</button>
      </div>
      <div style={{ background: C.navyMid, border: `1px solid ${C.gray700}`, borderRadius: 14, padding: 18, maxHeight: 540, overflowY: "auto", lineHeight: 1.8 }}>
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
          if (line.startsWith("# ")) return <div key={i} style={{ color: s.color, fontWeight: 800, fontSize: 16, marginTop: 20, marginBottom: 8, borderBottom: `1px solid ${s.color}33`, paddingBottom: 6 }}>{line.slice(2)}</div>;
          if (line.startsWith("## ")) return <div key={i} style={{ color: C.goldLight, fontWeight: 700, fontSize: 14, marginTop: 14, marginBottom: 5 }}>{line.slice(3)}</div>;
          if (line.startsWith("### ")) return <div key={i} style={{ color: C.cream, fontWeight: 700, fontSize: 13, marginTop: 10, marginBottom: 4 }}>{line.slice(4)}</div>;
          if (/^[-•]/.test(line) || /^\d+\./.test(line)) return <div key={i} style={{ color: C.gray300, fontSize: 13, paddingLeft: 14, marginBottom: 3, lineHeight: 1.7 }}>{line}</div>;
          return <div key={i} style={{ color: C.cream, fontSize: 13, marginBottom: 3 }}>{line}</div>;
        })}
      </div>
    </div>
  );
}

// ── 로딩 ─────────────────────────────────────────────────
function Loading({ s }) {
  return (
    <div style={{ textAlign: "center", padding: "70px 20px" }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${s.color}33`, borderTop: `3px solid ${s.color}`, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
      <div style={{ color: s.color, fontWeight: 700, fontSize: 14 }}>{s.emoji} 분석 중...</div>
      <div style={{ color: C.gray500, fontSize: 12, marginTop: 6 }}>맞춤 전략을 생성하고 있어요</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── 메인 앱 ──────────────────────────────────────────────
export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [tab, setTab] = useState(0);
  const [states, setStates] = useState(STRATEGIES.map(() => ({ phase: "form", result: null })));

  const update = (i, patch) => setStates((p) => p.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const handleStart = async (context) => {
    update(tab, { phase: "loading" });
    const { system, user } = STRATEGIES[tab].buildPrompt(context);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: [{ role: "user", content: user }] }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "결과를 가져오지 못했어요.";
      update(tab, { phase: "result", result: text });
    } catch {
      update(tab, { phase: "result", result: "오류가 발생했어요. 다시 시도해주세요." });
    }
  };

  if (!userInfo) return <Onboarding onComplete={setUserInfo} />;

  const s = STRATEGIES[tab];
  const st = states[tab];
  const doneCount = states.filter((s) => s.phase === "result").length;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.navy}, ${C.navyMid})`, fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif", paddingBottom: 40 }}>
      {/* 헤더 */}
      <div style={{ background: C.navy, borderBottom: `1px solid ${C.gold}33`, padding: "16px 18px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: C.gold, fontWeight: 800, fontSize: 15 }}>퍼스널 브랜드 전략 AI</div>
            <div style={{ color: C.gray500, fontSize: 11 }}>{userInfo.name || "사용자"} · {doneCount}/5 완료</div>
          </div>
          <button onClick={() => setUserInfo(null)} style={{ background: "transparent", border: `1px solid ${C.gray700}`, borderRadius: 8, color: C.gray500, fontSize: 11, padding: "5px 10px", cursor: "pointer" }}>정보 수정</button>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* 탭 */}
        <div style={{ display: "flex", gap: 5, background: C.navy, padding: 5, borderRadius: 14, marginBottom: 20 }}>
          {STRATEGIES.map((strategy, i) => (
            <Tab key={strategy.id} s={strategy} active={tab === i} done={states[i].phase === "result"} onClick={() => setTab(i)} />
          ))}
        </div>

        {/* 순서 안내 */}
        {doneCount === 0 && (
          <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}22`, borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginBottom: 3 }}>💡 추천 순서</div>
            <div style={{ color: C.gray500, fontSize: 11, lineHeight: 1.7 }}>🗺️ 포지셔닝 → 💎 가치 → 🎯 오퍼 → 🔥 공유성 → 🚀 확장</div>
          </div>
        )}

        {/* 콘텐츠 */}
        {st.phase === "form" && <QuestionForm s={s} userInfo={userInfo} onStart={handleStart} />}
        {st.phase === "loading" && <Loading s={s} />}
        {st.phase === "result" && st.result && <ResultView content={st.result} s={s} onReset={() => update(tab, { phase: "form", result: null })} />}
      </div>
    </div>
  );
}
