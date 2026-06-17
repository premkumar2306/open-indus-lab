import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── SIGN IMAGE DATA ───────────────────────────────────────
// Images extracted directly from author's Indus_Signs_Reading.pdf
const SIGN_IMGS = {};
const signModules = import.meta.glob('./signs/*.png', { eager: true, query: '?url', import: 'default' });
Object.entries(signModules).forEach(([path, url]) => {
  const m = path.match(/sign_(\d+)\.png/);
  if (m) SIGN_IMGS[parseInt(m[1])] = url;
});

// ── REAL DATA ─────────────────────────────────────────────
const SIGN_DATA = {
  1:  {tamil:"க",     phoneme:"ka"},
  2:  {tamil:"ரகர்",  phoneme:"rkar"},
  10: {tamil:"கா",    phoneme:"kaa"},
  12: {tamil:"காவ்வ", phoneme:"kaavva"},
  15: {tamil:"ஆகாவ்வ",phoneme:"aakaavva"},
  17: {tamil:"தவ",    phoneme:"thava"},
  65: {tamil:"இள",    phoneme:"iLa"},
  66: {tamil:"இல்லம்",phoneme:"illam"},
  86: {tamil:"ஓர்",   phoneme:"oor"},
  87: {tamil:"இரு",   phoneme:"iru"},
  89: {tamil:"மூன்று",phoneme:"muu"},
  90: {tamil:"மூய",   phoneme:"muya"},
  95: {tamil:"நான்கு",phoneme:"na/naa"},
  102:{tamil:"மூன்று",phoneme:"muu"},
  104:{tamil:"நான்கு",phoneme:"na/naa"},
  108:{tamil:"ஆறு",   phoneme:"aaru"},
  110:{tamil:"ஏழு",   phoneme:"eezhu"},
  142:{tamil:"இருதப", phoneme:"iruthapa"},
  161:{tamil:"ன",     phoneme:"na"},
  162:{tamil:"ய்,ய",  phoneme:"y/ya"},
  171:{tamil:"ண,ணா",  phoneme:"Na/Naa"},
  176:{tamil:"ண்,ண",  phoneme:"N"},
  182:{tamil:"பண்ணா", phoneme:"paNNaa"},
  210:{tamil:"கோயில்",phoneme:"kooyil"},
  215:{tamil:"ஈசா",   phoneme:"iisaa"},
  216:{tamil:"ச",     phoneme:"sa"},
  219:{tamil:"சி",    phoneme:"si"},
  220:{tamil:"சிவம்", phoneme:"sivam"},
  230:{tamil:"மலய்",  phoneme:"malay"},
  242:{tamil:"தொழு",  phoneme:"thoLzu"},
  267:{tamil:"மீ",    phoneme:"mii"},
  287:{tamil:"ட",     phoneme:"Ta"},
  300:{tamil:"ட்,டி", phoneme:"T/di"},
  321:{tamil:"வவ்",   phoneme:"vav"},
  323:{tamil:"அரச",   phoneme:"arasa"},
  328:{tamil:"அ",     phoneme:"a"},
  342:{tamil:"ஆ",     phoneme:"aa"},
  343:{tamil:"அய்",   phoneme:"ay"},
  351:{tamil:"யவ்வ",  phoneme:"yavva"},
  352:{tamil:"ஆய,யா", phoneme:"aaya"},
  358:{tamil:"ண்ண",   phoneme:"NNa"},
  373:{tamil:"வ",     phoneme:"va"},
  381:{tamil:"வண்,வண",phoneme:"vaN"},
  385:{tamil:"வன",    phoneme:"vana"},
  387:{tamil:"வய",    phoneme:"vaya"},
  391:{tamil:"தவ",    phoneme:"thava"},
  402:{tamil:"ஆர்",   phoneme:"aar"},
  403:{tamil:"வ்வ,வவ்",phoneme:"vva"},
};

