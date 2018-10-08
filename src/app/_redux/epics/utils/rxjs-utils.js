import { finalize, mergeMap } from 'rxjs/operators'
import { timer } from 'rxjs'

export const genericRetryStrategy = (
  error,
  { maxRetryAttempts = 3, scalingDuration = 1000, excludedStatusCodes = [] }
) => {
  console.log(error)
  return error.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find(e => e === error.status)
      ) {
        throw error
      }
      console.log(
        `Attempt ${retryAttempt}: retrying in ${retryAttempt *
          scalingDuration}ms`
      )
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration)
    }),
    finalize(() => console.log('We are done!'))
  )
}
