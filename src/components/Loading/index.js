import React from 'react'

const Loading = (props) => {
  if(props.isLoading) {
    if(props.timedOut) {
      return <div>Loader timed out!</div>
    } else if(props.pastDelay) {
      return <div>Loading...</div>
    } else {
      return null
    }
  } else if (props.error) {
    return <div>Error! Component failed to load</div>
  } else {
    return null
  }
}

export default Loading

