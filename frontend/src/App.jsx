import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── SIGN IMAGE DATA ───────────────────────────────────────
// Images from author's Indus_Signs_Reading.pdf
// Direct URL construction — glob relative paths break at /open-indus-lab/ base
const BASE = import.meta.env.BASE_URL || '/open-indus-lab/';
const getSignUrl = (n) => `${BASE}signs/sign_${String(n).padStart(4,'0')}.png`;

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

const ALL_SIGNS = [
  {m:342,tamil:"ஆ",type:"geometric",freq:99},
  {m:99,tamil:"கமற்படி- இரு",type:"tally",freq:76},
  {m:161,tamil:"ன",type:"geometric",freq:35},
  {m:267,tamil:"மீ",type:"geometric",freq:35},
  {m:59,tamil:"ள், ள",type:"geometric",freq:32},
  {m:87,tamil:"இரு. ஈர்",type:"tally",freq:27},
  {m:123,tamil:"ட,த",type:"tally",freq:22},
  {m:67,tamil:"லா",type:"geometric",freq:21},
  {m:65,tamil:"இள, இளம்",type:"geometric",freq:20},
  {m:211,tamil:"ன்,ன",type:"geometric",freq:18},
  {m:387,tamil:"ெய",type:"geometric",freq:17},
  {m:391,tamil:"ட்",type:"geometric",freq:17},
  {m:72,tamil:"ல",type:"geometric",freq:15},
  {m:89,tamil:"மூன்று,மு,மூ",type:"tally",freq:14},
  {m:287,tamil:"ட",type:"geometric",freq:14},
  {m:343,tamil:"அய்",type:"geometric",freq:14},
  {m:102,tamil:"மூன்று,மு,மூ",type:"tally",freq:13},
  {m:347,tamil:"ய்ய",type:"geometric",freq:11},
  {m:402,tamil:"ஆர்",type:"geometric",freq:11},
  {m:17,tamil:"தெ (தெம்)",type:"geometric",freq:10},
  {m:97,tamil:"ஓர்",type:"tally",freq:10},
  {m:403,tamil:"வ்ெ,ெவ்",type:"geometric",freq:10},
  {m:1,tamil:"க",type:"geometric",freq:9},
  {m:70,tamil:"ழ",type:"geometric",freq:9},
  {m:48,tamil:"ளார்",type:"geometric",freq:8},
  {m:51,tamil:"'கதளணஅ'",type:"geometric",freq:8},
  {m:86,tamil:"ஒன்று,ஓர்,ஒ,ஓ,ர்",type:"tally",freq:8},
  {m:296,tamil:"ட்ட",type:"geometric",freq:7},
  {m:15,tamil:"ஆகாவ்ெ",type:"compound",freq:6},
  {m:108,tamil:"ஆறு",type:"tally",freq:6},
  {m:171,tamil:"ண,ணா",type:"geometric",freq:6},
  {m:230,tamil:"'மலய்'",type:"pictogram",freq:6},
  {m:249,tamil:"ப",type:"geometric",freq:6},
  {m:254,tamil:"ண, ணி",type:"geometric",freq:6},
  {m:293,tamil:"ட்",type:"geometric",freq:6},
  {m:8,tamil:"கய்",type:"geometric",freq:5},
  {m:60,tamil:"ளம்,ளன்,ளல்,ளர்",type:"modifier",freq:5},
  {m:204,tamil:"ககாயில்",type:"pictogram",freq:5},
  {m:233,tamil:"மு, மூ",type:"geometric",freq:5},
  {m:244,tamil:"பண்ண",type:"geometric",freq:5},
  {m:12,tamil:"காவ்ெ,காெல்",type:"compound",freq:4},
  {m:28,tamil:"கம",type:"geometric",freq:4},
  {m:53,tamil:"ம",type:"geometric",freq:4},
  {m:103,tamil:"மூன்று,மு,மூ",type:"tally",freq:4},
  {m:104,tamil:"நான்கு,ந,நா",type:"tally",freq:4},
  {m:106,tamil:"அய்,அய்ந்து",type:"tally",freq:4},
  {m:110,tamil:"ஏழு, ஏ,எ",type:"tally",freq:4},
  {m:121,tamil:"பன்னிரு",type:"tally",freq:4},
  {m:124,tamil:"த",type:"tally",freq:4},
  {m:173,tamil:"ண்ண",type:"geometric",freq:4},
  {m:176,tamil:"ண்,ண,மண",type:"geometric",freq:4},
  {m:197,tamil:"ந",type:"geometric",freq:4},
  {m:215,tamil:"ஈசா",type:"geometric",freq:4},
  {m:261,tamil:"ம",type:"geometric",freq:4},
  {m:25,tamil:"கர்",type:"geometric",freq:3},
  {m:81,tamil:"மயிலட்ட",type:"pictogram",freq:3},
  {m:127,tamil:"ர",type:"geometric",freq:3},
  {m:155,tamil:"ன,ன்",type:"geometric",freq:3},
  {m:182,tamil:"பண்ணா",type:"geometric",freq:3},
  {m:194,tamil:"ஞான் (இளஞன்)",type:"geometric",freq:3},
  {m:216,tamil:"ச",type:"geometric",freq:3},
  {m:224,tamil:"சங்கரா (வெண்மம)",type:"geometric",freq:3},
  {m:303,tamil:"ட்ட,டட்",type:"geometric",freq:3},
  {m:327,tamil:"'அரச ண அ",type:"geometric",freq:3},
  {m:344,tamil:"அவ்",type:"geometric",freq:3},
  {m:348,tamil:"யண்ண,ண்மண",type:"geometric",freq:3},
  {m:381,tamil:"ெண்,ெண",type:"geometric",freq:3},
  {m:11,tamil:"கற்ற",type:"compound",freq:2},
  {m:19,tamil:"கண(கண்ண)",type:"geometric",freq:2},
  {m:32,tamil:"கவ் (வகௌ)",type:"compound",freq:2},
  {m:57,tamil:"'எறம்ப' = எருமம",type:"pictogram",freq:2},
  {m:96,tamil:"அய்,அய்ந்து",type:"tally",freq:2},
  {m:114,tamil:"எட்டு, எண்",type:"tally",freq:2},
  {m:130,tamil:"ற்,ற",type:"geometric",freq:2},
  {m:160,tamil:"தண்ன,தன்ண",type:"geometric",freq:2},
  {m:242,tamil:"வதாழு",type:"geometric",freq:2},
  {m:264,tamil:"தம,தம்",type:"geometric",freq:2},
  {m:286,tamil:"தெதம்",type:"geometric",freq:2},
  {m:294,tamil:"ட்ட",type:"geometric",freq:2},
  {m:307,tamil:"ம",type:"geometric",freq:2},
  {m:325,tamil:"அரச",type:"geometric",freq:2},
  {m:328,tamil:"அ",type:"geometric",freq:2},
  {m:367,tamil:"ெவ்யெ",type:"geometric",freq:2},
  {m:3,tamil:"க், கர்",type:"geometric",freq:1},
  {m:4,tamil:"கண்",type:"geometric",freq:1},
  {m:7,tamil:"கீ",type:"geometric",freq:1},
  {m:9,tamil:"கய்ட்ட",type:"geometric",freq:1},
  {m:18,tamil:"கா",type:"geometric",freq:1},
  {m:26,tamil:"கரர், காரர்",type:"geometric",freq:1},
  {m:30,tamil:"கம",type:"compound",freq:1},
  {m:34,tamil:"கய்",type:"geometric",freq:1},
  {m:36,tamil:"கச",type:"geometric",freq:1},
  {m:38,tamil:"கண்,கண்ண",type:"geometric",freq:1},
  {m:41,tamil:"கர், கர",type:"geometric",freq:1},
  {m:47,tamil:"ெர, ெர்",type:"geometric",freq:1},
  {m:50,tamil:"\"ணாய்\"",type:"geometric",freq:1},
  {m:62,tamil:"ட்டள்",type:"geometric",freq:1},
  {m:66,tamil:"இளம், இல்லம்",type:"geometric",freq:1},
  {m:75,tamil:"இலி",type:"geometric",freq:1},
  {m:76,tamil:"ககாழி (ககாழியூர்)",type:"pictogram",freq:1},
  {m:80,tamil:"மயில்",type:"pictogram",freq:1},
  {m:111,tamil:"எழுட்ட",type:"tally",freq:1},
  {m:143,tamil:"இருதஅம் அம்(ன்,ல்,ர்)",type:"modifier",freq:1},
  {m:144,tamil:"இருதட்ட",type:"geometric",freq:1},
  {m:159,tamil:"இயன்",type:"geometric",freq:1},
  {m:163,tamil:"இய",type:"geometric",freq:1},
  {m:177,tamil:"ரீ",type:"geometric",freq:1},
  {m:198,tamil:"நண்",type:"geometric",freq:1},
  {m:206,tamil:"ககாயில்ண்[ண]",type:"pictogram",freq:1},
  {m:209,tamil:"ககாயில்",type:"pictogram",freq:1},
  {m:219,tamil:"சி",type:"geometric",freq:1},
  {m:221,tamil:"சா",type:"geometric",freq:1},
  {m:223,tamil:"சங்ங",type:"geometric",freq:1},
  {m:228,tamil:"சச்",type:"geometric",freq:1},
  {m:235,tamil:"மூய",type:"geometric",freq:1},
  {m:252,tamil:"பண",type:"geometric",freq:1},
  {m:284,tamil:"தம், தமீ",type:"geometric",freq:1},
  {m:288,tamil:"ட்",type:"geometric",freq:1},
  {m:298,tamil:"டட்டட்ட",type:"geometric",freq:1},
  {m:304,tamil:"ம,ம்",type:"geometric",freq:1},
  {m:306,tamil:"மீர்",type:"geometric",freq:1},
  {m:311,tamil:"'யாழ்'",type:"geometric",freq:1},
  {m:329,tamil:"அவ்",type:"geometric",freq:1},
  {m:345,tamil:"ஆமூ",type:"geometric",freq:1},
  {m:349,tamil:"ய்யர்",type:"geometric",freq:1},
  {m:392,tamil:"தெஇருென்(ர்)",type:"geometric",freq:1},
  {m:404,tamil:"வ்ென்,வ்ெர்",type:"geometric",freq:1},
  {m:2,tamil:"ரகர், கரர், காரர்",type:"geometric",freq:0},
  {m:5,tamil:"கண்",type:"geometric",freq:0},
  {m:6,tamil:"கி",type:"geometric",freq:0},
  {m:10,tamil:"கா",type:"compound",freq:0},
  {m:13,tamil:"காவ்ெர்",type:"compound",freq:0},
  {m:14,tamil:"காவ்ென்",type:"compound",freq:0},
  {m:20,tamil:"கண்ணர்",type:"geometric",freq:0},
  {m:21,tamil:"கய",type:"geometric",freq:0},
  {m:22,tamil:"கண",type:"geometric",freq:0},
  {m:23,tamil:"கரி",type:"geometric",freq:0},
  {m:24,tamil:"ரிகரி",type:"geometric",freq:0},
  {m:27,tamil:"கட",type:"geometric",freq:0},
  {m:29,tamil:"மகம, கமகம",type:"compound",freq:0},
  {m:31,tamil:"கவ்ெ",type:"compound",freq:0},
  {m:33,tamil:"அகெ",type:"compound",freq:0},
  {m:35,tamil:"கண",type:"geometric",freq:0},
  {m:37,tamil:"கமண",type:"geometric",freq:0},
  {m:39,tamil:"வக, கக",type:"geometric",freq:0},
  {m:40,tamil:"கண,கண்ண",type:"geometric",freq:0},
  {m:42,tamil:"தெகதெ",type:"geometric",freq:0},
  {m:43,tamil:"கண",type:"geometric",freq:0},
  {m:49,tamil:"முக'",type:"geometric",freq:0},
  {m:52,tamil:"'கதளனர்'",type:"geometric",freq:0},
  {m:58,tamil:"தெ (early form)",type:"geometric",freq:0},
  {m:61,tamil:"நலம்,நலன்",type:"modifier",freq:0},
  {m:63,tamil:"மயிலட்டள்",type:"geometric",freq:0},
  {m:64,tamil:"மயிலட்டள்",type:"geometric",freq:0},
  {m:68,tamil:"லாம்,லான்,லால்,லார்",type:"modifier",freq:0},
  {m:69,tamil:"லி",type:"geometric",freq:0},
  {m:71,tamil:"ழம்,ழன்,ழல்,ழர்",type:"modifier",freq:0},
  {m:73,tamil:"லம்.லன்.லல்,லர்",type:"modifier",freq:0},
  {m:74,tamil:"லி",type:"geometric",freq:0},
  {m:78,tamil:"மயில்",type:"pictogram",freq:0},
  {m:79,tamil:"மயில்",type:"pictogram",freq:0},
  {m:82,tamil:"ெ அன்னம்=ெனம்",type:"pictogram",freq:0},
  {m:84,tamil:"கால் = காற்று",type:"pictogram",freq:0},
  {m:88,tamil:"இரும்",type:"tally",freq:0},
  {m:90,tamil:"மூய=எருது",type:"tally",freq:0},
  {m:91,tamil:"முரா=கமார்",type:"tally",freq:0},
  {m:92,tamil:"இமூ",type:"tally",freq:0},
  {m:93,tamil:"ஓரிரு",type:"tally",freq:0},
  {m:94,tamil:"இருஓர்",type:"tally",freq:0},
  {m:95,tamil:"நான்கு,ந,நா",type:"tally",freq:0},
  {m:98,tamil:"கமற்ப்டி -ஒரு",type:"tally",freq:0},
  {m:100,tamil:"இரு",type:"tally",freq:0},
  {m:101,tamil:"இரு",type:"tally",freq:0},
  {m:105,tamil:"நான்கு,நா,ந",type:"tally",freq:0},
  {m:107,tamil:"அய்,அய்ந்து",type:"tally",freq:0},
  {m:109,tamil:"ஆறு, நதி",type:"tally",freq:0},
  {m:112,tamil:"ஏழு, ஏ,எ",type:"tally",freq:0},
  {m:113,tamil:"எழுட்ட",type:"tally",freq:0},
  {m:115,tamil:"வதாண்டு",type:"tally",freq:0},
  {m:116,tamil:"வதாண்டு",type:"tally",freq:0},
  {m:117,tamil:"வதாண்டுப",type:"tally",freq:0},
  {m:122,tamil:"பன்னிருட்ட",type:"tally",freq:0},
  {m:125,tamil:"த",type:"geometric",freq:0},
  {m:126,tamil:"த",type:"geometric",freq:0},
  {m:128,tamil:"ரி",type:"geometric",freq:0},
  {m:129,tamil:"ர",type:"geometric",freq:0},
  {m:137,tamil:"த",type:"geometric",freq:0},
  {m:138,tamil:"இத",type:"geometric",freq:0},
  {m:139,tamil:"பத",type:"geometric",freq:0},
  {m:140,tamil:"தஅம்அம், தஅன்அன்",type:"modifier",freq:0},
  {m:141,tamil:"இருத",type:"geometric",freq:0},
  {m:142,tamil:"இருதப",type:"geometric",freq:0},
  {m:145,tamil:"இருதண்",type:"geometric",freq:0},
  {m:153,tamil:"ன,ன்",type:"geometric",freq:0},
  {m:156,tamil:"னட்ட",type:"geometric",freq:0},
  {m:158,tamil:"தர், இன்",type:"geometric",freq:0},
  {m:162,tamil:"ய்,ய",type:"geometric",freq:0},
  {m:164,tamil:"யஅம்அம்,(அன்,ல்,ர்)",type:"modifier",freq:0},
  {m:167,tamil:"ய்ய",type:"geometric",freq:0},
  {m:169,tamil:"னி",type:"geometric",freq:0},
  {m:172,tamil:"ணண்",type:"geometric",freq:0},
  {m:175,tamil:"ெய",type:"geometric",freq:0},
  {m:190,tamil:"'கெலி'=நில அளமெ",type:"pictogram",freq:0},
  {m:205,tamil:"ண,ணய்",type:"geometric",freq:0},
  {m:207,tamil:"ககாயிலண்ணல்",type:"pictogram",freq:0},
  {m:210,tamil:"ககாயில்",type:"pictogram",freq:0},
  {m:212,tamil:"பன்,பன",type:"geometric",freq:0},
  {m:213,tamil:"யன்",type:"geometric",freq:0},
  {m:214,tamil:"ச்,ச",type:"geometric",freq:0},
  {m:217,tamil:"ச்ச",type:"geometric",freq:0},
  {m:220,tamil:"சிெம்,சிென்",type:"geometric",freq:0},
  {m:222,tamil:"சா",type:"geometric",freq:0},
  {m:225,tamil:"ச,ச்",type:"geometric",freq:0},
  {m:226,tamil:"சி",type:"geometric",freq:0},
  {m:227,tamil:"சரி",type:"geometric",freq:0},
  {m:229,tamil:"ஈ",type:"geometric",freq:0},
  {m:231,tamil:"'மலயமலய்'",type:"pictogram",freq:0},
  {m:232,tamil:"\"மலய் அரச'",type:"pictogram",freq:0},
  {m:243,tamil:"அ வதாழு",type:"geometric",freq:0},
  {m:245,tamil:"'இட'",type:"geometric",freq:0},
  {m:246,tamil:"'இடர்'",type:"geometric",freq:0},
  {m:250,tamil:"பம்,பன்,பல்,பர்",type:"modifier",freq:0},
  {m:251,tamil:"பச",type:"geometric",freq:0},
  {m:257,tamil:"பண்ணய்",type:"geometric",freq:0},
  {m:258,tamil:"பண்ணய்",type:"geometric",freq:0},
  {m:259,tamil:"பண்ணய்",type:"geometric",freq:0},
  {m:262,tamil:"மய",type:"geometric",freq:0},
  {m:266,tamil:"மன",type:"geometric",freq:0},
  {m:270,tamil:"மீய",type:"geometric",freq:0},
  {m:285,tamil:"தமம்,தமன்,தமர்",type:"modifier",freq:0},
  {m:289,tamil:"டஅம்அம்(அன்,அல்,அர்)",type:"modifier",freq:0},
  {m:290,tamil:"டீ",type:"geometric",freq:0},
  {m:295,tamil:"டட்",type:"geometric",freq:0},
  {m:297,tamil:"ட்டண்",type:"geometric",freq:0},
  {m:299,tamil:"ட",type:"geometric",freq:0},
  {m:300,tamil:"ட்,டி",type:"geometric",freq:0},
  {m:302,tamil:"டர்",type:"geometric",freq:0},
  {m:305,tamil:"வம",type:"geometric",freq:0},
  {m:308,tamil:"மஅம்அம்(அன்,அல்,அர்)",type:"modifier",freq:0},
  {m:309,tamil:"ஈ",type:"geometric",freq:0},
  {m:321,tamil:"ெவ்,வ்ெ",type:"geometric",freq:0},
  {m:322,tamil:"ெென்,வ்ென்",type:"geometric",freq:0},
  {m:323,tamil:"அரச",type:"geometric",freq:0},
  {m:324,tamil:"அரசன",type:"geometric",freq:0},
  {m:326,tamil:"அரச",type:"geometric",freq:0},
  {m:330,tamil:"அமூ",type:"geometric",freq:0},
  {m:331,tamil:"அன",type:"geometric",freq:0},
  {m:340,tamil:"அய் (old form)",type:"geometric",freq:0},
  {m:351,tamil:"யவ்ெ,ெவ்ய",type:"geometric",freq:0},
  {m:352,tamil:"ஆய,யா",type:"geometric",freq:0},
  {m:355,tamil:"தெய்ய",type:"geometric",freq:0},
  {m:356,tamil:"இதய்ய",type:"geometric",freq:0},
  {m:357,tamil:"தய்ய",type:"geometric",freq:0},
  {m:358,tamil:"ண்ண",type:"geometric",freq:0},
  {m:363,tamil:"மன்ன",type:"geometric",freq:0},
  {m:372,tamil:"வ்ெவ்யய்",type:"geometric",freq:0},
  {m:373,tamil:"ெ",type:"geometric",freq:0},
  {m:382,tamil:"ெண்ண",type:"geometric",freq:0},
  {m:385,tamil:"ென",type:"geometric",freq:0},
  {m:388,tamil:"ெயல்",type:"geometric",freq:0},
  {m:389,tamil:"ென",type:"geometric",freq:0},
  {m:390,tamil:"ெனம்",type:"geometric",freq:0},
  {m:393,tamil:"தெஅவ்",type:"geometric",freq:0},
  {m:3411,tamil:"பண்,பண",type:"geometric",freq:0},
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
  const imgSrc = getSignUrl(mahadevan);
  const type = getSignType(mahadevan);
  const info = SIGN_DATA[mahadevan];
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}
         title={`M-${mahadevan}${info ? " · " + info.phoneme : ""}`}>
      <div style={{
        width:size, height:size,
        background: loaded && !errored ? "#f5f0e8" : "#1a2030",
        border:`1px solid ${SIGN_TYPE_COLORS[type]||"#2a3040"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden", flexShrink:0, position:"relative",
      }}>
        <img
          src={imgSrc}
          alt={"M-" + mahadevan}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            width:size-6, height:size-6,
            objectFit:"contain",
            display: loaded && !errored ? "block" : "none",
          }}
        />
        {(!loaded || errored) && (
          <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",
            color:SIGN_TYPE_COLORS[type],fontWeight:700}}>
            {mahadevan}
          </span>
        )}
      </div>
      {showLabel && info && (
        <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",
          color:"#5a6070",textAlign:"center",maxWidth:size}}>
          {info.phoneme}
        </span>
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

// ── SPEECH ────────────────────────────────────────────────
function speak(text, lang="en-US", rate=0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  u.pitch = 1;
  // Try Tamil voice if available
  if (lang === "ta-IN") {
    const voices = window.speechSynthesis.getVoices();
    const tamil = voices.find(v => v.lang.startsWith("ta"));
    if (tamil) u.voice = tamil;
  }
  window.speechSynthesis.speak(u);
}

function SpeakBtn({ text, lang="en-US", label="", rate=0.85 }) {
  const [speaking, setSpeaking] = useState(false);
  const handleClick = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    setSpeaking(true);
    speak(text, lang, rate);
    // Reset after ~3 seconds
    setTimeout(() => setSpeaking(false), text.length * 80 + 800);
  };
  return (
    <button onClick={handleClick} title={`Listen: ${label||text}`} style={{
      background: speaking ? "#c9963e" : "#1a2030",
      border: `1px solid ${speaking?"#c9963e":"#2a3040"}`,
      color: speaking ? "#0e1117" : "#8090a8",
      borderRadius: "50%", width:28, height:28,
      cursor:"pointer", fontSize:13, flexShrink:0,
      display:"inline-flex", alignItems:"center", justifyContent:"center",
    }}>
      {speaking ? "■" : "▶"}
    </button>
  );
}

// ── TALLY EXPLANATION ─────────────────────────────────────
const TALLY_NAMES = {
  86:"onRu (1) → o/oo", 97:"oor (1) → o",
  87:"iru (2) → i/ii",  99:"iru (2) → i",100:"iru (2) → i",101:"iru (2) → i",
  89:"munRu (3) → mu/muu", 102:"munRu (3) → mu/muu",103:"munRu (3) → mu/muu",
  95:"nanku (4) → na/naa", 104:"nanku (4) → na/naa",105:"nanku (4) → na/naa",
  96:"aintu (5) → ai/ay", 106:"aintu (5) → ai/ay",107:"aintu (5) → ai",
  108:"aaRu (6) → a/aa — also means river",109:"aaRu (6) → a/aa",
  110:"eLzu (7) → e/ee",112:"eLzu (7) → e/ee",
  114:"ettu (8) → eN — also sesame",
  115:"toNdu (9) → to",116:"toNdu (9) → to",117:"toNdu (9) → to",
  121:"panniru (12) → panniru",122:"panniru (12) → panniru",
};

const MOTIF_DETAIL = {
  unicorn: { icon:"◈", name:"Unicorn", jurisdiction:"Market Common", desc:"Central commercial plaza. Laws, dairy, cattle, facilities, skilled workers.", color:"#c9963e" },
  elephant:{ icon:"◉", name:"Elephant", jurisdiction:"Elephant Street", desc:"Ghee sheds and sesame oil production. Seal 2648 (ghee shed) and 2127 (sesame oil).", color:"#4a7c59" },
  bull:    { icon:"◆", name:"Bull", jurisdiction:"Bull Street", desc:"Fresh milk, ox pens, market banners.", color:"#a0522d" },
  zebu:    { icon:"◇", name:"Zebu", jurisdiction:"High-value Cattle District", desc:"Premium livestock sheds.", color:"#8b6914" },
  tiger:   { icon:"▲", name:"Tiger", jurisdiction:"Tiger District", desc:"High-value cattle, premium products.", color:"#b85450" },
  gharial: { icon:"◗", name:"Gharial", jurisdiction:"Riverine District", desc:"Laws governing river facility usage. Seal 2864.", color:"#4a6b7c" },
  none:    { icon:"○", name:"No motif", jurisdiction:"City-wide", desc:"Universal ordinance — not location-restricted. Curfews, guild laws, welfare mandates.", color:"#8090a8" },
};

// ── SEAL DETAIL (COMPLETE) ────────────────────────────────
function SealDetail({seal, onClose}) {
  const [tab, setTab] = useState("reading");

  if(!seal) return (
    <div style={{...S.detail, color:"#3a4050", textAlign:"center", padding:40}}>
      <div style={{fontFamily:"'Cinzel',serif", fontSize:14, letterSpacing:"0.1em"}}>SELECT A SEAL</div>
      <div style={{fontSize:11, color:"#2a3040", marginTop:8}}>Tap any seal card to view its full reading, sign breakdown, and sounds</div>
    </div>
  );

  const motifInfo = MOTIF_DETAIL[seal.motif] || MOTIF_DETAIL.none;
  const hasTally  = seal.signs.some(m => TALLY_NAMES[m]);

  // Build readable phoneme for speech
  const phonemeForSpeech = seal.layer1.replace(/→/g," means ").replace(/[·,]/g," ");
  const meaningForSpeech = seal.layer2 !== "[meaning pending]" ? seal.layer2 : "";

  const tabs = ["reading", "signs", "evidence"];

  return (
    <div style={S.detail}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16}}>
        <div>
          <div style={{fontFamily:"'Cinzel',serif", fontSize:20, color:"#c9963e", letterSpacing:"0.08em"}}>
            Seal #{seal.id}
          </div>
          <div style={{fontSize:11, color:"#5a6070", marginTop:2}}>
            {seal.site} · {seal.signs.length} signs · <span style={{color:motifInfo.color}}>{motifInfo.icon} {seal.motif}</span>
          </div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#5a6070",cursor:"pointer",fontSize:20,padding:"0 4px"}}>✕</button>
      </div>

      {/* ── TABS ───────────────────────────────────────── */}
      <div style={{display:"flex", gap:0, marginBottom:20, borderBottom:"1px solid #1e2533"}}>
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{
            background:"none", border:"none", borderBottom: tab===t?"2px solid #c9963e":"2px solid transparent",
            color:tab===t?"#c9963e":"#5a6070", padding:"8px 16px",
            cursor:"pointer", fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase",
            fontFamily:"'Cinzel',serif",
          }}>
            {t==="reading"?"Reading":t==="signs"?"Signs":"Evidence"}
          </button>
        ))}
      </div>

      {/* ══ TAB: READING ════════════════════════════════ */}
      {tab==="reading" && (
        <div>

          {/* Sign strip — compact */}
          <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:20}}>
            {seal.signs.map((m,i) => (
              <div key={i} style={{textAlign:"center"}}>
                <SignGlyph mahadevan={m} size={44} showLabel={false}/>
                <div style={{fontSize:8, color:"#c9963e", marginTop:2, fontFamily:"'JetBrains Mono',monospace"}}>
                  {SIGN_DATA[m]?.phoneme || `M-${m}`}
                </div>
              </div>
            ))}
          </div>

          {/* Layer 1 — Phoneme */}
          <div style={{background:"#0d1017", border:"1px solid #1e2533", padding:16, marginBottom:12}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
              <span style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em"}}>LAYER 1 — PHONEME (SOUND)</span>
              <SpeakBtn text={phonemeForSpeech} lang="en-US" label="phoneme string" rate={0.75}/>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:16, color:"#c9963e", marginBottom:6}}>
              {seal.layer1}
            </div>
            <div style={{fontSize:10, color:"#5a6070"}}>
              Tamil script reading — complete ✓
            </div>
          </div>

          {/* Layer 2 — Morpheme */}
          <div style={{background:"#0d1017", border:`1px solid ${seal.status==="complete"?"#1e2533":"#2a2010"}`, padding:16, marginBottom:12}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
              <span style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em"}}>LAYER 2 — MORPHEME (MEANING)</span>
              {seal.status==="complete" && meaningForSpeech &&
                <SpeakBtn text={meaningForSpeech} lang="en-US" label="English meaning"/>}
            </div>
            {seal.status==="complete"
              ? <div style={{fontSize:18, color:"#e8dcc8", fontWeight:600, marginBottom:6}}>{seal.layer2}</div>
              : <div style={{fontSize:14, color:"#4a5060", fontStyle:"italic", marginBottom:6}}>
                  [meaning pending — Tamil phoneme reading above is complete]
                </div>
            }
            {seal.domain && <div style={S.domainBadge(seal.domain)}>{seal.domain}</div>}
          </div>

          {/* Jurisdiction */}
          <div style={{background:"#0d1017", border:"1px solid #1e2533", padding:16, marginBottom:12}}>
            <div style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em", marginBottom:8}}>JURISDICTION</div>
            <div style={{display:"flex", alignItems:"flex-start", gap:12}}>
              <span style={{fontSize:28, color:motifInfo.color}}>{motifInfo.icon}</span>
              <div>
                <div style={{fontSize:15, color:motifInfo.color, fontWeight:600, marginBottom:4}}>
                  {motifInfo.jurisdiction}
                </div>
                <div style={{fontSize:12, color:"#8090a8", lineHeight:1.5}}>
                  {motifInfo.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Tally marks */}
          {hasTally && (
            <div style={{background:"#0d1017", border:"1px solid #c9963e22", padding:16, marginBottom:12}}>
              <div style={{fontSize:10, color:"#c9963e", letterSpacing:"0.06em", marginBottom:10}}>
                TALLY MARK PHONETICS
              </div>
              <div style={{fontSize:11, color:"#8090a8", marginBottom:8, lineHeight:1.5}}>
                Tally marks encode Tamil numeral names as phonemes — not just counting strokes.
              </div>
              {seal.signs.filter(m => TALLY_NAMES[m]).map((m,i) => (
                <div key={i} style={{display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderTop:"1px solid #1a2030"}}>
                  <SignGlyph mahadevan={m} size={32} showLabel={false}/>
                  <div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#c9963e"}}>M-{m}</span>
                    <span style={{fontSize:11, color:"#8090a8", marginLeft:8}}>{TALLY_NAMES[m]}</span>
                  </div>
                  <SpeakBtn text={TALLY_NAMES[m].split("→")[1]?.trim()||""} lang="en-US" rate={0.8}/>
                </div>
              ))}
            </div>
          )}

          {/* Confidence */}
          <div style={{display:"flex", alignItems:"center", gap:12, marginTop:4}}>
            <div style={{flex:1, height:4, background:"#1e2533", borderRadius:2}}>
              <div style={{height:"100%", width:`${seal.confidence*100}%`,
                background:seal.confidence>0.7?"#c9963e":seal.confidence>0.6?"#8b6914":"#a0522d",
                borderRadius:2}}/>
            </div>
            <span style={{fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:"#5a6070", flexShrink:0}}>
              confidence: {seal.confidence}
            </span>
          </div>

          {/* Full audio button */}
          {seal.status==="complete" && (
            <button
              onClick={() => {
                speak(`Seal ${seal.id}. Phoneme reading: ${phonemeForSpeech}. English meaning: ${meaningForSpeech}. Jurisdiction: ${motifInfo.jurisdiction}.`, "en-US", 0.8);
              }}
              style={{
                marginTop:16, width:"100%", padding:"10px",
                background:"#1a2030", border:"1px solid #c9963e",
                color:"#c9963e", cursor:"pointer", fontSize:12,
                letterSpacing:"0.06em", fontFamily:"'Cinzel',serif",
              }}
            >
              ▶ PLAY FULL READING
            </button>
          )}
        </div>
      )}

      {/* ══ TAB: SIGNS ══════════════════════════════════ */}
      {tab==="signs" && (
        <div>
          <div style={{fontSize:11, color:"#5a6070", marginBottom:16}}>
            Each sign below links to the author's Tamil phoneme mapping. Tap ▶ to hear the sound.
          </div>
          {seal.signs.map((m, i) => {
            const info = SIGN_DATA[m];
            const isTally = !!TALLY_NAMES[m];
            const type = getSignType(m);
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"12px 0", borderBottom:"1px solid #1a2030",
              }}>
                {/* Position */}
                <span style={{fontSize:11, color:"#3a4050", fontFamily:"'JetBrains Mono',monospace", width:16, flexShrink:0}}>
                  {i+1}
                </span>

                {/* Glyph */}
                <SignGlyph mahadevan={m} size={52} showLabel={false}/>

                {/* Info */}
                <div style={{flex:1}}>
                  <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:4}}>
                    <span style={{fontFamily:"'Cinzel',serif", fontSize:13, color:"#c9963e"}}>M-{m}</span>
                    <span style={{fontSize:9, padding:"1px 6px",
                      background:SIGN_TYPE_COLORS[type]||"#2a3040", color:"#fff",
                      letterSpacing:"0.04em"}}>
                      {type}
                    </span>
                    {isTally && <span style={{fontSize:9, color:"#c9963e"}}>tally</span>}
                  </div>
                  {info
                    ? <>
                        <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#e8dcc8", marginBottom:2}}>
                          {info.phoneme}
                        </div>
                        <div style={{fontSize:13, color:"#8090a8"}}>{info.tamil}</div>
                      </>
                    : <div style={{fontSize:11, color:"#3a4050", fontStyle:"italic"}}>phoneme not yet mapped</div>
                  }
                  {isTally && (
                    <div style={{fontSize:10, color:"#c9963e88", marginTop:4}}>
                      {TALLY_NAMES[m]}
                    </div>
                  )}
                </div>

                {/* Speak */}
                {info && (
                  <SpeakBtn
                    text={`${info.phoneme}. Tamil: ${info.tamil}`}
                    lang="en-US"
                    label={info.phoneme}
                    rate={0.75}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══ TAB: EVIDENCE ════════════════════════════════ */}
      {tab==="evidence" && (
        <div>
          <div style={{fontSize:11, color:"#5a6070", marginBottom:16, lineHeight:1.6}}>
            Academic sources supporting this reading under the VPS2024 hypothesis.
          </div>

          {/* Core citation */}
          <div style={{background:"#0d1017", border:"1px solid #1e2533", padding:16, marginBottom:12}}>
            <div style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em", marginBottom:8}}>PRIMARY SOURCE</div>
            <div style={{fontSize:13, color:"#e8dcc8", marginBottom:4}}>
              Shanmugham, Ponmuthu. <em>Reading Indus-Harappan Script: Research Keys.</em>
            </div>
            <div style={{fontSize:11, color:"#8090a8"}}>ISBN 979-8-9940362-9-7 · 2026</div>
          </div>

          {/* Corpus source */}
          <div style={{background:"#0d1017", border:"1px solid #1e2533", padding:16, marginBottom:12}}>
            <div style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em", marginBottom:8}}>SEAL CORPUS</div>
            <div style={{fontSize:13, color:"#e8dcc8", marginBottom:4}}>
              Indus Script Web Tool, Roja Muthiah Research Library (RMRL), Chennai.
            </div>
            <div style={{fontSize:11, color:"#8090a8"}}>www.indusscript.in · Consultant: Iravatham Mahadevan</div>
          </div>

          {/* Grammar */}
          <div style={{background:"#0d1017", border:"1px solid #1e2533", padding:16, marginBottom:12}}>
            <div style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em", marginBottom:8}}>GRAMMAR REFERENCE</div>
            <div style={{fontSize:13, color:"#e8dcc8", marginBottom:4}}>
              <em>Tholkaappiyam</em> — ancient Tamil grammar treatise.
            </div>
            <div style={{fontSize:11, color:"#8090a8"}}>
              Establishes 'aa' (ஆ) as ancient morpheme for cow, predating the written script.
            </div>
          </div>

          {/* Statistical support */}
          <div style={{background:"#0d1017", border:"1px solid #1e2533", padding:16, marginBottom:12}}>
            <div style={{fontSize:10, color:"#5a6070", letterSpacing:"0.06em", marginBottom:8}}>STATISTICAL SUPPORT</div>
            <div style={{fontSize:13, color:"#e8dcc8", marginBottom:4}}>
              Rao, R.P.N. et al. "Entropic Evidence for Linguistic Structure in the Indus Script."
            </div>
            <div style={{fontSize:11, color:"#8090a8"}}>Science 324:1165 · 2009 · DOI: 10.1126/science.1170391</div>
          </div>

          {/* Confidence note */}
          <div style={{background:"#1a1612", border:"1px solid #3a2518", padding:12, fontSize:11, color:"#8b6914", lineHeight:1.6}}>
            Confidence {seal.confidence} is a researcher estimate, not a statistically validated probability.
            Statistical validation (Stage 5 — Zipf test, motif co-occurrence) is planned but not yet complete.
          </div>
        </div>
      )}
    </div>
  );
}

function SignRegistry() {
  const [search, setSearch] = useState("");
  const [tf, setTf]         = useState("all");
  const [page, setPage]     = useState(0);
  const PAGE_SIZE = 48;

  const filtered = ALL_SIGNS.filter(s =>
    (tf === "all" || s.type === tf) &&
    (search === "" ||
      String(s.m).includes(search) ||
      s.tamil.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible    = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const maxFreq = Math.max(...ALL_SIGNS.map(s => s.freq), 1);

  return (
    <div>
      <div style={S.pageTitle}>Sign Registry</div>
      <div style={S.pageSub}>264 signs mapped · Mahadevan concordance · VPS2024 phonemes</div>

      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>264</div><div style={S.statLabel}>Signs Mapped</div></div>
        <div style={S.statCard}><div style={S.statNum}>404</div><div style={S.statLabel}>Total in Corpus</div></div>
        <div style={S.statCard}><div style={S.statNum}>50+</div><div style={S.statLabel}>Unidentified</div></div>
        <div style={S.statCard}><div style={S.statNum}>1003</div><div style={S.statLabel}>Occurrences</div></div>
      </div>

      <div style={S.filterRow}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search M-number or Tamil…"
          style={{background:"#131822",border:"1px solid #1e2533",color:"#e8dcc8",
                  padding:"6px 12px",fontSize:12,width:220,outline:"none"}}
        />
        {["all","tally","compound","pictogram","geometric","modifier"].map(t => (
          <button key={t}
            style={{...S.filterBtn(tf===t), borderLeft:`2px solid ${tf===t?SIGN_TYPE_COLORS[t]||"#c9963e":"transparent"}`}}
            onClick={() => { setTf(t); setPage(0); }}>
            {t}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{fontSize:11,color:"#5a6070",marginBottom:12}}>
        Showing {visible.length} of {filtered.length} signs
        {totalPages > 1 && ` · Page ${page+1}/${totalPages}`}
      </div>

      {/* Sign grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:10,marginBottom:16}}>
        {visible.map(s => (
          <div key={s.m} style={{
            background:"#131822", border:`1px solid ${SIGN_TYPE_COLORS[s.type]||"#1e2533"}`,
            padding:"10px 8px", textAlign:"center",
          }}>
            <SignGlyph mahadevan={s.m} size={56} showLabel={false} />
            <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#c9963e",marginTop:6}}>M-{s.m}</div>
            <div style={{fontSize:9,color:"#5a6070",marginTop:2,letterSpacing:"0.04em"}}>{s.type}</div>
            <div style={{fontSize:11,color:"#e8dcc8",marginTop:4,minHeight:16,lineHeight:1.3}}>{s.tamil}</div>
            {s.freq > 0 && (
              <div style={{marginTop:6,height:3,background:"#1e2533"}}>
                <div style={{height:"100%",width:`${(s.freq/maxFreq)*100}%`,background:"#c9963e"}}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
          <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0}
            style={{...S.filterBtn(false), opacity:page===0?0.3:1}}>← Prev</button>
          {Array.from({length:totalPages},(_,i) => (
            <button key={i} onClick={() => setPage(i)}
              style={{...S.filterBtn(page===i), minWidth:32}}>
              {i+1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages-1,p+1))} disabled={page===totalPages-1}
            style={{...S.filterBtn(false), opacity:page===totalPages-1?0.3:1}}>Next →</button>
        </div>
      )}

      <div style={{fontSize:10,color:"#3a4050",padding:"8px 0",borderTop:"1px solid #1e2533"}}>
        Note: 50+ signs remain unidentified — ongoing research. Future: comparative Tamil family study (Malayalam, Kannada, Telugu, Tulu, Brahui).
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

// ── MOBILE RESPONSIVE APP ────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("seals");
  const [sel, setSel]           = useState(null);
  const [sidebarOpen, setSidebar] = useState(false);

  const nav = [
    {id:"seals",  icon:"◈", label:"Seal Browser"},
    {id:"signs",  icon:"▦", label:"Sign Registry"},
    {id:"hyps",   icon:"⚖", label:"Hypotheses"},
    {id:"charts", icon:"▬", label:"Frequency"},
    {id:"review", icon:"✍", label:"Peer Review"},
  ];

  const navigate = (id) => {
    setPage(id);
    setSidebar(false);   // always close sidebar on navigation
    setSel(null);
  };

  return (
    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",background:"#0e1117",minHeight:"100vh",color:"#e8dcc8",display:"flex",flexDirection:"column"}}>

      {/* ── TOP BAR (mobile) ─────────────────────────────── */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"#0a0d13", borderBottom:"1px solid #1e2533",
        padding:"12px 16px", position:"sticky", top:0, zIndex:100,
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setSidebar(o => !o)}
          style={{background:"none",border:"none",color:"#c9963e",fontSize:22,cursor:"pointer",padding:"4px 8px",lineHeight:1}}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* Logo centre */}
        <span style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#c9963e",letterSpacing:"0.12em",fontWeight:700}}>
          OPEN INDUS LAB
        </span>

        {/* Current page label */}
        <span style={{fontSize:11,color:"#5a6070",letterSpacing:"0.06em",textTransform:"uppercase"}}>
          {nav.find(n=>n.id===page)?.label}
        </span>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div style={{display:"flex",flex:1,position:"relative",overflow:"hidden"}}>

        {/* ── OVERLAY (mobile, closes sidebar on tap) ────── */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebar(false)}
            style={{
              position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",
              zIndex:200,
            }}
          />
        )}

        {/* ── SIDEBAR ──────────────────────────────────────
            Desktop: always visible as a fixed left column.
            Mobile:  slides in from left as an overlay.
        ───────────────────────────────────────────────── */}
        <div style={{
          position:"fixed", top:0, left:0,
          width:220, height:"100vh",
          background:"#0a0d13", borderRight:"1px solid #1e2533",
          display:"flex", flexDirection:"column",
          zIndex:300,
          // Desktop: always shown via translate(0). Mobile: slide in/out.
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition:"transform 0.25s ease",
          // Desktop override via media query — applied inline isn't possible,
          // so we use a wrapper trick below for ≥768px
        }}
          className="sidebar"
        >
          {/* Close button inside sidebar (mobile) */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 0"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#c9963e",letterSpacing:"0.1em",fontWeight:700}}>
              OPEN<br/>INDUS<br/>LAB
            </div>
            <button
              onClick={() => setSidebar(false)}
              style={{background:"none",border:"none",color:"#5a6070",fontSize:18,cursor:"pointer"}}
            >✕</button>
          </div>
          <div style={{fontSize:10,color:"#5a6070",padding:"4px 20px 20px",letterSpacing:"0.06em",borderBottom:"1px solid #1e2533"}}>
            Script Analysis Platform
          </div>

          <div style={{padding:"16px 0",flex:1}}>
            {nav.map(n => (
              <div
                key={n.id}
                onClick={() => navigate(n.id)}
                style={{
                  display:"flex",alignItems:"center",gap:10,
                  padding:"12px 20px",cursor:"pointer",
                  fontSize:13,letterSpacing:"0.04em",
                  color:page===n.id?"#c9963e":"#8090a8",
                  background:page===n.id?"#13171f":"transparent",
                  borderLeft:page===n.id?"2px solid #c9963e":"2px solid transparent",
                }}
              >
                <span style={{fontSize:16,width:20}}>{n.icon}</span>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.06em"}}>{n.label}</span>
              </div>
            ))}
          </div>

          <div style={{padding:"16px 20px",borderTop:"1px solid #1e2533"}}>
            <div style={{fontSize:9,color:"#2a3040",letterSpacing:"0.06em",lineHeight:1.8}}>
              VPS2024 · Ponmuthu Shanmugham<br/>
              259 signs · 206 seals · 6 hypotheses
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────
            Left margin = 220px on desktop (sidebar width).
            On mobile sidebar is an overlay so no margin.
        ───────────────────────────────────────────────── */}
        <div
          className="main-content"
          style={{
            flex:1,
            overflow:"auto",
            padding:"20px 16px",
            // Desktop: pushed right by sidebar
            marginLeft:0,
          }}
        >
          {page==="seals" && (
            <div style={{
              display:"grid",
              gridTemplateColumns: sel ? "1fr" : "1fr",
              gap:20,
            }}>
              <SealBrowser onSelect={setSel} selected={sel}/>
              {sel && (
                <div>
                  <SealDetail seal={sel} onClose={()=>setSel(null)}/>
                </div>
              )}
            </div>
          )}
          {page==="signs"  && <SignRegistry/>}
          {page==="hyps"   && <HypothesisViewer/>}
          {page==="charts" && <FrequencyDashboard/>}
          {page==="review" && <PeerReview/>}
        </div>
      </div>

      {/* ── BOTTOM NAV BAR (mobile only) ─────────────────── */}
      <div style={{
        display:"flex", background:"#0a0d13",
        borderTop:"1px solid #1e2533",
        position:"sticky", bottom:0, zIndex:100,
      }}
        className="bottom-nav"
      >
        {nav.map(n => (
          <button
            key={n.id}
            onClick={() => navigate(n.id)}
            style={{
              flex:1, background:"none", border:"none",
              padding:"10px 4px 8px",
              color:page===n.id?"#c9963e":"#4a5060",
              cursor:"pointer", fontSize:18,
              borderTop:page===n.id?"2px solid #c9963e":"2px solid transparent",
            }}
            aria-label={n.label}
          >
            <div>{n.icon}</div>
            <div style={{fontSize:8,letterSpacing:"0.04em",marginTop:2,
              fontFamily:"'Cinzel',serif",
              color:page===n.id?"#c9963e":"#3a4050"}}>
              {n.label.split(" ")[0]}
            </div>
          </button>
        ))}
      </div>

      {/* ── RESPONSIVE CSS ───────────────────────────────── */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0) !important;
            position: fixed !important;
            top: 0 !important;
          }
          .main-content {
            margin-left: 220px !important;
            padding: 28px 32px !important;
          }
          .bottom-nav {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .sidebar {
            top: 0 !important;
          }
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}