const SEALS = [
  { id:"1076", motif:"unicorn", site:"Mohenjo-daro", signs:[95,162,162], layer1:"na y y → thava ney", layer2:"Very Good Ghee", domain:"dairy products", status:"complete", confidence:0.74 },
  { id:"2082", motif:"unicorn", site:"Mohenjo-daro", signs:[215,89,342,15], layer1:"iisaa muu aa aakaavva", layer2:"Carer of Isa's 3 cows", domain:"animal husbandry", status:"complete", confidence:0.68 },
  { id:"3023", motif:"unicorn", site:"Mohenjo-daro", signs:[300,300,342], layer1:"di dii aa", layer2:"Just expressed fresh milk", domain:"dairy products", status:"complete", confidence:0.72 },
  { id:"2127", motif:"elephant", site:"Mohenjo-daro", signs:[176,162], layer1:"eN ney", layer2:"Sesame oil (eNNey)", domain:"food commodities", status:"complete", confidence:0.72 },
  { id:"2648", motif:"elephant", site:"Mohenjo-daro", signs:[267,267,95,162,242], layer1:"mii mii na y thoLzu", layer2:"Very good ghee shed", domain:"dairy products", status:"complete", confidence:0.70 },
  { id:"2444", motif:"unicorn", site:"Mohenjo-daro", signs:[171,162,342,171], layer1:"Na y aa Na → aNNal kai aaNai", layer2:"Order of the Leader", domain:"governance / law", status:"complete", confidence:0.71 },
  { id:"2864", motif:"gharial", site:"Mohenjo-daro", signs:[171,162,342,171], layer1:"Na y aa Na → aNNal kai aaNai", layer2:"Order of the Leader (Riverine)", domain:"governance / law", status:"complete", confidence:0.71 },
  { id:"4440", motif:"none",    site:"Mohenjo-daro", signs:[65,87,294,342,171], layer1:"iLa iru TTa aa Na", layer2:"Citywide curfew ordinance", domain:"governance / law", status:"complete", confidence:0.65 },
  { id:"2234", motif:"unicorn", site:"Mohenjo-daro", signs:[351,66,66], layer1:"vayya illam illam", layer2:"The world is a Big Home", domain:"governance / ethics", status:"complete", confidence:0.70 },
  { id:"4718", motif:"none",    site:"Mohenjo-daro", signs:[343,213,343,86,2015], layer1:"ay ya ay o vya mun → children's milk", layer2:"Panic milk mandate for children", domain:"social welfare", status:"complete", confidence:0.66 },
  { id:"1425", motif:"none",    site:"Mohenjo-daro", signs:[66,387,102,161], layer1:"illam vaya muu na", layer2:"Homes for the aged and alone", domain:"social welfare", status:"complete", confidence:0.67 },
  { id:"3246", motif:"none",    site:"Mohenjo-daro", signs:[387,102,59,15], layer1:"vaya muu La aakaavva", layer2:"Carer of aged cattle", domain:"animal husbandry", status:"complete", confidence:0.67 },
  { id:"1110", motif:"unicorn", site:"Mohenjo-daro", signs:[17,216,230,17,358], layer1:"thava sama thaLa thava aNNal", layer2:"Respected equanimous great leader", domain:"governance", status:"complete", confidence:0.64 },
  { id:"5119", motif:"unicorn", site:"Mohenjo-daro", signs:[17,17,89,287,342,242], layer1:"mi mi muu Ta aa thoLzu", layer2:"Shed for aged cattle", domain:"animal welfare", status:"complete", confidence:0.65 },
  { id:"2950", motif:"unicorn", site:"Mohenjo-daro", signs:[95,162], layer1:"na ney", layer2:"Ghee", domain:"dairy products", status:"complete", confidence:0.73 },
  { id:"1133", motif:"unicorn", site:"Mohenjo-daro", signs:[162,95,162], layer1:"y na y → ney", layer2:"Ghee (evolved form)", domain:"dairy products", status:"complete", confidence:0.72 },
  { id:"2322", motif:"unicorn", site:"Mohenjo-daro", signs:[15,95,162], layer1:"aakaavva na y → aakaavvan ney", layer2:"Cow carer's ghee", domain:"dairy products", status:"complete", confidence:0.69 },
  { id:"2617", motif:"unicorn", site:"Mohenjo-daro", signs:[403,403,351,267,402], layer1:"vva vva vayya mii aar", layer2:"Buttermilk available HERE", domain:"dairy products", status:"complete", confidence:0.62 },
];

const SIGN_FREQ_DATA = [
  {m:95, tamil:"நான்கு,ந,நா", phoneme:"na/naa", freq:76, type:"tally"},
  {m:162,tamil:"ய்,ய",        phoneme:"y/ya",   freq:67, type:"geometric"},
  {m:267,tamil:"மீ",          phoneme:"mii",    freq:35, type:"geometric"},
  {m:86, tamil:"ஓர்,ஒ",       phoneme:"oor",    freq:35, type:"tally"},
  {m:216,tamil:"ச",           phoneme:"sa",     freq:32, type:"geometric"},
  {m:342,tamil:"ஆ",           phoneme:"aa",     freq:31, type:"pictogram"},
  {m:89, tamil:"மூன்று,மு",   phoneme:"muu",   freq:27, type:"tally"},
  {m:242,tamil:"தொழு",        phoneme:"thoLzu", freq:23, type:"geometric"},
  {m:171,tamil:"ண,ணா",        phoneme:"Na",     freq:21, type:"geometric"},
  {m:391,tamil:"தவ",          phoneme:"thava",  freq:20, type:"pictogram"},
  {m:10, tamil:"கா",          phoneme:"kaa",    freq:19, type:"compound"},
  {m:12, tamil:"காவ்வ",       phoneme:"kaavva", freq:18, type:"compound"},
  {m:15, tamil:"ஆகாவ்வ",     phoneme:"aakaavva",freq:17,type:"compound"},
  {m:66, tamil:"இல்லம்",      phoneme:"illam",  freq:17, type:"pictogram"},
  {m:171,tamil:"ண,ணா",        phoneme:"Na/Naa", freq:15, type:"geometric"},
];

