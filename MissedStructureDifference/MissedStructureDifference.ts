enum Modes {
  First = "first",
  Second = "second",
  Third = "third",
}

type ModeLookup = {
  [Modes.First]: "a",
  [Modes.Second]: "b",
  [Modes.Third]: "c",
}

function TypeIncorrectFn<Mode extends Modes>(o: ModeLookup[Modes.First]): ModeLookup[Mode] {
  return o // No error
}
const isTypedAsB = TypeIncorrectFn<Modes.Second>("a")

type SafeLookup<Mode extends Modes> =
    Mode extends Modes.First | Modes.Second | Modes.Third
      ? ModeLookup[Mode]
      : never

function TypeCorrectFn<Mode extends Modes>(o: SafeLookup<Modes.First>): SafeLookup<Mode> {
  return o // Error as expected
}

type ExaclyOneMode<T extends Modes> =
  T extends Modes.First
      ? Modes.First
  : T extends Modes.Second
      ? Modes.Second
  : T extends Modes.Third
      ? Modes.Third
  : never

type ModeLookupWrap<Mode extends Modes> = {
  lookup: { [K in ModeLookup[ExaclyOneMode<Mode>]]: true }
}

function TestA<Mode extends Modes>() {
  let a: ModeLookupWrap<Mode> = 0 as any
  let b: ModeLookupWrap<Modes.First> = 0 as any

  a.lookup = b.lookup
  a = b
}