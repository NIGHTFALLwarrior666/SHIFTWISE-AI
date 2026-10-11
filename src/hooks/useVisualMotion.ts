import {useEffect} from 'react';

/** Presentation-only effects. Never writes application data or decisions. */
export function useVisualMotion(){
 useEffect(()=>{
  const media=typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  let frame=0;let pointerFrame=0;let observer:IntersectionObserver|null=null;
  const root=document.querySelector<HTMLElement>('.app');
  if(!root)return;
  const scroll=()=>{
   if(frame||media?.matches)return;
   frame=requestAnimationFrame(()=>{frame=0;const hero=root.querySelector<HTMLElement>('.hero');if(hero){const y=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/hero.offsetHeight));hero.style.setProperty('--travel',String(Number.isFinite(y)?y:0));}});
  };
  const pointer=(e:PointerEvent)=>{
   if(media?.matches||e.pointerType==='touch'||pointerFrame)return;
   const target=e.target instanceof Element?e.target.closest<HTMLElement>('.hero,.stat,.panel,.demo-card,.dropzone'):null;
   if(!target)return;
   pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const r=target.getBoundingClientRect();if(!r.width||!r.height)return;target.style.setProperty('--light-x',`${((e.clientX-r.left)/r.width)*100}%`);target.style.setProperty('--light-y',`${((e.clientY-r.top)/r.height)*100}%`);if(target.classList.contains('hero')){target.style.setProperty('--tilt-x',`${-(e.clientY-r.top-r.height/2)/r.height*8}deg`);target.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/r.width*10}deg`);}});
  };
  const leave=()=>{const hero=root.querySelector<HTMLElement>('.hero');hero?.style.setProperty('--tilt-x','0deg');hero?.style.setProperty('--tilt-y','0deg')};
  if(typeof IntersectionObserver!=='undefined'&&!media?.matches){observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.08});root.querySelectorAll('.panel,.demo-card,.stat').forEach(el=>observer?.observe(el));}
  window.addEventListener('scroll',scroll,{passive:true});root.addEventListener('pointermove',pointer,{passive:true});root.addEventListener('pointerleave',leave);scroll();
  return()=>{window.removeEventListener('scroll',scroll);root.removeEventListener('pointermove',pointer);root.removeEventListener('pointerleave',leave);cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);observer?.disconnect()};
 },[]);
}
