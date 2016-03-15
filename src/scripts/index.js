import Cycle from '@cycle/core'
import CycleDOM from '@cycle/dom'

const { makeDOMDriver } = CycleDOM

// Logic (functional)
// ----
function main (sources) {
  const { label, input, h1, hr, div } = CycleDOM

  const inputEv$ = sources.DOM.select('.field').events('input')
  const name$ = inputEv$.map(ev => ev.target.value).startWith('')

  return {
    DOM: name$.map(name =>
      div([
        label('Name:'),
        input('.field', { type: 'text' }),
        hr(),
        h1(`Hello ${name}!`)
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
