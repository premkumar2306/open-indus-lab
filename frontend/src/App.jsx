import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── SIGN IMAGE DATA ───────────────────────────────────────
// Images from author's Indus_Signs_Reading.pdf
// Direct URL construction — glob relative paths break at /open-indus-lab/ base
const BASE = import.meta.env.BASE_URL || '/open-indus-lab/';
const getSignUrl = (n) => `${BASE}signs/sign_${String(n).padStart(4,'0')}.png?v=3`;

// ── REAL DATA ─────────────────────────────────────────────
const SIGN_DATA = {
  1:{tamil:"க",phoneme:"ka"},
  2:{tamil:"ரகர், கரர், காரர்",phoneme:"rakar"},
  3:{tamil:"க், கர்",phoneme:"k"},
  4:{tamil:"கண்",phoneme:"kaN"},
  5:{tamil:"கண்",phoneme:"kaN"},
  6:{tamil:"கி",phoneme:"ki"},
  7:{tamil:"கீ",phoneme:"kii"},
  8:{tamil:"கய்",phoneme:"kay"},
  9:{tamil:"கய்ட்ட",phoneme:"kayTTa"},
  10:{tamil:"கா",phoneme:"kaa"},
  11:{tamil:"கற்ற",phoneme:"kaRRa"},
  12:{tamil:"காவ்வ,காவல்",phoneme:"kaavva"},
  13:{tamil:"காவ்வர்",phoneme:"kaavvar"},
  14:{tamil:"காவ்வன்",phoneme:"kaavvan"},
  15:{tamil:"ஆகாவ்வ",phoneme:"aakaavva"},
  17:{tamil:"தவ (தவம்)",phoneme:"thava (thavam)"},
  18:{tamil:"கா",phoneme:"kaa"},
  19:{tamil:"கண(கண்ண)",phoneme:"kaNa(kaNNa)"},
  20:{tamil:"கண்ணர்",phoneme:"kaNNar"},
  21:{tamil:"கய",phoneme:"kaya"},
  22:{tamil:"கண",phoneme:"kaNa"},
  23:{tamil:"கரி",phoneme:"kari"},
  24:{tamil:"ரிகரி",phoneme:"rikari"},
  25:{tamil:"கர்",phoneme:"kar"},
  53:{tamil:"ம",phoneme:"ma"},
  57:{tamil:"'எறம்ப' = எருமம",phoneme:"'eRampa' = erumama"},
  58:{tamil:"தவ (early form)",phoneme:"the (early form)"},
  59:{tamil:"ள், ள",phoneme:"L"},
  60:{tamil:"ளம்,ளன்,ளல்,ளர்",phoneme:"Lam"},
  61:{tamil:"நலம்,நலன்",phoneme:"nalam"},
  62:{tamil:"ட்டள்",phoneme:"TTaL"},
  63:{tamil:"மயிலட்டள்",phoneme:"mayilaTTaL"},
  64:{tamil:"மயிலட்டள்",phoneme:"mayilaTTaL"},
  65:{tamil:"இள, இளம்",phoneme:"iLa"},
  66:{tamil:"இளம், இல்லம்",phoneme:"iLam"},
  67:{tamil:"லா",phoneme:"laa"},
  68:{tamil:"லாம்,லான்,லால்,லார்",phoneme:"laam"},
  69:{tamil:"லி",phoneme:"li"},
  70:{tamil:"ழ",phoneme:"Lza"},
  71:{tamil:"ழம்,ழன்,ழல்,ழர்",phoneme:"Lzam"},
  72:{tamil:"ல",phoneme:"la"},
  73:{tamil:"லம்.லன்.லல்,லர்",phoneme:"lam.lan.lal"},
  74:{tamil:"லி",phoneme:"li"},
  75:{tamil:"இலி",phoneme:"ili"},
  76:{tamil:"கோழி (கோழியூர்)",phoneme:"kakaaLzi (kakaaLziyuur)"},
  78:{tamil:"மயில்",phoneme:"mayil"},
  79:{tamil:"மயில்",phoneme:"mayil"},
  80:{tamil:"மயில்",phoneme:"mayil"},
  81:{tamil:"மயிலட்ட",phoneme:"mayilaTTa"},
  105:{tamil:"நான்கு,நா,ந",phoneme:"naanku"},
  106:{tamil:"அய்,அய்ந்து",phoneme:"ay"},
  107:{tamil:"அய்,அய்ந்து",phoneme:"ay"},
  108:{tamil:"ஆறு",phoneme:"aaRu"},
  109:{tamil:"ஆறு, நதி",phoneme:"aaRu"},
  110:{tamil:"ஏழு, ஏ,எ",phoneme:"eeLzu"},
  111:{tamil:"எழுட்ட",phoneme:"eLzuTTa"},
  112:{tamil:"ஏழு, ஏ,எ",phoneme:"eeLzu"},
  113:{tamil:"எழுட்ட",phoneme:"eLzuTTa"},
  114:{tamil:"எட்டு, எண்",phoneme:"eTTu"},
  115:{tamil:"தொண்டு",phoneme:"vathaaNTu"},
  116:{tamil:"தொண்டு",phoneme:"vathaaNTu"},
  117:{tamil:"தொண்டுப",phoneme:"vathaaNTupa"},
  121:{tamil:"பன்னிரு",phoneme:"panniru"},
  122:{tamil:"பன்னிருட்ட",phoneme:"panniruTTa"},
  123:{tamil:"ட,த",phoneme:"Ta"},
  124:{tamil:"த",phoneme:"tha"},
  125:{tamil:"த",phoneme:"tha"},
  126:{tamil:"த",phoneme:"tha"},
  127:{tamil:"ர",phoneme:"ra"},
  128:{tamil:"ரி",phoneme:"ri"},
  129:{tamil:"ர",phoneme:"ra"},
  130:{tamil:"ற்,ற",phoneme:"R"},
  137:{tamil:"த",phoneme:"tha"},
  177:{tamil:"ரீ",phoneme:"rii"},
  182:{tamil:"பண்ணா",phoneme:"paNNaa"},
  190:{tamil:"'வேலி'=நில அளவை",phoneme:"'keli'=nila aLame"},
  194:{tamil:"ஞான் (இளஞன்)",phoneme:"njaan (iLanjan)"},
  197:{tamil:"ந",phoneme:"na"},
  198:{tamil:"நண்",phoneme:"naN"},
  210:{tamil:"கோயில்",phoneme:"kakaayil"},
  209:{tamil:"கோயில்",phoneme:"kakaayil"},
  204:{tamil:"கோயில்",phoneme:"kakaayil"},
  206:{tamil:"கோயிலண்ண",phoneme:"kakaayilN[Na]"},
  207:{tamil:"கோயிலண்ணல்",phoneme:"kakaayilaNNal"},
  211:{tamil:"ன்,ன",phoneme:"n"},
  205:{tamil:"ண,ணய்",phoneme:"Na"},
  212:{tamil:"பன்,பன",phoneme:"pan"},
  213:{tamil:"யன்",phoneme:"yan"},
  214:{tamil:"ச்,ச",phoneme:"s"},
  215:{tamil:"ஈசா",phoneme:"iisaa"},
  216:{tamil:"ச",phoneme:"sa"},
  217:{tamil:"ச்ச",phoneme:"ssa"},
  219:{tamil:"சி",phoneme:"si"},
  220:{tamil:"சிவம்,சிவன்",phoneme:"sim"},
  221:{tamil:"சா",phoneme:"saa"},
  222:{tamil:"சா",phoneme:"saa"},
  223:{tamil:"சங்ங",phoneme:"sangnga"},
  224:{tamil:"சங்கரா (வெண்மை)",phoneme:"sangkaraa (veNmama)"},
  264:{tamil:"தம,தம்",phoneme:"thama"},
  266:{tamil:"மன",phoneme:"mana"},
  267:{tamil:"மீ",phoneme:"mii"},
  270:{tamil:"மீய",phoneme:"miiya"},
  284:{tamil:"தம், தமீ",phoneme:"tham"},
  285:{tamil:"தமம்,தமன்,தமர்",phoneme:"thamam"},
  286:{tamil:"தவதம்",phoneme:"thavatham"},
  287:{tamil:"ட",phoneme:"Ta"},
  288:{tamil:"ட்",phoneme:"T"},
  289:{tamil:"டஅம்அம்(அன்,அல்,அர்)",phoneme:"Taamam(an"},
  290:{tamil:"டீ",phoneme:"Tii"},
  293:{tamil:"ட்",phoneme:"T"},
  294:{tamil:"ட்ட",phoneme:"TTa"},
  295:{tamil:"டட்",phoneme:"TaT"},
  296:{tamil:"ட்ட",phoneme:"TTa"},
  297:{tamil:"ட்டண்",phoneme:"TTaN"},
  298:{tamil:"டட்டட்ட",phoneme:"TaTTaTTa"},
  299:{tamil:"ட",phoneme:"Ta"},
  300:{tamil:"ட்,டி",phoneme:"T"},
  391:{tamil:"தவ",phoneme:"thava"},
  302:{tamil:"டர்",phoneme:"Tar"},
  303:{tamil:"ட்ட,டட்",phoneme:"TTa"},
  304:{tamil:"ம,ம்",phoneme:"ma"},
  305:{tamil:"வம",phoneme:"vama"},
  306:{tamil:"மீர்",phoneme:"miir"},
  352:{tamil:"ஆய,யா",phoneme:"aaya"},
  351:{tamil:"யவ்வ,வவ்ய",phoneme:"yavva"},
  355:{tamil:"தவய்ய",phoneme:"thavayya"},
  356:{tamil:"இதய்ய",phoneme:"ithayya"},
  357:{tamil:"தய்ய",phoneme:"thayya"},
  358:{tamil:"ண்ண",phoneme:"NNa"},
  363:{tamil:"மன்ன",phoneme:"manna"},
  367:{tamil:"வவ்யவ",phoneme:"vavyava"},
  372:{tamil:"வ்வவ்யய்",phoneme:"vvavyay"},
  373:{tamil:"வ",phoneme:"va"},
  382:{tamil:"வண்ண",phoneme:"vaNNa"},
  381:{tamil:"வண்,ெண",phoneme:"vaN"},
  385:{tamil:"வன",phoneme:"vana"},
  387:{tamil:"வய",phoneme:"vaya"},
  388:{tamil:"வயல்",phoneme:"vayal"},
  389:{tamil:"வன",phoneme:"vana"},
  390:{tamil:"வனம்",phoneme:"vanam"},
  392:{tamil:"தவஇருவன்(ர்)",phoneme:"thavairuvan(r)"},
  393:{tamil:"தவஅவ்",phoneme:"thavaav"},
  402:{tamil:"ஆர்",phoneme:"aar"},
  403:{tamil:"வ்வ,வவ்",phoneme:"vva"},
  404:{tamil:"வ்வன்,வ்வர்",phoneme:"vvan"},
  26:{tamil:"கரர், காரர்",phoneme:"karar"},
  27:{tamil:"கட",phoneme:"kaTa"},
  28:{tamil:"கம",phoneme:"kama"},
  29:{tamil:"மகம, கமகம",phoneme:"makama"},
  30:{tamil:"கம",phoneme:"kama"},
  31:{tamil:"கவ்வ",phoneme:"kavva"},
  32:{tamil:"கவ் (வகௌ)",phoneme:"kav (vakau)"},
  33:{tamil:"அகவ",phoneme:"akava"},
  34:{tamil:"கய்",phoneme:"kay"},
  35:{tamil:"கண",phoneme:"kaNa"},
  36:{tamil:"கச",phoneme:"kasa"},
  37:{tamil:"கமண",phoneme:"kamaNa"},
  38:{tamil:"கண்,கண்ண",phoneme:"kaN"},
  39:{tamil:"கெ, கே",phoneme:"ke"},
  40:{tamil:"கண,கண்ண",phoneme:"kaNa"},
  41:{tamil:"கர், கர",phoneme:"kar"},
  42:{tamil:"தவகதவ",phoneme:"thavakathava"},
  43:{tamil:"கண",phoneme:"kaNa"},
  47:{tamil:"வர, வர்",phoneme:"vara"},
  48:{tamil:"ளார்",phoneme:"Laar"},
  49:{tamil:"முக'",phoneme:"muka'"},
  50:{tamil:"\"ணாய்\"",phoneme:"\"Naay\""},
  51:{tamil:"தேளணஅ",phoneme:"theeLaNaa"},
  52:{tamil:"தேளனர்",phoneme:"theeLanar"},
  82:{tamil:"வ அன்னம்=வனம்",phoneme:"va annam=nam"},
  84:{tamil:"கால் = காற்று",phoneme:"kaal = kaaRRu"},
  86:{tamil:"ஒன்று,ஓர்,ஒ,ஓ,ர்",phoneme:"onRu"},
  87:{tamil:"இரு. ஈர்",phoneme:"iru. iir"},
  88:{tamil:"இரும்",phoneme:"irum"},
  89:{tamil:"மூன்று,மு,மூ",phoneme:"muunRu"},
  90:{tamil:"மூய=எருது",phoneme:"muuya=eruthu"},
  91:{tamil:"முரா=மோர்",phoneme:"muraa=kamaar"},
  92:{tamil:"இமூ",phoneme:"imuu"},
  93:{tamil:"ஓரிரு",phoneme:"ooriru"},
  94:{tamil:"இருஓர்",phoneme:"iruoor"},
  95:{tamil:"நான்கு,ந,நா",phoneme:"naanku"},
  96:{tamil:"அய்,அய்ந்து",phoneme:"ay"},
  97:{tamil:"ஓர்",phoneme:"oor"},
  98:{tamil:"மேற்படி -ஒரு",phoneme:"kamaRpTi -oru"},
  99:{tamil:"மேற்படி- இரு",phoneme:"kamaRpaTi- iru"},
  100:{tamil:"இரு",phoneme:"iru"},
  101:{tamil:"இரு",phoneme:"iru"},
  102:{tamil:"மூன்று,மு,மூ",phoneme:"muunRu"},
  103:{tamil:"மூன்று,மு,மூ",phoneme:"muunRu"},
  104:{tamil:"நான்கு,ந,நா",phoneme:"naanku"},
  138:{tamil:"இத",phoneme:"itha"},
  139:{tamil:"பத",phoneme:"patha"},
  140:{tamil:"தஅம்அம், தஅன்அன்",phoneme:"thaamam"},
  141:{tamil:"இருத",phoneme:"irutha"},
  142:{tamil:"இருதப",phoneme:"iruthapa"},
  143:{tamil:"இருதஅம் அம்(ன்,ல்,ர்)",phoneme:"iruthaam am(n"},
  144:{tamil:"இருதட்ட",phoneme:"iruthaTTa"},
  145:{tamil:"இருதண்",phoneme:"iruthaN"},
  153:{tamil:"ன,ன்",phoneme:"na"},
  155:{tamil:"ன,ன்",phoneme:"na"},
  156:{tamil:"னட்ட",phoneme:"naTTa"},
  158:{tamil:"தர், இன்",phoneme:"thar"},
  159:{tamil:"இயன்",phoneme:"iyan"},
  160:{tamil:"தண்ன,தன்ண",phoneme:"thaNna"},
  161:{tamil:"ன",phoneme:"na"},
  162:{tamil:"ய்,ய",phoneme:"y"},
  163:{tamil:"இய",phoneme:"iya"},
  164:{tamil:"யஅம்அம்,(அன்,ல்,ர்)",phoneme:"yaamam"},
  167:{tamil:"ய்ய",phoneme:"yya"},
  169:{tamil:"னி",phoneme:"ni"},
  171:{tamil:"ண,ணா",phoneme:"Na"},
  172:{tamil:"ணண்",phoneme:"NaN"},
  173:{tamil:"ண்ண",phoneme:"NNa"},
  175:{tamil:"வய",phoneme:"vaya"},
  176:{tamil:"ண்,ண,மண",phoneme:"N"},
  225:{tamil:"ச,ச்",phoneme:"sa"},
  226:{tamil:"சி",phoneme:"si"},
  227:{tamil:"சரி",phoneme:"sari"},
  228:{tamil:"சச்",phoneme:"sas"},
  229:{tamil:"ஈ",phoneme:"ii"},
  230:{tamil:"'மலய்'",phoneme:"'malay'"},
  231:{tamil:"'மலயமலய்'",phoneme:"'malayamalay'"},
  232:{tamil:"\"மலய் அரச'",phoneme:"\"malay arasa'"},
  233:{tamil:"மு, மூ",phoneme:"mu"},
  235:{tamil:"மூய",phoneme:"muuya"},
  242:{tamil:"தொழு",phoneme:"vathaaLzu"},
  243:{tamil:"அ தொழு",phoneme:"a vathaaLzu"},
  244:{tamil:"பண்ண",phoneme:"paNNa"},
  245:{tamil:"'இட'",phoneme:"'iTa'"},
  246:{tamil:"'இடர்'",phoneme:"'iTar'"},
  249:{tamil:"ப",phoneme:"pa"},
  250:{tamil:"பம்,பன்,பல்,பர்",phoneme:"pam"},
  251:{tamil:"பச",phoneme:"pasa"},
  252:{tamil:"பண",phoneme:"paNa"},
  254:{tamil:"ண, ணி",phoneme:"Na"},
  257:{tamil:"பண்ணய்",phoneme:"paNNay"},
  258:{tamil:"பண்ணய்",phoneme:"paNNay"},
  259:{tamil:"பண்ணய்",phoneme:"paNNay"},
  261:{tamil:"ம",phoneme:"ma"},
  262:{tamil:"மய",phoneme:"maya"},
  307:{tamil:"ம",phoneme:"ma"},
  308:{tamil:"மஅம்அம்(அன்,அல்,அர்)",phoneme:"maamam(an"},
  309:{tamil:"ஈ",phoneme:"ii"},
  311:{tamil:"'யாழ்'",phoneme:"'yaaLz'"},
  321:{tamil:"வவ்,வ்வ",phoneme:"vav"},
  322:{tamil:"வன்,வ்வன்",phoneme:"van"},
  323:{tamil:"அரச",phoneme:"arasa"},
  326:{tamil:"அரச",phoneme:"arasa"},
  327:{tamil:"'அரச ண அ",phoneme:"'arasa Na a"},
  324:{tamil:"அரசன",phoneme:"arasana"},
  325:{tamil:"அரச",phoneme:"arasa"},
  328:{tamil:"அ",phoneme:"a"},
  329:{tamil:"அவ்",phoneme:"av"},
  330:{tamil:"அமூ",phoneme:"amuu"},
  331:{tamil:"அன",phoneme:"ana"},
  340:{tamil:"அய் (old form)",phoneme:"ay (old form)"},
  341:{tamil:"பண், பண",phoneme:"paN, paNa"},
  342:{tamil:"ஆ",phoneme:"aa"},
  343:{tamil:"அய்",phoneme:"ay"},
  344:{tamil:"அவ்",phoneme:"av"},
  345:{tamil:"ஆமூ",phoneme:"aamuu"},
  347:{tamil:"ய்ய",phoneme:"yya"},
  348:{tamil:"யண்ண,ண்மண",phoneme:"yaNNa"},
  349:{tamil:"ய்யர்",phoneme:"yyar"},
};

