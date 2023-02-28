// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js
  
import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm } from '../pokemon'
import { fetchPokemon } from '../pokemon';
import { PokemonInfoFallback } from '../pokemon';
import { PokemonDataView } from '../pokemon';
import {ErrorBoundary} from 'react-error-boundary'

const initialRequest = {
  error: { message: null },
  status: 'idle',
  pokemon: null
};

// class PokemonError extends React.Component {
//   state = {error: false}

//   static getDerivedStateFromError(error) {
//     console.log(error)
//     return error;
//   };

//   componentDidCatch(error, errorInfo) { 
//     console.log('my err log: ', error)
//     // alertnatively could log
//   };

//   render() {
//     if (this.state.message) {
//       console.log('Error boundary render')
//       return <this.props.fallback error={this.state.message } />;
//     } else {
//       return this.props.children;
//     }
//   }
// }

function PokemonInfoFallback2({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [request, setRequest] = React.useState(initialRequest)
  // const [pokemon, setPokemon] = React.useState(null);
  // const [error, setError] = React.useState({message:null});
  // const [status, setStatus] = React.useState('idle');
  // console.log(status)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    //
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  
  // if(request.status === 'rejected') throw new Error('invalid pokemon')

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setRequest({
      error: { message: null },
      status: 'pending',
      pokemon: null
    })
    // setStatus('pending');
    // setPokemon(null);
    // setError({message:null});
    
    fetchPokemon(pokemonName).then( 
      pokemonData => {
        // setStatus('resolved')
        // setPokemon(pokemonData)
        setRequest({ ...initialRequest, 
          status: 'resolved',
          pokemon: pokemonData
        })
      },
      error => {
        // setError(error)
        // setStatus('rejected');
        console.log('catch: ', error)
        setRequest({ ...initialRequest,
          status: 'rejected',
          error
        })
      }
    )
    // return () => new AbortController.abort(); ??? 
  }, [pokemonName]);
  // }, [request, pokemonName]);

  const statusDisplays = {
    idle: <span>Submit a pokemon</span>,
    pending: <PokemonInfoFallback name={pokemonName} />,
    resolved: <PokemonDataView pokemon={request.pokemon} />,
    rejected: true
  }

  if (request.status === 'rejected') {
    throw request.error
  } else {
    return statusDisplays[request.status];
  }

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary onReset={() => { setPokemonName('') }} resetKeys={[pokemonName] } FallbackComponent={PokemonInfoFallback2}>
        {/* <ErrorBoundary key={pokemonName } fallback={PokemonInfoFallback2}> */}
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
