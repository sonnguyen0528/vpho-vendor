import { useState, useMemo, useCallback } from "react";

const ITEMS = [
  { id: 1, cat: "Protein", name: "Chicken Breast Boneless 40lb", unit: "/LB", sj: 1.45, cj: 1.55, sjD: "Wayne Sanderson S/L Butterfly #40", cjD: "WF Fresh 40lbs", sjI: "12/22", cjI: "01/13", note: "CJ ranged $1.45–$1.55 across invoices", kw: "chicken breast boneless" },
  { id: 2, cat: "Protein", name: "Chicken Breast 40lb (case rate)", unit: "/CS", sj: 74.80, cj: 58.00, sjD: "FR-Breast Mt Wayne #40", cjD: "~$58/CS handwritten on SJ invoice", sjI: "12/22", cjI: "—", note: "Handwritten CJ comparison on SJ invoice", kw: "chicken breast case" },
  { id: 3, cat: "Protein", name: "Beef Brisket", unit: "/LB", sj: 5.35, cj: 4.49, sjD: "BF Brisket PaloDuro", cjD: "Sukarne Beef Brisket", sjI: "01/08", cjI: "12/30", kw: "beef brisket" },
  { id: 4, cat: "Protein", name: "Beef Tenderloin 2/3", unit: "/LB", sj: 8.70, cj: null, sjD: "Consistent $8.70 across 7 invoices", sjI: "12/22–01/16 (7x)", kw: "beef tenderloin" },
  { id: 5, cat: "Protein", name: "Beef Back Rib Circle-T", unit: "/LB", sj: 2.92, cj: null, sjD: "BF Back Rib W50338 CW", sjI: "12/22,12/30,01/05,01/09,01/15", kw: "beef back rib" },
  { id: 6, cat: "Protein", name: "Beef Eye Round", unit: "/LB", sj: 4.99, cj: null, sjD: "BF Eye Round", sjI: "01/12", kw: "beef eye round" },
  { id: 7, cat: "Protein", name: "Beef Omasum Shredded", unit: "/CS", sj: 75.95, cj: null, sjD: "BF Omasum Shredded", sjI: "01/09, 12/31", kw: "beef omasum tripe" },
  { id: 8, cat: "Protein", name: "Beef Leg Tendon Swift Flexor", unit: "/CS", sj: 92.40, cj: null, sjD: "BF Leg Tendon Swift Flexor", sjI: "01/05", kw: "beef leg tendon" },
  { id: 9, cat: "Protein", name: "Beef Short Rib 3Rib (IBP)", unit: "/CS", sj: 327.60, cj: null, sjD: "Cut Short 3Rib IBP", sjI: "12/31", kw: "beef short rib" },
  { id: 10, cat: "Protein", name: "Beef Banana Shank Boneless", unit: "/LB", sj: null, cj: 4.98, cjD: "Sukarne Beef Banana Shank", cjI: "12/30", kw: "beef shank banana boneless" },
  { id: 11, cat: "Protein", name: "Beef Tendon Ball 542JB", unit: "/CS", sj: 108.00, cj: null, sjD: "Beef Tendon Ball Cooked", sjI: "01/12, 12/31", kw: "beef tendon ball" },
  { id: 12, cat: "Protein", name: "Chicken Bone Frames Pitman", unit: "/CS", sj: 34.00, cj: null, sjD: "Chix Bone Frames Pitman", sjI: "12/31", kw: "chicken bone frames" },
  { id: 13, cat: "Protein", name: "Chicken Bone RIO 40lbs", unit: "/LB", sj: null, cj: 0.69, cjD: "RIO Chicken Bone 40lbs", cjI: "01/13", kw: "chicken bone rio" },
  { id: 14, cat: "Protein", name: "Jumbo Party Wing Wayne", unit: "/CS", sj: 94.80, cj: null, sjD: "Jumbo Party Wing Wayne", sjI: "12/31", kw: "chicken wing party jumbo" },
  { id: 15, cat: "Protein", name: "Leg Quarter Wayne Halal", unit: "/CS", sj: 36.40, cj: null, sjD: "Leg Quarter Wayne Halal", sjI: "01/08", kw: "chicken leg quarter" },
  { id: 16, cat: "Protein", name: "Brown Cockerels Rooster", unit: "/CS", sj: 162.00, cj: null, sjD: "Brown Cockerels Rooster", sjI: "01/12", kw: "rooster cockerels brown" },
  { id: 17, cat: "Protein", name: "Whole Chicken Fresh", unit: "/LB", sj: null, cj: 1.55, cjD: "Fresh WC Whole Chicken", cjI: "CSV", kw: "whole chicken fresh" },
  { id: 18, cat: "Seafood", name: "Shrimp 26/30 IQF P&D Tail On", unit: "/CS", sj: 57.50, cj: 54.50, sjD: "PDT-ON Good Old #10 box", cjD: "Talassa 5x2lbs ($5.45x10)", sjI: "12/22,12/27,01/08,01/09", cjI: "01/06,01/13", note: "Different pack sizes", kw: "shrimp 26 30 peeled deveined tail" },
  { id: 19, cat: "Seafood", name: "Shrimp 16/20 Shell-On", unit: "/LB", sj: 8.70, cj: null, sjD: "Headless Shell-on 16/20", sjI: "CSV", kw: "shrimp 16 20 shell" },
  { id: 20, cat: "Seafood", name: "Squid Tube U5 #13.2", unit: "/CS", sj: 53.95, cj: 53.00, sjD: "SQ Tube Fishboy U5", cjD: "U5 Squid Tube", sjI: "12/30", cjI: "01/13", kw: "squid tube calamari" },
  { id: 21, cat: "Seafood", name: "Lobster Ball Lion Head #30", unit: "/CS", sj: 130.50, cj: null, sjD: "Lobster Ball Lion Head DT", sjI: "12/22", kw: "lobster ball" },
  { id: 22, cat: "Seafood", name: "Fish Ball w/ Fish Roe 25pc", unit: "/CS", sj: 140.30, cj: null, sjD: "Golden Fried 25pcX12oz", sjI: "12/22", kw: "fish ball roe" },
  { id: 23, cat: "Produce", name: "Bean Sprout", unit: "/CS", sj: 18.25, cj: 18.28, sjD: "Salad Cosmo #20", cjD: "Japan Bean Sprout 4x5lbs", sjI: "12/27-01/16 (7x)", cjI: "12/30, 01/06", note: "Essentially tied", kw: "bean sprout" },
  { id: 24, cat: "Produce", name: "Thai / Mexico Basil", unit: "/PC", sj: 6.10, cj: null, sjD: "Thai/Mexico Basil #1", sjI: "12/27-01/16 (6x)", kw: "basil thai mexico" },
  { id: 25, cat: "Produce", name: "Green Onion", unit: "/CS", sj: 63.89, cj: 64.50, sjD: "Green Onion M 4Doz", cjD: "No Return ($62-$67)", sjI: "12/27", cjI: "12/30, 01/13", kw: "green onion scallion" },
  { id: 26, cat: "Produce", name: "Green Cabbage", unit: "/PC", sj: 5.12, cj: null, sjD: "Green Cabbage #3.5-4.5", sjI: "01/05, 01/12", kw: "cabbage green" },
  { id: 27, cat: "Produce", name: "Green Leaf Lettuce", unit: "/CS", sj: 24.89, cj: 26.00, sjD: "Green Leaf Lettuce", cjD: "Green Leaves No Return", sjI: "01/16", cjI: "01/06", kw: "green leaf lettuce" },
  { id: 28, cat: "Produce", name: "Jalapeno", unit: "varies", sj: 8.75, cj: 1.59, sjD: "SJ: $8.75/PC", cjD: "CJ: $1.59/LB", sjI: "12/22,12/31,01/15", cjI: "01/06,01/13", note: "Different units — PC vs LB", kw: "jalapeno pepper hot" },
  { id: 29, cat: "Produce", name: "Lemon", unit: "/CS", sj: null, cj: 28.00, cjD: "Lemon No Return", cjI: "01/06, 01/13", kw: "lemon" },
  { id: 30, cat: "Produce", name: "Lemon Grass", unit: "/PC", sj: 9.95, cj: null, sjD: "PC-Lemon Grass #5", sjI: "12/22, 01/15", kw: "lemongrass lemon grass" },
  { id: 31, cat: "Produce", name: "Daikon", unit: "/PC", sj: 6.50, cj: null, sjD: "Daikon", sjI: "01/16", kw: "daikon radish" },
  { id: 32, cat: "Produce", name: "China Ginger #25UP", unit: "/CS", sj: 57.95, cj: null, sjD: "China Ginger #25UP", sjI: "01/05", kw: "ginger china" },
  { id: 33, cat: "Produce", name: "Carrot", unit: "varies", sj: 4.50, cj: 16.50, sjD: "SJ: $4.50/PC", cjD: "CJ: $16.50/BAG", sjI: "12/27", cjI: "01/13", note: "Different units", kw: "carrot" },
  { id: 34, cat: "Produce", name: "Jumbo Yellow Onion", unit: "/BAG", sj: null, cj: 12.25, cjD: "No Return ($12-$12.50)", cjI: "12/30, 01/13", kw: "yellow onion white onion jumbo" },
  { id: 35, cat: "Produce", name: "Navel Orange (Gift)", unit: "/CS", sj: 0.00, cj: null, sjD: "FREE ORANGE AS NEW YEAR GIFT", sjI: "12/22", kw: "orange navel" },
  { id: 36, cat: "Produce", name: "King Oyster Mushroom L", unit: "/CS", sj: 20.95, cj: null, sjD: "King Oyster L #11", sjI: "12/30", kw: "mushroom king oyster" },
  { id: 60, cat: "Produce", name: "Firm Tofu Fong Kee 60PC", unit: "/CS", sj: 18.50, cj: null, sjD: "Firm Tofu Fong Kee 60PC", sjI: "12/27, 01/05, 01/15", kw: "tofu firm fong kee" },
  { id: 37, cat: "Sauces", name: "Hoisin Sauce", unit: "/CS", sj: 22.96, cj: 34.50, sjD: "Shing Kee Hoisin #8", cjD: "LKK Hoi Sin 6x5lbs", sjI: "12/22, 01/15", cjI: "01/13", note: "SJ significantly cheaper", kw: "hoisin sauce" },
  { id: 38, cat: "Sauces", name: "Oyster Sauce", unit: "/CS", sj: null, cj: 35.50, cjD: "LKK Panda 6x5lbs", cjI: "01/13", kw: "oyster sauce" },
  { id: 39, cat: "Sauces", name: "Sriracha Huy Fong 12x28oz", unit: "/CS", sj: 42.30, cj: null, sjD: "Sriracha Huy Fong 12x28oz", sjI: "01/08", kw: "sriracha siracha hot sauce huy fong bottle rooster" },
  { id: 40, cat: "Sauces", name: "Sriracha S.K. 8lb", unit: "/CS", sj: 22.96, cj: null, sjD: "Sriracha S.K. 8lb", sjI: "12/31", kw: "sriracha siracha sk bulk" },
  { id: 41, cat: "Sauces", name: "Sweet Chili Mae Ploy 12x730ml", unit: "/CS", sj: 37.88, cj: null, sjD: "Sweet Chili Mae Ploy", sjI: "01/08", kw: "sweet chili mae ploy" },
  { id: 42, cat: "Sauces", name: "Premium Soy Sauce 5gal", unit: "/PAL", sj: null, cj: 24.50, cjD: "LKK Premium Soy 5gal", cjI: "01/06", kw: "soy sauce lee kum kee lkk premium" },
  { id: 43, cat: "Sauces", name: "Sweet & Sour Sauce 500pcs", unit: "/CS", sj: null, cj: 23.78, cjD: "Double Hi Sweet & Sour", cjI: "01/06", kw: "sweet sour sauce packet" },
  { id: 44, cat: "Dry Goods", name: "Pho Noodle Fresh", unit: "/PC", sj: 9.50, cj: 9.95, sjD: "Banh Pho Tuoi Sincere", cjD: "Pho Noodle 10lbs", sjI: "12/30,01/05,01/09,01/16", cjI: "12/30", note: "Close — verify pack sizes", kw: "pho noodle fresh banh" },
  { id: 45, cat: "Dry Goods", name: "Vietnam Vermicelli 3Lady 18PC", unit: "/CS", sj: 86.50, cj: null, sjD: "Vietnam Vermicelli 3Lady", sjI: "01/05", kw: "vermicelli bun vietnam" },
  { id: 46, cat: "Dry Goods", name: "Chinese Noodle", unit: "/CS", sj: 9.95, cj: null, sjD: "Chinese Noodle", sjI: "01/12", kw: "chinese noodle lo mein" },
  { id: 47, cat: "Dry Goods", name: "Spring Roll Shells 40pc", unit: "/CS", sj: 57.85, cj: 49.78, sjD: "Wei-Chuan 40PC", cjD: "O'Tasty 40x25pcs", sjI: "01/05", cjI: "01/13, 12/30", note: "CJ saves $8-$10/CS", kw: "spring roll wrapper shell skin" },
  { id: 48, cat: "Dry Goods", name: "Fried Wan Ton Skin Kim Hong 24PC", unit: "/CS", sj: 46.00, cj: null, sjD: "Fried Wan Ton Skin Kim Hong", sjI: "12/27", kw: "wonton wanton skin fried" },
  { id: 49, cat: "Dry Goods", name: "Corn Starch", unit: "/CS", sj: 31.95, cj: null, sjD: "Corn Starch", sjI: "01/15", kw: "corn starch" },
  { id: 50, cat: "Dry Goods", name: "Rock Candy 50x454g", unit: "/CS", sj: null, cj: 59.50, cjD: "Rock Candy 50x454g", cjI: "12/30, 01/13", kw: "rock candy sugar crystal" },
  { id: 51, cat: "Dry Goods", name: "C&H Sugar 50lbs", unit: "/BAG", sj: null, cj: 32.50, cjD: "C&H Granulated Sugar", cjI: "01/06", kw: "sugar white granulated ch bag" },
  { id: 52, cat: "Dry Goods", name: "Salt Tru-Flo 50lbs", unit: "/BAG", sj: null, cj: 11.78, cjD: "Salt USC 50lbs", cjI: "12/30", kw: "salt bag bulk" },
  { id: 53, cat: "Dry Goods", name: "Ajinomoto MSG 44lbs", unit: "/BAG", sj: null, cj: 73.50, cjD: "Ajinomoto Regular USA", cjI: "12/30", kw: "msg ajinomoto seasoning" },
  { id: 54, cat: "Dry Goods", name: "Panko Bread Crumb Japan 20lbs", unit: "/BAG", sj: null, cj: 25.50, cjD: "Japan Large Panko", cjI: "12/30", kw: "panko bread crumb" },
  { id: 55, cat: "Dry Goods", name: "Tempura Batter Mix 40lbs", unit: "/BAG", sj: null, cj: 45.78, cjD: "Wei-Pac Gold Tempura", cjI: "12/30", kw: "tempura batter mix" },
  { id: 56, cat: "Dry Goods", name: "Dried Minced Garlic 5lbs", unit: "/BAG", sj: null, cj: 13.78, cjD: "CJ Dried Minced 8/16", cjI: "01/06", kw: "garlic dried minced" },
  { id: 57, cat: "Dry Goods", name: "Dried Fungus Whole 5lbs", unit: "/BAG", sj: null, cj: 28.78, cjD: "Superior Dried Fungus", cjI: "01/06", kw: "fungus dried wood ear mushroom" },
  { id: 58, cat: "Oils", name: "Frying Oil Clear", unit: "varies", sj: 32.95, cj: 29.50, sjD: "Heavenly Chef 560FL.OZ/CS", cjD: "CJ Clear Soy 35lbs/PAL", sjI: "01/12", cjI: "12/30, 01/13", note: "Different units — CJ appears cheaper", kw: "frying oil deep fried cooking oil clear" },
  { id: 59, cat: "Oils", name: "Unsalted Butter FR Country Cream", unit: "/CS", sj: 105.00, cj: null, sjD: "FR Unsalted Butter Country Cream", sjI: "12/27", kw: "butter unsalted cream" },
  { id: 61, cat: "Supplies", name: "32oz Soup Cup & Lid 250sets", unit: "/CS", sj: null, cj: 39.50, cjD: "CJ Clear Plastic 32oz", cjI: "01/06, 01/13", kw: "32oz soup cup togo clear thick layer" },
  { id: 62, cat: "Supplies", name: "32oz Container KD29B 150sets", unit: "/CS", sj: null, cj: 25.50, cjD: "KD29B Black Base Clear Lid", cjI: "01/13", kw: "32oz container black togo bowl kd29b" },
  { id: 63, cat: "Supplies", name: "Wooden Chopsticks 40x100pairs", unit: "/CS", sj: null, cj: 49.50, cjD: "CJ Japan Wooden Chopstick", cjI: "01/13", kw: "chopstick wooden" },
  { id: 64, cat: "Supplies", name: "Jumbo Straws Wrapped 100pcs", unit: "/BAG", sj: null, cj: 1.45, cjD: "CJ Plastic Straws 21cm", cjI: "01/06", kw: "straw jumbo plastic" },
  { id: 65, cat: "Supplies", name: "Paper Straws 7.75in 400pcs", unit: "/BOX", sj: null, cj: 2.18, cjD: "CJ Paper Wrapped Plastic", cjI: "01/06", kw: "straw paper" },
  { id: 66, cat: "Supplies", name: "Food Container #4 Brown 4x40pcs", unit: "/CS", sj: null, cj: 39.50, cjD: "CJ Brown Paperboard #4", cjI: "01/06", kw: "food container brown paperboard #4" },
  { id: 67, cat: "Supplies", name: "Food Container #1 Brown 9x50pcs", unit: "/CS", sj: null, cj: 44.50, cjD: "CJ Brown Paperboard #1", cjI: "01/06", kw: "food container brown paperboard #1" },
];

