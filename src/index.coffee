Rx = require 'rx'
Cycle = require '@cycle/core'


# Logic (functional)
# ----
main = (sources) ->
  click$ = sources.DOM

  sinks =
    DOM:
      click$
      .startWith(null)
      .flatMapLatest () ->
        Rx.Observable.timer(0, 1000).map (i) ->
          tagName: 'H1'
          children: [
            {
              tagName: 'SPAN'
              children: [
                "Seconds elapsed #{i}"
              ]
            }
          ]
    Log:
      Rx.Observable.timer(0, 2000).map (i) ->
        2 * i



# Effects (imperative)
# ----
DOMDriver = (obj$) ->
  createElement = (obj) ->
    element = document.createElement(obj.tagName)
    obj
    .children
    .filter (child) ->
      typeof child == 'object'
    .map(createElement)
    .forEach (child) ->
      element.appendChild child

    obj
    .children
    .filter (child) ->
      typeof child == 'string'
    .forEach (child) ->
      element.innerHTML += child

    element

  obj$.subscribe (obj) ->
    container = document.querySelector("#app")
    container.innerHTML = ''
    element = createElement(obj)
    container.appendChild(element)

  Rx.Observable.fromEvent(document, 'click')


consoleLogDriver = (msg$) ->
  msg$.subscribe (msg) ->
    console.log msg


drivers =
  DOM: DOMDriver
  Log: consoleLogDriver



# Wiring
# ----
Cycle.run(main, drivers)
