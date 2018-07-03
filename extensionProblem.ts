type Cryptic = { cryptic: "cryptic" }
type IsCryptic<MaybeCryptic> = MaybeCryptic extends Cryptic ? 1 : 0
const any: any = 0

interface A {
  mustBeZero: 0
}

module CorrectExample {
  // This interface declaration will correctly cause a compile-time error
  interface B<T> extends A {
    mustBeZero: IsCryptic<T>
  }
  
  const incorrect: A = any as B<Cryptic>
}

module BrokenExample1 {
  type Confuse<A> = [A] & A

  // This should report the "Interface 'B<T>' incorrectly extends interface 'A'." error
  interface B<T> extends A {
    mustBeZero: IsCryptic<T & [T]>
  }
  
  // The above extension is allowed yet B<T> is not assignable to A for some T:
  const incorrect: A = any as B<Cryptic>
}

module BrokenExample2 {
  type SomeOtherType = { value: number }

  interface B<T extends SomeOtherType> extends A {
    mustBeZero: IsCryptic<T>
  }

  // The above extension is allowed yet B<SomeOtherType & T> is not assignable to A for some T:
  const incorrect: A = any as B<SomeOtherType & Cryptic>
}

module BrokenExample3 {
  interface RecurseToZero<T> {
    recurse: RecurseToZero<[T,T]>
    mustBeZero: 0
  }

  interface RecurseToWhat<T> extends RecurseToZero<T> {
    recurse: RecurseToWhat<[T,T]>
    // The type of "mustBeZero" member will be different from 0 only on a certain recursion depth
    mustBeZero: T extends [infer T1, infer T2]
              ? T1 extends [infer T3, infer T4]
              ? T3 extends [infer T5, infer T6]
              ? T5 extends [infer T7, infer T8]
              ? T7 extends [infer T9, infer T10]
                ? 1
                : 0 : 0 : 0 : 0 : 0
  }

  // The above extension is allowed and the type RecurseToWhat<null> appears to be assignable to RecurseToZero<null>:
  declare let a: RecurseToZero<null>
  declare let b: RecurseToWhat<null>
  a = b

  // Yet the above should not be allowed because the type RecurseToWhat<null> is not structurally assignable to RecurseToZero<null>:
  a.recurse.recurse.recurse.recurse.mustBeZero = b.recurse.recurse.recurse.recurse.mustBeZero
  
  // This is because on the certain depths of recursion of the RecurseToWhat<T> the type of "mustBeZero" is 1:
  type Zero = RecurseToZero<null>["recurse"]["recurse"]["recurse"]["recurse"]["mustBeZero"]
  type What = RecurseToWhat<null>["recurse"]["recurse"]["recurse"]["recurse"]["mustBeZero"]
  const incorect: Zero = any as What
}

module BrokenExample4 {
  interface RecurseToZeroP<T> {
    recurse: RecurseToZeroP<[T,T]>
    mustBeZero: 0
  }

  type RecurseToZero = RecurseToZeroP<null>

  interface RecurseToWhatP<T> {
    recurse: RecurseToWhatP<[T,T]>
    // The type of "mustBeZero" member will be different from 0 only on a certain recursion depth
    mustBeZero: T extends [infer T1, infer T2]
              ? T1 extends [infer T3, infer T4]
              ? T3 extends [infer T5, infer T6]
              ? T5 extends [infer T7, infer T8]
              ? T7 extends [infer T9, infer T10]
                ? 1
                : 0 : 0 : 0 : 0 : 0
  }

  type RecurseToWhat = RecurseToWhatP<null>

  // The type RecurseToWhat appears to be assignable to RecurseToZero:
  declare let a: RecurseToZero
  declare let b: RecurseToWhat
  a = b

  // Yet the above should not be allowed because the type RecurseToWhat is not structurally assignable to RecurseToZero:
  a.recurse.recurse.recurse.recurse.mustBeZero = b.recurse.recurse.recurse.recurse.mustBeZero
  
  // This is because on the certain depths of recursion the type of "mustBeZero" is 1
  type Zero = RecurseToZero["recurse"]["recurse"]["recurse"]["recurse"]["mustBeZero"]
  type What = RecurseToWhat["recurse"]["recurse"]["recurse"]["recurse"]["mustBeZero"]
  const incorect: Zero = any as What
}

