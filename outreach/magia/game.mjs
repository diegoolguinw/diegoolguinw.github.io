const palette = [
  [1, 'Violeta', '#70218b'], [2, 'Amarilla', '#efaf10'], [4, 'Azul', '#139cd4'],
  [8, 'Roja', '#fa2725'], [16, 'Gris', '#696d72'], [32, 'Verde', '#69c629']
];
export function cardsFor(size=64) {
  if(size!==32 && size!==64) throw new RangeError('Choose 32 or 64 possibilities');
  return palette.filter(([value])=>value<size).map(([value,name,color])=>({
    value,name,color,numbers:Array.from({length:size-1},(_,i)=>i+1).filter(n=>(n&value)!==0)
  }));
}
export const cards=cardsFor();
export function guess(answers,size=64) {
  const deck=cardsFor(size);
  if(answers.length!==deck.length || answers.some(a=>typeof a!=='boolean')) return null;
  const matches=Array.from({length:size},(_,i)=>i).filter(n=>deck.every((c,i)=>c.numbers.includes(n)===answers[i]));
  return matches.length===1 ? matches[0] : null;
}
