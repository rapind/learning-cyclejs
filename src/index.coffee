Rx = require 'rx'

# Login (functional)
main = (sources) ->
  click$ = sources.DOM

  sinks =
    DOM:
      click$
      .startWith(null)
      .flatMapLatest () ->
        Rx.Observable.timer(0, 1000).map (i) ->
          "Seconds elapsed #{i}"
    Log:
      Rx.Observable.timer(0, 2000).map (i) ->
        2 * i

# Effects (imperative)
DOMDriver = (text$) ->
  text$.subscribe (text) ->
    container = document.querySelector("#app")
    container.textContent = text

  Rx.Observable.fromEvent(document, 'click')

consoleLogDriver = (msg$) ->
  msg$.subscribe (msg) ->
    console.log msg

run = (mainFn, drivers) ->
  proxySources = {}
  Object.keys(drivers).forEach (key) ->
    proxySources[key] = new Rx.Subject()

  sinks = mainFn(proxySources)

  Object.keys(drivers).forEach (key) ->
    source = drivers[key](sinks[key])
    source.subscribe (x) ->
      proxySources[key].onNext(x)

drivers =
  DOM: DOMDriver
  Log: consoleLogDriver

run(main, drivers)
