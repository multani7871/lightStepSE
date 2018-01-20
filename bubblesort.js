var opentracing = require('opentracing');
var lightstep = require('lightstep-tracer');

var tracer = new lightstep.Tracer({
  access_token: 'c10958f100a9b0f59730e95543cce753',
  component_name: 'bubblesort',
})

opentracing.initGlobalTracer(tracer);

function bubbleSort(arr) {
  let bubbleSortSpan = tracer.startSpan('bubblesort');
  bubbleSortSpan.logEvent(`Unsorted dataset: ${arr}`);
  for (let i = 0; i < arr.length; i += 1){
    for (let j = 1; j < arr.length; j += 1) {
      if (arr[j - 1].length > arr[j].length){
        bubbleSortSpan.logEvent(`swap ${arr[j-1]} & ${arr[j]}`);
        swap(bubbleSortSpan, arr, j - 1, j);
        bubbleSortSpan.logEvent(arr);
      } else {
        bubbleSortSpan.logEvent(`don't swap ${arr[j - 1]} & ${arr[j]}`)
      }
    }
  }
  bubbleSortSpan.logEvent(`Sorted dataset: ${arr}`);
  bubbleSortSpan.finish();
  return arr;
}

function swap(parentSpan, array, i, j) {
  let swapSpan = opentracing.globalTracer().startSpan('swap', { childOf: parentSpan });
  let temp = array[i];
  swapSpan.logEvent(`before: ${array}`);
  swapSpan.logEvent(`swap: ${ array[i] } and ${ array[j] }`);
  array[i] = array[j];
  array[j] = temp;
  swapSpan.logEvent(`after: ${array}`);
  swapSpan.finish()
}


let dataset = ['engineering', 'trace', 'microservices', 'span', 'lightstep', 'histogram', 'tag']

bubbleSort(dataset);
