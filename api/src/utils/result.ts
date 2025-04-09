export type Result<T, E = Error> = Success<T> | Failure<E>

interface Success<T> {
  readonly ok: true
  readonly value: T
}

interface Failure<E> {
  readonly ok: false
  readonly error: E
}

export const success = <T>(value: T): Success<T> => ({ ok: true, value })
export const failure = <E>(error: E): Failure<E> => ({ ok: false, error })
