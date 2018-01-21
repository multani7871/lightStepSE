var opentracing = require('opentracing');
var lightstep = require('lightstep-tracer');

var tracer = new lightstep.Tracer({
  access_token: 'c10958f100a9b0f59730e95543cce753',
  component_name: 'bubblesort',
})

opentracing.initGlobalTracer(tracer);

function bubbleSort(arr) {
  let bubbleSortSpan = tracer.startSpan('bubblesort');
  bubbleSortSpan.log({event: `Invoking w/ Unsorted dataset`, payload: arr});
  for (let i = 0; i < arr.length; i += 1){
    for (let j = 1; j < arr.length; j += 1) {
      if (arr[j - 1].length > arr[j].length){
        swap(bubbleSortSpan, arr, j - 1, j);
        bubbleSortSpan.log({ event: `swapped ${arr[j-1]} & ${arr[j]}`, payload: arr});
      } else {
        bubbleSortSpan.log({ event: `don't swap ${arr[j - 1]} & ${arr[j]}`})
      }
    }
  }
  bubbleSortSpan.log({ event: `Finished w/ Sorted dataset`, payload: arr });
  bubbleSortSpan.finish();
  return arr;
}

function swap(parentSpan, array, i, j) {
  let swapSpan = opentracing.globalTracer().startSpan('swap', { childOf: parentSpan });
  let temp = array[i];
  swapSpan.log({ event: `before swap`, payload: array});
  swapSpan.log({ event: `swap: ${ array[i] } and ${ array[j] }`});
  array[i] = array[j];
  array[j] = temp;
  swapSpan.log({ event: `after swap`, payload: array});
  swapSpan.finish()
}


let dataset = ['engineering', 'trace', 'microservices', 'span', 'lightstep', 'histogram', 'tag']

bubbleSort(dataset);
