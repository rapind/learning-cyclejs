Rx = require 'rx'
Cycle = require '@cycle/core'


h = (tagName, children) ->
  tagName: tagName
  children: children

h1 = (children) ->
  h('H1', children)

span = (children) ->
  h('SPAN', children)

# Logic (functional)
# ----
main = (sources) ->
  mouseover$ = sources.DOM.selectEvents('span', 'mouseover')

  sinks =
    DOM:
      mouseover$
      .startWith(null)
      .flatMapLatest () ->
        Rx.Observable.timer(0, 1000).map (i) ->
          h1 [
            span [
              "Seconds elapsed #{i}"
            ]
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


  DOMSource =
    selectEvents: (tagName, eventType) ->
      Rx.Observable.fromEvent(document, eventType)
      .filter (ev) ->
        ev.target.tagName == tagName.toUpperCase()

consoleLogDriver = (msg$) ->
  msg$.subscribe (msg) ->
    console.log msg


drivers =
  DOM: DOMDriver
  Log: consoleLogDriver



# Wiring
# ----
Cycle.run(main, drivers)