module BrokenExample5 {
  enum True { true = "true" }
  enum False { false = "false" }

  type And<Bool1,Bool2> = Bool1 extends True ? Bool2 extends True ? True : False : False
  type Or<Bool1, Bool2> = Bool1 extends True ? True : Bool2 extends True ? True : False
  type Not<Bool> = Bool extends False ? True : Bool extends True ? False : never

  interface RecurseToFalseP<T> {
    recurseWithTrue: RecurseToFalseP<[T,True]>
    recurseWithFalse: RecurseToFalseP<[T,False]>
    mustBeFalse: False
  }

  type RecurseToFalse = RecurseToFalseP<null>

  interface RecurseToPropsitionP<T> {
    recurseWithTrue: RecurseToPropsitionP<[T,True]>
    recurseWithFalse: RecurseToPropsitionP<[T,False]>
    // The type of "mustBeFalse" member will be different from False only when T represents the assignment satisfying propositional logic statement hardcoded below
    mustBeFalse: T extends [infer R6, infer T7]
              ? R6 extends [infer R5, infer T6]
              ? R5 extends [infer R4, infer T5]
              ? R4 extends [infer R3, infer T4]
              ? R3 extends [infer R2, infer T3]
              ? R2 extends [infer R1, infer T2]
              ? R1 extends [null, infer T1]
                ? And<And<And<Or<And<T1,T2>,Not<Or<T3,T4>>>,T5>,T6>,T7> // propsitional logic with T1, ..., TK variables goes here
                : False : False : False : False : False : False : False
  }

  type RecurseToPropsition = RecurseToPropsitionP<null>

  // The type RecurseToPropsition appears to be assignable to RecurseToZero:
  declare let a: RecurseToFalse
  declare let b: RecurseToPropsition
  a = b

  // In order for the TypeScript to find the member breaking the structural assignability it needs to solve the satisfiability problem for the propsition hardcoded in RecurseToPropsitionP<T>:
  a
    .recurseWithTrue.recurseWithTrue
    .recurseWithFalse.recurseWithFalse
    .recurseWithTrue.recurseWithTrue.recurseWithTrue
    .mustBeFalse 
    =
  b
    .recurseWithTrue.recurseWithTrue
    .recurseWithFalse.recurseWithFalse
    .recurseWithTrue.recurseWithTrue.recurseWithTrue
    .mustBeFalse
}

type unknown = {} | null | undefined

interface InfiniteRecurse<T,K> {
  recurse: InfiniteRecurse<[T,T],K>
  simpleValue: K
  value: InfiniteRecurse<[T,T],K>["recurse"]["simpleValue"]
}

type M = InfiniteRecurse<null,never>["value"]

// Start: Intersection
// Object intersection does NOT represent and intersection type!
type ResolvedObjectIntersection<T1,T2> = { [K in keyof T1 & keyof T2] : T1[K] & T2[K] }
type OnlyA = ResolvedObjectIntersection<{ a: number }, {a: string, b: number }>
type OnlyB = ResolvedObjectIntersection<{ a: number, b: number }, { b: string }>
type AandB = ResolvedObjectIntersection<{ a: number, b: number }, { a: string, b: string }>
// End: Intersection

// Start: Interesting observations
// We can force TypeScript to decide whether a type is possible or not
// To do so we leverage that T | never is not always T
// TypeScript will simplify T | never to T, if T is a generic so we delay this by using T | Second
// And only passing the Second=never when the T is not a generic type anymore
type Impossible = "v" & "s"
type Possible = "v" | "s"

// Computation delay trick: Normally `keyof { [K in T]: any }` would simplify to `T`
type IsPossible<T, Second> = T | Second

type Nope = IsPossible<Impossible, never>
const abcd1: Nope = 0 as any as Impossible
type Yeah = IsPossible<Possible, never>
const abcd2: Yeah = 0 as any as Possible

// End: Interesting observations

// Start: Completely unrelated bug
type AllowsOther<T extends { v?: any }> = ({ [K in keyof T]: unknown })["v"]
type DeniesOther<T extends { v?: any }> = ({ [K in keyof T]: unknown })

