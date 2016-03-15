Rx = require 'rx'
Cycle = require '@cycle/core'
CycleDOM = require '@cycle/dom'

{ h, h1, span, makeDOMDriver } = CycleDOM


# Logic (functional)
# ----
main = (sources) ->
  mouseover$ = sources.DOM.select('span').events('mouseover')

  sinks =
    DOM:
      mouseover$
      .startWith(null)
      .flatMapLatest () ->
        Rx.Observable.timer(0, 1000).map (i) ->
          h1
            style:
              backgroundColor: 'red'
            span {},
              "Seconds elapsed #{i}"
    Log:
      Rx.Observable.timer(0, 2000).map (i) ->
        2 * i



# Effects (imperative)
# ----

consoleLogDriver = (msg$) ->
  msg$.subscribe (msg) ->
    console.log msg


drivers =
  DOM: makeDOMDriver('#app')
  Log: consoleLogDriver



# Wiring
# ----
Cycle.run(main, drivers)