const CATS = ["All","Protein","Seafood","Produce","Sauces","Dry Goods","Oils","Supplies"];
function w(sj,cj){if(sj==null&&cj==null)return"none";if(sj==null)return"cj-only";if(cj==null)return"sj-only";if(Math.abs(sj-cj)<0.01)return"tie";return sj<cj?"sj":"cj";}
function fmt(v){return v==null?"—":v===0?"FREE":"$"+v.toFixed(2);}
function diff(a,b){return a==null||b==null?null:Math.abs(a-b);}
function pct(a,b){if(a==null||b==null)return null;const m=Math.max(a,b);return m===0?0:(Math.abs(a-b)/m)*100;}
function bestV(item){if(!item)return{vendor:null,price:null};if(item.sj!=null&&item.cj!=null)return item.sj<=item.cj?{vendor:"SJ",price:item.sj}:{vendor:"CJ",price:item.cj};if(item.sj!=null)return{vendor:"SJ",price:item.sj};if(item.cj!=null)return{vendor:"CJ",price:item.cj};return{vendor:null,price:null};}

const S={card:{background:"linear-gradient(180deg,#fff 0%,#f8f8fa 100%)",border:"1px solid rgba(255,255,255,0.8)",boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.03),inset 0 1px 0 rgba(255,255,255,0.9)",borderRadius:14},lbl:{fontSize:10,fontWeight:600,color:"#8e8e93",textTransform:"uppercase",letterSpacing:1.2}};
const pill=a=>({border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",background:a?"linear-gradient(180deg,#1c1c1e 0%,#2c2c2e 100%)":"linear-gradient(180deg,#fff 0%,#f8f8fa 100%)",color:a?"#fff":"#636366",boxShadow:a?"0 2px 8px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.08)":"0 1px 3px rgba(0,0,0,.04),inset 0 1px 0 rgba(255,255,255,.9)"});

/* ── Bulk order parser ── */
function parseOrderList(text){
  const lines=text.split(/\n/).map(l=>l.trim()).filter(Boolean);
  return lines.map(line=>{
    const m=line.match(/^(\d+\.?\d*)\s*(box|boxes|case|cases|bag|bags|pc|pcs|piece|pieces|lb|lbs|pound|pounds|cs|pack|packs|each|ea|pallet|pal|gallon|gal|bottle|bottles|can|cans|jar|jars|roll|rolls|ct|count|set|sets|pair|pairs|dozen|doz|bundle|bundles|carton|cartons|tub|tubs|bucket|buckets|unit|units)?\s*(of\s+)?(.+)$/i);
    let qty=1,txt=line;
    if(m){qty=parseFloat(m[1])||1;txt=m[4]||line;}
    else{const s=line.match(/^(\d+\.?\d*)\s+(.+)$/);if(s){qty=parseFloat(s[1])||1;txt=s[2];}}
    txt=txt.replace(/^\s*(of|x|-)\s*/i,"").trim();
    return{rawLine:line,qty:Math.max(1,Math.round(qty)),itemText:txt,matched:fuzzy(txt)};
  });
}
function fuzzy(q){
  q=q.toLowerCase().trim();if(!q)return null;
  const stop=new Set(["box","boxes","case","cases","bag","bags","pc","pcs","lb","lbs","the","a","an","of","for","my","and","with"]);
  const words=q.split(/\s+/).filter(x=>!stop.has(x));if(!words.length)return null;
  const scored=ITEMS.map(item=>{
    const n=item.name.toLowerCase(),k=(item.kw||"").toLowerCase(),d=((item.sjD||"")+" "+(item.cjD||"")).toLowerCase(),all=n+" "+k+" "+d;
    let score=0,hits=0;
    words.forEach(w=>{if(n.includes(w)){score+=15;hits++;}else if(k.includes(w)){score+=12;hits++;}else if(d.includes(w)){score+=4;hits++;}});
    if(n===q)score+=50;if(n.startsWith(q))score+=25;
    const cov=words.length>0?hits/words.length:0;
    score*=(0.5+0.5*cov);if(cov<0.3&&words.length>1)score=0;
    return{item,score};
  }).filter(s=>s.score>5).sort((a,b)=>b.score-a.score);
  return scored.length?scored[0].item:null;
}

/* ── Reusable components ── */
const Badge=({v})=>{const s={sj:{bg:"linear-gradient(180deg,#34c759 0%,#28a745 100%)",c:"#fff"},cj:{bg:"linear-gradient(180deg,#ff9f0a 0%,#e8890a 100%)",c:"#fff"},tie:{bg:"linear-gradient(180deg,#aeaeb2 0%,#98989d 100%)",c:"#fff"},"sj-only":{bg:"linear-gradient(180deg,#f2f2f7 0%,#e8e8ed 100%)",c:"#8e8e93"},"cj-only":{bg:"linear-gradient(180deg,#f2f2f7 0%,#e8e8ed 100%)",c:"#8e8e93"}}[v]||{bg:"#f2f2f7",c:"#8e8e93"};const l={sj:"SJ",cj:"CJ",tie:"TIE","sj-only":"SJ only","cj-only":"CJ only"};return<span style={{display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",background:s.bg,color:s.c,lineHeight:"16px"}}>{l[v]||"—"}</span>;};
const VP=({v})=>{if(!v)return<span style={{fontSize:11,color:"#aeaeb2"}}>—</span>;const c={SJ:{bg:"linear-gradient(180deg,#34c759 0%,#28a745 100%)"},CJ:{bg:"linear-gradient(180deg,#ff9f0a 0%,#e8890a 100%)"}}[v]||{bg:"#ccc"};return<span style={{display:"inline-block",padding:"3px 12px",borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:.8,color:"#fff",background:c.bg,lineHeight:"16px"}}>{v}</span>;};

/* ══════ TAB 1 — PRICE COMPARE ══════ */
function PriceCompareTab(){
  const[cat,setCat]=useState("All");const[q,setQ]=useState("");const[sort,setSort]=useState("category");const[filter,setFilter]=useState("all");const[open,setOpen]=useState(null);
  const rows=useMemo(()=>{let r=ITEMS;if(cat!=="All")r=r.filter(i=>i.cat===cat);if(q){const s=q.toLowerCase();r=r.filter(i=>i.name.toLowerCase().includes(s)||(i.sjD||"").toLowerCase().includes(s)||(i.cjD||"").toLowerCase().includes(s));}if(filter==="matched")r=r.filter(i=>i.sj!=null&&i.cj!=null);if(filter==="sj-only")r=r.filter(i=>i.sj!=null&&i.cj==null);if(filter==="cj-only")r=r.filter(i=>i.cj!=null&&i.sj==null);if(sort==="savings")r=[...r].sort((a,b)=>(diff(b.sj,b.cj)||0)-(diff(a.sj,a.cj)||0));else if(sort==="name")r=[...r].sort((a,b)=>a.name.localeCompare(b.name));else if(sort==="price")r=[...r].sort((a,b)=>Math.min(a.sj||1e6,a.cj||1e6)-Math.min(b.sj||1e6,b.cj||1e6));return r;},[cat,q,sort,filter]);
  const stats=useMemo(()=>{const m=ITEMS.filter(i=>i.sj!=null&&i.cj!=null);const top=m.map(i=>({...i,d:diff(i.sj,i.cj),p:pct(i.sj,i.cj),win:w(i.sj,i.cj)})).filter(i=>i.d>0).sort((a,b)=>b.p-a.p).slice(0,6);return{total:ITEMS.length,matched:m.length,sjW:m.filter(i=>i.sj<i.cj).length,cjW:m.filter(i=>i.cj<i.sj).length,tie:m.filter(i=>Math.abs((i.sj||0)-(i.cj||0))<.50).length,sjO:ITEMS.filter(i=>i.sj!=null&&i.cj==null).length,cjO:ITEMS.filter(i=>i.cj!=null&&i.sj==null).length,top};},[]);
  return(<>
    <div style={{padding:"24px 28px 0"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
        {[{l:"Comparable",v:stats.matched,s:`of ${stats.total} total`,c:"#1c1c1e"},{l:"SJ Cheaper",v:stats.sjW,s:"items",c:"#34c759"},{l:"CJ Cheaper",v:stats.cjW,s:"items",c:"#ff9f0a"},{l:"Tied",v:stats.tie,s:"within $0.50",c:"#8e8e93"},{l:"Single Source",v:`${stats.sjO} / ${stats.cjO}`,s:"SJ / CJ",c:"#636366"}].map((x,i)=><div key={i} style={{...S.card,padding:"16px 18px"}}><div style={{...S.lbl,marginBottom:6}}>{x.l}</div><div style={{fontSize:28,fontWeight:700,color:x.c,lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{x.v}</div><div style={{fontSize:11,color:"#aeaeb2",marginTop:3}}>{x.s}</div></div>)}
      </div>
      {stats.top.length>0&&<div style={{...S.card,padding:"18px 20px",marginBottom:20}}><div style={{...S.lbl,marginBottom:14}}>Biggest Savings Opportunities</div>{stats.top.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:12,fontWeight:500,color:"#3a3a3c",width:200,flexShrink:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</span><div style={{flex:1,background:"#f2f2f7",borderRadius:2,height:4,overflow:"hidden"}}><div style={{height:4,borderRadius:2,width:`${Math.min(s.p,100)}%`,background:s.win==="sj"?"linear-gradient(90deg,#34c759,#28a745)":"linear-gradient(90deg,#ff9f0a,#e8890a)"}}/></div><Badge v={s.win}/><span style={{fontSize:12,fontWeight:700,color:s.win==="sj"?"#34c759":"#ff9f0a",width:60,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>-${s.d.toFixed(2)}</span><span style={{fontSize:11,color:"#aeaeb2",width:36,textAlign:"right"}}>{s.p.toFixed(0)}%</span></div>)}</div>}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:20}}>{CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{...pill(cat===c),padding:"7px 16px",borderRadius:20,fontSize:12,fontWeight:600,letterSpacing:.2,whiteSpace:"nowrap"}}>{c} ({c==="All"?ITEMS.length:ITEMS.filter(i=>i.cat===c).length})</button>)}</div>
    </div>
    <div style={{padding:"12px 28px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",borderTop:"1px solid rgba(0,0,0,.04)",borderBottom:"1px solid rgba(0,0,0,.04)",background:"rgba(255,255,255,.3)"}}>
      <input placeholder="Search items..." value={q} onChange={e=>setQ(e.target.value)} style={{...S.card,borderRadius:10,padding:"8px 14px",color:"#1c1c1e",fontSize:13,fontFamily:"inherit",width:200,outline:"none"}}/>
      {[["all","All"],["matched","Matched"],["sj-only","SJ Only"],["cj-only","CJ Only"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} style={{...pill(filter===v),padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:600}}>{l}</button>)}
      <div style={{marginLeft:"auto"}}/><span style={{...S.lbl,letterSpacing:1,marginRight:4}}>Sort</span>
      {[["category","Category"],["savings","Savings"],["name","A-Z"],["price","Price"]].map(([v,l])=><button key={v} onClick={()=>setSort(v)} style={{...pill(sort===v),padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:600}}>{l}</button>)}
    </div>
    <div style={{padding:"10px 28px",display:"grid",gridTemplateColumns:"1fr 60px 90px 90px 100px 72px",gap:8,...S.lbl,letterSpacing:1}}><span>Item</span><span>Unit</span><span style={{textAlign:"right",color:"#34c759"}}>SJ Price</span><span style={{textAlign:"right",color:"#ff9f0a"}}>CJ Price</span><span style={{textAlign:"right"}}>Savings</span><span style={{textAlign:"center"}}>Winner</span></div>
    <div style={{padding:"0 28px 28px",overflowY:"auto",maxHeight:"calc(100vh - 560px)"}}>
      {rows.length===0&&<div style={{textAlign:"center",padding:48,color:"#aeaeb2",fontWeight:500}}>No items match</div>}
      {rows.map(item=>{const wi=w(item.sj,item.cj),d=diff(item.sj,item.cj),p=pct(item.sj,item.cj),ex=open===item.id;return<div key={item.id} onClick={()=>setOpen(ex?null:item.id)} style={{...S.card,borderRadius:12,marginBottom:6,cursor:"pointer",overflow:"hidden",transition:"all .15s",...(ex?{boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.04)"}:{})}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 60px 90px 90px 100px 72px",gap:8,alignItems:"center",padding:"12px 16px"}}>
          <div><span style={{fontSize:13,fontWeight:600,color:"#1c1c1e"}}>{item.name}</span><span style={{fontSize:10,color:"#aeaeb2",marginLeft:8,fontWeight:500}}>{item.cat}</span></div>
          <span style={{fontSize:11,color:"#8e8e93",fontWeight:500}}>{item.unit}</span>
          <span style={{textAlign:"right",fontVariantNumeric:"tabular-nums",fontWeight:700,fontSize:14,color:item.sj==null?"#d1d1d6":wi==="sj"?"#34c759":"#3a3a3c"}}>{fmt(item.sj)}</span>
          <span style={{textAlign:"right",fontVariantNumeric:"tabular-nums",fontWeight:700,fontSize:14,color:item.cj==null?"#d1d1d6":wi==="cj"?"#ff9f0a":"#3a3a3c"}}>{fmt(item.cj)}</span>
          <span style={{textAlign:"right",fontSize:12,fontWeight:600,fontVariantNumeric:"tabular-nums",color:d!=null?"#1c1c1e":"#d1d1d6"}}>{d!=null?`${d.toFixed(2)} (${p.toFixed(0)}%)`:"—"}</span>
          <span style={{textAlign:"center"}}><Badge v={wi}/></span>
        </div>
        {ex&&<div style={{padding:"0 16px 16px",fontSize:12,color:"#636366",lineHeight:1.7}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:4}}>
            {item.sjD&&<div style={{background:"#f8f8fa",borderRadius:10,padding:"12px 14px"}}><div style={{...S.lbl,color:"#34c759",marginBottom:4}}>SJ Details</div><div style={{color:"#3a3a3c"}}>{item.sjD}</div>{item.sjI&&<div style={{color:"#aeaeb2",fontSize:11,marginTop:4}}>Invoices: {item.sjI}</div>}</div>}
            {item.cjD&&<div style={{background:"#f8f8fa",borderRadius:10,padding:"12px 14px"}}><div style={{...S.lbl,color:"#ff9f0a",marginBottom:4}}>CJ Details</div><div style={{color:"#3a3a3c"}}>{item.cjD}</div>{item.cjI&&<div style={{color:"#aeaeb2",fontSize:11,marginTop:4}}>Invoices: {item.cjI}</div>}</div>}
          </div>
          {item.note&&<div style={{background:"#fffbf0",borderRadius:8,padding:"8px 12px",marginTop:8,fontSize:11,color:"#8e6a00"}}>&#9888; {item.note}</div>}
        </div>}
      </div>;})}
    </div>
  </>);
}

/* ══════ TAB 2 — MY ORDER TODAY ══════ */
function MyOrderTab(){
  const[lines,setLines]=useState([]);
  const[bulk,setBulk]=useState("");
  const[preview,setPreview]=useState(null);

  const process=useCallback(()=>{if(!bulk.trim())return;setPreview(parseOrderList(bulk));},[bulk]);
  const confirm=useCallback(()=>{
    if(!preview)return;
    const add=preview.map((p,i)=>{const it=p.matched,b=it?bestV(it):{vendor:null,price:null};return{id:Date.now()+i,itemId:it?it.id:null,name:it?it.name:p.itemText,raw:p.rawLine,cat:it?it.cat:"—",unit:it?it.unit:"—",qty:p.qty,vendor:b.vendor,price:b.price,sjP:it?it.sj:null,cjP:it?it.cj:null,note:it?it.note:null};});
    const merged=[];for(const l of add){const ex=merged.find(m=>m.itemId!=null&&m.itemId===l.itemId);if(ex)ex.qty+=l.qty;else merged.push({...l});}
    setLines(prev=>{const c=[...prev];for(const l of merged){const ex=c.find(x=>x.itemId!=null&&x.itemId===l.itemId);if(ex)ex.qty+=l.qty;else c.push(l);}return c;});
    setBulk("");setPreview(null);
  },[preview]);

  const updQ=useCallback((id,n)=>{if(n<1){setLines(p=>p.filter(l=>l.id!==id));return;}setLines(p=>p.map(l=>l.id===id?{...l,qty:n}:l));},[]);
  const rem=useCallback(id=>setLines(p=>p.filter(l=>l.id!==id)),[]);
  const clear=useCallback(()=>{setLines([]);setPreview(null);setBulk("");},[]);

  const st=useMemo(()=>{const m=lines.filter(l=>l.price!=null),u=lines.filter(l=>l.price==null),sj=m.filter(l=>l.vendor==="SJ"),cj=m.filter(l=>l.vendor==="CJ");return{total:m.reduce((s,l)=>s+l.price*l.qty,0),lines:lines.length,matched:m.length,unmatched:u.length,sjN:sj.length,cjN:cj.length,sjT:sj.reduce((s,l)=>s+l.price*l.qty,0),cjT:cj.reduce((s,l)=>s+l.price*l.qty,0)};},[lines]);
  const ps=preview?{total:preview.length,matched:preview.filter(p=>p.matched).length,unmatched:preview.filter(p=>!p.matched).length}:null;

  const example="1 box beef shank\n2 boxes chicken breast\n1 case soy sauce\n2 boxes deep fried oil\n1 box bean sprout\n1 box rock candy sugar\n1 bag sugar\n1 bag salt\n3 bags white onion\n10lbs jalapeno\n1 box ginger\n1 box green leaf lettuce\n2 boxes pho noodle\n1 box sweet and sour sauce\n2 boxes sriracha bottle\n2 boxes hoisin sauce\n1 box green onion";

  return<div style={{padding:"24px 28px"}}>
    {/* PASTE BOX */}
    <div style={{...S.card,padding:"20px 24px",marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={S.lbl}>Paste Your Full Order List</div>
        {!bulk&&<button onClick={()=>setBulk(example)} style={{...pill(false),padding:"5px 12px",borderRadius:7,fontSize:10,fontWeight:600,color:"#636366"}}>Load Example</button>}
      </div>
      <textarea value={bulk} onChange={e=>{setBulk(e.target.value);setPreview(null);}} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")process();}}
        placeholder={"Paste your order here — one item per line:\n\n1 box beef shank\n2 boxes chicken breast\n1 case soy sauce\n10lbs jalapeno\n3 bags white onion\n...\n\nThen hit \"Process Order\" to match everything."}
        rows={8} style={{...S.card,borderRadius:12,padding:"14px 16px",color:"#1c1c1e",fontSize:13,fontFamily:"'SF Mono','Menlo','Monaco','Courier New',monospace",lineHeight:1.8,width:"100%",resize:"vertical",outline:"none",minHeight:160}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
        <div style={{fontSize:11,color:"#aeaeb2"}}>{bulk.trim()?`${bulk.trim().split(/\n/).filter(Boolean).length} lines detected`:"Supports: qty + unit + item name per line"}<span style={{marginLeft:12,color:"#c7c7cc"}}>&#8984;+Enter to process</span></div>
        <div style={{display:"flex",gap:8}}>
          {bulk&&<button onClick={()=>{setBulk("");setPreview(null);}} style={{...pill(false),padding:"9px 18px",borderRadius:10,fontSize:12,fontWeight:600,color:"#ff3b30"}}>Clear</button>}
          <button onClick={process} disabled={!bulk.trim()} style={{...pill(!!bulk.trim()),padding:"9px 24px",borderRadius:10,fontSize:13,fontWeight:600,opacity:bulk.trim()?1:.4}}>&#9889; Process Order</button>
        </div>
      </div>
    </div>

    {/* PARSE PREVIEW */}
    {preview&&<div style={{...S.card,padding:"20px 24px",marginBottom:20,border:"1px solid rgba(52,199,89,.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{...S.lbl,marginBottom:4}}>Parse Preview</div><div style={{fontSize:12,color:"#636366"}}><span style={{color:"#34c759",fontWeight:700}}>{ps.matched} matched</span>{ps.unmatched>0&&<span style={{color:"#ff3b30",fontWeight:700,marginLeft:10}}>{ps.unmatched} not found</span>}<span style={{color:"#aeaeb2",marginLeft:10}}>of {ps.total} lines</span></div></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setPreview(null)} style={{...pill(false),padding:"8px 16px",borderRadius:10,fontSize:12,fontWeight:600,color:"#636366"}}>Cancel</button>
          <button onClick={confirm} style={{...pill(true),padding:"8px 20px",borderRadius:10,fontSize:13,fontWeight:600,background:"linear-gradient(180deg,#34c759 0%,#28a745 100%)"}}>&#10003; Add {preview.length} Items to Order</button>
        </div>
      </div>
      <div style={{maxHeight:360,overflowY:"auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 1fr 72px 72px 110px",gap:8,padding:"6px 8px",...S.lbl,letterSpacing:.8,marginBottom:4}}><span style={{textAlign:"center"}}>Qty</span><span>You Typed</span><span>Matched To</span><span style={{textAlign:"center"}}>Status</span><span style={{textAlign:"center"}}>Vendor</span><span style={{textAlign:"right"}}>Est. Cost</span></div>
        {preview.map((p,i)=>{const b=p.matched?bestV(p.matched):{vendor:null,price:null};return<div key={i} style={{display:"grid",gridTemplateColumns:"36px 1fr 1fr 72px 72px 110px",gap:8,alignItems:"center",padding:"8px 8px",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:12}}>
          <span style={{color:"#1c1c1e",fontSize:13,fontWeight:700,textAlign:"center"}}>{p.qty}</span>
          <div style={{color:"#8e8e93",fontStyle:"italic"}}>{p.rawLine}</div>
          <div>{p.matched?<span style={{fontWeight:600,color:"#1c1c1e"}}>{p.matched.name}</span>:<span style={{color:"#ff3b30",fontWeight:500}}>{p.itemText}</span>}</div>
          <span style={{textAlign:"center"}}><span style={{display:"inline-block",padding:"2px 8px",borderRadius:5,fontSize:9,fontWeight:600,background:p.matched?"#e8f7ed":"#ffeaea",color:p.matched?"#1b7a3d":"#cc2936",lineHeight:"15px"}}>{p.matched?"&#10003; Match":"&#10007; None"}</span></span>
          <span style={{textAlign:"center"}}><VP v={b.vendor}/></span>
          <span style={{textAlign:"right",fontWeight:700,fontVariantNumeric:"tabular-nums",color:b.price!=null?"#1c1c1e":"#d1d1d6"}}>{b.price!=null?`${fmt(b.price)} x ${p.qty} = ${(b.price*p.qty).toFixed(2)}`:"—"}</span>
        </div>})}
      </div>
    </div>}

    {/* ORDER SUMMARY */}
    {lines.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
      <div style={{...S.card,padding:"16px 18px"}}><div style={{...S.lbl,marginBottom:6}}>Order Total</div><div style={{fontSize:28,fontWeight:700,color:"#1c1c1e",lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>${st.total.toFixed(2)}</div><div style={{fontSize:11,color:"#aeaeb2",marginTop:3}}>{st.lines} line items</div></div>
      <div style={{...S.card,padding:"16px 18px"}}><div style={{...S.lbl,marginBottom:6,color:"#34c759"}}>Buy from SJ</div><div style={{fontSize:28,fontWeight:700,color:"#34c759",lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{st.sjN}</div><div style={{fontSize:11,color:"#aeaeb2",marginTop:3}}>${st.sjT.toFixed(2)}</div></div>
      <div style={{...S.card,padding:"16px 18px"}}><div style={{...S.lbl,marginBottom:6,color:"#ff9f0a"}}>Buy from CJ</div><div style={{fontSize:28,fontWeight:700,color:"#ff9f0a",lineHeight:1.1,fontVariantNumeric:"tabular-nums"}}>{st.cjN}</div><div style={{fontSize:11,color:"#aeaeb2",marginTop:3}}>${st.cjT.toFixed(2)}</div></div>
      {st.unmatched>0&&<div style={{...S.card,padding:"16px 18px"}}><div style={{...S.lbl,marginBottom:6,color:"#ff3b30"}}>Not Found</div><div style={{fontSize:28,fontWeight:700,color:"#ff3b30",lineHeight:1.1}}>{st.unmatched}</div><div style={{fontSize:11,color:"#aeaeb2",marginTop:3}}>need manual price</div></div>}
    </div>}

    {/* ORDER LINES */}
    {lines.length>0&&<>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{...S.lbl,letterSpacing:1.5}}>Order Items</div>
        <button onClick={clear} style={{...pill(false),padding:"5px 14px",borderRadius:8,fontSize:11,fontWeight:600,color:"#ff3b30"}}>Clear All</button>
      </div>
      <div style={{padding:"8px 16px",display:"grid",gridTemplateColumns:"1fr 80px 60px 90px 90px 100px 36px",gap:8,...S.lbl,letterSpacing:1}}><span>Item</span><span style={{textAlign:"center"}}>Buy From</span><span style={{textAlign:"center"}}>Qty</span><span style={{textAlign:"right"}}>Unit $</span><span style={{textAlign:"right"}}>Line Total</span><span style={{textAlign:"right"}}>Alt Price</span><span></span></div>
      <div style={{overflowY:"auto",maxHeight:"calc(100vh - 520px)"}}>
        {lines.map(l=>{const alt=l.vendor==="SJ"?l.cjP:l.sjP,altV=l.vendor==="SJ"?"CJ":"SJ",lt=l.price!=null?l.price*l.qty:null;return<div key={l.id} style={{...S.card,borderRadius:12,marginBottom:6,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 60px 90px 90px 100px 36px",gap:8,alignItems:"center",padding:"12px 16px"}}>
            <div><span style={{fontSize:13,fontWeight:600,color:l.itemId?"#1c1c1e":"#ff3b30"}}>{l.name}</span><span style={{fontSize:10,color:"#aeaeb2",marginLeft:8,fontWeight:500}}>{l.cat} · {l.unit}</span>{l.raw&&l.raw.toLowerCase()!==l.name.toLowerCase()&&<div style={{fontSize:10,color:"#c7c7cc",marginTop:1,fontStyle:"italic"}}>from: "{l.raw}"</div>}{!l.itemId&&<div style={{fontSize:10,color:"#ff3b30",marginTop:2,fontWeight:500}}>&#9888; Not in database</div>}{l.note&&<div style={{fontSize:10,color:"#8e6a00",marginTop:2}}>&#9888; {l.note}</div>}</div>
            <span style={{textAlign:"center"}}><VP v={l.vendor}/></span>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2}}>
              <button onClick={()=>updQ(l.id,l.qty-1)} style={{width:22,height:22,borderRadius:6,border:"none",background:"#f2f2f7",color:"#636366",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>-</button>
              <span style={{fontSize:14,fontWeight:700,color:"#1c1c1e",width:20,textAlign:"center",fontVariantNumeric:"tabular-nums"}}>{l.qty}</span>
              <button onClick={()=>updQ(l.id,l.qty+1)} style={{width:22,height:22,borderRadius:6,border:"none",background:"#f2f2f7",color:"#636366",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>+</button>
            </div>
            <span style={{textAlign:"right",fontVariantNumeric:"tabular-nums",fontWeight:700,fontSize:14,color:l.price!=null?"#1c1c1e":"#d1d1d6"}}>{fmt(l.price)}</span>
            <span style={{textAlign:"right",fontVariantNumeric:"tabular-nums",fontWeight:700,fontSize:14,color:lt!=null?"#1c1c1e":"#d1d1d6"}}>{lt!=null?`${lt.toFixed(2)}`:"—"}</span>
            <span style={{textAlign:"right",fontSize:11,color:"#aeaeb2",fontVariantNumeric:"tabular-nums"}}>{alt!=null?`${altV} ${fmt(alt)}`:"—"}</span>
            <button onClick={()=>rem(l.id)} style={{width:24,height:24,borderRadius:6,border:"none",background:"transparent",color:"#d1d1d6",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.color="#ff3b30"} onMouseLeave={e=>e.currentTarget.style.color="#d1d1d6"}>&#10005;</button>
          </div>
        </div>;})}
      </div>
    </>}

    {lines.length===0&&!preview&&<div style={{...S.card,padding:"60px 40px",textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>&#128203;</div>
      <div style={{fontSize:16,fontWeight:600,color:"#1c1c1e",marginBottom:6}}>Paste Your Full Order</div>
      <div style={{fontSize:13,color:"#8e8e93",lineHeight:1.6,maxWidth:440,margin:"0 auto"}}>Paste your entire shopping list above — one item per line, exactly how you'd text it to your distributor. The system parses quantities, matches to your {ITEMS.length}-item invoice database, and finds the cheapest vendor for each item.</div>
      <div style={{fontSize:12,color:"#aeaeb2",marginTop:16,lineHeight:1.8,fontFamily:"'SF Mono','Menlo',monospace"}}>Example:<br/>2 boxes chicken breast<br/>1 box bean sprout<br/>10lbs jalapeno</div>
    </div>}
  </div>;
}

/* ══════ MAIN ══════ */
export default function App(){
  const[tab,setTab]=useState("order");
  return<div style={{minHeight:"100vh",background:"#e8e8ed",fontFamily:"-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif",fontSize:13,color:"#1c1c1e"}}>
    <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:3px}@keyframes fadeSlide{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{padding:"32px 28px 0"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:4}}><h1 style={{fontSize:34,fontWeight:700,color:"#1c1c1e",letterSpacing:-.5,lineHeight:1.1}}>V Pho</h1><span style={{...S.lbl,letterSpacing:2}}>Purchasing Board</span></div>
      <p style={{fontSize:12,color:"#aeaeb2",fontWeight:500,marginBottom:20}}>{ITEMS.length} items · 15 invoices · Dec 2025 – Jan 2026 · CJ Distribution vs SJ Distributors</p>
      <div style={{display:"flex",gap:4,marginBottom:4,background:"rgba(0,0,0,.04)",borderRadius:12,padding:3,width:"fit-content"}}>
        {[["compare","Price Compare"],["order","My Order Today"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,letterSpacing:.1,padding:"9px 24px",borderRadius:10,transition:"all .15s",background:tab===k?"linear-gradient(180deg,#fff 0%,#f8f8fa 100%)":"transparent",color:tab===k?"#1c1c1e":"#8e8e93",boxShadow:tab===k?"0 1px 3px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04),inset 0 1px 0 rgba(255,255,255,.9)":"none"}}>{l}</button>)}
      </div>
    </div>
    {tab==="compare"?<PriceCompareTab/>:<MyOrderTab/>}
    <div style={{padding:"14px 28px",display:"flex",justifyContent:"space-between",fontSize:11,color:"#aeaeb2",fontWeight:500,borderTop:"1px solid rgba(0,0,0,.04)"}}><span>V Pho · 930 West Hamilton Ave, Campbell CA 95008</span><span>{tab==="compare"?`${ITEMS.length} items · Click rows for details`:"Paste full list · Auto-matches cheapest vendor"}</span></div>
  </div>;
}