type Passes1 = AllowsOther<{ v: true }>
type Passes2 = AllowsOther<{ s: true }>
type Passes3 = DeniesOther<{ v: true }>
type Fails1 = DeniesOther<{ s: true }>
// End: Completely unrelated bug

// Start: HasKey
// Using the IsPossible trick we can build the HasV type
type HasKey<T,K,Second> = IsPossible<(K & keyof T), Second>
type HasV<T,Second> = HasKey<T,"v",Second>
type HasS<T,Second> = HasKey<T,"s",Second>

const shouldFail1: HasV<{},never> = any
const shouldPass1: HasV<{ v: true },never> = any
const shouldFail2: HasV<{ s: true },never> = any
const shouldPass2: HasS<{ s: true },never> = any

// We want to make true to unknown and false to never
type C1 = keyof (string & { b: true })
type C2 = keyof (number & { b: true })
type C3 = keyof (never & { b: true })
type C4 = keyof ({} & { b: true })
type ConvertNotNeverToX<T extends string | number | symbol,X> = { [K in (T & string & "v")]: X }[T & string & "v"]

type IsKey<T extends string | number | symbol,X> = { [K in T]: X }[T]

// The ["m" & StringDelay] trick is here to delay the distribution of keyof
// We need to because `keyof (T & L)` is not always `(keyof T) | (keyof L)`
// In particualr we need the delayed because one of K or L can be "never"
type SafeKeyOf<T,StringDelay> = keyof (({ m: T })["m" & StringDelay])

type IsNotNever<T,X,StringDelay extends string> = IsKey<SafeKeyOf<T & { whatever: true },StringDelay>,X>

type ShouldBeNever0 = IsNotNever<never,true,string>
type ShouldBeTrue0 = IsNotNever<string,true,string>
type ShouldBeTrue1 = IsNotNever<number,true,string>
type ShouldBeTrue2 = IsNotNever<{},true,string>
type ShouldBeTrue3 = IsNotNever<{ v: number },true,string>

type TE0 = ConvertNotNeverToX<never,true>
const abbbb: TE0 = any
type TE1 = ConvertNotNeverToX<string,true>
type TE2 = ConvertNotNeverToX<number,true>
type TE3 = ConvertNotNeverToX<{ a: null },true>
type TE4 = ConvertNotNeverToX<number & string,true>

type ConvertNotNeverToUnkown<T extends string | number | symbol> = ConvertNotNeverToX<T, unknown>
type Som1 = ConvertNotNeverToUnkown<never>
type Som2 = ConvertNotNeverToUnkown<"a">

type TT1 = ConvertNotNeverToUnkown<HasV<{},never>>
type TT2 = ConvertNotNeverToUnkown<HasV<{ v: number },never>>
// End: HasKey

// Start: RemoveOneKey
type KeySelector<T,K extends keyof T,RestType> = (({ [M in keyof T]: RestType }) & ({ [key in K]: never }))
type NeverForOneKey<T, K extends keyof T> = { [P in (keyof T) | K]: KeySelector<T,K,T[P]>[P] }

type What1 = NeverForOneKey<{ v: number, k: string },"v">
type What2 = NeverForOneKey<{ v: number, k: string },"k">

//
type Restrict<T,S extends keyof T> = { [K in S]: T[K] }
type FindNonNeverKeys<T,StringDelay extends string> = { [K in keyof T]: IsNotNever<T[K] & K,K,StringDelay> }[keyof T]
type RemoveNeverValues<T,StringDelay extends string> = Restrict<T, FindNonNeverKeys<T,StringDelay> & keyof T>

type Whatt1 = RemoveNeverValues<What1,string>
type Whatt2 = RemoveNeverValues<What2,string>

type RemoveOneKey<T, K extends keyof T, StringDelay extends string> = RemoveNeverValues<NeverForOneKey<T,K>,StringDelay>

type Whattt1 = RemoveOneKey<{ t: string, u: {} }, "t", string>
type Whattt2 = RemoveOneKey<{ t: string, u: {} }, "u", string>

type LLK = keyof ({ v: number } | { s: string }) | never

