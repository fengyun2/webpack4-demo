import React from 'react'

const Loading = ({
  isLoading, timedOut, pastDelay, error
}) => {
  if (isLoading) {
    if (timedOut) {
      return <div>Loader timed out!</div>
    }
    if (pastDelay) {
      return <div>Loading...</div>
    }
    return null
  }
  if (error) {
    return <div>Error! Component failed to load</div>
  }
  return null
}

export default Loading