const MOTIF_DATA = [
  {name:"Unicorn",value:60,color:"#c9963e"},{name:"Bull",value:5.5,color:"#a0522d"},
  {name:"Zebu",value:9,color:"#8b6914"},{name:"Elephant",value:4.5,color:"#4a7c59"},
  {name:"Tiger",value:2.5,color:"#b85450"},{name:"Gharial",value:2,color:"#4a6b7c"},
  {name:"Composite",value:1.5,color:"#7b68ee"},{name:"None",value:15,color:"#3a3f4a"},
];

const HYPOTHESES = [
  {code:"VPS2024",  name:"Proto-Tamil",     researcher:"Ponmuthu Shanmugham", claim:"Ancient Tamil, syllabic",         status:"active",  isNull:false, color:"#c9963e", year:2024},
  {code:"PARPOLA",  name:"Proto-Dravidian", researcher:"Asko Parpola",        claim:"Proto-Dravidian, logo-syllabic",  status:"active",  isNull:false, color:"#4a7c59", year:1994},
  {code:"MAHADEVAN",name:"Dravidian",       researcher:"Iravatham Mahadevan",  claim:"Dravidian concordance",          status:"active",  isNull:false, color:"#6b7fa3", year:1977},
  {code:"FSW2004",  name:"Non-Linguistic",  researcher:"Farmer, Sproat, Witzel",claim:"Political/religious emblems",   status:"active",  isNull:true,  color:"#a0522d", year:2004},
  {code:"RAO2009",  name:"Statistical",     researcher:"Rajesh Rao et al.",    claim:"Language-like entropy structure", status:"active",  isNull:false, color:"#7b68ee", year:2009},
  {code:"JEEVA2020",name:"Proto-Tamil (prior)",researcher:"Purnachandra Jeeva",claim:"Ancient Tamil (extended by VPS2024)",status:"active",isNull:false, color:"#20b2aa", year:2020},
];

const SIGN_TYPE_COLORS = {tally:"#c9963e",compound:"#a0522d",pictogram:"#4a7c59",geometric:"#6b7fa3",modifier:"#7b68ee",unknown:"#2a3040"};
const MOTIF_COLORS = {unicorn:"#c9963e",elephant:"#4a7c59",bull:"#a0522d",zebu:"#8b6914",tiger:"#b85450",gharial:"#4a6b7c",composite:"#7b68ee",none:"#3a4050"};
const DOMAIN_COLORS = {"dairy products":"#c9963e","animal husbandry":"#8b6914","governance / law":"#6b7fa3","social welfare":"#4a7c59","food commodities":"#20b2aa","governance / ethics":"#7b68ee","governance":"#a0522d","animal welfare":"#4a6b7c"};

const getSignType = (m) => {
  if ([86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,121,122].includes(m)) return "tally";
  if ([10,12,13,14,15].includes(m)) return "compound";
  if ([342,343,344,345,230,232,82,84,76,78,79,80,81,57,190].includes(m)) return "pictogram";
  if ([140,143,164,308,289].includes(m)) return "modifier";
  return "geometric";
};

