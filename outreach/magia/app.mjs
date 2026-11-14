import {cardsFor,guess} from './game.mjs';
const main=document.querySelector('#main');
const dialog=document.querySelector('#instructions');
const howDialog=document.querySelector('#how-it-works');
let answers=[],screen='intro',locked=false,revealTimer;
let mode=64,cards=cardsFor(mode);
const countWord=()=>mode===32?'cinco':'seis';
const digits=n=>`<span class="digits" aria-label="${n}">${String(n).split('').map(d=>`<svg class="digit" viewBox="0 0 20 28" aria-hidden="true"><use href="./assets/digits.svg#d${d}"/></svg>`).join('')}</span>`;
const spark='<svg class="spark" viewBox="0 0 38 38" aria-hidden="true"><path d="M19 1c1 12 5 16 18 18-13 1-17 5-18 18C17 24 13 20 1 19 14 17 17 13 19 1Z" fill="currentColor"/></svg>';
function sheet(index,preview=false){const c=cards[index];return `<div class="sheet${mode===32?' compact':''}" style="--card-color:${c.color}"><div class="sheet-header"><span class="sheet-wordmark" aria-hidden="true">¡Magia!</span><span class="sheet-label">LÁMINA ${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}</span></div><ul class="number-grid" aria-label="Números de la lámina ${index+1}" ${preview?'aria-hidden="true"':''}>${c.numbers.map(n=>`<li class="number-cell">${digits(n)}</li>`).join('')}</ul></div>`;}
function focusTitle(){main.querySelector('h1')?.focus({preventScroll:true});}
function intro(focus=false){clearTimeout(revealTimer);screen='intro';answers=[];locked=false;main.innerHTML=`<section class="intro"><div class="intro-copy"><p class="eyebrow">UN JUEGO DE MAGIA MATEMÁTICA</p><h1 tabindex="-1">Piensa un número.<br><em>¡No lo digas!</em></h1><fieldset class="mode-selector"><legend>Elige una modalidad</legend>${[32,64].map(size=>`<label class="mode-option"><input type="radio" name="mode" value="${size}" ${mode===size?'checked':''}><span><strong>${size} números</strong><small>Del 0 al ${size-1}</small></span></label>`).join('')}</fieldset><p id="intro-description">Elige un número <strong>del 0 al ${mode-1}</strong>.<br>Mira las ${countWord()} láminas y deja que<br>adivinemos cuál es.</p><button class="button primary" id="start">Ya tengo mi número <span aria-hidden="true">→</span></button></div><div class="intro-art" aria-label="Vista de las fichas del juego"><div class="deck-shadow" aria-hidden="true"></div>${sheet(0,true)}</div></section>`;document.querySelector('#start').onclick=startGame;
  for(const input of main.querySelectorAll('[name="mode"]')) input.onchange=()=>{
    mode=Number(input.value);cards=cardsFor(mode);
    main.querySelector('#intro-description').innerHTML=`Elige un número <strong>del 0 al ${mode-1}</strong>.<br>Mira las ${countWord()} láminas y deja que<br>adivinemos cuál es.`;
    main.querySelector('.intro-art .sheet').outerHTML=sheet(0,true);
    syncHelp();
  };
  syncHelp();if(focus)focusTitle();}
