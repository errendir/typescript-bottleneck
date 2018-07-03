namespace fakeConditional {

// Start: Test helpers - the only example of real conditionals
type IsEquivalentH<TypeA,TypeB> = TypeA extends TypeB ? TypeB extends TypeA ? 1 : 0 : 0
type IsEquivalent<TypeA,TypeB> = IsEquivalentH<{ m: TypeA },{ m: TypeB }>
let onlyAcceptTrue: 1
// End: Test helpers

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
// TypeScript will simplify T | never to T, if T is a generic so we delay this by using T | NeverDelay
// And only passing the NeverDelay=never when the T is not a generic type anymore
type Impossible1 = "v" & "s"
type Impossible2 = true & false
type Possible = "v" | "s"

// Computation delay trick: Normally `keyof { [K in T]: any }` would simplify to `T`
type IsPossible<T, NeverDelay> = T | NeverDelay

module Test0 {
  type ShouldBeNever0 = IsPossible<Impossible1, never>
  type ShouldBeNever1 = IsPossible<Impossible2, never>
  type ShouldBeVorS = IsPossible<Possible, never>

  onlyAcceptTrue = any as IsEquivalent<ShouldBeNever0,never>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeNever1,never>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeVorS, "v" | "s">
}

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
type HasKey<T,K,NeverDelay> = IsPossible<(K & keyof T), NeverDelay>
type HasV<T,NeverDelay> = HasKey<T,"v",NeverDelay>
type HasS<T,NeverDelay> = HasKey<T,"s",NeverDelay>

module Test1 {
  type ShouldBeNever0 = HasV<{}, never>
  type ShouldBeNever1 = HasV<{ s: true }, never>
  type ShouldBeV = HasV<{ v: true }, never>
  type ShouldBeS = HasS<{ s: true }, never>

  onlyAcceptTrue = any as IsEquivalent<ShouldBeNever0,never>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeNever1,never>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeV,"v">
  onlyAcceptTrue = any as IsEquivalent<ShouldBeS,"s">
}

type IsKey<T extends string | number | symbol,X,Y> = ({ [k: string]: Y } & { [K in T]: X })[T]

type MOK0 = IsKey<never,true,false>
type MOK1 = IsKey<"s",true,false>
type MOK2 = IsKey<"t" | "u",true,false>
type MOK3 = IsKey<"t" & "u",true,false>
type MOK4 = IsKey<"t" & string,true,false>
type MOK5 = IsKey<number,true,false>

// keyof shouldn't always distrubute over intersection type:
type C1 = keyof (string & { b: true })
type C2 = keyof (number & { b: true })
type C3 = keyof ({} & { b: true })

type C4_correct = keyof (never & { b: true })
type C4_mistake = (keyof never) | (keyof { b: true })

// The ["m" & StringDelay] trick is here to delay the distribution of keyof
// We need to because `keyof (T & L)` is not always `(keyof T) | (keyof L)`
// In particular we need the delayed because one of K or L can be "never"
type SafeKeyOf<T,StringDelay> = keyof (({ m: T })["m" & StringDelay])

type IsNotNever<T,X,Y,StringDelay extends string> = IsKey<SafeKeyOf<T & { whatever: true },StringDelay>,X,Y>

module Test2 {
  type ShouldBeNever0 = IsNotNever<never,true,never,string>
  type ShouldBeTrue0 = IsNotNever<string,true,never,string>
  type ShouldBeTrue1 = IsNotNever<number,true,never,string>
  type ShouldBeTrue2 = IsNotNever<{},true,never,string>
  type ShouldBeTrue3 = IsNotNever<{ v: number },true,never,string>

  onlyAcceptTrue = any as IsEquivalent<ShouldBeNever0,never>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeTrue0,true>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeTrue1,true>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeTrue2,true>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeTrue3,true>
}

// Here is an attempt to create IsNotNever without the delayed string
type IsNotNever2<T extends string | number | symbol,X> = { [K in (T & string & "v")]: X }[T & string & "v"]

module Test3 {
  type TE0 = IsNotNever2<never,true>
  type TE1 = IsNotNever2<string,true>
  type TE2 = IsNotNever2<number,true>
  type TE3 = IsNotNever2<{ a: null },true>
  type TE4 = IsNotNever2<number & string,true>
}

type ConvertNotNeverToUnkown<T extends string | number | symbol> = IsNotNever2<T, unknown>
type Som1 = ConvertNotNeverToUnkown<never>
type Som2 = ConvertNotNeverToUnkown<"a">

type TT1 = ConvertNotNeverToUnkown<HasV<{},never>>
type TT2 = ConvertNotNeverToUnkown<HasV<{ v: number },never>>
// End: HasKey

// Start: RemoveOneKey
type KeySelector<T,K extends keyof T,RestType> = (({ [M in keyof T]: RestType }) & ({ [key in K]: never }))
type NeverForOneKey<T, K extends keyof T> = { [P in (keyof T) | K]: KeySelector<T,K,T[P]>[P] }

type Restrict<T,S extends keyof T> = { [K in S]: T[K] }
type FindNonNeverKeys<T,StringDelay extends string> = { [K in keyof T]: IsNotNever<T[K] & K, K, never, StringDelay> }[keyof T]
type RemoveNeverValues<T,StringDelay extends string> = Restrict<T, FindNonNeverKeys<T,StringDelay> & keyof T>

type RemoveOneKey<T, K extends keyof T, StringDelay extends string> = RemoveNeverValues<NeverForOneKey<T,K>,StringDelay>

module Test4 {
  type NeverV = NeverForOneKey<{ v: number, k: string },"v">
  type NeverK = NeverForOneKey<{ v: number, k: string },"k">
  type RemoveV = RemoveNeverValues<NeverV,string>
  type RemoveK = RemoveNeverValues<NeverK,string>
  type RemoveT = RemoveOneKey<{ t: string, u: {} }, "t", string>
  type RemoveU = RemoveOneKey<{ t: string, u: {} }, "u", string>

  onlyAcceptTrue = any as IsEquivalent<NeverV,{ v: never, k: string }>
  onlyAcceptTrue = any as IsEquivalent<NeverK,{ v: number, k: never }>
  onlyAcceptTrue = any as IsEquivalent<RemoveV,{ k: string }>
  onlyAcceptTrue = any as IsEquivalent<RemoveK,{ v: number }>
  onlyAcceptTrue = any as IsEquivalent<RemoveT,{ u: {} }>
  onlyAcceptTrue = any as IsEquivalent<RemoveU,{ t: string }>
}

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

type ConditionHelper<T extends { true: any, false: any }, S extends { true: any, false: any }> = Merge<T,S>["true" | "false"]
type Condition<T,IfTrue,IfFalse, StringDelay extends string> = IsNotNever<T,IfTrue,IfFalse,StringDelay> 


type T1 = Condition<unknown, {ifTrue: true}, {ifFalse: false}, string>
type T2 = Condition<never, {ifTrue: true}, {ifFalse: false}, string>

type IfVThen<TestType,IfTrue,IfFalse,StringDelay extends string> = Condition<HasV<TestType,never>, IfTrue, IfFalse,StringDelay>

type Test4 = IfVThen<{},true,false,string>
type Test5 = IfVThen<{ v: 0 },true,false,string>
// End: Condition

// Start: Accept only certain numbers condition
type NZero = { s: true }
type NIncrement<Number> = { v: Number }
type NFive = NIncrement<NIncrement<NIncrement<NIncrement<NIncrement<NZero>>>>>

type IsZero<Number extends any, NeverDelay, StringDelay extends string> = Condition<HasS<Number,NeverDelay>, true, false, StringDelay>
type IsOne<Number extends any, NeverDelay, StringDelay extends string> = Condition<HasV<Number,NeverDelay>, IsZero<Number["v"],NeverDelay,StringDelay>, false, StringDelay>
type IsTwo<Number extends any, NeverDelay, StringDelay extends string> = Condition<HasV<Number,NeverDelay>, IsOne<Number["v"],NeverDelay,StringDelay>, false, StringDelay>
type IsThree<Number extends any, NeverDelay, StringDelay extends string> = Condition<HasV<Number,NeverDelay>, IsTwo<Number["v"],NeverDelay,StringDelay>, false, StringDelay>
type IsFour<Number extends any, NeverDelay, StringDelay extends string> = Condition<HasV<Number,NeverDelay>, IsThree<Number["v"],NeverDelay,StringDelay>, false, StringDelay>
type IsFive<Number extends any, NeverDelay, StringDelay extends string> = Condition<HasV<Number,NeverDelay>, IsFour<Number["v"],NeverDelay,StringDelay>, false, StringDelay>

const ttt0: IsZero<NZero, never, string> = true
const ttt1: IsOne<NIncrement<NZero>, never, string> = true
const ttt2: IsTwo<NIncrement<NIncrement<NZero>>,never, string> = true
const ttt3: IsThree<NIncrement<NIncrement<NIncrement<NZero>>>,never, string> = true
// End: Accept only certain numbers condition

// Start: Recursive conditional types structural assignability fail
interface InfiniteNumbersWithZero<Number> {
  next: InfiniteNumbersWithZero<NIncrement<Number>>
  alwaysNever: false
}

interface InfiniteNumbersWithWhat<Number, NeverDelay, StringDelay extends string> {
  next: InfiniteNumbersWithWhat<NIncrement<Number>,NeverDelay, StringDelay>
  alwaysNever: IsFive<Number,NeverDelay,StringDelay>
}

declare let infinite1: InfiniteNumbersWithZero<NZero>
declare let infinite2: InfiniteNumbersWithWhat<NZero, never, string>

// If you replace alwaysNever: IsFive with alwaysNever: IsThree, error will be detected on the next line
infinite1 = infinite2
infinite1.alwaysNever = infinite2.alwaysNever
infinite1.next.next.alwaysNever = infinite2.next.next.alwaysNever
infinite1.next.next.next.next.next.alwaysNever = infinite2.next.next.next.next.next.alwaysNever

// End: Recursive conditional types structural assignability fail

// Start: Lambda calculus equivalent to typeExplosion4.ts

type NUnwrapDouble<WrappedType extends any,NeverDelay,StringDelay extends string> = Condition<
  HasKey<WrappedType,"wrap",NeverDelay>,
    Condition<
      HasKey<WrappedType["wrap"],"wrap",NeverDelay>,
        { wrap: NUnwrapDouble<WrappedType["wrap"]["wrap"], NeverDelay,StringDelay> },
        WrappedType,
      StringDelay
    >,
    WrappedType,
  StringDelay
>

type NUnwrapLast<WrappedType extends any,NeverDelay,StringDelay extends string> = Condition<
  HasKey<WrappedType,"wrap",NeverDelay>,
    WrappedType["wrap"],
    WrappedType,
  StringDelay
>

type NUnwrap<WrappedType, NeverDelay, StringDelay extends string> =
  NUnwrapLast<NUnwrapLast<NUnwrapLast<NUnwrapDouble<WrappedType, NeverDelay, StringDelay>,NeverDelay,StringDelay>,NeverDelay,StringDelay>,NeverDelay,StringDelay>

type NAddUnaryWrapped<UIntA, UIntB extends any,NeverDelay,StringDelay extends string> = 
  Condition<
    HasV<UIntB,NeverDelay>,
      { wrap: NAddUnaryWrapped<NIncrement<UIntA>,UIntB["v"],NeverDelay,StringDelay> },
      UIntA,
    StringDelay
  >
type NAddUnary<UIntA, UIntB,NeverDelay,StringDelay extends string> = NUnwrap<NAddUnaryWrapped<UIntA, UIntB,NeverDelay,StringDelay>,NeverDelay,StringDelay>

module Test5 {
  type Four = NIncrement<NIncrement<NIncrement<NIncrement<NZero>>>>
  type ShouldBeFour1 = NAddUnary<NIncrement<NZero>, NIncrement<NIncrement<NIncrement<NZero>>>, never, string>
  type ShouldBeFour2 = NAddUnary<NIncrement<NIncrement<NZero>>, NIncrement<NIncrement<NZero>>, never, string>

  onlyAcceptTrue = any as IsEquivalent<ShouldBeFour1,Four>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeFour2,Four>
}
}