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

// Problem: partially binding args

// const wrapLogUsual: <M extends any[]>(fn: (type: Type, ...args: M) => Type | undefined) => any = <M>wrapLogCustom<M, Type>(
//   (type: Type, ...args: M) => `${typeToString(type)}${args.length > 0 ? "," + args.join(",") : ""}`,
//   (ret: Type | undefined) => `${ret && typeToString(ret)}`
// );
// const wrapLog = <M extends any[]>(fn: (type: Type, ...args: M) => Type | undefined): (type: Type, ...args: M) => Type | undefined => {
//   return wrapLogUsual(fn);
// };