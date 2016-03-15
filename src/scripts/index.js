import Rx from 'rx'
import Cycle from '@cycle/core'
import CycleDOM from '@cycle/dom'

const { makeDOMDriver } = CycleDOM

// Logic (functional)
// ----
function main (sources) {
  const { div, button, p, label } = CycleDOM

  const decrementClick$ = sources.DOM
    .select('.decrement').events('click')

  const incrementClick$ = sources.DOM
    .select('.increment').events('click')

  const decrementAction$ = decrementClick$.map(ev => -1)
  const incrementAction$ = incrementClick$.map(ev => +1)

  const number$ = Rx.Observable.of(0)
    .merge(decrementAction$).merge(incrementAction$)
    .scan((prev, curr) => prev + curr)

  return {
    DOM: number$.map(number =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p([
          label(String(number))
        ])
      ])
    )
  }
}

// Effects (imperative)
// ----
const drivers = {
  DOM: makeDOMDriver('#app')
}

// Wiring
// ----
Cycle.run(main, drivers)
