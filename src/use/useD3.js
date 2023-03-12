import React from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn, dependencies) => { // 2 arguments: 1 function + 1 array di dependencs
    const ref = React.useRef();  // creates a plain JS object....
    // https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
    React.useEffect(() => { 
        renderChartFn(d3.select(ref.current));  // 1 function e' anonima con argoment  => ref is svg tag, svg is object  
        return () => {};
      }, dependencies); // questo indica quando si verifica la condizione (in questo caso sempre uguale e quindi non fa niente)...
    return ref;
} // ATTENZIONE ritorna ref 