type MapVOnly<T extends { v?: any }, NewVType, StringDelay extends string> = RemoveOneKey<T,"v",StringDelay> & { v: NewVType }
//({ [K in keyof T]: T[K] } & { v: never }) & { [other: string]: any, v: true }
// type Normalize<T> = { [K in keyof T]: T[K] }

type Bounce<T> = { [K in keyof T]: T[K] }
type What = Bounce<MapVOnly<{ v: "v", k: "k" }, "newV", string>>
// End: RemoveOneKey

// Start: Condition
// Using unknown as true and never as false we can built conditional types
type Merge<T,S> = {
  [K in keyof T & keyof S]: T[K] & S[K]
}

//type IsNever<T> = 
//type FlipUnknownNever<T> = 

type Condition<T extends { true: any, false: any }, S extends { true: any, false: any }> = Merge<T,S>["true" | "false"]

type MKLO0 = HasKey<RemoveNeverValues<{ true: unknown }, string>,"true",never>
type MKLO1 = RemoveNeverValues<{ true: never }, string>

type T1 = Condition<{ true: unknown, false: never }, { true: {ifTrue: true}, false: {ifFalse: false} }>
type T2 = Condition<{ true: never, false: unknown }, { true: {ifTrue: true}, false: {ifFalse: false} }>

type IfVThen<TestType,IfTrue,IfFalse> = Condition<
  { true: ConvertNotNeverToUnkown<HasV<TestType,never>>, false: never },
  { true: IfTrue, false: IfFalse }
>

type Test4 = IfVThen<{},true,false>
type Test5 = IfVThen<{ v: 0 },true,false>
// End: Condition

// Start: Accept only certain numbers condition
type NZero = { s: true }
type NIncrement<Number> = { v: Number }
type NFive = NIncrement<NIncrement<NIncrement<NIncrement<NIncrement<NZero>>>>>

type CHasV<Number,Second extends string> = ConvertNotNeverToUnkown<HasV<Number,Second>>
type CHasS<Number,Second extends string> = ConvertNotNeverToUnkown<HasS<Number,Second>>

type IsZero<Number extends any, Second extends string> = Condition<{ true: CHasS<Number,Second>, false: never }, { true: true, false: never }>
type IsOne<Number extends any, Second extends string> = Condition<{ true: CHasV<Number,Second>, false: never }, { true: IsZero<Number["v"],Second>, false: never }>
type IsTwo<Number extends any, Second extends string> = Condition<{ true: CHasV<Number,Second>, false: never }, { true: IsOne<Number["v"],Second>, false: never }>
type IsThree<Number extends any, Second extends string> = Condition<{ true: CHasV<Number,Second>, false: never }, { true: IsTwo<Number["v"],Second>, false: never }>
type IsFour<Number extends any, Second extends string> = Condition<{ true: CHasV<Number,Second>, false: never }, { true: IsThree<Number["v"],Second>, false: never }>
type IsFive<Number extends any, Second extends string> = Condition<{ true: CHasV<Number,Second>, false: never }, { true: IsFour<Number["v"],Second>, false: never }>

const ttt0: IsZero<NZero,never> = true
const ttt1: IsOne<NIncrement<NZero>,never> = true
const ttt2: IsTwo<NIncrement<NIncrement<NZero>>,never> = true
const ttt3: IsThree<NIncrement<NIncrement<NIncrement<NZero>>>,never> = true

interface InfiniteNumbersWithZero<Number> {
  next: InfiniteNumbersWithZero<NIncrement<Number>>
  alwaysNever: never
}

interface InfiniteNumbersWithWhat<Number> extends InfiniteNumbersWithZero<Number> {
  next: InfiniteNumbersWithWhat<NIncrement<Number>>
  alwaysNever: IsFive<Number,never>
}

const infinite1: InfiniteNumbersWithZero<NZero> = any
const infinite2: InfiniteNumbersWithWhat<NZero> = any

// infinite1.alwaysNever = infinite2.alwaysNever
// infinite1.next.next.alwaysNever = infinite2.next.next.alwaysNever

// End: Accept only certain numbers condition

type T3 = never & number
type T4 = any & number
type T5 = any | never
type T6 = any & never
type T7 = (true & false) | never