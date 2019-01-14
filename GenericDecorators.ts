// https://github.com/Microsoft/TypeScript/issues/15016#issuecomment-292108004
// https://github.com/Microsoft/TypeScript/issues/9949
// https://github.com/Microsoft/TypeScript/issues/9366
// https://github.com/Microsoft/TypeScript/pull/24626

declare function param<A, B, C>(a: A, b: B): C
declare function noParam(a: number, b: string): boolean

type Preserve<FN extends (...args: any[]) => any> = FN extends (...args: infer AS) => infer R
  ? { (...args: AS): R }
  : never

type MM1 = Preserve<typeof param>
type MM2 = Preserve<typeof noParam>

declare function Transform<FN extends (...args: any[]) => any>(fn: FN): Preserve<FN>

const fn2 = Transform(param)