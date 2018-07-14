namespace lambda2 {

// Start: Test helpers
type IsEquivalentH<TypeA,TypeB> = TypeA extends TypeB ? TypeB extends TypeA ? 1 : 0 : 0
type IsEquivalent<TypeA,TypeB> = IsEquivalentH<{ m: TypeA },{ m: TypeB }>
declare let onlyAcceptTrue: 1
declare let any: any
// End: Test helpers

type ArgumentsTuple<Fn> = Fn extends (...args: infer A) => any
  ? A
  : never

type Prepend<T, K extends any[]> = ArgumentsTuple<(t: T, ...rest: K) => void>

type Head<K> = K extends [infer H, ...any[]] ? H : never
  //((...args: K) => void) extends (head: infer H, ...rest: any[]) => any ? H : never
// type ForceArray<K,Never> = K extends any[] ? K : K & Never
type Tail<K extends any[]> = ((...args: K) => void) extends (h: any, ...tail: infer T) => any ? T : never

module Test1 {
  type ShouldBe12345 = Prepend<1,Prepend<2,[3,4,5]>>
  type ShouldBe1 = Head<[1,2,3,4]>
  type ShouldBeNever = Head<[]>
  type ShouldBe2345 = Tail<[1,2,3,4,5]>
  
  onlyAcceptTrue = any as IsEquivalent<ShouldBe12345,[1,2,3,4,5]>
  onlyAcceptTrue = any as IsEquivalent<ShouldBe1,1>
  onlyAcceptTrue = any as IsEquivalent<ShouldBeNever,never>
  onlyAcceptTrue = any as IsEquivalent<ShouldBe2345,[2,3,4,5]>
}

enum UnaryZeroInternal { unaryZeroInternal = "unaryZeroInternal" }
type UnaryZero = [UnaryZeroInternal]
enum PlusOne { plusOne = "plusOne" }
type UnaryIncrement<UnaryNumber extends any[]> = Prepend<PlusOne, UnaryNumber>
type UnaryDecrement<UnaryNumber extends any[]> =
    UnaryNumber extends UnaryZero
      ? UnaryZero
  : Head<UnaryNumber> extends PlusOne
      ? Tail<UnaryNumber>
  : never

module Test2 {
  type UnaryOne1 = UnaryIncrement<UnaryZero>
  type UnaryTwo = UnaryIncrement<UnaryOne1>
  type UnaryOne2 = UnaryDecrement<UnaryTwo>

  onlyAcceptTrue = any as IsEquivalent<UnaryOne1,[PlusOne, UnaryZeroInternal]>
  onlyAcceptTrue = any as IsEquivalent<UnaryTwo,[PlusOne, PlusOne, UnaryZeroInternal]>
  onlyAcceptTrue = any as IsEquivalent<UnaryOne2,[PlusOne, UnaryZeroInternal]>
}

}