// ── STYLES ───────────────────────────────────────────────
const S = {
  app: {fontFamily:"'Source Serif 4',Georgia,serif",background:"#0e1117",minHeight:"100vh",color:"#e8dcc8",display:"flex"},
  sidebar: {width:220,background:"#0a0d13",borderRight:"1px solid #1e2533",padding:"24px 0",display:"flex",flexDirection:"column",flexShrink:0},
  logo: {padding:"0 20px 28px",borderBottom:"1px solid #1e2533"},
  logoTitle: {fontFamily:"'Cinzel','Times New Roman',serif",fontSize:15,color:"#c9963e",letterSpacing:"0.12em",fontWeight:700,lineHeight:1.3},
  logoSub: {fontSize:10,color:"#5a6070",letterSpacing:"0.08em",marginTop:4,textTransform:"uppercase"},
  navItem: (a) => ({display:"flex",alignItems:"center",gap:10,padding:"10px 20px",cursor:"pointer",fontSize:12.5,letterSpacing:"0.04em",color:a?"#c9963e":"#8090a8",background:a?"#13171f":"transparent",borderLeft:a?"2px solid #c9963e":"2px solid transparent"}),
  main: {flex:1,overflow:"auto",padding:"28px 32px"},
  pageTitle: {fontFamily:"'Cinzel',serif",fontSize:22,color:"#e8dcc8",fontWeight:600,letterSpacing:"0.06em",marginBottom:4},
  pageSub: {fontSize:12,color:"#5a6070",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:24},
  statsRow: {display:"flex",gap:16,marginBottom:28},
  statCard: {background:"#131822",border:"1px solid #1e2533",padding:"14px 20px",flex:1},
  statNum: {fontFamily:"'Cinzel',serif",fontSize:28,color:"#c9963e",lineHeight:1},
  statLabel: {fontSize:11,color:"#5a6070",letterSpacing:"0.06em",textTransform:"uppercase",marginTop:4},
  grid: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14},
  sealCard: (a) => ({background:a?"#1a2035":"#131822",border:a?"1px solid #c9963e":"1px solid #1e2533",padding:16,cursor:"pointer"}),
  sealId: {fontFamily:"'Cinzel',serif",fontSize:18,color:"#c9963e"},
  sealMeta: {fontSize:11,color:"#5a6070",marginTop:4,marginBottom:12},
  signStrip: {display:"flex",gap:4,flexWrap:"wrap",marginBottom:10},
  layer1: {fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#8090a8",marginBottom:4},
  layer2: (s) => ({fontSize:13,color:s==="complete"?"#e8dcc8":"#4a5060",fontStyle:s==="pending"?"italic":"normal"}),
  domainBadge: (d) => ({display:"inline-block",fontSize:10,padding:"2px 8px",background:"#0e1117",border:`1px solid ${DOMAIN_COLORS[d]||"#2a3040"}`,color:DOMAIN_COLORS[d]||"#5a6070",letterSpacing:"0.04em",marginTop:8}),
  confBar: {height:3,background:"#1e2533",marginTop:10},
  confFill: (c) => ({height:"100%",width:`${c*100}%`,background:c>0.7?"#c9963e":c>0.6?"#8b6914":"#a0522d"}),
  detail: {background:"#0d1017",border:"1px solid #1e2533",padding:24,marginBottom:16},
  sectionHdr: {fontFamily:"'Cinzel',serif",fontSize:13,color:"#8090a8",letterSpacing:"0.1em",textTransform:"uppercase",borderBottom:"1px solid #1e2533",paddingBottom:10,marginBottom:16,marginTop:28},
  twoCol: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:20},
  chartBox: {background:"#131822",border:"1px solid #1e2533",padding:20},
  chartTitle: {fontFamily:"'Cinzel',serif",fontSize:12,color:"#8090a8",letterSpacing:"0.08em",marginBottom:16,textTransform:"uppercase"},
  filterRow: {display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"},
  filterBtn: (a) => ({padding:"5px 14px",fontSize:11,cursor:"pointer",border:`1px solid ${a?"#c9963e":"#1e2533"}`,background:a?"#1a1810":"transparent",color:a?"#c9963e":"#5a6070",letterSpacing:"0.04em"}),
  hypCard: {background:"#131822",border:"1px solid #1e2533",padding:20,marginBottom:12},
};

