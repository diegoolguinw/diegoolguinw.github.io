export const cards = [
  [1, 'Violeta', '#70218b'], [2, 'Amarilla', '#efaf10'], [4, 'Azul', '#139cd4'],
  [8, 'Roja', '#fa2725'], [16, 'Gris', '#696d72'], [32, 'Verde', '#69c629']
].map(([value,name,color])=>({value,name,color,numbers:Array.from({length:63},(_,i)=>i+1).filter(n=>(n&value)!==0)}));
export function guess(answers) {
  if(answers.length!==6 || answers.some(a=>typeof a!=='boolean')) return null;
  const matches=Array.from({length:64},(_,i)=>i).filter(n=>cards.every((c,i)=>c.numbers.includes(n)===answers[i]));
  return matches.length===1 ? matches[0] : null;
}
