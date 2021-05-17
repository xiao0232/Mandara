import React, {useMemo, useRef, useState} from 'react';
import RangeSlider from './RangeSlider';
import './Mandara.scss';

type Point = [number, number];

function getPrimeArray(num: number) {
  const arr = Array.from({length: num}, (v, k) => k).slice(2);
  return arr.filter(element => {
    return arr
      .filter(ref => (ref*ref) <= element)
      .every(ref => element % ref !== 0);
  });
}

function getColorArray(sColor: string, fColor:string, n: number):Array<string> {
  let colorArray: Array<string> = []
  const regex: RegExp = /^#([0-9a-fA-F]{6})$/
  const colorValidation = (): boolean => {
    return regex.test(sColor) ? regex.test(fColor) : false
  }
  
  if (!colorValidation()) return colorArray
  const a = sColor.match(/[0-9a-fA-F]{2}/g) as RegExpMatchArray,
        b = fColor.match(/[0-9a-fA-F]{2}/g) as RegExpMatchArray,
        r1 = parseInt(a[0], 16),
        g1 = parseInt(a[1], 16),
        b1 = parseInt(a[2], 16),
        r2 = parseInt(b[0], 16),
        g2 = parseInt(b[1], 16),
        b2 = parseInt(b[2], 16);

  [...Array(n)].forEach((_, i) => {
    let r = Math.floor((r2 - r1) * i / (n - 1) + r1),
        g = Math.floor((g2 - g1) * i / (n - 1) + g1),
        b = Math.floor((b2 - b1) * i / (n - 1) + b1)
    colorArray.push(('#' + ('00' + r.toString(16)).slice(-2) + ('00' + g.toString(16)).slice(-2) + ('00' + b.toString(16)).slice(-2)))
  })

  return colorArray
}

let taskId: any[] = []

function Mandara() {
  const [vertex, setVertex] = useState<number>(10);
  const svgRef = useRef<SVGSVGElement>(null);

  const memoizedAdd = () => {
    let cache: { [k: number]: Point } = {};
    return (k: number) => {
      if (k in cache) {
        return cache[k];
      }
      else {
        let result: Point = [Math.floor(350 - 350 * Math.cos(k)), Math.floor(350 - 350 * Math.sin(k))];
        cache[k] = result;
        return result;
      }
    }
  }
  
  const createLine = () => {
    let cache: { [a1: number]: { [a2: number]: { [b1: number]: { [b2: number]: SVGPathElement } } } } = {};
    return (a: Point, b: Point) => {
      let [a1, a2] = a,
      [b1, b2] = b
      if (a1 in cache && a2 in cache[a1] && b1 in cache[a1][a2] && b2 in cache[a1][a2][b1]) {
        return cache[a1][a2][b1][b2];
      }
      else if (b1 in cache && b2 in cache[b1] && a1 in cache[b1][b2] && a2 in cache[b1][b2][a1]) {
        return cache[b1][b2][a1][a2];
      }
      else {
        const path = document.createElementNS('http://www.w3.org/2000/svg','path')
        path.setAttribute('d', `M ${String(a1)} ${String(a2)} L ${String(b1)} ${String(b2)}`)
        path.setAttribute('stroke', 'black')
        if (!(a1 in cache)) cache[a1] = {};
        if (!(a2 in cache[a1])) cache[a1][a2] = {};
        if (!(b1 in cache[a1][a2])) cache[a1][a2][b1] = {};
        cache[a1][a2][b1][b2] = path;
        return path;
      }
    }
  };


  useMemo(
    () => {
      taskId.forEach((timer) => {
        clearTimeout(timer)
      })
      
      let p: Array<Point[]> = [];
      let primeArray: Array<number> = getPrimeArray(vertex);
      const getPoint = memoizedAdd();
      primeArray.forEach((i) => [...Array(vertex)].forEach((_,b) => {
          let k1 = (vertex - 4 * b) * Math.PI / (2 * vertex)
          let k2 = (vertex - 4 * (b + i)) * Math.PI / (2 * vertex)
          p.push([getPoint(k1), getPoint(k2)]);
        }
        ));
        
      const svg = svgRef.current as SVGSVGElement;
      const getLine = createLine();
      const colorArray: Array<string> = getColorArray("#111111", "#aa0000", primeArray.length);
      const interval: number = 2000/p.length;
      const tId: any[] = []
      if (svg) {
        while(svg.firstChild){
          svg.removeChild(svg.firstChild)
        }
        p.forEach((n, i) => {
          let [a, b] = n
          let path: SVGPathElement = getLine(a, b)
          path.setAttribute("stroke", colorArray[Math.floor(i/vertex)])
          new Promise(() => {
            tId.push(setTimeout(() => {
            svg.appendChild(path)
          }, (i*interval + 20)))
        })
        }
        )
        taskId = tId
      }
    },
    [ vertex ]
  );
  
  return (
    <div className="mandaraContainer">
      <svg className="svgMandara" ref={svgRef} xmlns="http://www.w3.org/2000/svg">
      </svg>
      <RangeSlider changeVertex={setVertex}/>
    </div>
  );
}

export default Mandara;
