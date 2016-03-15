import Rx from 'rx'
import Cycle from '@cycle/core'
import CycleDOM from '@cycle/dom'
import CycleHTTPDriver from '@cycle/http'

const { makeDOMDriver } = CycleDOM
const { makeHTTPDriver } = CycleHTTPDriver

// Logic (functional)
// ----
//
// DOM read effect: button clicked
// HTTP write effect: request sent
// HTTP read effect: response received
// DOM write effect: data displayed
function main (sources) {
  const { div, button, h1, h4, a } = CycleDOM

  const clickEvent$ = sources.DOM
    .select('.get-first').events('click')

  const url = 'http://jsonplaceholder.typicode.com/users/1'
  const request$ = clickEvent$.map(() => {
    return {
      url: url,
      method: 'GET'
    }
  })

  const response$$ = sources.HTTP
    .filter(response$ =>
      response$.request.url === url
    )

  const response$ = response$$.switch()
  const firstUser$ = response$.map(response =>
    response.body
  ).startWith(null)

  return {
    DOM: firstUser$.map(firstUser =>
      div([
        button('.get-first', 'Get first user'),
        firstUser == null ? null : div('.user-details', [
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', { href: firstUser.website }, firstUser.website)
        ])
      ])
    ),
    HTTP: request$
  }
}

// Effects (imperative)
// ----
const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
}

// Wiring
// ----
Cycle.run(main, drivers)
