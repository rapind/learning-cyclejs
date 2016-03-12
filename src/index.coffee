Rx = require 'rx'

# Login (functional)
main = ->
  DOM: Rx.Observable.timer(0, 1000).map(
    (i) ->
      "Seconds elapsed #{i}"
  )
  Log: Rx.Observable.timer(0, 2000).map(
    (i) ->
      2 * i
  )

# Effects (imperative)
DOMDriver = (text$) ->
  text$.subscribe (text) ->
    container = document.querySelector("#app")
    container.textContent = text

  #Rx.Observable.fromEvent(document, 'click')

consoleLogDriver = (msg$) ->
  msg$.subscribe (msg) ->
    console.log msg

run = (mainFn, effects) ->
  sinks = mainFn()
  Object.keys(effects).forEach (key) ->
    effects[key](sinks[key])

drivers =
  DOM: DOMDriver
  Log: consoleLogDriver

run(main, drivers)
