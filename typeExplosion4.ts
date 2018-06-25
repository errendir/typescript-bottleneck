type AppendDigit<Number,Digit> = [Number, Digit]

type BinarySplit<NumberSet,Zero,One> = NumberSet extends { zero: infer A, one: infer B }
  ? { zero: BinarySplit<A,Zero,One>, one: BinarySplit<B,Zero,One> }
  : { zero: AppendDigit<NumberSet,Zero>, one: AppendDigit<NumberSet,One> }

enum Zero { zero = "zero" }
enum One { one = "one" }
enum End { end = "end" }

enum True { true = "true" }
enum False { false = "false" }

type Not<Bool> =
    Bool extends False
      ? True 
  : Bool extends True
      ? False
  : never

type BSplit<A> = BinarySplit<A,Zero,One>

enum UnaryZero { unaryZero = "unaryZero" }
enum PlusOne { plusOne = "plusOne" }
type UnaryIncrement<UnaryNumber> = [UnaryNumber, PlusOne]
type UnaryDecrement<UnaryNumber> = 
    UnaryNumber extends UnaryZero
      ? UnaryZero
  : UnaryNumber extends [infer UnaryNumberDecremented, PlusOne]
      ? UnaryNumberDecremented
  : never

type UnaryOne = UnaryIncrement<UnaryZero>

type CreateNestedNumber<UnaryNumber,Zero,One> = UnaryNumber extends [infer UnaryNumberDecremented, PlusOne]
  ? { wrap: BinarySplit<Unwrap<CreateNestedNumber<UnaryNumberDecremented,Zero,One>>,Zero,One> }
  : End

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

type UnaryFive = UnaryIncrement<UnaryIncrement<UnaryIncrement<UnaryIncrement<UnaryIncrement<UnaryZero>>>>>
type FiveDigits3 = Unwrap<FlattenNestedNumber<Unwrap<CreateNestedNumber<UnaryFive,Zero,One>>>>

// 1101
type Eleven = [[[[[End, One], One], Zero], One], Zero]

// Some simple unary and binary operations
type AddUnaryWrappd<UIntA, UIntB> =
    UIntA extends UnaryZero
      ? UIntB
  : UIntA extends [infer UIntADecremented, PlusOne]
    ? { wrap: AddUnaryWrappd<UIntADecremented, UnaryIncrement<UIntB>> }
  : never
type AddUnary<UIntA, UIntB> = Unwrap<AddUnaryWrappd<UIntA,UIntB>>

type SubtractUnaryWrappd<UIntA, UIntB> =
    UIntB extends UnaryZero
      ? UIntA
  : UIntB extends [infer UIntBDecremented, PlusOne]
    ? { wrap: SubtractUnaryWrappd<UnaryDecrement<UIntA>, UIntBDecremented> }
  : never
type SubtractUnary<UIntA, UIntB> = Unwrap<SubtractUnaryWrappd<UIntA,UIntB>>

type DoubleUnaryWrapped<UnaryNumber> = UnaryNumber extends [infer UnaryNumberDecremented, PlusOne]
  ? { wrap: [[Unwrap<DoubleUnaryWrapped<UnaryNumberDecremented>>, PlusOne], PlusOne] }
  : UnaryNumber
type DoubleUnary<UnaryNumber> = Unwrap<DoubleUnaryWrapped<UnaryNumber>>

type HalfUnaryWrapped<UnaryNumber> = UnaryNumber extends [[infer UnaryNumberMinusTwo, PlusOne], PlusOne]
  ? { wrap: [Unwrap<HalfUnaryWrapped<UnaryNumberMinusTwo>>, PlusOne] }
  : UnaryZero
type HalfUnary<UnaryNumber> = Unwrap<HalfUnaryWrapped<UnaryNumber>>

type IsEvenUnaryWrapped<UnaryNumber> =
    UnaryNumber extends [[infer UnaryNumberMinusTwo, PlusOne], PlusOne]
      ? { wrap: Unwrap<IsEvenUnaryWrapped<UnaryNumberMinusTwo>> }
  : UnaryNumber extends UnaryOne
      ? False
  : UnaryNumber extends UnaryZero
      ? True
  : never
type IsEvenUnary<UnaryNumber> = Unwrap<IsEvenUnaryWrapped<UnaryNumber>>

type IsOddUnary<UnaryNumber> = Not<IsEvenUnary<UnaryNumber>>

type UnaryTwo = UnaryIncrement<UnaryIncrement<UnaryZero>>
type UnaryFour = DoubleUnary<UnaryTwo>
type UnarySix = AddUnary<UnaryFour,UnaryTwo>
type UnaryFour2 = SubtractUnary<UnarySix, UnaryTwo>
type UnaryTwo2 = HalfUnary<UnaryFive>

type shouldBeTrue1 = IsEvenUnary<UnaryZero>
type shouldBeTrue2 = IsOddUnary<UnaryIncrement<UnaryTwo>>

