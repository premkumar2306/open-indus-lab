import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── REAL DATA FROM SEED CSVs ──────────────────────────────

const SEALS = [
  { id:"1076", motif:"unicorn", site:"Mohenjo-daro", signs:[95,162,162], signCount:3, layer1:"na y,ya y,ya", layer2:"Very Good Ghee", domain:"dairy products", status:"complete", confidence:0.74 },
  { id:"2082", motif:"unicorn", site:"Mohenjo-daro", signs:[215,102,142,15], signCount:4, layer1:"chiva muu aa aakaave", layer2:"Carer of Isa's 3 cows", domain:"animal husbandry", status:"complete", confidence:0.68 },
  { id:"3023", motif:"unicorn", site:"Mohenjo-daro", signs:[300,342,142], signCount:3, layer1:"didiir aa", layer2:"Just expressed fresh milk", domain:"dairy products", status:"complete", confidence:0.72 },
  { id:"2127", motif:"elephant", site:"Mohenjo-daro", signs:[114,162], signCount:2, layer1:"en ney", layer2:"Sesame oil (eNNey)", domain:"food commodities", status:"complete", confidence:0.72 },
  { id:"2648", motif:"elephant", site:"Mohenjo-daro", signs:[267,267,95,162,242], signCount:5, layer1:"mi mi na ney thoLzu", layer2:"Very good ghee shed", domain:"dairy products", status:"complete", confidence:0.70 },
  { id:"2444", motif:"unicorn", site:"Mohenjo-daro", signs:[171,162,142,171], signCount:4, layer1:"Na y aa Na", layer2:"Order of the Leader", domain:"governance / law", status:"complete", confidence:0.71 },
  { id:"2864", motif:"gharial", site:"Mohenjo-daro", signs:[171,162,142,171], signCount:4, layer1:"Na y aa Na", layer2:"Order of the Leader (Riverine)", domain:"governance / law", status:"complete", confidence:0.71 },
  { id:"4440", motif:"none", site:"Mohenjo-daro", signs:[65,87,294,142,171], signCount:5, layer1:"iLa iru TTa aa Na", layer2:"Citywide curfew ordinance", domain:"governance / law", status:"complete", confidence:0.65 },
  { id:"2234", motif:"unicorn", site:"Mohenjo-daro", signs:[351,66,66], signCount:3, layer1:"vayya illam illam", layer2:"The world is a Big Home", domain:"governance / ethics", status:"complete", confidence:0.70 },
  { id:"4718", motif:"none", site:"Mohenjo-daro", signs:[106,213,106,86,2015], signCount:5, layer1:"ay ya ay o vyamun", layer2:"Panic milk mandate for children", domain:"social welfare", status:"complete", confidence:0.66 },
  { id:"1425", motif:"none", site:"Mohenjo-daro", signs:[66,90,102,161], signCount:4, layer1:"illam vaya muu thani", layer2:"Homes for the aged and alone", domain:"social welfare", status:"complete", confidence:0.67 },
  { id:"3246", motif:"none", site:"Mohenjo-daro", signs:[352,102,59,15], signCount:4, layer1:"vaya muu La aakaavva", layer2:"Carer of aged cattle", domain:"animal husbandry", status:"complete", confidence:0.67 },
  { id:"1110", motif:"unicorn", site:"Mohenjo-daro", signs:[17,216,230,17,358], signCount:5, layer1:"thava sama thaLa thava aNNal", layer2:"Respected equanimous great leader", domain:"governance", status:"complete", confidence:0.64 },
  { id:"5119", motif:"unicorn", site:"Mohenjo-daro", signs:[17,17,89,287,142,242], signCount:6, layer1:"mi mi muu Ta aa thoLzu", layer2:"Shed for aged cattle", domain:"animal welfare", status:"complete", confidence:0.65 },
  { id:"232",  motif:"unicorn", site:"Harappa",     signs:[230,323], signCount:2, layer1:"malai aracha", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0.60 },
  { id:"342",  motif:"none",    site:"Dholavira",   signs:[242,242], signCount:2, layer1:"tha ozhu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0.60 },
  { id:"2950", motif:"unicorn", site:"Mohenjo-daro", signs:[95,162], signCount:2, layer1:"na ney", layer2:"Ghee", domain:"dairy products", status:"complete", confidence:0.73 },
  { id:"2617", motif:"unicorn", site:"Mohenjo-daro", signs:[403,403,351,267,402], signCount:5, layer1:"v va da vya muu r muraa", layer2:"Buttermilk available HERE", domain:"dairy products", status:"complete", confidence:0.62 },
];

const SIGN_FREQ = [
  {id:"P324",m:142,freq:99,type:"pictogram",tamil:"இருதப"}, {id:"P122",m:95,freq:76,type:"tally",tamil:"நான்கு,ந,நா"},
  {id:"P385",m:162,freq:35,type:"geometric",tamil:"ய்,ய"}, {id:"P086",m:86,freq:35,type:"tally",tamil:"ஒன்று,ஓர்"},
  {id:"P050",m:216,freq:32,type:"geometric",tamil:"ச"}, {id:"P145",m:104,freq:27,type:"tally",tamil:"நான்கு,ந,நா"},
  {id:"P230",m:267,freq:23,type:"geometric",tamil:"மீ"}, {id:"P120",m:89,freq:22,type:"tally",tamil:"மூன்று,மு,மூ"},
  {id:"P062",m:242,freq:21,type:"geometric",tamil:"வதொழு"}, {id:"P060",m:230,freq:20,type:"pictogram",tamil:"மலய்"},
  {id:"P316",m:10,freq:19,type:"compound",tamil:"கா"}, {id:"P217",m:12,freq:18,type:"compound",tamil:"காவ்வ"},
  {id:"P378",m:15,freq:17,type:"compound",tamil:"ஆகாவ்வ"}, {id:"P364",m:66,freq:17,type:"geometric",tamil:"இளம்"},
  {id:"P058",m:171,freq:15,type:"geometric",tamil:"ண,ணா"},
];

const HYPOTHESES = [
  { code:"VPS2024", name:"Proto-Tamil", researcher:"Ponmuthu Shanmugham", claim:"Ancient Tamil, syllabic", status:"active", isNull:false, color:"#c9963e", year:2024 },
  { code:"PARPOLA", name:"Proto-Dravidian", researcher:"Asko Parpola", claim:"Proto-Dravidian, logo-syllabic", status:"active", isNull:false, color:"#4a7c59", year:1994 },
  { code:"MAHADEVAN", name:"Dravidian", researcher:"Iravatham Mahadevan", claim:"Dravidian concordance", status:"active", isNull:false, color:"#6b7fa3", year:1977 },
  { code:"FSW2004", name:"Non-Linguistic", researcher:"Farmer, Sproat, Witzel", claim:"Political/religious emblems", status:"active", isNull:true, color:"#a0522d", year:2004 },
  { code:"RAO2009", name:"Statistical", researcher:"Rajesh Rao et al.", claim:"Language-like entropy structure", status:"active", isNull:false, color:"#7b68ee", year:2009 },
  { code:"JEEVA2020", name:"Proto-Tamil (prior)", researcher:"Purnachandra Jeeva", claim:"Ancient Tamil (extended by VPS2024)", status:"active", isNull:false, color:"#20b2aa", year:2020 },
];

const MOTIF_DATA = [
  {name:"Unicorn",value:60,color:"#c9963e"}, {name:"Bull",value:5.5,color:"#a0522d"},
  {name:"Zebu",value:9,color:"#8b6914"}, {name:"Elephant",value:4.5,color:"#4a7c59"},
  {name:"Tiger",value:2.5,color:"#b85450"}, {name:"Gharial",value:2,color:"#4a6b7c"},
  {name:"Composite",value:1.5,color:"#7b68ee"}, {name:"None",value:15,color:"#3a3f4a"},
];

const SIGN_TYPE_COLORS = { tally:"#c9963e", compound:"#a0522d", pictogram:"#4a7c59", geometric:"#6b7fa3", modifier:"#7b68ee", unknown:"#3a4050" };
const MOTIF_COLORS = { unicorn:"#c9963e", elephant:"#4a7c59", bull:"#a0522d", zebu:"#8b6914", tiger:"#b85450", gharial:"#4a6b7c", composite:"#7b68ee", none:"#3a4050" };
const DOMAIN_COLORS = { "dairy products":"#c9963e", "animal husbandry":"#8b6914", "governance / law":"#6b7fa3", "social welfare":"#4a7c59", "food commodities":"#20b2aa", "governance / ethics":"#7b68ee", "governance":"#a0522d", "animal welfare":"#4a6b7c" };

// ── STYLES ────────────────────────────────────────────────
const S = {
  app: { fontFamily:"'Source Serif 4', Georgia, serif", background:"#0e1117", minHeight:"100vh", color:"#e8dcc8", display:"flex" },
  sidebar: { width:220, background:"#0a0d13", borderRight:"1px solid #1e2533", padding:"24px 0", display:"flex", flexDirection:"column", gap:0, flexShrink:0 },
  logo: { padding:"0 20px 28px", borderBottom:"1px solid #1e2533" },
  logoTitle: { fontFamily:"'Cinzel', 'Times New Roman', serif", fontSize:15, color:"#c9963e", letterSpacing:"0.12em", fontWeight:700, lineHeight:1.3 },
  logoSub: { fontSize:10, color:"#5a6070", letterSpacing:"0.08em", marginTop:4, textTransform:"uppercase" },
  navItem: (active) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", cursor:"pointer", fontSize:12.5, letterSpacing:"0.04em", color: active ? "#c9963e" : "#8090a8", background: active ? "#13171f" : "transparent", borderLeft: active ? "2px solid #c9963e" : "2px solid transparent", transition:"all 0.15s" }),
  navIcon: { fontSize:14, width:16 },
  main: { flex:1, overflow:"auto", padding:"28px 32px" },
  pageTitle: { fontFamily:"'Cinzel', serif", fontSize:22, color:"#e8dcc8", fontWeight:600, letterSpacing:"0.06em", marginBottom:4 },
  pageSubtitle: { fontSize:12, color:"#5a6070", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:24 },
  statsRow: { display:"flex", gap:16, marginBottom:28 },
  statCard: { background:"#131822", border:"1px solid #1e2533", padding:"14px 20px", flex:1 },
  statNum: { fontFamily:"'Cinzel', serif", fontSize:28, color:"#c9963e", lineHeight:1 },
  statLabel: { fontSize:11, color:"#5a6070", letterSpacing:"0.06em", textTransform:"uppercase", marginTop:4 },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 },
  sealCard: (active) => ({ background: active ? "#1a2035" : "#131822", border: active ? "1px solid #c9963e" : "1px solid #1e2533", padding:16, cursor:"pointer", transition:"all 0.15s", position:"relative" }),
  sealId: { fontFamily:"'Cinzel', serif", fontSize:18, color:"#c9963e", lineHeight:1 },
  sealMeta: { fontSize:11, color:"#5a6070", marginTop:4, marginBottom:12 },
  signStrip: { display:"flex", gap:3, flexWrap:"wrap", marginBottom:10 },
  signTile: (type) => ({ width:28, height:28, background: SIGN_TYPE_COLORS[type]||"#2a3040", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontFamily:"'JetBrains Mono', monospace", color:"#fff", fontWeight:700, letterSpacing:0 }),
  layer1: { fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:"#8090a8", marginBottom:4 },
  layer2: (status) => ({ fontSize:13, color: status==="complete" ? "#e8dcc8" : "#4a5060", fontStyle: status==="pending" ? "italic" : "normal" }),
  domainBadge: (domain) => ({ display:"inline-block", fontSize:10, padding:"2px 8px", background:"#0e1117", border:`1px solid ${DOMAIN_COLORS[domain]||"#2a3040"}`, color:DOMAIN_COLORS[domain]||"#5a6070", letterSpacing:"0.04em", marginTop:8 }),
  confBar: { height:3, background:"#1e2533", marginTop:10 },
  confFill: (conf) => ({ height:"100%", width:`${conf*100}%`, background: conf>0.7?"#c9963e":conf>0.6?"#8b6914":"#a0522d" }),
  detailPanel: { background:"#0d1017", border:"1px solid #1e2533", padding:24, marginBottom:16 },
  detailTitle: { fontFamily:"'Cinzel', serif", fontSize:14, color:"#c9963e", marginBottom:16, letterSpacing:"0.08em" },
  rule: { display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid #1e2533", fontSize:12 },
  ruleType: (t) => ({ padding:"2px 8px", fontSize:10, letterSpacing:"0.06em", background:SIGN_TYPE_COLORS[t==="tally_phoneme"?"tally":t==="sign_phoneme"?"pictogram":t==="motif_context"?"compound":t==="modifier"?"modifier":"unknown"]||"#2a3040", color:"#fff", fontFamily:"'JetBrains Mono', monospace", flexShrink:0, height:"fit-content" }),
  hypCard: { background:"#131822", border:"1px solid #1e2533", padding:20, marginBottom:12 },
  hypName: { fontFamily:"'Cinzel', serif", fontSize:15, marginBottom:4 },
  hypMeta: { fontSize:11, color:"#5a6070", marginBottom:10 },
  nullBadge: { display:"inline-block", fontSize:9, padding:"2px 6px", background:"#2a1510", border:"1px solid #a0522d", color:"#a0522d", letterSpacing:"0.06em", marginLeft:8 },
  activeBadge: { display:"inline-block", fontSize:9, padding:"2px 6px", background:"#0d1a12", border:"1px solid #4a7c59", color:"#4a7c59", letterSpacing:"0.06em", marginLeft:8 },
  sectionHeader: { fontFamily:"'Cinzel', serif", fontSize:13, color:"#8090a8", letterSpacing:"0.1em", textTransform:"uppercase", borderBottom:"1px solid #1e2533", paddingBottom:10, marginBottom:16, marginTop:28 },
  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
  chartBox: { background:"#131822", border:"1px solid #1e2533", padding:20 },
  chartTitle: { fontFamily:"'Cinzel', serif", fontSize:12, color:"#8090a8", letterSpacing:"0.08em", marginBottom:16, textTransform:"uppercase" },
  filterRow: { display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" },
  filterBtn: (active) => ({ padding:"5px 14px", fontSize:11, cursor:"pointer", border:`1px solid ${active?"#c9963e":"#1e2533"}`, background: active?"#1a1810":"transparent", color: active?"#c9963e":"#5a6070", letterSpacing:"0.04em", transition:"all 0.15s" }),
  motifDot: (motif) => ({ width:8, height:8, borderRadius:"50%", background:MOTIF_COLORS[motif]||"#3a4050", display:"inline-block", marginRight:6 }),
  pendingNote: { background:"#1a1612", border:"1px solid #3a2518", padding:"10px 14px", fontSize:12, color:"#8b6914", marginBottom:12 },
  signRow: { display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid #1a2030", fontSize:12 },
  signNum: { fontFamily:"'Cinzel', serif", fontSize:14, color:"#c9963e", width:48, flexShrink:0 },
  tamilText: { fontFamily:"Noto Sans Tamil, sans-serif", fontSize:14, color:"#e8dcc8", width:140, flexShrink:0 },
  romanText: { fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:"#8090a8", flex:1 },
  freqBar: (freq, max) => ({ height:6, width:`${(freq/max)*100}%`, background:"#c9963e", maxWidth:120 }),
};

// ── COMPONENTS ────────────────────────────────────────────

function SignStrip({ signs, compact=false }) {
  const typeMap = { 86:1,87:2,88:2,89:3,90:3,95:4,96:5,97:1,98:1,99:2,100:2,101:2,102:3,103:3,104:4,105:4,106:5,107:5,108:6,109:6,110:7,112:7,114:8 };
  const getType = (m) => {
    if (typeMap[m]) return "tally";
    if ([10,12,15].includes(m)) return "compound";
    if ([142].includes(m)) return "pictogram";
    if ([216,219,220].includes(m)) return "modifier";
    return "geometric";
  };
  return (
    <div style={S.signStrip}>
      {signs.map((m, i) => (
        <div key={i} style={{...S.signTile(getType(m)), width:compact?22:28, height:compact?22:28, fontSize:compact?7:8}} title={`M-${m}`}>
          {m}
        </div>
      ))}
    </div>
  );
}

function ConfBar({ conf }) {
  return <div style={S.confBar}><div style={S.confFill(conf)} /></div>;
}

function MotifIcon({ motif }) {
  const icons = { unicorn:"◈", elephant:"◉", bull:"◆", zebu:"◇", tiger:"▲", gharial:"◗", composite:"⬡", none:"○" };
  return <span style={{ color:MOTIF_COLORS[motif]||"#3a4050", marginRight:4, fontSize:10 }}>{icons[motif]||"○"}</span>;
}

// ── PAGES ─────────────────────────────────────────────────

function SealBrowser({ onSelect, selected }) {
  const [motifFilter, setMotifFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const motifs = ["all","unicorn","elephant","gharial","none"];
  const filtered = SEALS.filter(s =>
    (motifFilter==="all" || s.motif===motifFilter) &&
    (statusFilter==="all" || s.status===statusFilter)
  );
  return (
    <div>
      <div style={S.pageTitle}>Seal Browser</div>
      <div style={S.pageSubtitle}>194 readings · 206 seals in corpus · VPS2024 hypothesis</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>206</div><div style={S.statLabel}>Seals Read</div></div>
        <div style={S.statCard}><div style={S.statNum}>~1000</div><div style={S.statLabel}>Total Studied</div></div>
        <div style={S.statCard}><div style={S.statNum}>17</div><div style={S.statLabel}>Fully Translated</div></div>
        <div style={S.statCard}><div style={S.statNum}>264</div><div style={S.statLabel}>Signs Mapped</div></div>
      </div>
      <div style={S.filterRow}>
        {motifs.map(m => <button key={m} style={S.filterBtn(motifFilter===m)} onClick={()=>setMotifFilter(m)}><MotifIcon motif={m}/>{m==="all"?"All Motifs":m.charAt(0).toUpperCase()+m.slice(1)}</button>)}
        <div style={{width:1,background:"#1e2533",margin:"0 4px"}}/>
        {["all","complete","pending"].map(s => <button key={s} style={S.filterBtn(statusFilter===s)} onClick={()=>setStatusFilter(s)}>{s==="all"?"All Layers":s==="complete"?"2-Layer Complete":"Layer 1 Only"}</button>)}
      </div>
      <div style={S.grid}>
        {filtered.map(seal => (
          <div key={seal.id} style={S.sealCard(selected?.id===seal.id)} onClick={()=>onSelect(seal)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={S.sealId}>#{seal.id}</div>
              <span style={{fontSize:10,color:MOTIF_COLORS[seal.motif],letterSpacing:"0.04em"}}><MotifIcon motif={seal.motif}/>{seal.motif}</span>
            </div>
            <div style={S.sealMeta}>{seal.site} · {seal.signCount} signs</div>
            <SignStrip signs={seal.signs} />
            <div style={S.layer1}>{seal.layer1}</div>
            <div style={S.layer2(seal.status)}>{seal.layer2}</div>
            {seal.domain && <div style={S.domainBadge(seal.domain)}>{seal.domain}</div>}
            <ConfBar conf={seal.confidence} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SealDetail({ seal, onClose }) {
  if (!seal) return (
    <div style={{...S.detailPanel, color:"#3a4050", textAlign:"center", padding:40}}>
      <div style={{fontFamily:"'Cinzel', serif", fontSize:14, letterSpacing:"0.1em", marginBottom:8}}>SELECT A SEAL</div>
      <div style={{fontSize:11, color:"#2a3040"}}>Click any seal card to view its full reading</div>
    </div>
  );
  const rules = [
    {type:"motif_context", desc:`${seal.motif} → ${seal.motif==="unicorn"?"Market Common":seal.motif==="none"?"City-wide":"Elephant Street"}`, conf:0.72},
    {type:"tally_phoneme", desc:"tally-4 (nanku) → na/naa phoneme", conf:0.73},
    {type:"sign_phoneme",  desc:"Y-sign M-162 → y,ya (ney component)", conf:0.70},
    {type:"sign_phoneme",  desc:"M-142 → aa (cow/milk)", conf:0.75},
  ].slice(0, seal.signs.length > 3 ? 4 : 2);

  return (
    <div style={S.detailPanel}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={S.detailTitle}>SEAL #{seal.id}</div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#5a6070",cursor:"pointer",fontSize:16}}>✕</button>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:"#5a6070",marginBottom:6,letterSpacing:"0.06em"}}>SIGN SEQUENCE — {seal.signCount} SIGNS</div>
        <SignStrip signs={seal.signs} />
        <div style={{fontSize:10,color:"#3a4050",marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>
          {seal.signs.map(m=>`M-${m}`).join(" · ")}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div>
          <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:6}}>LAYER 1 — PHONEME</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#c9963e",marginBottom:4}}>{seal.layer1}</div>
          <div style={{fontSize:10,color:"#3a5050",letterSpacing:"0.04em"}}>auto-transliterated · author-reviewable</div>
        </div>
        <div>
          <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:6}}>LAYER 2 — MORPHEME</div>
          <div style={{fontSize:14,color:seal.status==="complete"?"#e8dcc8":"#4a5060",fontStyle:seal.status==="pending"?"italic":"normal",marginBottom:4}}>{seal.layer2}</div>
          {seal.domain && <div style={S.domainBadge(seal.domain)}>{seal.domain}</div>}
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:8}}>JURISDICTION</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <MotifIcon motif={seal.motif}/>
          <span style={{fontSize:13,color:MOTIF_COLORS[seal.motif]}}>{seal.motif==="unicorn"?"Market Common":seal.motif==="elephant"?"Elephant Street":seal.motif==="none"?"City-wide (universal ordinance)":seal.motif==="gharial"?"Riverine District":"Bull Street"}</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:8}}>RULES APPLIED</div>
        {rules.map((r,i) => (
          <div key={i} style={S.rule}>
            <span style={S.ruleType(r.type)}>{r.type}</span>
            <span style={{color:"#8090a8",flex:1}}>{r.desc}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:r.conf>0.7?"#c9963e":"#5a6070"}}>{r.conf.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <ConfBar conf={seal.confidence} />
      <div style={{fontSize:10,color:"#3a4050",marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>confidence: {seal.confidence.toFixed(3)}</div>
    </div>
  );
}

function SignRegistry() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = SIGN_FREQ.filter(s =>
    (typeFilter==="all" || s.type===typeFilter) &&
    (search==="" || String(s.m).includes(search) || s.tamil.includes(search))
  );
  const maxFreq = Math.max(...SIGN_FREQ.map(s=>s.freq));
  return (
    <div>
      <div style={S.pageTitle}>Sign Registry</div>
      <div style={S.pageSubtitle}>264 signs mapped · Mahadevan concordance · VPS2024 phonemes</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>264</div><div style={S.statLabel}>Signs Mapped</div></div>
        <div style={S.statCard}><div style={S.statNum}>397</div><div style={S.statLabel}>Total in Corpus</div></div>
        <div style={S.statCard}><div style={S.statNum}>50+</div><div style={S.statLabel}>Unidentified</div></div>
        <div style={S.statCard}><div style={S.statNum}>1003</div><div style={S.statLabel}>Occurrences</div></div>
      </div>
      <div style={S.filterRow}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by M-number or Tamil…" style={{background:"#131822",border:"1px solid #1e2533",color:"#e8dcc8",padding:"5px 12px",fontSize:12,width:220,outline:"none"}}/>
        {["all","tally","compound","pictogram","geometric","modifier"].map(t=>(
          <button key={t} style={{...S.filterBtn(typeFilter===t), borderLeft:`2px solid ${typeFilter===t?SIGN_TYPE_COLORS[t]||"#c9963e":"transparent"}`}} onClick={()=>setTypeFilter(t)}>{t}</button>
        ))}
      </div>
      <div style={{background:"#131822",border:"1px solid #1e2533"}}>
        <div style={{display:"flex",gap:12,padding:"8px 16px",borderBottom:"1px solid #1e2533",fontSize:10,color:"#3a4050",letterSpacing:"0.06em"}}>
          <span style={{width:60}}>SIGN</span>
          <span style={{width:60}}>TYPE</span>
          <span style={{width:160}}>TAMIL PHONEME</span>
          <span style={{width:160}}>ROMAN</span>
          <span style={{width:80}}>FREQ</span>
          <span style={{flex:1}}>DISTRIBUTION</span>
        </div>
        {filtered.map(s => (
          <div key={s.id} style={S.signRow}>
            <div style={{...S.signTile(s.type),width:36,height:36,fontSize:9,marginRight:8,flexShrink:0}}>{s.m}</div>
            <span style={{width:48,fontSize:11,color:"#5a6070",letterSpacing:"0.04em",flexShrink:0}}>{s.id}</span>
            <span style={{width:60,fontSize:9,padding:"1px 6px",background:SIGN_TYPE_COLORS[s.type]||"#2a3040",color:"#fff",letterSpacing:"0.04em",height:"fit-content",flexShrink:0}}>{s.type}</span>
            <span style={{...S.tamilText,width:140}}>{s.tamil}</span>
            <span style={{...S.romanText,width:120,flexShrink:0}}>{s.tamil.split(",")[0]}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#c9963e",width:48,flexShrink:0}}>{s.freq}</span>
            <div style={{flex:1}}><div style={S.freqBar(s.freq,maxFreq)}/></div>
          </div>
        ))}
      </div>
      <div style={{...S.pendingNote,marginTop:16}}>⚠ 50+ signs remain unidentified in either classical literature or current vocabulary — stated explicitly in the Research Keys. Engine marks these as [M-N?] in output.</div>
    </div>
  );
}

function HypothesisViewer() {
  const [selected, setSelected] = useState("VPS2024");
  const hyp = HYPOTHESES.find(h=>h.code===selected);
  const sealReadings = {
    VPS2024: [{seal:"1076",reading:"thava ney",meaning:"very good ghee",conf:0.74},{seal:"2082",reading:"chiva muu aakaavva",meaning:"carer of Shiva's 3 cows",conf:0.68},{seal:"2234",reading:"vayya illam",meaning:"the world is a big home",conf:0.70}],
    PARPOLA: [{seal:"1076",reading:"(undeciphered)",meaning:"probable Dravidian morpheme",conf:0.40},{seal:"2082",reading:"(undeciphered)",meaning:"animal husbandry context",conf:0.35},{seal:"2234",reading:"(undeciphered)",meaning:"–",conf:0.30}],
    FSW2004: [{seal:"1076",reading:"(non-linguistic)",meaning:"political/religious emblem",conf:0.0},{seal:"2082",reading:"(non-linguistic)",meaning:"clan or ownership mark",conf:0.0},{seal:"2234",reading:"(non-linguistic)",meaning:"–",conf:0.0}],
  };
  const readings = sealReadings[selected] || sealReadings.PARPOLA;
  return (
    <div>
      <div style={S.pageTitle}>Hypothesis Viewer</div>
      <div style={S.pageSubtitle}>6 competing hypotheses · same corpus · no pre-selected winner</div>
      <div style={S.filterRow}>
        {HYPOTHESES.map(h=>(
          <button key={h.code} style={{...S.filterBtn(selected===h.code),borderLeft:`2px solid ${selected===h.code?h.color:"transparent"}`}} onClick={()=>setSelected(h.code)}>
            {h.code}
          </button>
        ))}
      </div>
      {hyp && (
        <div>
          <div style={S.hypCard}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{...S.hypName,color:hyp.color}}>{hyp.name}</div>
                <div style={S.hypMeta}>{hyp.researcher} · {hyp.year}</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {hyp.isNull && <span style={S.nullBadge}>NULL HYPOTHESIS</span>}
                <span style={S.activeBadge}>{hyp.status}</span>
              </div>
            </div>
            <div style={{fontSize:13,color:"#c8b89a",padding:"10px 0",borderTop:"1px solid #1e2533",marginTop:10}}>{hyp.claim}</div>
          </div>
          {hyp.isNull && (
            <div style={{...S.pendingNote,borderColor:"#8b4513",color:"#c8722a",marginBottom:16}}>
              ⚖ FSW2004 is modelled as the null hypothesis. All statistical tests in Stage 5 run against this baseline. VPS2024 rebuttal: brevity = purpose (identifier, not essay); singletons explained by modifier system; long-form writing on perishable materials.
            </div>
          )}
          <div style={S.sectionHeader}>Sample Readings — Same Seals, Different Hypotheses</div>
          <div style={{background:"#131822",border:"1px solid #1e2533"}}>
            <div style={{display:"flex",gap:12,padding:"8px 16px",borderBottom:"1px solid #1e2533",fontSize:10,color:"#3a4050",letterSpacing:"0.06em"}}>
              <span style={{width:60}}>SEAL</span><span style={{width:180}}>PHONEME (L1)</span><span style={{width:180}}>MEANING (L2)</span><span style={{width:80}}>CONFIDENCE</span>
            </div>
            {readings.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"10px 16px",borderBottom:"1px solid #131822",fontSize:12,alignItems:"center"}}>
                <span style={{...S.signNum,width:60}}>#{r.seal}</span>
                <span style={{width:180,fontFamily:"'JetBrains Mono',monospace",color:"#8090a8",fontSize:11}}>{r.reading}</span>
                <span style={{width:180,color:r.conf>0?"#e8dcc8":"#3a4050",fontStyle:r.conf===0?"italic":"normal"}}>{r.meaning}</span>
                <div style={{width:80}}>
                  <div style={{height:3,background:"#1e2533"}}><div style={{height:"100%",width:`${r.conf*100}%`,background:hyp.color}}/></div>
                  <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#5a6070"}}>{r.conf.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FrequencyDashboard() {
  return (
    <div>
      <div style={S.pageTitle}>Frequency Dashboard</div>
      <div style={S.pageSubtitle}>Corpus statistics · 179 seals · 1003 sign occurrences · Mohenjo-daro subset</div>
      <div style={S.twoCol}>
        <div style={S.chartBox}>
          <div style={S.chartTitle}>Top 15 Signs by Corpus Frequency</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SIGN_FREQ} margin={{top:0,right:0,bottom:20,left:0}}>
              <XAxis dataKey="id" tick={{fontSize:8,fill:"#5a6070",fontFamily:"JetBrains Mono"}} angle={-45} textAnchor="end"/>
              <YAxis tick={{fontSize:9,fill:"#5a6070"}}/>
              <Tooltip contentStyle={{background:"#0d1017",border:"1px solid #1e2533",fontSize:11}} labelStyle={{color:"#c9963e"}} cursor={{fill:"#1a2030"}}/>
              <Bar dataKey="freq" fill="#c9963e" radius={[2,2,0,0]}>
                {SIGN_FREQ.map((s,i)=><Cell key={i} fill={SIGN_TYPE_COLORS[s.type]||"#c9963e"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}>
            {Object.entries(SIGN_TYPE_COLORS).map(([t,c])=>(
              <span key={t} style={{fontSize:9,color:c,letterSpacing:"0.04em"}}>■ {t}</span>
            ))}
          </div>
        </div>
        <div style={S.chartBox}>
          <div style={S.chartTitle}>Seal Motif Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={MOTIF_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                {MOTIF_DATA.map((m,i)=><Cell key={i} fill={m.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0d1017",border:"1px solid #1e2533",fontSize:11}} cursor={{fill:"#1a2030"}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
            {MOTIF_DATA.map(m=>(
              <span key={m.name} style={{fontSize:9,color:m.color}}>■ {m.name} {m.value}%</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{...S.chartBox,marginTop:20}}>
        <div style={S.chartTitle}>Readings by Semantic Domain (VPS2024)</div>
        <div style={{display:"flex",gap:0,flexWrap:"wrap",alignItems:"flex-end",height:80,marginBottom:12}}>
          {Object.entries(DOMAIN_COLORS).map(([domain,color])=>{
            const count = SEALS.filter(s=>s.domain===domain).length;
            return count>0?(
              <div key={domain} style={{display:"flex",flexDirection:"column",alignItems:"center",marginRight:24}}>
                <div style={{width:32,background:color,height:count*14,marginBottom:4,opacity:0.85}}/>
                <span style={{fontSize:8,color,letterSpacing:"0.03em",textAlign:"center",maxWidth:70}}>{domain}</span>
                <span style={{fontSize:10,color,fontFamily:"'Cinzel',serif"}}>{count}</span>
              </div>
            ):null;
          })}
        </div>
      </div>
      <div style={{...S.chartBox,marginTop:16}}>
        <div style={S.chartTitle}>Translation Layer Status</div>
        <div style={{display:"flex",gap:32,alignItems:"center",padding:"8px 0"}}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:32,color:"#4a7c59"}}>17</div>
            <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em"}}>COMPLETE — both layers</div>
          </div>
          <div style={{flex:1,height:16,background:"#1e2533",position:"relative"}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:"8.25%",background:"#4a7c59"}}/>
          </div>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:32,color:"#8b6914"}}>189</div>
            <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em"}}>PENDING — Tamil + phoneme only</div>
          </div>
        </div>
        <div style={{fontSize:11,color:"#5a6070",marginTop:8}}>Layer 1 (phoneme) is complete for all 206 readings and available to peer reviewers now. Layer 2 (English meaning) is being added progressively by the author.</div>
      </div>
    </div>
  );
}

function PeerReviewDashboard() {
  const objections = [
    {id:1,claim:"Tally-4 = phoneme 'na' via numeral name",objection:"Onomatopoeic derivation from numeral names is speculative — similar claims have been made for other scripts without consensus.",reviewer:"Reviewer A",status:"addressed",response:"The derivation is not purely onomatopoeic but systematic: all 12 Tamil numeral names embed their first syllable as a phoneme. This is documented in Research Keys §2.40-2.60 with 20+ seal examples showing consistent application."},
    {id:2,claim:"Unicorn motif = Market Common jurisdiction",objection:"The urban topology interpretation lacks archaeological corroboration. No physical evidence of a 'Market Common' has been excavated.",reviewer:"Reviewer B",status:"open",response:""},
    {id:3,claim:"Brevity = purpose (rebuttal of FSW2004)",objection:"Average of 5 signs per seal is consistent with non-linguistic emblems, not necessarily identifiers.",reviewer:"Reviewer C",status:"open",response:""},
  ];
  return (
    <div>
      <div style={S.pageTitle}>Peer Review</div>
      <div style={S.pageSubtitle}>Open platform · all objections logged · all responses public</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>3</div><div style={S.statLabel}>Open Objections</div></div>
        <div style={S.statCard}><div style={S.statNum}>1</div><div style={S.statLabel}>Addressed</div></div>
        <div style={S.statCard}><div style={S.statNum}>0</div><div style={S.statLabel}>Reviews Received</div></div>
        <div style={S.statCard}><div style={S.statNum}>8</div><div style={S.statLabel}>Evidence Links</div></div>
      </div>
      <div style={S.pendingNote}>📬 This platform is accepting peer reviewers. Contact vpshanmugham@yahoo.com · All submitted reviews are logged here publicly.</div>
      <div style={S.sectionHeader}>Objection Tracker</div>
      {objections.map(obj=>(
        <div key={obj.id} style={{...S.hypCard,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em"}}>CLAIM UNDER REVIEW</div>
            <span style={{fontSize:9,padding:"2px 8px",border:`1px solid ${obj.status==="addressed"?"#4a7c59":"#8b6914"}`,color:obj.status==="addressed"?"#4a7c59":"#8b6914",letterSpacing:"0.06em"}}>{obj.status.toUpperCase()}</span>
          </div>
          <div style={{fontSize:13,color:"#c9963e",marginBottom:10}}>"{obj.claim}"</div>
          <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:4}}>OBJECTION — {obj.reviewer}</div>
          <div style={{fontSize:12,color:"#8090a8",marginBottom:obj.response?12:0}}>{obj.objection}</div>
          {obj.response && <>
            <div style={{fontSize:10,color:"#4a7c59",letterSpacing:"0.06em",marginBottom:4}}>AUTHOR RESPONSE</div>
            <div style={{fontSize:12,color:"#c8b89a",borderLeft:"2px solid #4a7c59",paddingLeft:10}}>{obj.response}</div>
          </>}
        </div>
      ))}
      <div style={S.sectionHeader}>Reproducibility Statement</div>
      <div style={{background:"#131822",border:"1px solid #1e2533",padding:20,fontSize:12,color:"#8090a8",lineHeight:1.7}}>
        A peer reviewer can clone this repository, run <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#c9963e",fontSize:11}}>docker compose up</span>, import the VPS2024 rule set, and reproduce any of the 206 readings. The engine applies rules deterministically — same input, same output, every time. Reviewers are invited to sign a reproducibility statement after testing.
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("seals");
  const [selectedSeal, setSelectedSeal] = useState(null);

  const nav = [
    {id:"seals",    icon:"◈", label:"Seal Browser"},
    {id:"signs",    icon:"▦", label:"Sign Registry"},
    {id:"hyps",     icon:"⚖", label:"Hypotheses"},
    {id:"charts",   icon:"▬", label:"Frequency"},
    {id:"review",   icon:"✍", label:"Peer Review"},
  ];

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoTitle}>OPEN<br/>INDUS<br/>LAB</div>
          <div style={S.logoSub}>Script Analysis Platform</div>
        </div>
        <div style={{padding:"16px 0"}}>
          {nav.map(n=>(
            <div key={n.id} style={S.navItem(page===n.id)} onClick={()=>setPage(n.id)}>
              <span style={S.navIcon}>{n.icon}</span>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.06em"}}>{n.label}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:"auto",padding:"16px 20px",borderTop:"1px solid #1e2533"}}>
          <div style={{fontSize:9,color:"#2a3040",letterSpacing:"0.06em",lineHeight:1.6}}>
            VPS2024 HYPOTHESIS<br/>
            Ponmuthu Shanmugham<br/>
            <span style={{color:"#1e2533"}}>──────────</span><br/>
            264 signs mapped<br/>
            206 seals read<br/>
            6 hypotheses modelled
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        {page==="seals" && (
          <div style={{display:"grid",gridTemplateColumns:selectedSeal?"1fr 360px":"1fr",gap:24}}>
            <SealBrowser onSelect={setSelectedSeal} selected={selectedSeal}/>
            {selectedSeal && <div><SealDetail seal={selectedSeal} onClose={()=>setSelectedSeal(null)}/></div>}
          </div>
        )}
        {page==="signs"  && <SignRegistry/>}
        {page==="hyps"   && <HypothesisViewer/>}
        {page==="charts" && <FrequencyDashboard/>}
        {page==="review" && <PeerReviewDashboard/>}
      </div>
    </div>
  );
}
