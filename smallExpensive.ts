/// <reference path="Immutable.d.ts" />

// export interface IRepresentANumber<Held, Zero, One> {
//   addOneAndShift(): IRepresentANumber<[Held, One], Zero, One>;
//   addZeroAndShift(): IRepresentANumber<[Held, Zero], Zero, One>;
// }

// type Start = {}
// const zero: IRepresentANumber<[Start], { zero: boolean }, { one: boolean }> = "hey" as any
// const Thirty = zero.addOneAndShift().addOneAndShift().addOneAndShift().addOneAndShift().addZeroAndShift()

// type Z<K> = { z: K }
// interface A extends Z<A> {
//   get(): Z<A>
// }

// const t: A = 0 as any

// t.get().z

// export interface MapTypeArgs<A> extends SimpleType<A> {
//   perm: MapTypeArgs<[A, A]>
// }

// // MapTypeArgs<C, A, B> must be assignable to SimpleType<{ k: A }, B & { x: string }, C | number>

// // MapTypeArgs<C, A, B> extends SimpleType<F1(B), F2(C), F3(A)>

// interface SimpleType<X> {
//   prop1: X
//   perm: SimpleType<[X, X]>
// }