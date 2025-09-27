// Types for tuple-based error handling
type TryCatchResult<T, E = Error> = readonly [E, null] | readonly [null, T];
type TryCatchResultAsync<T, E = Error> = Promise<TryCatchResult<T, E>>;

// Overloads for different use cases
export function tryCatch<T, E = Error>(
  promise: Promise<T>,
): TryCatchResultAsync<T, E>;

export function tryCatch<T, E = Error>(fn: () => T): TryCatchResult<T, E>;

export function tryCatch<T, E = Error>(
  asyncFn: () => Promise<T>,
): TryCatchResultAsync<T, E>;

// Main implementation
export function tryCatch<T, E = Error>(
  operation: Promise<T> | (() => T) | (() => Promise<T>),
): TryCatchResult<T, E> | TryCatchResultAsync<T, E> {
  // Handle direct Promise
  if (operation instanceof Promise) {
    return operation
      .then((data: T) => [null, data] as const)
      .catch((error: E) => [error, null] as const);
  }

  try {
    const result = operation();

    // If function returns a Promise, handle it async
    if (result instanceof Promise) {
      return result
        .then((data: T) => [null, data] as const)
        .catch((error: E) => [error, null] as const);
    }

    // Sync result
    return [null, result] as const;
  } catch (error) {
    return [error as E, null] as const;
  }
}

// export type ArrayResolved<T> = [null, T]
// export type ArrayRejected<E> = [E, null]

// export type ArraySwappedResolved<T> = [T, null]
// export type ArraySwappedRejected<E> = [null, E]

// export type ObjectResolved<T> = {
// 	data: T
// 	err: null

// 	success: true
// }

// export type ObjectRejected<E extends Error> = {
// 	data: null
// 	err: E

// 	success: false
// }

// export type Result<T, E extends Error> = (
// 	| ObjectResolved<T>
// 	| ObjectRejected<E>
// ) &
// 	(ArrayResolved<T> | ArrayRejected<E>) &
// 	ResultAddon<T>
// export type SwappedResult<T, E extends Error> = (
// 	| ObjectResolved<T>
// 	| ObjectRejected<E>
// ) &
// 	(ArraySwappedResolved<T> | ArraySwappedRejected<E>) &
// 	ResultAddon<T>

// export type ResultAddon<T> = { resolve(): T }

// export type MaybePromise<T> = T | Promise<T>

// export function transformMaybePromise<T, U>(
// 	arg: MaybePromise<T>,
// 	func: (arg: T) => U,
// ): MaybePromise<U | Result<null, Error>> {
// 	return arg instanceof Promise
// 		? new Promise(async resolve => {
// 				try {
// 					const data = await arg
// 					resolve(func(data))
// 				} catch (anyErr) {
// 					const err = parseErr(anyErr)
// 					resolve(createResult(null, err) as Result<null, Error>)
// 				}
// 			})
// 		: func(arg)
// }

// export function shallowCopyObj(obj: object): Record<string, string> {
// 	const copy: Record<string, string> = {}
// 	for (const key in obj) {
// 		const value: any = obj[<keyof object>key]

// 		const copyVal: string = (() => {
// 			switch (typeof value) {
// 				case 'string':
// 					return value

// 				case 'number':
// 				case 'boolean':
// 					return `${value}`

// 				case 'bigint':
// 					return `${value}n`

// 				case 'object':
// 					return value === null
// 						? 'null'
// 						: (value.toJSON?.() ??
// 								(value.toString() === '[object Object]'
// 									? undefined
// 									: value.toString()) ??
// 								value[Symbol.toStringTag] ??
// 								value[Symbol.name] ??
// 								('constructor' in value ? value.constructor.name : 'Object'))

// 				case 'function':
// 					return value.name
// 				case 'symbol':
// 					return value.description

// 				case 'undefined':
// 					return 'undefined'
// 			}
// 		})()

// 		copy[<keyof object>key] = copyVal
// 	}

// 	return copy
// }

// export function parseErr(err: any): Error {
// 	if (err instanceof Error) return err

// 	switch (typeof err) {
// 		case 'string':
// 			return new Error(err)
// 		case 'object':
// 			try {
// 				return new Error(
// 					err === null ? 'null' : JSON.stringify(shallowCopyObj(err)),
// 				)
// 			} catch (_stringifyError) {
// 				return new Error('[object Object] (stringify failed)')
// 			}

// 		case 'symbol':
// 			return new Error(err.description)

// 		default:
// 			return new Error(`${err}`)
// 	}
// }

// export function createResult<T, E extends Error>(
// 	data: T | null = null,
// 	err: E | null = null,
// ): Result<T, E> {
// 	const success = err === null
// 	return <Result<T, E>>{
// 		data,
// 		err,
// 		success,
// 		0: err,
// 		1: data,
// 		length: 2,
// 		[Symbol.iterator]: resultIterator,
// 		resolve,
// 	}

// 	function* resultIterator() {
// 		yield err
// 		yield data
// 	}

// 	function resolve(): T {
// 		if (success) return <T>data
// 		throw err
// 	}
// }

// export function tryCatch<T, E extends Error>(
// 	arg: () => Promise<void>,
// ): Promise<Result<T, E>>
// export function tryCatch<T, E extends Error>(arg: VoidFunction): Result<T, E>
// export function tryCatch<T, E extends Error>(
// 	arg: Promise<T> | (() => Promise<T>),
// ): Promise<Result<T, E>>
// export function tryCatch<T, E extends Error>(arg: () => T): Result<T, E>
// export function tryCatch<T, E extends Error = Error>(
// 	arg: Promise<T> | (() => MaybePromise<T>),
// ): MaybePromise<Result<T, E>>
// export function tryCatch<T, E extends Error = Error>(
// 	arg: Promise<T> | (() => MaybePromise<T>),
// ): MaybePromise<Result<T, E>> {
// 	try {
// 		const maybePromiseData = arg instanceof Promise ? arg : arg()
// 		const resultPromiseOrValue = transformMaybePromise(maybePromiseData, data =>
// 			createResult(data, null),
// 		)

// 		return resultPromiseOrValue as MaybePromise<Result<T, E>>
// 	} catch (anyErr: any) {
// 		const err = parseErr(anyErr) as E
// 		return createResult(<T>null, err)
// 	}
// }

// tryCatch.dataErr = dataErr

// async function dataErr<T, E extends Error>(
// 	arg: Promise<T> | (() => MaybePromise<T>),
// ): Promise<SwappedResult<T, E>> {
// 	const result = await tryCatch(arg)

// 	const { data, err, success, resolve } = result

// 	return {
// 		data,
// 		err,
// 		success,
// 		0: data,
// 		1: err,
// 		length: 2,
// 		[Symbol.iterator]: function* () {
// 			yield data
// 			yield err
// 		},
// 		resolve,
// 	} as SwappedResult<T, E>
// }