type AppendToBinaryWrapped<BinaryNumber, Digit> =
    BinaryNumber extends End
      ? [End, Digit]
  : BinaryNumber extends [infer Head, infer Tail]
      ? { wrap: [AppendToBinary<Head,Digit>, Tail] }
  : never
type AppendToBinary<BinaryNumber, Digit> = Unwrap<AppendToBinaryWrapped<BinaryNumber, Digit>>

type ReverseBinaryWrapped<BinaryNumber> =
    BinaryNumber extends End
      ? End
  : BinaryNumber extends [infer Head, infer Tail]
      ? { wrap: AppendToBinaryWrapped<Unwrap<ReverseBinaryWrapped<Head>>, Tail> }
  : Zero
type ReverseBinary<BinaryNumber> = Unwrap<ReverseBinaryWrapped<BinaryNumber>>

type ioio = [[[[End, One], Zero], One], Zero]
type oioio = AppendToBinary<ioio, Zero>
type oioi = ReverseBinaryWrapped<ioio>

type BinaryToUnaryWrapped<BinaryNumber> =
    BinaryNumber extends End
      ? UnaryZero
  : ReverseBinary<BinaryNumber> extends [infer Rest, One]
      ? { wrap: AddUnary<DoubleUnary<Unwrap<BinaryToUnaryWrapped<ReverseBinary<Rest>>>>, UnaryIncrement<UnaryZero>> }
  : ReverseBinary<BinaryNumber> extends [infer Rest, Zero]
      ? { wrap: DoubleUnary<Unwrap<BinaryToUnaryWrapped<ReverseBinary<Rest>>>> }
  : never
type BinaryToUnary<BinaryNumber> = Unwrap<BinaryToUnaryWrapped<BinaryNumber>>

type UnaryEight = BinaryToUnary<[[[[End, Zero], Zero], Zero], One]>
type UnarySeven = BinaryToUnary<[[[End, One], One], One]>
type UnaryFifteen = BinaryToUnary<[[[[End, One], One], One], One]>

type UnaryToBinaryHelperWrapped<UnaryNumber, BinaryPart> =
    UnaryNumber extends UnaryZero
      ? BinaryPart
  : IsOddUnary<UnaryNumber> extends True
      ? { wrap: UnaryToBinaryHelperWrapped<HalfUnary<UnaryNumber>, [BinaryPart, One]> }
  : IsEvenUnary<UnaryNumber> extends True
      ? { wrap: UnaryToBinaryHelperWrapped<HalfUnary<UnaryNumber>, [BinaryPart, Zero]> }
  : never
type UnaryToBinaryHelper<UnaryNumber, BinaryPart> = Unwrap<UnaryToBinaryHelperWrapped<UnaryNumber, BinaryPart>>

type UnaryToBinary<UnaryNumber> = UnaryToBinaryHelper<UnaryNumber, End>

type BinaryThree = UnaryToBinary<UnaryIncrement<DoubleUnary<UnaryIncrement<UnaryZero>>>>
type BinarySeven = UnaryToBinary<UnaryIncrement<DoubleUnary<UnaryIncrement<DoubleUnary<UnaryIncrement<UnaryZero>>>>>>

type UnarySequenceWrapped<MaxUnaryNumber> =
    MaxUnaryNumber extends UnaryZero
      ? End
  : MaxUnaryNumber extends [infer NewMaxUnaryNumber, PlusOne]
      ? { wrap: [Unwrap<UnarySequenceWrapped<NewMaxUnaryNumber>>, MaxUnaryNumber] }
  : never
type UnarySequence<MaxUnaryNumber> = Unwrap<UnarySequenceWrapped<MaxUnaryNumber>>

type OneToSeven = UnarySequence<UnarySeven>

// Assuming numbers are different and have the same number of digits
type IsGreaterWrapped<IntA,IntB> =
    IntA extends [infer NextIntA, infer SigDigitA]
  ? IntB extends [infer NextIntB, infer SigDigitB]
    ? SigDigitA extends One
      ? SigDigitB extends One
        ? { wrap: IsGreaterWrapped<NextIntA,NextIntB> }
        : True
      : SigDigitB extends One
        ? False
        : { wrap: IsGreaterWrapped<NextIntA,NextIntB> }
    : "brokenB"
  : "brokenA"

type IsGreater<IntA,IntB> = Unwrap<IsGreaterWrapped<IntA,IntB>>

type Test5gt4 = IsGreater<[[[[End], One], Zero], One], [[[[End], Zero], Zero], One]>

type MMM = [[[[End], One], Zero], One] extends [infer A, infer B] ? B : never

type OOO = MMM extends One ? True : False

// TODO: Iteration (map over the nested numbers)
type C = { a: never, b: "b", c: "c" }
type M = C[keyof C]

const a: FiveDigits = 0 as any as Eleven