async function startGame(){
  if(screen!=='intro'||locked)return;
  answers=[];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){play();return;}
  screen='transition';locked=true;main.inert=true;
  const sourceSheet=main.querySelector('.intro-art .sheet');
  const source=sourceSheet.getBoundingClientRect();
  const sourceWidth=sourceSheet.offsetWidth;
  let rendered=false;
  const render=()=>{if(!rendered){play(true);rendered=true;}};
  try{
    if(typeof document.startViewTransition==='function'){
      // Track the card itself, avoiding the deck wrapper's padding and shadows.
      const transition=document.startViewTransition(render);
      await Promise.allSettled([transition.finished,transition.updateCallbackDone]);
    }else{
      // FLIP fallback for browsers without shared-element view transitions.
      await main.querySelector('.intro-copy').animate(
        [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],
        {duration:120,easing:'ease-in',fill:'forwards'}
      ).finished;
      render();
      const target=main.querySelector('.game > .sheet');
      const dest=target.getBoundingClientRect();
      const x=source.left+source.width/2-dest.left-dest.width/2;
      const y=source.top+source.height/2-dest.top-dest.height/2;
      const movements=[target.animate([
        {transform:`translate(${x}px,${y}px) scale(${sourceWidth/dest.width}) rotate(-2deg)`},
        {transform:'translate(0,0) scale(1) rotate(0deg)'}
      ],{duration:740,easing:'cubic-bezier(.32,0,.18,1)'})];
      for(const el of main.querySelectorAll('.game > :not(.sheet)')){
        movements.push(el.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],
          {duration:300,delay:280,easing:'ease-out',fill:'backwards'}));
      }
      await Promise.allSettled(movements.map(animation=>animation.finished));
    }
  }finally{
    render();main.querySelector('.game')?.classList.add('has-entered');
    main.querySelector('.game')?.classList.remove('is-entering');
    main.inert=false;screen='play';locked=false;focusTitle();
  }
}
function play(entering=false){clearTimeout(revealTimer);screen=entering?'transition':'play';locked=entering;const index=answers.length;main.innerHTML=`<section class="game${entering?' is-entering':''}"><div class="game-top"><div class="progress" aria-label="Lámina ${index+1} de ${cards.length}"><span class="sr-only">Progreso:</span>${cards.map((c,i)=>`<span class="progress-dot ${i<index?'complete':i===index?'current':''}" style="--dot-color:${c.color}" aria-hidden="true"></span>`).join('')}<span class="progress-label">${index+1} de ${cards.length}</span></div><button class="text-button" id="restart">Reiniciar</button></div><h1 tabindex="-1">¿Está tu número en esta lámina?</h1><p class="game-description">Mira con atención y responde sin decir cuál es.</p>${sheet(index)}<div class="actions"><button class="button secondary" id="no"><span class="answer-icon" aria-hidden="true">×</span>No está</button><button class="button primary" id="yes"><span class="answer-icon" aria-hidden="true">✓</span>Sí, está</button></div><div class="game-bottom"><button class="text-button" id="back">← ${index?'Volver':'Inicio'}</button><span class="keyboard-note">También puedes usar <kbd>N</kbd> y <kbd>S</kbd></span></div></section>`;document.querySelector('#no').onclick=()=>answer(false);document.querySelector('#yes').onclick=()=>answer(true);document.querySelector('#back').onclick=back;document.querySelector('#restart').onclick=()=>intro(true);if(!entering)focusTitle();}
function answer(value){if(screen!=='play'||locked)return;locked=true;answers.push(value);if(answers.length===cards.length){screen='thinking';main.innerHTML=`<section class="thinking" role="status">${spark}<h1>Un momento… ya casi lo tengo.</h1></section>`;revealTimer=setTimeout(result,matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);}else{play();locked=true;setTimeout(()=>locked=false,220);}}
function back(){if(answers.length){answers.pop();play();}else intro(true);}
function result(){screen='result';locked=false;const n=guess(answers,mode);if(n===null){main.innerHTML=`<section class="result invalid"><p class="eyebrow">ALGO SE NOS ESCAPÓ</p><h1 tabindex="-1">No pudimos completar<br>la partida.</h1><p class="result-subtitle">Revisa tus respuestas o vuelve a empezar.</p><div class="actions"><button class="button primary" id="review">Revisar respuestas</button><button class="button secondary" id="again">Volver a empezar</button></div></section>`;document.querySelector('#review').onclick=back;}else{main.innerHTML=`<section class="result"><p class="eyebrow">LAS ${countWord().toUpperCase()} LÁMINAS HAN HABLADO</p><h1 tabindex="-1">El número que pensaste es…</h1><div class="reveal-number"><span class="result-spark">${spark}</span>${digits(n)}<span class="result-spark second">${spark}</span></div><p class="result-subtitle">¡Las matemáticas lo han hecho otra vez!</p><div class="secret-invitation"><button class="secret-link" id="reveal-secret">Un buen matemático sí revela sus secretos, <span>descubre cómo funciona.</span></button></div><div class="answer-history" aria-label="Tus respuestas">${cards.map((c,i)=>`<span class="answer-chip ${answers[i]?'is-yes':''} ${c.value===32?'green':c.value===2?'yellow':''}" style="--chip:${c.color}" aria-label="Lámina ${i+1}: ${answers[i]?'sí':'no'}">${answers[i]?'✓':'−'}</span>`).join('')}</div><div class="actions"><button class="button primary" id="again">Jugar otra vez <span aria-hidden="true">↻</span></button></div><button class="text-button" id="review">¿Te equivocaste? Revisar respuestas</button></section>`;document.querySelector('#review').onclick=back;}document.querySelector('#again').onclick=()=>intro(true);document.querySelector('#reveal-secret')?.addEventListener('click',openExplanation);focusTitle();}
function syncHelp(){
  document.querySelector('#help-range').textContent=`del 0 al ${mode-1}`;
  document.querySelector('#help-count').textContent=countWord();
  const keys=cards.map(c=>c.value);
  document.querySelector('#how-keys').textContent=`Las ${countWord()} claves son ${keys.slice(0,-1).join(', ')} y ${keys.at(-1)}.`;
  document.querySelector('#how-range').textContent=`del 0 al ${mode-1}`;
  for(const el of document.querySelectorAll('[data-count]')) el.textContent=countWord();
  document.querySelector('#how-count-start').textContent=mode===32?'Cinco':'Seis';
}
function openExplanation(){
  const resultNumber=screen==='result'?guess(answers,mode):null;
  const n=resultNumber>0?resultNumber:null;
  document.querySelector('#example-label').textContent=n===null?`Por ejemplo, para el número ${mode===32?21:42}:`:'Con tus respuestas, la suma fue:';
  document.querySelector('#example-sum').textContent=n===null?(mode===32?'1 + 4 + 16 = 21':'2 + 8 + 32 = 42'):cards.filter((c,i)=>answers[i]).map(c=>c.value).join(' + ')+` = ${n}`;
  howDialog.showModal();
}
document.querySelector('#help').onclick=()=>dialog.showModal();
document.querySelector('#how').onclick=openExplanation;
document.querySelector('#close-help').onclick=()=>dialog.close();
document.querySelector('#understood').onclick=()=>dialog.close();
document.querySelector('#close-how').onclick=()=>howDialog.close();
document.querySelector('#understood-how').onclick=()=>howDialog.close();
for(const modal of [dialog,howDialog]) modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
document.addEventListener('keydown',e=>{if(dialog.open||howDialog.open||screen!=='play'||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const key=e.key.toLowerCase();if(key==='s'||key==='n'){e.preventDefault();answer(key==='s');}else if(key==='arrowleft'){e.preventDefault();back();}});
intro();
