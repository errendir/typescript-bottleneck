/// <reference lib="es2015" />
/// <reference lib="es2016" />
/// <reference lib="es2017" />

// The DontDistrubute<E> type is only used to avoid distributive conditional types
type DontDistrubute<E> = { m: E }

type IsEquivalentH<TypeA,TypeB> = TypeA extends TypeB ? TypeB extends TypeA ? 1 : 0 : 0
type IsEquivalent<TypeA,TypeB> = IsEquivalentH<DontDistrubute<TypeA>,DontDistrubute<TypeB>>
declare let onlyAcceptTrue: 1
declare const any: any

enum Modes {
  First = "first",
  Second = "second",
  Third = "third",
}
// This is how you can manually verify if there is only one member of the union type
type ExaclyOneMode<T extends Modes> =
    DontDistrubute<T> extends DontDistrubute<never>
      ? never
  : DontDistrubute<T> extends DontDistrubute<Modes.First>
      ? Modes.First
  : DontDistrubute<T> extends DontDistrubute<Modes.Second>
      ? Modes.Second
  : DontDistrubute<T> extends DontDistrubute<Modes.Third>
      ? Modes.Third
  : never

onlyAcceptTrue = any as IsEquivalent<ExaclyOneMode<never>,never>
onlyAcceptTrue = any as IsEquivalent<ExaclyOneMode<Modes>,never>
onlyAcceptTrue = any as IsEquivalent<ExaclyOneMode<Modes.First>,Modes.First>
onlyAcceptTrue = any as IsEquivalent<ExaclyOneMode<Modes.Second>,Modes.Second>
onlyAcceptTrue = any as IsEquivalent<ExaclyOneMode<Modes.Third>,Modes.Third>

const anyMode: Modes = 0 as any
function CannotInferWhichMode<Mode extends Modes>(mode: ExaclyOneMode<Mode>) {
    console.log(mode)
}
CannotInferWhichMode(Mode.First)
CannotInferWhichMode(anyMode)

function CanInferWhichMode<Mode extends Modes>(mode: ExaclyOneMode<Mode>, repeatMode: Mode) {
    console.log(mode)
}
CanInferWhichMode(Modes.First, Modes.First)
CanInferWhichMode(anyMode, anyMode)

function CanInferWhichMode2<Mode extends Modes>(mode: ExaclyOneMode<Mode> & Mode) {
    console.log(mode)
}
CanInferWhichMode2(Modes.First)
CanInferWhichMode2(anyMode)

type ModeLookupRaw = {
    [Modes.First]: "a"
    [Modes.Second]: "b",
    [Modes.Third]: "c",
}
type ModeLookup<Mode extends Modes> = ModeLookupRaw[Mode]

function Test<Mode extends Modes>(o: ModeLookup<Modes.First>): ModeLookup<Mode> {
    return o
}

const te = Test<Modes.Second>(0 as any)

type ModeLookupWrapOne<Mode extends Modes> = {
    lookup: { [K in ModeLookup<ExaclyOneMode<Mode> & Mode>] }
}

export type ModeLookupWrapTwo<Mode extends Modes> = {
    wrap: ModeLookupWrapOne<ExaclyOneMode<Mode> & Mode>
}

function TestA<Mode extends Modes>() {
    let a: ModeLookupWrapTwo<Mode> = 0 as any
    let b: ModeLookupWrapTwo<Modes.First> = 0 as any

    a.wrap.lookup = b.wrap.lookup
    a.wrap = b.wrap
    a = b
}


// TODO: Develop union arithmetic.
// We want to be able to half the number of members
// of a union type and verify if the number of members
// of a union type is even or odd
type U2I<T extends string> = { [K in T]: K }

type SubTwo<T extends any[]> = ((...args: T) => void) extends (a: infer A, b: infer B, ...args: infer C) => void ? C : T

type L = SubTwo<[1,2,3]>

declare const A: unique symbol
type A = typeof A
declare const B: unique symbol
type B = typeof B
type Z = U2I<Modes.First | Modes.Second>

const a = Object.entries

type Stamp<T extends string> = { [K in T]: K & { stamp: K } }[T]
type HEY = Stamp<"a" | "b" | "c">

type SS = ("A" | "B") | never