// ── SIGN GLYPH COMPONENT ─────────────────────────────────
function SignGlyph({ mahadevan, size=40, showLabel=true }) {
  const imgSrc = SIGN_IMGS[mahadevan];
  const type = getSignType(mahadevan);
  const info = SIGN_DATA[mahadevan];

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}} title={`M-${mahadevan}${info?` · ${info.phoneme}`:""}`}>
      <div style={{
        width:size, height:size,
        background:"#1a2030",
        border:`1px solid ${SIGN_TYPE_COLORS[type]||"#2a3040"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden", flexShrink:0,
      }}>
        {imgSrc
          ? <img src={imgSrc} alt={`M-${mahadevan}`} style={{width:size-4,height:size-4,objectFit:"contain",filter:"invert(1)"}} />
          : <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:SIGN_TYPE_COLORS[type],fontWeight:700}}>{mahadevan}</span>
        }
      </div>
      {showLabel && info && (
        <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:"#5a6070",textAlign:"center",maxWidth:size}}>{info.phoneme}</span>
      )}
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────
function SealBrowser({onSelect,selected}) {
  const [mf,setMf] = useState("all");
  const [sf,setSf] = useState("all");
  const filtered = SEALS.filter(s=>(mf==="all"||s.motif===mf)&&(sf==="all"||s.status===sf));
  return (
    <div>
      <div style={S.pageTitle}>Seal Browser</div>
      <div style={S.pageSub}>Sign glyphs from author's Indus_Signs_Reading.pdf · VPS2024 readings</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>259</div><div style={S.statLabel}>Signs Extracted</div></div>
        <div style={S.statCard}><div style={S.statNum}>206</div><div style={S.statLabel}>Seals Read</div></div>
        <div style={S.statCard}><div style={S.statNum}>~1000</div><div style={S.statLabel}>Total Studied</div></div>
        <div style={S.statCard}><div style={S.statNum}>400+</div><div style={S.statLabel}>Seals Documented</div></div>
      </div>
      <div style={S.filterRow}>
        {["all","unicorn","elephant","gharial","none"].map(m=>(
          <button key={m} style={S.filterBtn(mf===m)} onClick={()=>setMf(m)}>
            <span style={{color:MOTIF_COLORS[m]||"#5a6070",marginRight:4}}>◈</span>{m==="all"?"All Motifs":m}
          </button>
        ))}
        <div style={{width:1,background:"#1e2533"}}/>
        {["all","complete","pending"].map(s=>(
          <button key={s} style={S.filterBtn(sf===s)} onClick={()=>setSf(s)}>
            {s==="all"?"All":s==="complete"?"2-Layer Complete":"Layer 1 Only"}
          </button>
        ))}
      </div>
      <div style={S.grid}>
        {filtered.map(seal=>(
          <div key={seal.id} style={S.sealCard(selected?.id===seal.id)} onClick={()=>onSelect(seal)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={S.sealId}>#{seal.id}</div>
              <span style={{fontSize:10,color:MOTIF_COLORS[seal.motif],letterSpacing:"0.04em"}}>{seal.motif}</span>
            </div>
            <div style={S.sealMeta}>{seal.site} · {seal.signs.length} signs</div>
            {/* ACTUAL SIGN GLYPHS */}
            <div style={S.signStrip}>
              {seal.signs.map((m,i)=><SignGlyph key={i} mahadevan={m} size={38} showLabel={true}/>)}
            </div>
            <div style={S.layer1}>{seal.layer1}</div>
            <div style={S.layer2(seal.status)}>{seal.layer2}</div>
            {seal.domain && <div style={S.domainBadge(seal.domain)}>{seal.domain}</div>}
            <div style={S.confBar}><div style={S.confFill(seal.confidence)}/></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SealDetail({seal,onClose}) {
  if(!seal) return (
    <div style={{...S.detail,color:"#3a4050",textAlign:"center",padding:40}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:14,letterSpacing:"0.1em"}}>SELECT A SEAL</div>
      <div style={{fontSize:11,color:"#2a3040",marginTop:8}}>Click any seal card to view its full reading</div>
    </div>
  );
  return (
    <div style={S.detail}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#c9963e",letterSpacing:"0.08em"}}>SEAL #{seal.id}</div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#5a6070",cursor:"pointer",fontSize:16}}>✕</button>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#5a6070",marginBottom:10,letterSpacing:"0.06em"}}>SIGN SEQUENCE — {seal.signs.length} SIGNS</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {seal.signs.map((m,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <SignGlyph mahadevan={m} size={56} showLabel={false}/>
              <div style={{fontSize:9,color:"#5a6070",marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>M-{m}</div>
              {SIGN_DATA[m] && <div style={{fontSize:9,color:"#c9963e",fontFamily:"'JetBrains Mono',monospace"}}>{SIGN_DATA[m].phoneme}</div>}
              {SIGN_DATA[m] && <div style={{fontSize:9,color:"#8090a8"}}>{SIGN_DATA[m].tamil}</div>}
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div>
          <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:6}}>LAYER 1 — PHONEME</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#c9963e"}}>{seal.layer1}</div>
        </div>
        <div>
          <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:6}}>LAYER 2 — MORPHEME</div>
          <div style={{fontSize:14,color:seal.status==="complete"?"#e8dcc8":"#4a5060",fontStyle:seal.status==="pending"?"italic":"normal"}}>{seal.layer2}</div>
          {seal.domain && <div style={S.domainBadge(seal.domain)}>{seal.domain}</div>}
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:6}}>JURISDICTION</div>
        <div style={{fontSize:13,color:MOTIF_COLORS[seal.motif]}}>
          {seal.motif==="unicorn"?"◈ Market Common (commercial plaza)":seal.motif==="none"?"○ City-wide (universal ordinance)":seal.motif==="elephant"?"◉ Elephant Street":seal.motif==="gharial"?"◗ Riverine District":"◆ Bull Street"}
        </div>
      </div>
      <div style={S.confBar}><div style={S.confFill(seal.confidence)}/></div>
      <div style={{fontSize:10,color:"#3a4050",marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>confidence: {seal.confidence}</div>
    </div>
  );
}

function SignRegistry() {
  const [search,setSearch] = useState("");
  const [tf,setTf] = useState("all");
  const filtered = SIGN_FREQ_DATA.filter(s=>(tf==="all"||s.type===tf)&&(search===""||String(s.m).includes(search)||s.tamil.includes(search)||s.phoneme.toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      <div style={S.pageTitle}>Sign Registry</div>
      <div style={S.pageSub}>259 sign glyphs extracted from author's document · Mahadevan concordance</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>259</div><div style={S.statLabel}>Signs Extracted</div></div>
        <div style={S.statCard}><div style={S.statNum}>404</div><div style={S.statLabel}>Total in Corpus</div></div>
        <div style={S.statCard}><div style={S.statNum}>50+</div><div style={S.statLabel}>Unidentified</div></div>
        <div style={S.statCard}><div style={S.statNum}>1003</div><div style={S.statLabel}>Occurrences</div></div>
      </div>
      <div style={S.filterRow}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search M-number or phoneme…" style={{background:"#131822",border:"1px solid #1e2533",color:"#e8dcc8",padding:"5px 12px",fontSize:12,width:220,outline:"none"}}/>
        {["all","tally","compound","pictogram","geometric"].map(t=>(
          <button key={t} style={{...S.filterBtn(tf===t),borderLeft:`2px solid ${tf===t?SIGN_TYPE_COLORS[t]:"transparent"}`}} onClick={()=>setTf(t)}>{t}</button>
        ))}
      </div>
      <div style={{background:"#131822",border:"1px solid #1e2533"}}>
        <div style={{display:"flex",gap:12,padding:"8px 16px",borderBottom:"1px solid #1e2533",fontSize:10,color:"#3a4050",letterSpacing:"0.06em"}}>
          <span style={{width:64}}>GLYPH</span>
          <span style={{width:48}}>M-NO</span>
          <span style={{width:72}}>TYPE</span>
          <span style={{width:140}}>TAMIL PHONEME</span>
          <span style={{width:100}}>ROMAN</span>
          <span style={{flex:1}}>FREQUENCY</span>
        </div>
        {filtered.map(s=>(
          <div key={s.m} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid #0e1117"}}>
            <div style={{width:64,flexShrink:0}}><SignGlyph mahadevan={s.m} size={44} showLabel={false}/></div>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#c9963e",width:48,flexShrink:0}}>M-{s.m}</span>
            <span style={{width:72,fontSize:9,padding:"2px 6px",background:SIGN_TYPE_COLORS[s.type],color:"#fff",letterSpacing:"0.04em",height:"fit-content",flexShrink:0}}>{s.type}</span>
            <span style={{width:140,fontSize:13,flexShrink:0}}>{s.tamil}</span>
            <span style={{width:100,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#8090a8",flexShrink:0}}>{s.phoneme}</span>
            <div style={{flex:1}}><div style={{height:6,width:`${(s.freq/76)*100}%`,background:"#c9963e"}}/><span style={{fontSize:9,color:"#5a6070",fontFamily:"'JetBrains Mono',monospace"}}>{s.freq}</span></div>
          </div>
        ))}
      </div>
      <div style={{background:"#1a1612",border:"1px solid #3a2518",padding:"10px 14px",fontSize:12,color:"#8b6914",marginTop:16}}>
        ⚠ 50+ signs remain unidentified. Engine marks these as [M-N?] in output. Future research: comparative Tamil family study (Malayalam, Kannada, Telugu, Tulu, Brahui).
      </div>
    </div>
  );
}

function HypothesisViewer() {
  const [sel,setSel] = useState("VPS2024");
  const hyp = HYPOTHESES.find(h=>h.code===sel);
  const sampleReadings = {
    VPS2024:[{seal:"1076",reading:"thava ney",meaning:"very good ghee",conf:0.74},{seal:"2082",reading:"iisaa muu aakaavva",meaning:"carer of Shiva's 3 cows",conf:0.68},{seal:"2234",reading:"vayya illam",meaning:"the world is a big home",conf:0.70}],
    PARPOLA:[{seal:"1076",reading:"(undeciphered)",meaning:"probable Dravidian morpheme",conf:0.40},{seal:"2082",reading:"(undeciphered)",meaning:"animal husbandry context",conf:0.35},{seal:"2234",reading:"(undeciphered)",meaning:"–",conf:0.30}],
    FSW2004:[{seal:"1076",reading:"(non-linguistic)",meaning:"political/religious emblem",conf:0.0},{seal:"2082",reading:"(non-linguistic)",meaning:"clan mark",conf:0.0},{seal:"2234",reading:"(non-linguistic)",meaning:"–",conf:0.0}],
  };
  const readings = sampleReadings[sel]||sampleReadings.PARPOLA;
  return (
    <div>
      <div style={S.pageTitle}>Hypothesis Viewer</div>
      <div style={S.pageSub}>6 competing hypotheses · same corpus · no pre-selected winner</div>
      <div style={S.filterRow}>
        {HYPOTHESES.map(h=>(
          <button key={h.code} style={{...S.filterBtn(sel===h.code),borderLeft:`2px solid ${sel===h.code?h.color:"transparent"}`}} onClick={()=>setSel(h.code)}>{h.code}</button>
        ))}
      </div>
      {hyp && (
        <div>
          <div style={S.hypCard}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:hyp.color,marginBottom:4}}>{hyp.name}</div>
                <div style={{fontSize:11,color:"#5a6070"}}>{hyp.researcher} · {hyp.year}</div>
              </div>
              <div>
                {hyp.isNull && <span style={{fontSize:9,padding:"2px 8px",border:"1px solid #a0522d",color:"#a0522d",letterSpacing:"0.06em",marginRight:6}}>NULL HYPOTHESIS</span>}
                <span style={{fontSize:9,padding:"2px 8px",border:"1px solid #4a7c59",color:"#4a7c59",letterSpacing:"0.06em"}}>active</span>
              </div>
            </div>
            <div style={{fontSize:13,color:"#c8b89a",padding:"10px 0",borderTop:"1px solid #1e2533",marginTop:10}}>{hyp.claim}</div>
          </div>
          {hyp.isNull && <div style={{background:"#1a1612",border:"1px solid #8b4513",color:"#c8722a",padding:"10px 14px",fontSize:12,marginBottom:16}}>⚖ FSW2004 is the null hypothesis. VPS2024 rebuttal: brevity = purpose not limitation; singletons explained by modifier system; long-form writing on perishable materials.</div>}
          <div style={S.sectionHdr}>Same Seals Under Different Hypotheses</div>
          <div style={{background:"#131822",border:"1px solid #1e2533"}}>
            {readings.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:16,padding:"12px 16px",borderBottom:"1px solid #131822",alignItems:"center"}}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#c9963e",width:60,flexShrink:0}}>#{r.seal}</span>
                <span style={{width:180,fontFamily:"'JetBrains Mono',monospace",color:"#8090a8",fontSize:11}}>{r.reading}</span>
                <span style={{flex:1,color:r.conf>0?"#e8dcc8":"#3a4050",fontStyle:r.conf===0?"italic":"normal"}}>{r.meaning}</span>
                <div style={{width:80}}><div style={{height:3,background:"#1e2533"}}><div style={{height:"100%",width:`${r.conf*100}%`,background:hyp.color}}/></div><span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#5a6070"}}>{r.conf.toFixed(2)}</span></div>
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
      <div style={S.pageSub}>Corpus statistics · 179 seals · 1003 sign occurrences · Mohenjo-daro subset</div>
      <div style={S.twoCol}>
        <div style={S.chartBox}>
          <div style={S.chartTitle}>Top Signs by Frequency</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SIGN_FREQ_DATA} margin={{bottom:20}}>
              <XAxis dataKey="m" tickFormatter={v=>`M-${v}`} tick={{fontSize:8,fill:"#5a6070"}} angle={-45} textAnchor="end"/>
              <YAxis tick={{fontSize:9,fill:"#5a6070"}}/>
              <Tooltip contentStyle={{background:"#0d1017",border:"1px solid #1e2533",fontSize:11}} cursor={{fill:"#1a2030"}}
                content={({active,payload})=>{
                  if(active&&payload&&payload[0]){
                    const d=payload[0].payload;
                    return <div style={{background:"#0d1017",border:"1px solid #1e2533",padding:"8px 12px",fontSize:11}}>
                      <div style={{color:"#c9963e",marginBottom:4}}>M-{d.m}</div>
                      <div style={{color:"#e8dcc8"}}>{d.tamil}</div>
                      <div style={{color:"#8090a8",fontFamily:"'JetBrains Mono',monospace"}}>{d.phoneme}</div>
                      <div style={{color:"#5a6070"}}>freq: {d.freq}</div>
                    </div>;
                  }
                  return null;
                }}
              />
              <Bar dataKey="freq" radius={[2,2,0,0]}>
                {SIGN_FREQ_DATA.map((s,i)=><Cell key={i} fill={SIGN_TYPE_COLORS[s.type]||"#c9963e"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.chartBox}>
          <div style={S.chartTitle}>Motif Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={MOTIF_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                {MOTIF_DATA.map((m,i)=><Cell key={i} fill={m.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0d1017",border:"1px solid #1e2533",fontSize:11}} cursor={{fill:"#1a2030"}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
            {MOTIF_DATA.map(m=><span key={m.name} style={{fontSize:9,color:m.color}}>■ {m.name} {m.value}%</span>)}
          </div>
        </div>
      </div>
      <div style={{...S.chartBox,marginTop:20}}>
        <div style={S.chartTitle}>Top Signs — With Glyphs</div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",padding:"8px 0"}}>
          {SIGN_FREQ_DATA.slice(0,12).map(s=>(
            <div key={s.m} style={{textAlign:"center"}}>
              <SignGlyph mahadevan={s.m} size={44} showLabel={false}/>
              <div style={{fontSize:8,color:"#c9963e",marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>M-{s.m}</div>
              <div style={{fontSize:8,color:"#8090a8"}}>{s.phoneme}</div>
              <div style={{fontSize:8,color:"#5a6070"}}>×{s.freq}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PeerReview() {
  return (
    <div>
      <div style={S.pageTitle}>Peer Review</div>
      <div style={S.pageSub}>Open platform · all objections logged · all responses public</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>3</div><div style={S.statLabel}>Open Objections</div></div>
        <div style={S.statCard}><div style={S.statNum}>1</div><div style={S.statLabel}>Addressed</div></div>
        <div style={S.statCard}><div style={S.statNum}>0</div><div style={S.statLabel}>Reviews In</div></div>
        <div style={S.statCard}><div style={S.statNum}>8</div><div style={S.statLabel}>Evidence Links</div></div>
      </div>
      <div style={{background:"#1a1612",border:"1px solid #3a2518",padding:"10px 14px",fontSize:12,color:"#8b6914",marginBottom:20}}>
        📬 Platform is accepting peer reviewers. Contact: vpshanmugham@yahoo.com · All reviews logged publicly.
      </div>
      {[{id:1,claim:"Tally-4 = phoneme 'na' via numeral name",obj:"Onomatopoeic derivation from numeral names is speculative.",rev:"Reviewer A",status:"addressed",resp:"Derivation is systematic: all 12 Tamil numeral names embed first syllable as phoneme. Documented in Research Keys §2.40–2.60 with 20+ seal examples."},{id:2,claim:"Unicorn motif = Market Common jurisdiction",obj:"Urban topology interpretation lacks archaeological corroboration.",rev:"Reviewer B",status:"open",resp:""},{id:3,claim:"Brevity = purpose (rebuttal of FSW2004)",obj:"Average of 5 signs per seal is consistent with non-linguistic emblems.",rev:"Reviewer C",status:"open",resp:""}].map(obj=>(
        <div key={obj.id} style={{...S.hypCard,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em"}}>CLAIM UNDER REVIEW</div>
            <span style={{fontSize:9,padding:"2px 8px",border:`1px solid ${obj.status==="addressed"?"#4a7c59":"#8b6914"}`,color:obj.status==="addressed"?"#4a7c59":"#8b6914",letterSpacing:"0.06em"}}>{obj.status.toUpperCase()}</span>
          </div>
          <div style={{fontSize:13,color:"#c9963e",marginBottom:10}}>"{obj.claim}"</div>
          <div style={{fontSize:10,color:"#5a6070",letterSpacing:"0.06em",marginBottom:4}}>OBJECTION — {obj.rev}</div>
          <div style={{fontSize:12,color:"#8090a8",marginBottom:obj.resp?12:0}}>{obj.obj}</div>
          {obj.resp && <><div style={{fontSize:10,color:"#4a7c59",letterSpacing:"0.06em",marginBottom:4}}>AUTHOR RESPONSE</div><div style={{fontSize:12,color:"#c8b89a",borderLeft:"2px solid #4a7c59",paddingLeft:10}}>{obj.resp}</div></>}
        </div>
      ))}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [page,setPage] = useState("seals");
  const [sel,setSel] = useState(null);
  const nav = [{id:"seals",icon:"◈",label:"Seal Browser"},{id:"signs",icon:"▦",label:"Sign Registry"},{id:"hyps",icon:"⚖",label:"Hypotheses"},{id:"charts",icon:"▬",label:"Frequency"},{id:"review",icon:"✍",label:"Peer Review"}];
  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoTitle}>OPEN<br/>INDUS<br/>LAB</div>
          <div style={S.logoSub}>Script Analysis Platform</div>
        </div>
        <div style={{padding:"16px 0"}}>
          {nav.map(n=><div key={n.id} style={S.navItem(page===n.id)} onClick={()=>setPage(n.id)}><span style={{fontSize:14,width:16}}>{n.icon}</span><span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.06em"}}>{n.label}</span></div>)}
        </div>
        <div style={{marginTop:"auto",padding:"16px 20px",borderTop:"1px solid #1e2533"}}>
          <div style={{fontSize:9,color:"#2a3040",letterSpacing:"0.06em",lineHeight:1.7}}>VPS2024 HYPOTHESIS<br/>Ponmuthu Shanmugham<br/><span style={{color:"#1e2533"}}>────────</span><br/>259 sign glyphs<br/>206 seals read<br/>6 hypotheses</div>
        </div>
      </div>
      <div style={S.main}>
        {page==="seals" && <div style={{display:"grid",gridTemplateColumns:sel?"1fr 360px":"1fr",gap:24}}>
          <SealBrowser onSelect={setSel} selected={sel}/>
          {sel && <SealDetail seal={sel} onClose={()=>setSel(null)}/>}
        </div>}
        {page==="signs"  && <SignRegistry/>}
        {page==="hyps"   && <HypothesisViewer/>}
        {page==="charts" && <FrequencyDashboard/>}
        {page==="review" && <PeerReview/>}
      </div>
    </div>
  );
}
