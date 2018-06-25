type AppendDigit<Number,Digit> = [Number, Digit]

type BinarySplit<NumberSet,Zero,One> = NumberSet extends { zero: infer A, one: infer B }
  ? { zero: BinarySplit<A,Zero,One>, one: BinarySplit<B,Zero,One> }
  : { zero: AppendDigit<NumberSet,Zero>, one: AppendDigit<NumberSet,One> }

enum Zero { zero = "zero" }
enum One { one = "one" }
enum End { end = "end" }

type BSplit<A> = BinarySplit<A,Zero,One>

type UnaryZero = null

type UnaryIncrement<UnaryNumber> = { one: UnaryNumber }

type CreateNestedNumber<UnaryNumber,Zero,One> =  UnaryNumber extends { one: infer UnaryNumberDecremented }
  ? { wrap: BinarySplit<Unwrap<CreateNestedNumber<UnaryNumberDecremented,Zero,One>>,Zero,One> }
  : null

type FlattenNestedNumberDouble<WrappedType> = WrappedType extends { zero: { zero: infer ZZ, one: infer ZO }, one: { zero: infer OZ, one: infer OO } }
  ? { wrap: FlattenNestedNumberDouble<WrappedType["zero" | "one"]["zero" | "one"]> }
  : WrappedType

type FlattenNestedNumberSingle<WrappedType> = 
  WrappedType extends { wrap: infer T }
    ? { wrap: FlattenNestedNumberSingle<T> }
  : WrappedType extends { zero: infer Z, one: infer O }
    ? { wrap: WrappedType["zero" | "one"] }
    : WrappedType

type FlattenNestedNumber<WrappedType> = FlattenNestedNumberSingle<FlattenNestedNumberDouble<WrappedType>>

type UnwrapDouble<WrappedType> = WrappedType extends { wrap: { wrap: infer T } }
  ? { wrap: UnwrapDouble<T> }
  : WrappedType

type UnwrapLast<WrappedType> = WrappedType extends { wrap: infer T }
  ? T
  : WrappedType

type Unwrap<WrappedType> = UnwrapLast<UnwrapLast<UnwrapDouble<WrappedType>>>

type FiveDigits = 
  (BSplit<BSplit<BSplit<BSplit<BSplit<End>>>>>)["zero" | "one"]["zero" | "one"]["zero" | "one"]["zero" | "one"]["zero" | "one"]

type FiveDigits2 = Unwrap<FlattenNestedNumber<(BSplit<BSplit<BSplit<BSplit<BSplit<End>>>>>)>>

type UnaryFour = UnaryIncrement<UnaryIncrement<UnaryIncrement<UnaryIncrement<UnaryZero>>>>
type FiveDigits3 = Unwrap<FlattenNestedNumber<Unwrap<CreateNestedNumber<UnaryFour,Zero,One>>>>

// 1101
type Eleven = [[[[[End, One], One], Zero], One], Zero]

const a: FiveDigits = 0 as any as Eleven