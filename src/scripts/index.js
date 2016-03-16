import Rx from 'rx'
import Cycle from '@cycle/core'
import CycleDOM from '@cycle/dom'

const { makeDOMDriver } = CycleDOM

// Logic (functional)
// ----
//
// DOM read effect: detect slider change
// recalculate BMI
// DOM write effect: display BMI
function main (sources) {
  const { div, input, label, h2 } = CycleDOM

  const changeWeight$ = sources.DOM
    .select('.weight')
    .events('input')
    .map(ev =>
      ev.target.value
    )

  const changeHeight$ = sources.DOM
    .select('.height')
    .events('input')
    .map(ev =>
      ev.target.value
    )

  const state$ = Rx.Observable.combineLatest(
    changeWeight$.startWith(70),
    changeHeight$.startWith(170),
    (weight, height) => {
      const heightMeters = height * 0.01
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return { weight, height, bmi }
    }
  )

  return {
    DOM: state$.map(state =>
      div([
        div([
          label(`Weight ${state.weight}kg`),
          input('.weight', {
            type: 'range',
            min: 40,
            max: 150,
            value: state.weight
          })
        ]),
        div([
          label(`Height ${state.height}cm`),
          input('.height', {
            type: 'range',
            min: 140,
            max: 220,
            value: state.height
          })
        ]),
        h2(`BMI is ${state.bmi}`)
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