const SEALS = [
  { id:"1076", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"வ வ நெய்",  layer1:"thava thava ney", layer2:"Very good ghee",       domain:"dairy products",   status:"complete", confidence:0.74 },
  { id:"2082", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"சிவ மூ ஆகாவ்வ",    layer1:"Isa muu aagaavva",  layer2:"Cow carer of 3 cows of Isa",  domain:"livestock", status:"complete", confidence:0.68 },
  { id:"3023", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"டி டீ அய் லா இள வ்யமூன்", layer1:"di diir (da daal) aa", layer2:"Instant cow (on demand)", domain:"dairy products", status:"complete", confidence:0.72 },
  { id:"2127", motif:"elephant", site:"Mohenjo-daro",
    tamil:"எண் ய் = எண்ணய்",  layer1:"eN y",       layer2:"Oil (sesamum ghee)",              domain:"oils", status:"complete", confidence:0.72 },
  { id:"2648", motif:"elephant", site:"Mohenjo-daro",
    tamil:"மீ மீ நெய் தொழு",  layer1:"mi mi na y thoLzu",  layer2:"Very good ghee shed",     domain:"dairy products",   status:"complete", confidence:0.70 },
  { id:"2444", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"ண ய் ஆ ண",         layer1:"NNal's aa Nai",           layer2:"Leader's command",     domain:"governance", status:"complete", confidence:0.71 },
  { id:"2864", motif:"gharial", site:"Mohenjo-daro",
    tamil:"ண ய் ஆ ண",         layer1:"NNal kai aa Nai",           layer2:"Leader's command", domain:"governance", status:"complete", confidence:0.71 },
  { id:"4440", motif:"none",    site:"Mohenjo-daro",
    tamil:"இள இரு ட்ட ஆ ண",   layer1:"iLa iru tta aa Nai",   layer2:"Early night order (curfew)", domain:"governance", status:"complete", confidence:0.65 },
  { id:"2234", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"வ்ய்ய இளம்",        layer1:"vay ya iir illam",          layer2:"World is a big home", domain:"governance", status:"complete", confidence:0.70 },
  { id:"4718", motif:"none",    site:"Mohenjo-daro",
    tamil:"அய் ய அய் ஓ வ்யமூன்", layer1:"ay ya ay o vyamun | ammu", layer2:"Panic milk for children (ordinance)", domain:"welfare",   status:"complete", confidence:0.66 },
  { id:"1425", motif:"none",    site:"Mohenjo-daro",
    tamil:"இளம் வய மூ ன",      layer1:"illam vay muu tha ni",   layer2:"Home for the aged and alone",      domain:"welfare",   status:"complete", confidence:0.67 },
  { id:"3246", motif:"none",    site:"Mohenjo-daro",
    tamil:"வய மூ ள ஆகாவ்வ",   layer1:"vaya muu La aagaavva", layer2:"Carer of aged cow",   domain:"welfare", status:"complete", confidence:0.67 },
  { id:"1110", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"வ சம ள வ ண்ணல்",    layer1:"thava sa ma thaLa thava NNal", layer2:"Respected equanimous great leader", domain:"governance", status:"complete", confidence:0.64 },
  { id:"5119", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"வ வ மூட ஆ தொழு",   layer1:"muu da aa thoLzu", layer2:"Shed for aged cattle",  domain:"welfare",   status:"complete", confidence:0.65 },
  { id:"2950", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"நெய்",               layer1:"nay",           layer2:"Ghee",                    domain:"dairy products",   status:"complete", confidence:0.73 },
  { id:"1133", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"ந ய் = நெய்",        layer1:"nay",           layer2:"Ghee",     domain:"dairy products",   status:"complete", confidence:0.72 },
  { id:"2322", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"ஆகாவ்வ நெய்",       layer1:"nay aakaavva",          layer2:"Ghee from cow carer",        domain:"dairy products",   status:"complete", confidence:0.69 },
  { id:"2617", motif:"unicorn", site:"Mohenjo-daro",
    tamil:"வ்வட வ்ய மூர் மூரா", layer1:"ivva da t l vya mu r mura",   layer2:"Buttermilk available here", domain:"dairy products", status:"complete", confidence:0.62 },
  { id:"2358", motif:"unicorn", site:"Mohenjo-daro", tamil:"டி டீ ஆ", layer1:"didiir (dadaal) aa", layer2:"Instant cow (on demand)", domain:"dairy products", status:"complete", confidence:0.72 },
  { id:"220", motif:"none", site:"author corpus", signCount:3, tamil:"சிவம், சிவன் (துணக்குறி = அம்,அன்,அல்,அர்)", layer1:"sivam, sivan (thuNakkuRi", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"232", motif:"none", site:"author corpus", signCount:2, tamil:"மலை அரச", layer1:"malai arasa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"327", motif:"none", site:"author corpus", signCount:2, tamil:"அரசணஅ, அரசனின்", layer1:"arasaNaa, arasanin", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"342", motif:"none", site:"author corpus", signCount:2, tamil:"தொழு, தொழுவம்", layer1:"thoLzu, thoLzuvam", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"343", motif:"none", site:"author corpus", signCount:2, tamil:"அ தொழு = மொட்டுத் தொழுவம்", layer1:"a thoLzu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1007", motif:"none", site:"author corpus", signCount:2, tamil:"ஆறு (உலை)ய", layer1:"aaRu (ulai)ya", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1008", motif:"unicorn", site:"author corpus", signCount:5, tamil:"கொழி ஆர் இருளைொ வயமூன் (ஆர்=ஊர்)", layer1:"KoLzi ur iru La laa vya mu n", layer2:"KoLzi village IruLan's milk supply at Market Common", domain:"dairy products", status:"complete", confidence:0 },
  { id:"1010", motif:"none", site:"author corpus", signCount:6, tamil:"வ வ ளொர் ண்ண ய் ஆ", layer1:"va va Lor NNa y aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1028", motif:"none", site:"author corpus", signCount:4, tamil:"ஓவண்ணளொர் ய் (உலைய) ஆ", layer1:"oovaNNaLor y (ulaiya) aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1030", motif:"none", site:"author corpus", signCount:3, tamil:"வயமூன் ஓர் ஆொவ்வ=பொற்பசுக்ொவைர்", layer1:"vayamuun oor aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1035", motif:"none", site:"author corpus", signCount:4, tamil:"சி வண்(ணொ) ஆறு உலைய", layer1:"si vaN(No) aaRu ulaiya", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1045", motif:"unicorn", site:"author corpus", signCount:2, tamil:"வய(ல்)ொவ்வன், வைியொவ்வன்", layer1:"vaya(l) gaavvan", layer2:"Carer of the field", domain:"agriculture", status:"complete", confidence:0 },
  { id:"1046", motif:"none", site:"author corpus", signCount:3, tamil:"யொழ ன ண்ணொ", layer1:"yoLza na NNo", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1048", motif:"none", site:"author corpus", signCount:4, tamil:"ய ய இருளன் (துலணக்குறி= அன்)", layer1:"ya ya iruLan (thulaNakkuRi", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1049", motif:"none", site:"author corpus", signCount:8, tamil:"வய கொயிைண் பண \"ைொவ க ளண்ன ய்யொ ஆ", layer1:"vaya koyiN paNa \"va ka LaNna yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1068", motif:"none", site:"author corpus", signCount:2, tamil:"ண்(ண)ல் வ்யமூன் = அண்ணல் பொல்", layer1:"N(Na)l vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1070", motif:"none", site:"author corpus", signCount:3, tamil:"ஆமு ம ண்(ணொ)", layer1:"aamu ma N(No)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1078", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீ ர் ஆ= கமைொளர் ஆ", layer1:"miimii r aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1088", motif:"none", site:"author corpus", signCount:4, tamil:"வ வயைொ ள ன்", layer1:"va vayai La n", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1094", motif:"none", site:"author corpus", signCount:2, tamil:"மீமீண்ணல் வ்யமூன்=கமைொன அண்ணல் பொல்", layer1:"miimiiNNal vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1098", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீஇள ய்யொ ஆ", layer1:"miimiiiLa yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1102", motif:"none", site:"author corpus", signCount:3, tamil:"ண்ணி | ண்ண(ீர்)", layer1:"NNi / NNa(r)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1105", motif:"none", site:"author corpus", signCount:13, tamil:"வ \" பன்னிரு வண ள வ்யமூன் | வ வ பன்னிரு வன ண்ணல் பொல்", layer1:"va \" panniru vaNa La vyamuun / va va panniru vana NNal pol", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1109", motif:"none", site:"author corpus", signCount:4, tamil:"வ' இளைொ ஆக்( ள்)", layer1:"va' iLai aak( L)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1114", motif:"none", site:"author corpus", signCount:7, tamil:"வ வ இருளட்ை ஆ ( வொரி மொடு)", layer1:"va va iruLaT aa ( vori moTu)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1116", motif:"none", site:"author corpus", signCount:10, tamil:"மூ(த் ) வ(த் ர்) ய் (உலைய) (6-அன் உருபு) ஆ ண(ய்)", layer1:"muu(th ) va(th r) y (ulaiya) (6-an urupu) aa Na(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1120", motif:"none", site:"author corpus", signCount:2, tamil:"ொரி மொடு", layer1:"ri moTu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1121", motif:"none", site:"author corpus", signCount:3, tamil:"இைம இைம வய(ல்)ொவ(ல்)", layer1:"ima ima vaya(l)va(l)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1127", motif:"none", site:"author corpus", signCount:1, tamil:"வீவித்ொவ்வ= கமைொன வித்துொவல்", layer1:"viivithvva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1129", motif:"none", site:"author corpus", signCount:4, tamil:"சிவை மூ ஆொவ்வ;ை-6-அன் உருபு", layer1:"sivai muu aavva;-6-an urupu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1143", motif:"none", site:"author corpus", signCount:7, tamil:"மி ச் சிறந் தெய் | வ ய் = தெய்", layer1:"mi s siRan they / va y", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1147", motif:"none", site:"author corpus", signCount:3, tamil:"வய இல்ைம் வ்யமூன்= வயல் வட்ீடுப் பொல்", layer1:"vaya ilm vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1150", motif:"none", site:"author corpus", signCount:3, tamil:"ணொய் அரச ஆ= அரச ஆ வய்", layer1:"Noy arasa aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1156", motif:"none", site:"author corpus", signCount:4, tamil:"(இ)ை ழன் பன்னிரு ஆ", layer1:"(i) Lzan panniru aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1158", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீஇள(ம்) சொ ண", layer1:"miimiiiLa(m) so Na", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1159", motif:"none", site:"author corpus", signCount:5, tamil:"இை இை அய் வ ய் =இவ்விைம் சிறந் தெய்", layer1:"i i ay va y", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1168", motif:"none", site:"author corpus", signCount:2, tamil:"ஓ வ்யமூன் = சிறந் பொல்", layer1:"oo vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1170", motif:"none", site:"author corpus", signCount:3, tamil:"ை ழ வ்யமூன்", layer1:"Lza vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1171", motif:"none", site:"author corpus", signCount:2, tamil:"சிறந் ஆொவ்வ(ன்)", layer1:"siRan aavva(n)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1182", motif:"none", site:"author corpus", signCount:4, tamil:"ண் அய் கொயில் எறும்ப = ண் அய்யன்", layer1:"N ay koyil eRumpa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1199", motif:"none", site:"author corpus", signCount:2, tamil:"இளம ஆ", layer1:"iLama aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1220", motif:"unicorn", site:"author corpus", signCount:1, tamil:"எருது", layer1:"muuya", layer2:"Oxen", domain:"livestock", status:"complete", confidence:0 },
  { id:"1228", motif:"unicorn", site:"author corpus", signCount:3, tamil:"மீமீகொழி (ஊர்) ஆொவ்வ", layer1:"mi mi KoLzi aagaavva", layer2:"Very good KoLzi village cow carer (skill certification)", domain:"livestock", status:"complete", confidence:0 },
  { id:"1229", motif:"none", site:"author corpus", signCount:1, tamil:"மீமீெய்", layer1:"miimiiy", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1232", motif:"none", site:"author corpus", signCount:2, tamil:"மீமீளொர் ஆ", layer1:"miimiiLor aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1235", motif:"none", site:"author corpus", signCount:2, tamil:"ை இல்ைொைன்", layer1:"iln", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1237", motif:"none", site:"author corpus", signCount:3, tamil:"மயில் ய்யொ ஆ", layer1:"mayil yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1274", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீகொயில் ண் அல்", layer1:"miimiikoyil N al", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1275", motif:"none", site:"author corpus", signCount:3, tamil:"[வய(து)] மூை ஆ", layer1:"[vaya(thu)] muu aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1287", motif:"none", site:"author corpus", signCount:2, tamil:"ஓர் ஆொவ்வ", layer1:"oor aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1314", motif:"none", site:"author corpus", signCount:2, tamil:"சண்ணொ ஆறுளன்", layer1:"saNNo aaRuLan", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1326", motif:"bull", site:"author corpus", signCount:3, tamil:"மீமீை இள(ம்) பொல்", layer1:"mi la iLa vya mu n", layer2:"Quality fresh milk at Bull St.", domain:"dairy products", status:"complete", confidence:0 },
  { id:"1335", motif:"none", site:"author corpus", signCount:6, tamil:"வை சங் ஆ (சிறந் தவள்லள ஆ)", layer1:"vai sang aa (siRan thavaLlaLa aa)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1339", motif:"none", site:"author corpus", signCount:4, tamil:"மூ வ ல ஆ", layer1:"muu va la aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1341", motif:"none", site:"author corpus", signCount:3, tamil:"வ ண்ணொ ஆ", layer1:"va NNo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1344", motif:"none", site:"author corpus", signCount:5, tamil:"வ \" ஏழு (இள)ஞொன் ஆ", layer1:"va \" eeLzu (iLa)njon aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1345", motif:"rhinoceros", site:"author corpus", signCount:3, tamil:"வை இளை வ்யமூன்", layer1:"thava da iLa la vya mu n", layer2:"Very good fresh milk at Rhinoceros St.", domain:"dairy products", status:"complete", confidence:0 },
  { id:"1348", motif:"none", site:"author corpus", signCount:4, tamil:"வை வ ள ன்", layer1:"vai va La n", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1350", motif:"none", site:"author corpus", signCount:10, tamil:"இளை சொ ண ண் (ண ர ம ர மயக் ம்)", layer1:"iLai so Na N (Na ra ma ra mayak m)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1373", motif:"none", site:"author corpus", signCount:5, tamil:"வை வளன் இருைொ ரின் ஆ", layer1:"vai vaLan iru rin aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1374", motif:"none", site:"author corpus", signCount:3, tamil:"இள ண்ண ஆ", layer1:"iLa NNa aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1386", motif:"composite", site:"author corpus", signCount:8, tamil:"மீமீ வ ஆக்( ள்) தொழு (Zebu cattle shed)", layer1:"mi mi [thava] aa k thoLzu", layer2:"Very good zebu cattle shed", domain:"livestock", status:"complete", confidence:0 },
  { id:"1387", motif:"none", site:"author corpus", signCount:5, tamil:"மீமீ வை ள ன் தொழு", layer1:"miimii vai La n thoLzu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1407", motif:"none", site:"author corpus", signCount:4, tamil:"வ ண்(ண) ய் ஆ", layer1:"va N(Na) y aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1414", motif:"none", site:"author corpus", signCount:5, tamil:"இள வய(து) மூ-பன்னிரு (36) ஆ", layer1:"iLa vaya(thu) muu-panniru (36) aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1427", motif:"none", site:"author corpus", signCount:3, tamil:"ய் வ ர் = வய்க் ர்= தெய்க்ொரர்", layer1:"y va r", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1447", motif:"none", site:"author corpus", signCount:3, tamil:"மைொை சொ ண =குவிக் ப்பட்ை சொணம்", layer1:"ma laa la saa Na", layer2:"Gathered, heaped together manure", domain:"agriculture", status:"complete", confidence:0 },
  { id:"1456", motif:"none", site:"author corpus", signCount:6, tamil:"மீமீை வய(து) மூ(த் ) ச ண= சிறந் மூத் சொணம்", layer1:"miimii vaya(thu) muu(th ) sa Na", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1466", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீகொயில் ஏழு ஆ", layer1:"miimiikoyil eeLzu aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1533", motif:"none", site:"author corpus", signCount:2, tamil:"சொ ண(ம்)", layer1:"so Na(m)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1534", motif:"none", site:"author corpus", signCount:5, tamil:"மூப மூப்பைொ ள ன் தொழுவம்", layer1:"muupa muuppai La n thoLzuvam", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1551", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீஇரு ள ன்", layer1:"miimiiiru La n", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1561", motif:"none", site:"author corpus", signCount:3, tamil:"கொயில் மலை ஆ", layer1:"koyil malai aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1628", motif:"none", site:"author corpus", signCount:15, tamil:"பக் ம் 1- ள வ்வ இரு ஆ | பக் ம் 2- ள ம ச ண", layer1:"pak m 1- La vva iru aa / pak m 2- La ma sa Na", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1707", motif:"none", site:"author corpus", signCount:3, tamil:"கொயில் இை ஆ", layer1:"koyil i aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1708", motif:"none", site:"author corpus", signCount:4, tamil:"கொயில் இை ண்ண ஆ", layer1:"koyil i NNa aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1771", motif:"none", site:"author corpus", signCount:3, tamil:"வனை ளொர் ஆ", layer1:"vanai Lor aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"1801", motif:"none", site:"author corpus", signCount:3, tamil:"வண்ணை ளொர் ஆ", layer1:"vaNNai Lor aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2014", motif:"none", site:"author corpus", signCount:2, tamil:"ஆ தொழு", layer1:"aa thoLzu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2015", motif:"none", site:"author corpus", signCount:1, tamil:"வ்யமூன் = பொல்", layer1:"vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2056", motif:"none", site:"author corpus", signCount:5, tamil:"வ வ ணை ன ய்யொ", layer1:"va va Nai na yyo", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2057", motif:"none", site:"author corpus", signCount:6, tamil:"மீமீஓர் ண் ஆ (ஆ தெடில் குறி)", layer1:"miimiioor N aa (aa theTil kuRi)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2059", motif:"none", site:"author corpus", signCount:2, tamil:"மீமீசொ ண", layer1:"miimiiso Na", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2060", motif:"none", site:"author corpus", signCount:2, tamil:"மீமீசொ ண", layer1:"miimiiso Na", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2061", motif:"none", site:"author corpus", signCount:3, tamil:"ஆமு ண் ண(ல்)", layer1:"aamu N Na(l)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2068", motif:"none", site:"author corpus", signCount:6, tamil:"மீ மி ழ ட்ைள் ஆ க்=", layer1:"mii mi Lza TL aa k", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2069", motif:"none", site:"author corpus", signCount:7, tamil:"வ வ வவண் வ ஓணொள் ஆ ப", layer1:"va va vavaN va ooNoL aa pa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2081", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீவயைொ ள ன்", layer1:"miimiivayai La n", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2086", motif:"none", site:"author corpus", signCount:7, tamil:"ம யன் அய் வன ம ஆ தொழு", layer1:"ma yan ay vana ma aa thoLzu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2096", motif:"none", site:"author corpus", signCount:7, tamil:"ண்ன அவ் வர ண்ண வ்வ ய்யொ ஆ", layer1:"Nna av vara NNa vva yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2097", motif:"none", site:"author corpus", signCount:4, tamil:"கொயில் இை மூை ஆ", layer1:"koyil i muu aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2104", motif:"none", site:"author corpus", signCount:3, tamil:"வயைொ ளர் ஆ", layer1:"vayai Lar aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2113", motif:"none", site:"author corpus", signCount:2, tamil:"அய் ஆொவ்வ", layer1:"ay aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2123", motif:"none", site:"author corpus", signCount:2, tamil:"வ்யைைொ வ்யமுன்", layer1:"vyai vyamun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2142", motif:"none", site:"author corpus", signCount:7, tamil:"இள(ம்) சொ ண(ம்) | இள சொ ண(ம்)", layer1:"iLa(m) so Na(m) / iLa so Na(m)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2163", motif:"none", site:"author corpus", signCount:6, tamil:"(மீ) (இள) சொ ண பன்னிரு ஆ", layer1:"(mii) (iLa) so Na panniru aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2167", motif:"unicorn", site:"author corpus", signCount:2, tamil:"மூய தொழு", layer1:"muuya thoLzu", layer2:"Shed for oxen", domain:"livestock", status:"complete", confidence:0 },
  { id:"2169", motif:"none", site:"author corpus", signCount:6, tamil:"அ ம ஆர்ை ன ன் தொழு", layer1:"a ma aar na n thoLzu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2183", motif:"none", site:"author corpus", signCount:4, tamil:"ம ணொ ள ன்", layer1:"ma No La n", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2186", motif:"none", site:"author corpus", signCount:2, tamil:"இளைொ பன்னிருொவ்வ", layer1:"iLai panniruvva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2200", motif:"none", site:"author corpus", signCount:6, tamil:"(இ)ன் ன் ஆ (சுகமரியர் த ய்வம்)", layer1:"(i)n n aa (sukamariyar tha yvam)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2201", motif:"none", site:"author corpus", signCount:3, tamil:"ண ய்ய ஆ", layer1:"Na yya aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2251", motif:"none", site:"author corpus", signCount:1, tamil:"மீமீவ்யமூன்", layer1:"miimiivyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2290", motif:"none", site:"author corpus", signCount:5, tamil:"மீமீகொயில் மைய்ை ன ய்யொ ஆ", layer1:"miimiikoyil maiy na yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2315", motif:"none", site:"author corpus", signCount:3, tamil:"ை னி ஆ", layer1:"ni aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2343", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2368", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2375", motif:"none", site:"author corpus", signCount:2, tamil:"(இ)ள ஆொவ்வ", layer1:"(i)La aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2380", motif:"none", site:"author corpus", signCount:3, tamil:"ணொ ய் ஆ = வொல ஆ,அண்ணல் ல ஆ", layer1:"No y aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2382", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ அய்", layer1:"aavva ay", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2394", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ ஓர்", layer1:"aavva oor", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2420", motif:"none", site:"author corpus", signCount:4, tamil:"ஆள் அவ் ஈச ர் = சிவொ", layer1:"aaL av iisa r", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2442", motif:"unicorn", site:"author corpus", signCount:4, tamil:"ை அய்யி மு ர்", layer1:"da tha ay vya mugar", layer2:"Strong five-faced deity", domain:"culture", status:"complete", confidence:0 },
  { id:"2459", motif:"none", site:"author corpus", signCount:3, tamil:"வய(ளொர்) ய்யொ ஆ", layer1:"vaya(Lor) yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2472", motif:"none", site:"author corpus", signCount:2, tamil:"அரச ஆொவ்வன்", layer1:"arasa aavvan", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2478", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீஏழு ஞொன் ஆ", layer1:"miimiieeLzu njon aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2482", motif:"none", site:"author corpus", signCount:4, tamil:"வ ளொர் ஆ ண(ய்)", layer1:"va Lor aa Na(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2497", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2503", motif:"unicorn", site:"author corpus", signCount:2, tamil:"மீமீகொழி (ஊர்)ொவ்வ", layer1:"mi mi koLzi gaavva", layer2:"Very good KoLzi village guard", domain:"governance", status:"complete", confidence:0 },
  { id:"2507", motif:"none", site:"author corpus", signCount:3, tamil:"வ இளை வ்யமூன்", layer1:"va iLai vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2514", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2520", motif:"none", site:"author corpus", signCount:3, tamil:"இள எழுட்ை ஆ", layer1:"iLa eLzuT aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2534", motif:"none", site:"author corpus", signCount:3, tamil:"ை வய ஆ", layer1:"vaya aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2545", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீஇள ச ண", layer1:"miimiiiLa sa Na", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2596", motif:"none", site:"author corpus", signCount:7, tamil:"ண்ன அவ் வர ண்ண வ்வ ய்யொ ஆ", layer1:"Nna av vara NNa vva yyo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2608", motif:"none", site:"author corpus", signCount:3, tamil:"இள அரசன ஆ", layer1:"iLa arasana aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2614", motif:"none", site:"author corpus", signCount:6, tamil:"ொல் ள ண்ன அய்வனைொ இருளன ன்", layer1:"l La Nna ayvanai iruLana n", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2630", motif:"none", site:"author corpus", signCount:3, tamil:"மீமீ வ ண்(ண)", layer1:"miimii va N(Na)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2636", motif:"none", site:"author corpus", signCount:2, tamil:"மீமீெ ய்", layer1:"miimii y", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2639", motif:"none", site:"author corpus", signCount:2, tamil:"ஓர் ஆொவ்வ", layer1:"oor aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2651", motif:"none", site:"author corpus", signCount:4, tamil:"சிவன் (பண்பட்ை வத் ன்)", layer1:"sivan (paNpaT vath n)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2653", motif:"none", site:"author corpus", signCount:4, tamil:"மீமீளொர் ர ய்ய ஆ", layer1:"miimiiLor ra yya aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2663", motif:"none", site:"author corpus", signCount:4, tamil:"மீமீளொர் ர ய்ய ஆ", layer1:"miimiiLor ra yya aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2689", motif:"none", site:"author corpus", signCount:12, tamil:"வரி 1- வ வ வயச ஆ | வரி 2- ச ச ஆர் = ச சயொர்= யொர்", layer1:"vari 1- va va vayasa aa / vari 2- sa sa aar", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2698", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ வொன்கு", layer1:"aavva vonku", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2699", motif:"none", site:"author corpus", signCount:3, tamil:"வனி ஆ மூரொ", layer1:"vani aa muuro", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2700", motif:"none", site:"author corpus", signCount:3, tamil:"இருை இனொ ஆ", layer1:"iru ino aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2847", motif:"none", site:"author corpus", signCount:4, tamil:"வயமளொர் ஆொவ்வ மூ அய", layer1:"vayamaLor aavva muu aya", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2848", motif:"none", site:"author corpus", signCount:3, tamil:"ைொ ய் ஆண(ய்)", layer1:"y aaNa(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2856", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2862", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2908", motif:"none", site:"author corpus", signCount:9, tamil:"ஏழு (இள)ஞொன் அரசன ஆ | ஏழு ஞொன் அரசன ஆ", layer1:"eeLzu (iLa)njon arasana aa / eeLzu njon arasana aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2913", motif:"none", site:"author corpus", signCount:4, tamil:"இரு ள யண்ண ஆ", layer1:"iru La yaNNa aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3016", motif:"unicorn", site:"author corpus", signCount:5, tamil:"டி டீ (ிடீர்)அய்ைொ இள வ்யமூன்", layer1:"di diir ay laa iaLa vyamun", layer2:"Just expressed fresh milk", domain:"dairy products", status:"complete", confidence:0 },
  { id:"3075", motif:"none", site:"author corpus", signCount:2, tamil:"ஓர் ஆொவ்வ", layer1:"oor aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3095", motif:"none", site:"author corpus", signCount:2, tamil:"அரச ஆொவ்வ", layer1:"arasa aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3118", motif:"none", site:"author corpus", signCount:4, tamil:"ஈசொ இரு ணொ ஆ", layer1:"iiso iru No aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3159", motif:"none", site:"author corpus", signCount:3, tamil:"வொ ய் ண் = ண்ணெய் = தவண்ணய்", layer1:"vo y N", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3249", motif:"none", site:"author corpus", signCount:5, tamil:"ம ணொ ள ஆ ணய்", layer1:"ma No La aa Nay", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3328", motif:"none", site:"author corpus", signCount:8, tamil:"வய மூ ட்ை ஆ ஓர் (பசு - ஒருலம)", layer1:"vaya muu T aa oor (pasu - orulama)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"3351", motif:"none", site:"author corpus", signCount:8, tamil:"மூ ள ய் ஆ (மூ இள ய்மொடு ள்)", layer1:"muu La y aa (muu iLa ymoTu L)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4022", motif:"none", site:"author corpus", signCount:4, tamil:"மீமீவன இளை சொண னி", layer1:"miimiivana iLai soNa ni", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4029", motif:"none", site:"author corpus", signCount:2, tamil:"வய ஆொவ்வ", layer1:"vaya aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4033", motif:"none", site:"author corpus", signCount:4, tamil:"மூ வ ல ஆ", layer1:"muu va la aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4055", motif:"none", site:"author corpus", signCount:4, tamil:"இரு வ்வன் \" வ்யமூன்", layer1:"iru vvan \" vyamuun", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4056", motif:"unicorn", site:"author corpus", signCount:3, tamil:"ை மைொை ன் = வைிய அலமப்பொளன்", layer1:"tha da ma laa La n", layer2:"Strong organizer", domain:"governance", status:"complete", confidence:0 },
  { id:"4084", motif:"none", site:"author corpus", signCount:5, tamil:"மூை ஆவ் ஆய்ைொ ய் பசு", layer1:"muu aav aay y pasu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4166", motif:"none", site:"author corpus", signCount:2, tamil:"ஒர் ஆொவ்வ", layer1:"or aavva", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4262", motif:"none", site:"author corpus", signCount:4, tamil:"ை ணை ன ய்யொ", layer1:"Nai na yyo", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4320", motif:"none", site:"author corpus", signCount:5, tamil:"வர ளொர் ய் ஆ ண(ய்)", layer1:"vara Lor y aa Na(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4347", motif:"none", site:"author corpus", signCount:11, tamil:"வரி 1- அரச ஆ ண(ய்) | வரி 2- இரு அ ?", layer1:"vari 1- arasa aa Na(y) / vari 2- iru a ?", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4354", motif:"none", site:"author corpus", signCount:2, tamil:"மைொை பண்ணொை = பண்ணயர் குழுமம்", layer1:"ma laa La paNNa(da)", layer2:"Organized farmers", domain:"agriculture", status:"complete", confidence:0 },
  { id:"4371", motif:"none", site:"author corpus", signCount:4, tamil:"மைொை பண்ணொை ஆ ண(ய்)", layer1:"malaaLa paNNada aa Nai", layer2:"Ordinance by farmers guild", domain:"governance", status:"complete", confidence:0 },
  { id:"4430", motif:"none", site:"author corpus", signCount:4, tamil:"பண்ணய் ய்யொ ஆ ண(ய்)", layer1:"paNNay yyo aa Na(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4582", motif:"none", site:"author corpus", signCount:13, tamil:"வரி 1 -ைொ பண்ணொ ஆ ண (ய்) | அ வொ (மூ?) [scribe error?]", layer1:"vari 1 - paNNo aa Na (y) / a vo (muu?) [scribe error?]", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4590", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"4626", motif:"none", site:"author corpus", signCount:3, tamil:"(இ)ள ஞொன் ஆ", layer1:"(i)La njon aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"5274", motif:"none", site:"author corpus", signCount:12, tamil:"வரி 1 - இை இைம ஆண(ய்) | வரி 2 - அ ம்மூ", layer1:"vari 1 - i ima aaNa(y) / vari 2 - a mmuu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"5305", motif:"none", site:"author corpus", signCount:5, tamil:"ர ஆ ண வ்வ அய்", layer1:"ra aa Na vva ay", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"5443", motif:"none", site:"author corpus", signCount:3, tamil:"ளொர் ஆ ண(ய்)", layer1:"Lor aa Na(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"5461", motif:"none", site:"author corpus", signCount:8, tamil:"வரி 1 - ண்ண ள ய்யொ ஆ ண(ய்)", layer1:"vari 1 - NNa La yyo aa Na(y)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"6213", motif:"none", site:"author corpus", signCount:3, tamil:"ஓை ண்ணொ ஆ", layer1:"oo NNo aa", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"7002", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ மூ", layer1:"aavva muu", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"7040", motif:"none", site:"author corpus", signCount:2, tamil:"ஆொவ்வ அய்", layer1:"aavva ay", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"7078", motif:"none", site:"author corpus", signCount:3, tamil:"ண வ ய் = ணண்வய்= தவண்ணய்", layer1:"Na va y", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"8031", motif:"none", site:"author corpus", signCount:2, tamil:"ய் வ = தெய்", layer1:"y va", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"8041", motif:"none", site:"author corpus", signCount:8, tamil:"மூ ள ஆொவ்வ (ள ர- ர மயக் ம்)", layer1:"muu La aavva (La ra- ra mayak m)", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"8117", motif:"none", site:"author corpus", signCount:4, tamil:"கொழி (ஊர்) ஆ ண(ய்)", layer1:"KoLzi aa Nai", layer2:"KoLzi village ordinance", domain:"governance", status:"complete", confidence:0 },
  { id:"9091", motif:"none", site:"author corpus", signCount:6, tamil:"வ ம ய \" வ ய் = சிறந் மணமுலைய தெய்", layer1:"va ma ya \" va y", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"9811", motif:"none", site:"author corpus", signCount:5, tamil:"ம ம வயய் \" வய் = ம மவொய தெய்", layer1:"ma ma vayay \" vay", layer2:"[meaning pending]", domain:"", status:"pending", confidence:0 },
  { id:"2929", motif:"pottery", site:"paper VER_4", signCount:0, tamil:"—", layer1:"nay", layer2:"Ghee (pottery graffiti - GC-MS test piece)", domain:"dairy products", status:"complete", confidence:0 },
  { id:"2949", motif:"circle", site:"paper VER_4", signCount:0, tamil:"—", layer1:"muuya", layer2:"Oxen", domain:"livestock", status:"complete", confidence:0 },
  { id:"4284", motif:"none", site:"paper VER_4", signCount:0, tamil:"—", layer1:"koyil ida aagaavva", layer2:"Carer of temple cow", domain:"livestock", status:"complete", confidence:0 },
  { id:"2110", motif:"elephant", site:"paper VER_4", signCount:0, tamil:"—", layer1:"La vya mun", layer2:"Fresh milk at Elephant St.", domain:"dairy products", status:"complete", confidence:0 },
  { id:"2411", motif:"fabulous", site:"paper VER_4", signCount:0, tamil:"—", layer1:"thava da vya mun", layer2:"Good milk at many streets", domain:"dairy products", status:"complete", confidence:0 },
];

const ALL_SIGNS = [
  {m:342,tamil:"ஆ",type:"geometric",freq:99},
  {m:99,tamil:"மேற்படி- இரு",type:"tally",freq:76},
  {m:161,tamil:"ன",type:"geometric",freq:35},
  {m:267,tamil:"மீ",type:"geometric",freq:35},
  {m:59,tamil:"ள், ள",type:"geometric",freq:32},
  {m:87,tamil:"இரு. ஈர்",type:"tally",freq:27},
  {m:123,tamil:"ட,த",type:"tally",freq:22},
  {m:67,tamil:"லா",type:"geometric",freq:21},
  {m:65,tamil:"இள, இளம்",type:"geometric",freq:20},
  {m:211,tamil:"ன்,ன",type:"geometric",freq:18},
  {m:387,tamil:"வய",type:"geometric",freq:17},
  {m:391,tamil:"தவ",type:"geometric",freq:17},
  {m:72,tamil:"ல",type:"geometric",freq:15},
  {m:89,tamil:"மூன்று,மு,மூ",type:"tally",freq:14},
  {m:287,tamil:"ட",type:"geometric",freq:14},
  {m:343,tamil:"அய்",type:"geometric",freq:14},
  {m:102,tamil:"மூன்று,மு,மூ",type:"tally",freq:13},
  {m:347,tamil:"ய்ய",type:"geometric",freq:11},
  {m:402,tamil:"ஆர்",type:"geometric",freq:11},
  {m:17,tamil:"தவ (தவம்)",type:"geometric",freq:10},
  {m:97,tamil:"ஓர்",type:"tally",freq:10},
  {m:403,tamil:"வ்வ,வவ்",type:"geometric",freq:10},
  {m:1,tamil:"க",type:"geometric",freq:9},
  {m:70,tamil:"ழ",type:"geometric",freq:9},
  {m:48,tamil:"ளார்",type:"geometric",freq:8},
  {m:51,tamil:"தேளணஅ",type:"geometric",freq:8},
  {m:86,tamil:"ஒன்று,ஓர்,ஒ,ஓ,ர்",type:"tally",freq:8},
  {m:296,tamil:"ட்ட",type:"geometric",freq:7},
  {m:15,tamil:"ஆகாவ்வ",type:"compound",freq:6},
  {m:108,tamil:"ஆறு",type:"tally",freq:6},
  {m:171,tamil:"ண,ணா",type:"geometric",freq:6},
  {m:230,tamil:"'மலய்'",type:"pictogram",freq:6},
  {m:249,tamil:"ப",type:"geometric",freq:6},
  {m:254,tamil:"ண, ணி",type:"geometric",freq:6},
  {m:293,tamil:"ட்",type:"geometric",freq:6},
  {m:8,tamil:"கய்",type:"geometric",freq:5},
  {m:60,tamil:"ளம்,ளன்,ளல்,ளர்",type:"modifier",freq:5},
  {m:204,tamil:"கோயில்",type:"pictogram",freq:5},
  {m:233,tamil:"மு, மூ",type:"geometric",freq:5},
  {m:244,tamil:"பண்ண",type:"geometric",freq:5},
  {m:12,tamil:"காவ்வ,காவல்",type:"compound",freq:4},
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
  {m:224,tamil:"சங்கரா (வெண்மை)",type:"geometric",freq:3},
  {m:303,tamil:"ட்ட,டட்",type:"geometric",freq:3},
  {m:327,tamil:"'அரச ண அ",type:"geometric",freq:3},
  {m:344,tamil:"அவ்",type:"geometric",freq:3},
  {m:348,tamil:"யண்ண,ண்மண",type:"geometric",freq:3},
  {m:381,tamil:"வண்,ெண",type:"geometric",freq:3},
  {m:11,tamil:"கற்ற",type:"compound",freq:2},
  {m:19,tamil:"கண(கண்ண)",type:"geometric",freq:2},
  {m:32,tamil:"கவ் (வகௌ)",type:"compound",freq:2},
  {m:57,tamil:"'எறம்ப' = எருமம",type:"pictogram",freq:2},
  {m:96,tamil:"அய்,அய்ந்து",type:"tally",freq:2},
  {m:114,tamil:"எட்டு, எண்",type:"tally",freq:2},
  {m:130,tamil:"ற்,ற",type:"geometric",freq:2},
  {m:160,tamil:"தண்ன,தன்ண",type:"geometric",freq:2},
  {m:242,tamil:"தொழு",type:"geometric",freq:2},
  {m:264,tamil:"தம,தம்",type:"geometric",freq:2},
  {m:286,tamil:"தவதம்",type:"geometric",freq:2},
  {m:294,tamil:"ட்ட",type:"geometric",freq:2},
  {m:307,tamil:"ம",type:"geometric",freq:2},
  {m:325,tamil:"அரச",type:"geometric",freq:2},
  {m:328,tamil:"அ",type:"geometric",freq:2},
  {m:367,tamil:"வவ்யவ",type:"geometric",freq:2},
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
  {m:47,tamil:"வர, வர்",type:"geometric",freq:1},
  {m:50,tamil:"\"ணாய்\"",type:"unknown",freq:0},
  {m:62,tamil:"ட்டள்",type:"geometric",freq:1},
  {m:66,tamil:"இளம், இல்லம்",type:"geometric",freq:1},
  {m:75,tamil:"இலி",type:"geometric",freq:1},
  {m:76,tamil:"கோழி (கோழியூர்)",type:"pictogram",freq:1},
  {m:80,tamil:"மயில்",type:"pictogram",freq:1},
  {m:111,tamil:"எழுட்ட",type:"tally",freq:1},
  {m:143,tamil:"இருதஅம் அம்(ன்,ல்,ர்)",type:"modifier",freq:1},
  {m:144,tamil:"இருதட்ட",type:"geometric",freq:1},
  {m:159,tamil:"இயன்",type:"geometric",freq:1},
  {m:163,tamil:"இய",type:"geometric",freq:1},
  {m:177,tamil:"ரீ",type:"geometric",freq:1},
  {m:198,tamil:"நண்",type:"geometric",freq:1},
  {m:206,tamil:"கோயிலண்ண",type:"pictogram",freq:1},
  {m:209,tamil:"கோயில்",type:"pictogram",freq:1},
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
  {m:392,tamil:"தவஇருவன்(ர்)",type:"geometric",freq:1},
  {m:404,tamil:"வ்வன்,வ்வர்",type:"geometric",freq:1},
  {m:2,tamil:"ரகர், கரர், காரர்",type:"geometric",freq:0},
  {m:5,tamil:"கண்",type:"geometric",freq:0},
  {m:6,tamil:"கி",type:"geometric",freq:0},
  {m:10,tamil:"கா",type:"compound",freq:0},
  {m:13,tamil:"காவ்வர்",type:"compound",freq:0},
  {m:14,tamil:"காவ்வன்",type:"compound",freq:0},
  {m:20,tamil:"கண்ணர்",type:"geometric",freq:0},
  {m:21,tamil:"கய",type:"geometric",freq:0},
  {m:22,tamil:"கண",type:"geometric",freq:0},
  {m:23,tamil:"கரி",type:"geometric",freq:0},
  {m:24,tamil:"ரிகரி",type:"geometric",freq:0},
  {m:27,tamil:"கட",type:"geometric",freq:0},
  {m:29,tamil:"மகம, கமகம",type:"compound",freq:0},
  {m:31,tamil:"கவ்வ",type:"compound",freq:0},
  {m:33,tamil:"அகவ",type:"compound",freq:0},
  {m:35,tamil:"கண",type:"geometric",freq:0},
  {m:37,tamil:"கமண",type:"geometric",freq:0},
  {m:39,tamil:"கெ, கே",type:"geometric",freq:0},
  {m:40,tamil:"கண,கண்ண",type:"geometric",freq:0},
  {m:42,tamil:"தவகதவ",type:"geometric",freq:0},
  {m:43,tamil:"கண",type:"geometric",freq:0},
  {m:49,tamil:"முக'",type:"geometric",freq:0},
  {m:52,tamil:"தேளனர்",type:"geometric",freq:0},
  {m:58,tamil:"தவ (early form)",type:"geometric",freq:0},
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
  {m:82,tamil:"வ அன்னம்=வனம்",type:"pictogram",freq:0},
  {m:84,tamil:"கால் = காற்று",type:"pictogram",freq:0},
  {m:88,tamil:"இரும்",type:"tally",freq:0},
  {m:90,tamil:"மூய=எருது",type:"tally",freq:0},
  {m:91,tamil:"முரா=மோர்",type:"tally",freq:0},
  {m:92,tamil:"இமூ",type:"tally",freq:0},
  {m:93,tamil:"ஓரிரு",type:"tally",freq:0},
  {m:94,tamil:"இருஓர்",type:"tally",freq:0},
  {m:95,tamil:"நான்கு,ந,நா",type:"tally",freq:0},
  {m:98,tamil:"மேற்படி -ஒரு",type:"tally",freq:0},
  {m:100,tamil:"இரு",type:"tally",freq:0},
  {m:101,tamil:"இரு",type:"tally",freq:0},
  {m:105,tamil:"நான்கு,நா,ந",type:"tally",freq:0},
  {m:107,tamil:"அய்,அய்ந்து",type:"tally",freq:0},
  {m:109,tamil:"ஆறு, நதி",type:"tally",freq:0},
  {m:112,tamil:"ஏழு, ஏ,எ",type:"tally",freq:0},
  {m:113,tamil:"எழுட்ட",type:"tally",freq:0},
  {m:115,tamil:"தொண்டு",type:"tally",freq:0},
  {m:116,tamil:"தொண்டு",type:"tally",freq:0},
  {m:117,tamil:"தொண்டுப",type:"tally",freq:0},
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
  {m:175,tamil:"வய",type:"geometric",freq:0},
  {m:190,tamil:"'வேலி'=நில அளவை",type:"pictogram",freq:0},
  {m:205,tamil:"ண,ணய்",type:"geometric",freq:0},
  {m:207,tamil:"கோயிலண்ணல்",type:"pictogram",freq:0},
  {m:210,tamil:"கோயில்",type:"pictogram",freq:0},
  {m:212,tamil:"பன்,பன",type:"geometric",freq:0},
  {m:213,tamil:"யன்",type:"geometric",freq:0},
  {m:214,tamil:"ச்,ச",type:"geometric",freq:0},
  {m:217,tamil:"ச்ச",type:"geometric",freq:0},
  {m:220,tamil:"சிவம்,சிவன்",type:"geometric",freq:0},
  {m:222,tamil:"சா",type:"geometric",freq:0},
  {m:225,tamil:"ச,ச்",type:"geometric",freq:0},
  {m:226,tamil:"சி",type:"geometric",freq:0},
  {m:227,tamil:"சரி",type:"geometric",freq:0},
  {m:229,tamil:"ஈ",type:"geometric",freq:0},
  {m:231,tamil:"'மலயமலய்'",type:"pictogram",freq:0},
  {m:232,tamil:"\"மலய் அரச'",type:"unknown",freq:0},
  {m:243,tamil:"அ தொழு",type:"geometric",freq:0},
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
  {m:321,tamil:"வவ்,வ்வ",type:"geometric",freq:0},
  {m:322,tamil:"வன்,வ்வன்",type:"geometric",freq:0},
  {m:323,tamil:"அரச",type:"geometric",freq:0},
  {m:324,tamil:"அரசன",type:"geometric",freq:0},
  {m:326,tamil:"அரச",type:"geometric",freq:0},
  {m:330,tamil:"அமூ",type:"geometric",freq:0},
  {m:331,tamil:"அன",type:"geometric",freq:0},
  {m:340,tamil:"அய் (old form)",type:"geometric",freq:0},
  {m:351,tamil:"யவ்வ,வவ்ய",type:"geometric",freq:0},
  {m:352,tamil:"ஆய,யா",type:"geometric",freq:0},
  {m:355,tamil:"தவய்ய",type:"geometric",freq:0},
  {m:356,tamil:"இதய்ய",type:"geometric",freq:0},
  {m:357,tamil:"தய்ய",type:"geometric",freq:0},
  {m:358,tamil:"ண்ண",type:"geometric",freq:0},
  {m:363,tamil:"மன்ன",type:"geometric",freq:0},
  {m:372,tamil:"வ்வவ்யய்",type:"geometric",freq:0},
  {m:373,tamil:"வ",type:"geometric",freq:0},
  {m:382,tamil:"வண்ண",type:"geometric",freq:0},
  {m:385,tamil:"வன",type:"geometric",freq:0},
  {m:388,tamil:"வயல்",type:"geometric",freq:0},
  {m:389,tamil:"வன",type:"geometric",freq:0},
  {m:390,tamil:"வனம்",type:"geometric",freq:0},
  {m:393,tamil:"தவஅவ்",type:"geometric",freq:0},
  {m:341,tamil:"பண், பண",type:"geometric",freq:0},
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

const MOTIF_META = {
  unicorn: { icon:"◈", name:"Unicorn",  color:"#c9963e" },
  elephant:{ icon:"◉", name:"Elephant", color:"#4a7c59" },
  bull:    { icon:"◆", name:"Bull",     color:"#a0522d" },
  zebu:    { icon:"◇", name:"Zebu",     color:"#8b6914" },
  tiger:   { icon:"▲", name:"Tiger",    color:"#b85450" },
  gharial: { icon:"◗", name:"Gharial",  color:"#4a6b7c" },
  composite:{ icon:"◇", name:"Composite", color:"#7b68ee" },
  rhinoceros:{ icon:"◆", name:"Rhinoceros", color:"#6b7c4a" },
  fabulous: { icon:"✦", name:"Fabulous animal", color:"#9b59b6" },
  pottery:  { icon:"◍", name:"Pottery shard", color:"#a0724a" },
  circle:   { icon:"◎", name:"Circle symbol", color:"#4a8b8b" },
  none:    { icon:"○", name:"No motif", color:"#8090a8" },
};
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
  statsRow: {display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24},
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
  twoCol: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20},
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

// ── IMAGE INVENTORY ───────────────────────────────────────
// Only these seals have actual glyph images in /public/seal_glyphs/
const SEAL_HAS_IMAGE = new Set([1045,1076,1110,1133,1220,1228,1386,1425,2082,2127,2167,2234,2322,2358,2442,2444,2503,2617,2648,2864,2929,2949,2950,3016,3023,3246,4284,4371,4440,4718,5119,8117]);

// ── PAGES ─────────────────────────────────────────────────
function SealBrowser({onSelect,selected}) {
  const [view,setView]     = useState("gallery");
  const [search,setSearch] = useState("");
  const [motif,setMotif]   = useState("all");
  const gallery = SEALS.filter(s => SEAL_HAS_IMAGE.has(Number(s.id)));
  const q = search.trim().toLowerCase();
  const tableRows = SEALS.filter(s => {
    if (motif !== "all" && s.motif !== motif) return false;
    if (!q) return true;
    return s.id.includes(q)||s.tamil.includes(q)||s.layer1.toLowerCase().includes(q)||(s.layer2&&s.layer2.toLowerCase().includes(q));
  });
  const dummy = null; // remove unused
  return (
    <div>
      <div style={S.pageTitle}>Seal Browser</div>
      <div style={S.pageSub}>Readings sourced directly from the author's documents · Layer 1 (phonemes) complete · Layer 2 (English meaning) in progress</div>
      <div className="oi-stats" style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>264</div><div style={S.statLabel}>Signs (author)</div></div>
        <div style={S.statCard}><div style={S.statNum}>198</div><div style={S.statLabel}>Readings shown</div></div>
        <div style={S.statCard}><div style={S.statNum}>~1000</div><div style={S.statLabel}>Total Studied</div></div>
        <div style={S.statCard}><div style={S.statNum}>400+</div><div style={S.statLabel}>Seals Documented</div></div>
      </div>
      {/* Stats */}
      <div className="oi-stats" style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>204</div><div style={S.statLabel}>Readings</div></div>
        <div style={S.statCard}><div style={S.statNum}>14</div><div style={S.statLabel}>With Images</div></div>
        <div style={S.statCard}><div style={S.statNum}>264</div><div style={S.statLabel}>Signs Mapped</div></div>
        <div style={S.statCard}><div style={S.statNum}>400+</div><div style={S.statLabel}>Total Studied</div></div>
      </div>
      {/* View tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #1e2533",marginBottom:20}}>
        {[["gallery",`Featured Gallery (${gallery.length})`],["table",`All Readings (${SEALS.length})`]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setView(id)} style={{
            background:"none", border:"none",
            borderBottom: view===id?"2px solid #c9963e":"2px solid transparent",
            color: view===id?"#c9963e":"#5a6070",
            padding:"8px 18px", cursor:"pointer",
            fontSize:11, fontFamily:"'Cinzel',serif", letterSpacing:"0.07em",
          }}>{lbl}</button>
        ))}
      </div>
      {/* GALLERY */}
      {view==="gallery" && (
        <div style={S.grid}>
          {gallery.map(seal=>(
            <div key={seal.id} style={S.sealCard(selected?.id===seal.id)} onClick={()=>onSelect(seal)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={S.sealId}>#{seal.id}</div>
                {seal.motif!=="none"&&<span style={{fontSize:11,color:MOTIF_META[seal.motif]?.color||"#c9963e"}}>{MOTIF_META[seal.motif]?.icon} {MOTIF_META[seal.motif]?.name}</span>}
              </div>
              <div style={{background:"#f5f0e8",marginBottom:8,overflow:"hidden",lineHeight:0}}>
                <img src={`${BASE}seal_glyphs/seal_${seal.id}.png?v=3`} alt={`Seal ${seal.id}`}
                  style={{width:"100%",display:"block",filter:"contrast(1.2)"}}/>
              </div>
              <div style={S.layer1}>{seal.layer1}</div>
              <div style={S.layer2(seal.status)}>{seal.layer2}</div>
              {seal.domain&&<div style={S.domainBadge(seal.domain)}>{seal.domain}</div>}
            </div>
          ))}
        </div>
      )}
      {/* TABLE */}
      {view==="table" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by seal ID, Tamil text, or meaning…"
              style={{flex:1,minWidth:180,background:"#0d1017",border:"1px solid #1e2533",
                color:"#e8dcc8",padding:"8px 12px",fontSize:12,outline:"none"}}/>
            <select value={motif} onChange={e=>setMotif(e.target.value)} style={{...S.sel,minWidth:130}}>
              <option value="all">All Motifs</option>
              {["unicorn","elephant","bull","zebu","tiger","gharial","none"].map(m=>(
                <option key={m} value={m}>{MOTIF_META[m]?.name||m}</option>
              ))}
            </select>
          </div>
          <div style={{fontSize:11,color:"#5a6070",marginBottom:10}}>Showing {tableRows.length} of {SEALS.length}</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid #1e2533"}}>
                  {["Seal","Motif","Tamil Reading","Romanization","English Meaning"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#5a6070",
                      fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((seal,i)=>(
                  <tr key={seal.id} onClick={()=>onSelect(seal)}
                    style={{borderBottom:"1px solid #13171f",cursor:"pointer",
                      background:selected?.id===seal.id?"#13171f":i%2===0?"transparent":"#0c1016"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#161c26"}
                    onMouseLeave={e=>e.currentTarget.style.background=selected?.id===seal.id?"#13171f":i%2===0?"transparent":"#0c1016"}
                  >
                    <td style={{padding:"7px 10px",color:"#c9963e",fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>
                      #{seal.id}{SEAL_HAS_IMAGE.has(Number(seal.id))&&<span title="Has image" style={{marginLeft:4,color:"#4a7c59",fontSize:9}}>▪</span>}
                    </td>
                    <td style={{padding:"7px 10px",color:"#8090a8",fontSize:11}}>
                      {seal.motif!=="none"?(MOTIF_META[seal.motif]?.icon+" "+MOTIF_META[seal.motif]?.name):"—"}
                    </td>
                    <td style={{padding:"7px 10px",fontFamily:"'Source Serif 4',serif",fontSize:13,color:"#e8dcc8"}}>{seal.tamil}</td>
                    <td style={{padding:"7px 10px",fontFamily:"'JetBrains Mono',monospace",color:"#c9963e",fontSize:11}}>{seal.layer1}</td>
                    <td style={{padding:"7px 10px",color:seal.status==="complete"?"#e8dcc8":"#3a4050",fontStyle:seal.status==="complete"?"normal":"italic"}}>
                      {seal.status==="complete"?seal.layer2:"—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  const hasTally  = false;

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
            {seal.site} · {seal.signCount||0} signs · <span style={{color:motifInfo.color}}>{motifInfo.icon} {seal.motif}</span>
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
            {(seal.signs||[]).map((m,i) => (
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
              {(seal.signs||[]).filter(m => TALLY_NAMES[m]).map((m,i) => (
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
          {(seal.signs||[]).map((m, i) => {
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
  const [srchSign, setSrchSign] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [signPage, setSignPage]  = useState(0);
  const PG = 30;

  const filtered = ALL_SIGNS.filter(s =>
    (typeFilter === "all" || s.type === typeFilter) &&
    (srchSign === "" ||
      String(s.m).includes(srchSign) ||
      s.tamil.toLowerCase().includes(srchSign.toLowerCase()))
  );

  const nPages  = Math.ceil(filtered.length / PG);
  const visible = filtered.slice(signPage * PG, (signPage + 1) * PG);
  const maxFreq = Math.max(...ALL_SIGNS.map(s => s.freq), 1);

  const goPage = (n) => {
    setSignPage(n);
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  return (
    <div>
      <div style={S.pageTitle}>Sign Registry</div>
      <div style={S.pageSub}>264 signs mapped · Mahadevan concordance · VPS2024 phonemes</div>

      <div className="oi-stats" style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>264</div><div style={S.statLabel}>Signs Mapped</div></div>
        <div style={S.statCard}><div style={S.statNum}>404</div><div style={S.statLabel}>Total in Corpus</div></div>
        <div style={S.statCard}><div style={S.statNum}>50+</div><div style={S.statLabel}>Unidentified</div></div>
        <div style={S.statCard}><div style={S.statNum}>1003</div><div style={S.statLabel}>Occurrences</div></div>
      </div>

      {/* Search */}
      <div style={{marginBottom:14}}>
        <input
          value={srchSign}
          onChange={e => { setSrchSign(e.target.value); setSignPage(0); }}
          placeholder="Search by M-number (e.g. 142) or Tamil phoneme…"
          style={{background:"#131822",border:"1px solid #1e2533",color:"#e8dcc8",
                  padding:"8px 14px",fontSize:13,width:"100%",outline:"none",
                  maxWidth:420}}
        />
      </div>

      {/* Type filters with descriptions */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        {[
          {id:"all",       label:"All Signs",   desc:"Show all 264 mapped signs",                              count: ALL_SIGNS.length},
          {id:"tally",     label:"Tally",        desc:"Stroke marks — encode Tamil numeral names as phonemes",  count: ALL_SIGNS.filter(s=>s.type==="tally").length},
          {id:"compound",  label:"Compound",     desc:"Two signs fused into one — e.g. M-10+M-12 = M-15",     count: ALL_SIGNS.filter(s=>s.type==="compound").length},
          {id:"pictogram", label:"Pictogram",    desc:"Image-based signs — cow face, peacock, mountain",       count: ALL_SIGNS.filter(s=>s.type==="pictogram").length},
          {id:"geometric", label:"Geometric",    desc:"Abstract geometric forms — most common category",       count: ALL_SIGNS.filter(s=>s.type==="geometric").length},
          {id:"modifier",  label:"Modifier",     desc:"Has form but no sound — modifies the adjacent sign",    count: ALL_SIGNS.filter(s=>s.type==="modifier").length},
        ].map(f => (
          <button key={f.id}
            onClick={() => { setTypeFilter(f.id); setSignPage(0); }}
            title={f.desc}
            style={{
              background: typeFilter===f.id ? "#1a1810" : "#131822",
              border:`1px solid ${typeFilter===f.id ? SIGN_TYPE_COLORS[f.id]||"#c9963e" : "#1e2533"}`,
              borderLeft:`3px solid ${typeFilter===f.id ? SIGN_TYPE_COLORS[f.id]||"#c9963e" : "#1e2533"}`,
              color: typeFilter===f.id ? SIGN_TYPE_COLORS[f.id]||"#c9963e" : "#8090a8",
              padding:"8px 14px", cursor:"pointer",
              textAlign:"left", minWidth:120,
            }}>
            <div style={{fontSize:12,fontWeight:"bold",letterSpacing:"0.04em"}}>{f.label}</div>
            <div style={{fontSize:9,color: typeFilter===f.id ? SIGN_TYPE_COLORS[f.id]||"#c9963e" : "#4a5060",
                         marginTop:2, opacity:0.8}}>{f.desc}</div>
            <div style={{fontSize:10,marginTop:3,fontFamily:"'Cinzel',serif",
                         color: typeFilter===f.id ? SIGN_TYPE_COLORS[f.id]||"#c9963e" : "#3a4050"}}>
              {f.count} signs
            </div>
          </button>
        ))}
      </div>

      {/* Count + page indicator */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:11,color:"#5a6070"}}>
          {filtered.length} signs {srchSign || typeFilter !== "all" ? "(filtered)" : ""}
        </div>
        {nPages > 1 && (
          <div style={{fontSize:12,color:"#c9963e",fontFamily:"'Cinzel',serif",letterSpacing:"0.06em"}}>
            Page {signPage + 1} / {nPages}
          </div>
        )}
      </div>

      {/* Sign grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(96px,1fr))",gap:10,marginBottom:24}}>
        {visible.map(s => (
          <div key={s.m} style={{
            background:"#131822",
            border:`1px solid ${SIGN_TYPE_COLORS[s.type]||"#1e2533"}`,
            padding:"10px 8px", textAlign:"center",
          }}>
            <SignGlyph mahadevan={s.m} size={56} showLabel={false} />
            <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#c9963e",marginTop:6}}>M-{s.m}</div>
            <div style={{fontSize:9,color:"#5a6070",marginTop:2,letterSpacing:"0.04em"}}>{s.type}</div>
            <div style={{fontSize:11,color:"#e8dcc8",marginTop:4,lineHeight:1.3}}>{s.tamil}</div>
            {s.freq > 0 && (
              <div style={{marginTop:6,height:3,background:"#1e2533"}}>
                <div style={{height:"100%",width:`${(s.freq/maxFreq)*100}%`,background:"#c9963e"}}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── PAGINATION ── big, unmissable ── */}
      {nPages > 1 && (
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"#131822", border:"1px solid #c9963e",
          padding:"14px 20px", marginBottom:20,
        }}>
          <button
            onClick={() => goPage(Math.max(0, signPage - 1))}
            disabled={signPage === 0}
            style={{
              background: signPage === 0 ? "none" : "#1a1810",
              border:`1px solid ${signPage === 0 ? "#2a3040" : "#c9963e"}`,
              color: signPage === 0 ? "#3a4050" : "#c9963e",
              padding:"10px 20px", cursor: signPage === 0 ? "default" : "pointer",
              fontSize:16, fontFamily:"'Cinzel',serif", letterSpacing:"0.06em",
            }}>
            ← PREV
          </button>

          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:"#c9963e",letterSpacing:"0.08em"}}>
              {signPage + 1} / {nPages}
            </div>
            <div style={{fontSize:10,color:"#5a6070",marginTop:2}}>
              {signPage * PG + 1}–{Math.min((signPage+1)*PG, filtered.length)} of {filtered.length}
            </div>
          </div>

          <button
            onClick={() => goPage(Math.min(nPages - 1, signPage + 1))}
            disabled={signPage === nPages - 1}
            style={{
              background: signPage === nPages-1 ? "none" : "#1a1810",
              border:`1px solid ${signPage === nPages-1 ? "#2a3040" : "#c9963e"}`,
              color: signPage === nPages-1 ? "#3a4050" : "#c9963e",
              padding:"10px 20px", cursor: signPage === nPages-1 ? "default" : "pointer",
              fontSize:16, fontFamily:"'Cinzel',serif", letterSpacing:"0.06em",
            }}>
            NEXT →
          </button>
        </div>
      )}

      <div style={{fontSize:10,color:"#3a4050",padding:"8px 0",borderTop:"1px solid #1e2533"}}>
        50+ signs unidentified — ongoing research. Future: Tamil family comparative study.
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
      <div className="oi-stats" style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum}>3</div><div style={S.statLabel}>Open Objections</div></div>
        <div style={S.statCard}><div style={S.statNum}>1</div><div style={S.statLabel}>Addressed</div></div>
        <div style={S.statCard}><div style={S.statNum}>0</div><div style={S.statLabel}>Reviews In</div></div>
        <div style={S.statCard}><div style={S.statNum}>8</div><div style={S.statLabel}>Evidence Links</div></div>
      </div>
      <div style={{background:"#1a1612",border:"1px solid #3a2518",padding:"10px 14px",fontSize:12,color:"#8b6914",marginBottom:20}}>
        📬 Platform is accepting peer reviewers. Contact: ponmuthushanmugham@gmail.com · All reviews logged publicly.
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
  const [page, setPage] = useState("about");
  const [sel, setSel]   = useState(null);

  const nav = [
    {id:"about",   icon:"◎", label:"Overview"},
    {id:"seals",   icon:"◈", label:"Readings"},
    {id:"signs",   icon:"▦", label:"Signs"},
    {id:"pubs",   icon:"▤", label:"Publications"},
  ];

  const navigate = (id) => { setPage(id); setSel(null); };

  return (
    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",background:"#0e1117",minHeight:"100vh",color:"#e8dcc8",display:"flex",flexDirection:"column"}}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <div className="oi-header" style={{
        background:"#0a0d13", borderBottom:"1px solid #1e2533",
        padding:"0 12px", position:"sticky", top:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap",
      }}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#c9963e",
          letterSpacing:"0.12em",fontWeight:700,padding:"12px 0",whiteSpace:"nowrap"}}>
          OPEN INDUS LAB
        </span>

        <div className="oi-tabs" style={{display:"flex",gap:0,overflowX:"auto"}}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>navigate(n.id)} style={{
              background:"none", border:"none",
              borderBottom: page===n.id?"2px solid #c9963e":"2px solid transparent",
              color: page===n.id?"#c9963e":"#5a6070",
              padding:"14px 14px", cursor:"pointer",
              fontSize:11, fontFamily:"'Cinzel',serif", letterSpacing:"0.07em",
            }}>
              <span style={{marginRight:4}}>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>

        <span className="oi-badge" style={{fontSize:10,color:"#2a3040",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
          VPS · 2024
        </span>
      </div>

      {/* ── CONTENT ────────────────────────────────────── */}
      <div className="oi-main" style={{flex:1,overflow:"auto",padding:"24px 20px",maxWidth:1100,margin:"0 auto",width:"100%"}}>
        {page==="about" && <AboutPage go={navigate}/>}
        {page==="seals" && (
          <>
            <SealBrowser onSelect={setSel} selected={sel}/>
            {sel && <SealDetail seal={sel} onClose={()=>setSel(null)}/>}
          </>
        )}
        {page==="signs" && <SignRegistry/>}
        {page==="pubs" && <PublicationsPage/>}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        html { -webkit-text-size-adjust: 100%; }
        img { max-width: 100%; }
        a { word-break: break-word; }
        @media (max-width: 700px) {
          .oi-badge { display: none; }
          .oi-header { padding: 0 8px !important; }
          .oi-tabs { width: 100%; order: 3; justify-content: space-around;
                     border-top: 1px solid #1e2533; }
          .oi-tabs button { padding: 10px 6px !important; flex: 1; white-space: nowrap; }
          .oi-main { padding: 16px 10px !important; }
          .oi-stats { grid-template-columns: repeat(2,1fr) !important; gap: 8px !important; }
          .oi-stats > div { padding: 10px 12px !important; }
        }
      `}</style>
    </div>
  );
}


function AboutPage({go}) {
  const H = ({children}) => (
    <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#c9963e",letterSpacing:"0.1em",
      textTransform:"uppercase",borderBottom:"1px solid #1e2533",paddingBottom:8,margin:"28px 0 12px"}}>{children}</div>
  );
  const P = ({children}) => (
    <p style={{fontSize:14,lineHeight:1.75,color:"#c8bfa8",margin:"0 0 12px"}}>{children}</p>
  );
  const raw = "https://github.com/premkumar2306/open-indus-lab/blob/main/data/seed/";
  const L = ({id,children}) => (<a onClick={()=>go(id)} style={{color:"#c9963e",cursor:"pointer",textDecoration:"underline"}}>{children}</a>);
  return (
    <div style={{maxWidth:760}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:24,color:"#e8dcc8",fontWeight:600,letterSpacing:"0.05em",marginBottom:6}}>
        Reading the Indus-Harappan Script as an Ancient Classical Language
      </div>
      <div style={{fontSize:12,color:"#5a6070",letterSpacing:"0.04em",marginBottom:22}}>
        Research by V.P. (Ponmuthu) Shanmugham · Open platform for verification and peer review
      </div>

      <P>
        This platform presents a body of research that hypothesizes and develops verifiable
        arguments that the Indus-Harappan script is an ancient form of a classical spoken
        language. The approach prioritizes reconstructing the <em>spoken language</em>, which is
        a priori to writing — the Rosetta Stone suggests the need for a bounded research
        space, over decoding signs in isolation. The research reconstructs the signs and seals
        and maps them to ancient Tamizi's suggestive graphemes and phonemes. Pictograms and
        tally marks act as placeholders and evolve to geometric signs by schematization and
        acrophony; meaningful sound sequences emerge. The full methodology, used across the
        author's books, is summarized in the upcoming book "Indus Scripts Research Keys" and
        in the research paper hosted here.
      </P>
      <P>
        With nothing to decode or decipher, the research is presented for inspection: trace it
        to the source documents, reproduce the analysis for added seal readings, and discuss
        challenges in public. Falsification tests are indicated below.
      </P>

      <H>Method in brief</H>
      <P>
        The work identifies 10 vowels and 18 consonants suggestive of the later Tamizi
        geometric script. Five mechanisms carry most of the research weight:
        (1) the most frequent <b>"cow face" pictogram</b> (sign 342, phoneme <i>aa</i>, an
        onomatopoeia meaning cow — as 'kaakkaa' means crow), anchoring hundreds of
        animal-husbandry seals; (2) <b>tally marks as placeholders</b> evolving by acrophony
        into geometric sign phonemes — tally-4 (<i>nanku</i>) acrophonically becomes
        <i> na</i>, combines with the <i>y</i> sign (162) sounding <i>nay/ney</i>, ghee: a
        four-sign word (seal 2950) evolves to two signs (1133) and then to a single sign (199)
        <i> nay</i>; (3) <b>pictograms evolving by schematization or stylization</b> to
        geometric signs (sign 83 evolves to 367; 326 to 324; signs 1, 10, 12, 14, 15 also
        evolve by building upon signs); (4) <b>modifiers</b> — graphemes with form but no
        phoneme that grammatically alter signs and syllables, explaining many "singleton"
        signs with high information densities; and (5) <b>seal motifs read under the urban
        topology hypothesis</b>: the unicorn marks a Market Common; some animal motifs name
        streets; some motif-less seals indicate city-wide ordinances (some seals lack motifs
        in the declining-cities phase); others appear as product markers, locating banners,
        and jurisdictions.
      </P>

      <H>Falsification tests — the author's challenge</H>
      <P>
        The research stakes out testable ground rather than asking for belief. Three
        falsification routes are named in the paper: <b>script evolution</b> — the claim that
        sign sequences compress over generations (eight signs becoming four, becoming two,
        becoming one, as in seals 2949, 2950 → signs 1220, 1133) is checkable against
        stratigraphy, seriation and relative dating: run the test and disprove it.
        <b> Chemistry</b> — the pottery shard bearing the ghee reading (seal 2929) is a named
        GC-MS test piece: milk lipids present or absent is an independent, binary verdict.
        <b> A blind read</b> — a held-out page of Mahadevan's concordance (Fig. 7 of the
        paper) read cold with the published phoneme table, reproducible by anyone.
      </P>

      <H>What you can verify here</H>
      <P>
        Seal readings transcribed directly from the author's reading book, in original Tamil
        with romanization — browse them under <L id="seals">Readings</L>. Sign-to-phoneme
        mappings with the author's glyph images under <L id="signs">Signs</L>. The research
        paper and the author's books are under <L id="pubs">Publications</L>.
      </P>
      <P style={{fontSize:13}}>
        Reading layers: the paper presents 46 signs (Table 1) and 32 seal readings (Table 2)
        with English meanings — enough for researchers to read and find nine different uses
        for seals. The full book corpus is larger: 264 sign mappings (~280 in the book) and
        194 seal readings (220+ in the book), with English meanings being added
        progressively.
      </P>

      <H>Data &amp; reproducibility</H>
      <P>
        Canonical datasets (CSV, traceable to source documents):{" "}
        <a href={raw+"seals_master.csv"} target="_blank" rel="noreferrer" style={{color:"#c9963e"}}>seals_master.csv</a> (194 readings from the book) ·{" "}
        <a href={raw+"signs_master.csv"} target="_blank" rel="noreferrer" style={{color:"#c9963e"}}>signs_master.csv</a> (264 sign mappings) ·{" "}
        <a href={raw+"readings_paper_VER4.csv"} target="_blank" rel="noreferrer" style={{color:"#c9963e"}}>readings_paper_VER4.csv</a> (the paper's 40 readings with meanings).
        A validation suite runs every 4 hours; results are committed to the repository.
        Every read seal represents groups of similar seals (2, 20, 40, 60, 130, 160, up to
        300), so the readable seal count is much higher.
      </P>

      <H>For reviewers</H>
      <P>
        The author welcomes critical review from researchers in archaeology, linguistics,
        epigraphy, anthropology, urban topology, AI and machine learning, and related
        fields. Contact:{" "}
        <a href="mailto:ponmuthushanmugham@gmail.com" style={{color:"#c9963e"}}>ponmuthushanmugham@gmail.com</a>.
        Questions, challenges and author responses are logged publicly. Source code and
        data:{" "}
        <a href="https://github.com/premkumar2306/open-indus-lab" target="_blank" rel="noreferrer" style={{color:"#c9963e"}}>github.com/premkumar2306/open-indus-lab</a>.
      </P>
    </div>
  );
}

function PublicationsPage() {
  const H = ({children}) => (
    <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#c9963e",letterSpacing:"0.1em",
      textTransform:"uppercase",borderBottom:"1px solid #1e2533",paddingBottom:8,margin:"26px 0 14px"}}>{children}</div>
  );
  const Item = ({title, meta, children}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:15,color:"#e8dcc8",fontFamily:"'Source Serif 4',serif",marginBottom:3}}>{title}</div>
      {meta && <div style={{fontSize:11,color:"#5a6070",marginBottom:4}}>{meta}</div>}
      <div style={{fontSize:13,color:"#c8bfa8",lineHeight:1.65}}>{children}</div>
    </div>
  );
  return (
    <div style={{maxWidth:760}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#e8dcc8",fontWeight:600,letterSpacing:"0.05em",marginBottom:4}}>
        Publications
      </div>
      <div style={{fontSize:11,color:"#5a6070",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:8}}>
        The paper and books behind this platform
      </div>

      <H>Research paper</H>
      <Item title="Indus-Harappan Script: A Multi-Disciplinary Analysis of Linguistic Continuity and Urban Topology"
        meta="V.P. (Ponmuthu) Shanmugham · Final draft, 2026">
        Reading the Indus-Harappan script with tools of a new paradigm — sound-first
        reconstruction, tally-mark acrophony, modifiers, and the urban-topology reading of
        seal motifs, with falsification tests.{" "}
        <a href={`${BASE}paper/Indus-Harappan-Script_Shanmugham_2026.pdf`} target="_blank" rel="noreferrer"
          style={{color:"#c9963e"}}>Download the paper (PDF)</a>
      </Item>

      <H>Books by the author</H>
      <Item title="Ancient Harappans Speak! After 5000 Years"
        meta="Paperback ISBN 979-8-9949362-3-5 (IngramSpark — Barnes & Noble and library distribution) · eBook ISBN 979-8-9940362-4-2 (Amazon)">
        The full research narrative for general and scholarly readers.
      </Item>
      <Item title="Indus Script is a Language — A Living Language of 80 Million (Bilingual)"
        meta="ISBN 979-8-9940362-6-6 · Self-published 2026 · Available in India via Kavin Publishers (kavinpublishing.in)">
        Bilingual (Tamil/English) presentation of the readings and method.
      </Item>

      <H>Foundational references</H>
      <Item title="சிந்துவெளியில் முந்து தமிழ் (sinthuveLiyil munthu thamiz)"
        meta="Purnachandra Jeeva · Yalisaip Pathippagam, 2020 · ISBN 978-81-9427-9105 (Tamil)">
        Thirty years of independent research identifying the Tamil syllabic structure of the
        script — the work that drew the author into this study. Some results are used here,
        with substantial deviations and extensions.
      </Item>
      <Item title="Indus Script Web Tool — Roja Muthiah Research Library (RMRL), Chennai"
        meta="www.indusscript.in">
        Source of most seal images referenced in the research.
      </Item>
      <Item title="Mahadevan, I. — The Indus Script: Texts, Concordance and Tables"
        meta="Archaeological Survey of India, Memoir 77, 1977">
        The foundational concordance this research builds upon.
      </Item>
    </div>
  );
}
