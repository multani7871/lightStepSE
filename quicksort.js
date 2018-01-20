var opentracing = require('opentracing');
var lightstep = require('lightstep-tracer');

var tracer = new lightstep.Tracer({
  access_token: 'c10958f100a9b0f59730e95543cce753',
  component_name: 'quicksort',
})

opentracing.initGlobalTracer(tracer);

function quickSort(array, parentSpan) {
  let recurseSpan = opentracing.globalTracer().startSpan('quicksort_recursive_invocation', { childOf: parentSpan });
  let less = [];
  let equal = [];
  let greater = [];
  
  if (array.length > 1) {
    let pivot = array[0].length;
    array.forEach(e => {
      if (e.length < pivot) {
        less.push(e);
      }
      if (e.length === pivot) {
        equal.push(e);
      }
      if (e.length > pivot) {
        greater.push(e);
      }
    })
    recurseSpan.logEvent(`less: ${less}, equal: ${equal}, greater: ${greater}`)
    recurseSpan.finish();
    return quickSort(less, recurseSpan).concat(equal).concat(quickSort(greater, recurseSpan));
  } else {
    recurseSpan.finish();
    return array;
  }
}

function main(dataset) {
  var mainSpan = tracer.startSpan('quicksort_initial_invocation');
  mainSpan.logEvent(`Unsorted Dataset: ${dataset}`)
  let sorted = quickSort(dataset, mainSpan);
  mainSpan.logEvent(`Sorted Dataset: ${sorted}`);
  mainSpan.finish();
}

let dataset = ['engineering', 'trace', 'microservices', 'span', 'lightstep', 'histogram', 'tag']

main(dataset);