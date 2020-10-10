// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {PokemonForm} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  // const componentStates = ['IDLE', 'PENDING', 'RESOLVED', 'REJECTED']
  const [{
    status,
    pokemon,
    error
  }, setPokemon] = React.useState({status: 'idle', pokemon: null, error: null})

  if (status === 'rejected') throw error

  React.useEffect(() => {
    if (!pokemonName) return

    setPokemon({status: 'pending', pokemon: null})

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemon({status: 'resolved', pokemon: pokemonData})
      },
    ).catch((error) => {
        setPokemon({status: 'rejected', error})
    })
  }, [pokemonName])

  switch(status) {
    case 'rejected':
      throw error
    case 'idle':
      return <div>Submit a pokemon</div>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    default:
      return <PokemonDataView pokemon={pokemon} />
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
