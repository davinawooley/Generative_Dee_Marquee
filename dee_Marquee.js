const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1920, 1080 ], 
  animate: true,
  duration: 3,


};

let manager;
let text = 'Dee';
let fontSize = 1200;
let fontFamily = 'sans-serif';


const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');


const sketch = ({context, width, height, frame}) => {
  const cell = 20;
  const cols = Math.floor(width/cell);
  const rows = Math.floor(height/cell);
  const numCells = cols*rows;
  typeCanvas.frame = 0;

  typeCanvas.width = cols;
  typeCanvas.height = rows;


  return ({ context, width, height, frame }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols*.43;

    typeContext.fillStyle = 'white';
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = 'middle';

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft*-1;
    const my = metrics.actualBoundingBoxAscent*-1;
    const mw = metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent;

    const x = (cols - mw)*0.5-mx;
    const y = (rows - mh)*0.5-my;

    typeContext.save();
    typeContext.translate(x-10,y+11);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw,mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0,0,cols,rows).data;
    context.drawImage(typeCanvas,0,0);
    context.fillStyle = 'black';
    context.fillRect(0,0,width, height);
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    
    for(let i = 0; i<numCells; i++){
      const col = i%cols;
      const row = Math.floor(i/cols);

      const x = col*cell;
      const y = row*cell;

      const r = typeData[i*4+0];
      const g = typeData[i*4+1];
      const b = typeData[i*10+2];
      const a = typeData[i*4+3];


      const glyph = getGlyph(r);

      context.fillStyle = 'dimGrey';
      const n = random.noise2D(x + frame * 10, y, .001);
      context.save();
      
      context.translate(x,y); 
      context.translate(cell*0.5, cell*0.5);
      context.fillText(glyph,5,0);
      context.fillText(glyph,50,0);
      context.fillStyle = 'white';
      context.fillText(glyph,55,0);
      context.fillStyle = 'blue';
      context.fillText(glyph,50,0);
      context.fillStyle = 'silver';
      context.fillText(glyph,0,0);    
      
      context.beginPath();
      context.fill();

      context.restore();
    }
  };
};


const getGlyph = (v)=>{
  if(v<50) return '';
  if(v<100) return '*';
  if(v<150) return '%`';
  if(v<200) return '*';

  const glyphs = 'w *  + } ~ '.split('');

  return random.pick(glyphs);
}
const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
};

document.addEventListener('keyup', onkeyup);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();

