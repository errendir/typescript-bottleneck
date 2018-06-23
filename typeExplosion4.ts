type AppendDigit<Number,Digit> = [Number, Digit]

type BinarySplit<NumberSet,Zero,One> = NumberSet extends { zero: infer A, one: infer B }
  ? { zero: BinarySplit<A,Zero,One>, one: BinarySplit<B,Zero,One> }
  : { zero: AppendDigit<NumberSet,Zero>, one: AppendDigit<NumberSet,One> }

enum Zero { zero = "zero" }
enum One { one = "one" }
enum UnexpectedDigit { unexpected = "unexpected" }
enum End { end = "end" }

type BSplit<A> = BinarySplit<A,Zero,One>

// type NumberWithDigits<UnaryNumber,Zero,One> = UnaryNumber extends { one: infer B }
//   ? { zero: BinarySplit<NumberWithDigits<A,Zero,One>,Zero,One> }
//   : null

// type FlatNumber<NestedNumber> = NestedNumber extends { zero: any, one: any }
//   ? { only: FlatNumber<NestedNumber["zero" | "one"]> }
//   : AbortController

type FiveDigits = 
  (BSplit<BSplit<BSplit<BSplit<BSplit<End>>>>>)["zero" | "one"]["zero" | "one"]["zero" | "one"]["zero" | "one"]["zero" | "one"]

// 1101
type Eleven = [[[[[End, One], One], Zero], One], Zero]

const a: FiveDigits = 0 as any as Eleven