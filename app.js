// app.js
// === DONNÉES PRÉCHARGÉES POUR MODE HORS LIGNE ===
const QURAN_DATA = {
  pages: {
    "1": {
      page_number: 1, juz_number: 1,
      first_verse: { text: "بِسْمِٱللهِٱلرَّحْمَٰنِٱلرَّحِيمِ", verse_number: 1, surah_number: 1 },
      last_verse: { text: "صِرَٰطَٱلَّذِينَأَنْعَمْتَ...", verse_number: 7, surah_number: 1 },
      surahs: [{ number:1,name:"(1) سورة الفاتحة" }]
    },
    // … jusqu’à "604"
  }
};
// === FIN DES DONNÉES PRÉCHARGÉES ===

const AppState = {
  config:{ startPage:1,endPage:604,quizOption:1,showNumbers:true,attempts:'infinite' },
  quiz:{ pages:[],currentIndex:0,correctCount:0,wrongCount:0,startTime:null,endTime:null,elapsedTime:0,history:[],timer:null,wakeLock:null },
  cache:{}
};

function toFrenchNumbers(str) {
  const m={'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
  return String(str).replace(/[٠-٩]/g,c=>m[c]);
}

function shuffleArray(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

async function requestWakeLock(){
  try{ if(navigator.wakeLock){ AppState.quiz.wakeLock=await navigator.wakeLock.request('screen'); } }
  catch(e){ console.error(e); }
}

function startTimer(){
  AppState.quiz.startTime=Date.now();
  AppState.quiz.timer=setInterval(updateTimer,1000);
}

function pauseTimer(){
  clearInterval(AppState.quiz.timer);
  AppState.quiz.elapsedTime+=Date.now()-AppState.quiz.startTime;
}

function updateTimer(){
  const e=Date.now()-AppState.quiz.startTime+AppState.quiz.elapsedTime;
  const s=Math.floor(e/1e3%60),m=Math.floor(e/6e4%60),h=Math.floor(e/36e5);
  document.getElementById('timer').textContent=[h,m,s].map(x=>String(x).padStart(2,'0')).join(':');
}

async function fetchPageData(pageNumber){
  if(QURAN_DATA.pages[pageNumber]){
    const d=QURAN_DATA.pages[pageNumber];
    return {
      page:pageNumber,
      firstVerse:{ text:d.first_verse.text, number:toFrenchNumbers(d.first_verse.verse_number), surah:d.first_verse.surah_number },
      lastVerse:{ text:d.last_verse.text, number:toFrenchNumbers(d.last_verse.verse_number), surah:d.last_verse.surah_number },
      juz:toFrenchNumbers(d.juz_number),
      surahs:d.surahs.map(s=>s.name)
    };
  }
  console.warn(`Page ${pageNumber} introuvable en local`);
  return { page:pageNumber, firstVerse:{text:"...",number:"1",surah:1}, lastVerse:{text:"...",number:"7",surah:1}, juz:"1", surahs:[""] };
}

// … le reste de votre code (setupHomeScreen, navigation, rendu, etc.) …
