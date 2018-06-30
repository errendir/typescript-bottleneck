type Cryptic = { cryptic: "cryptic" }
type IsCryptic<A> = A extends Cryptic ? 1 : 0

interface A {
  mustBeZero: 0
}

module CorrectExample {
  interface B<T> extends A {
    mustBeZero: IsCryptic<T>
  }
  
  const incorrect: A = 0 as any as B<Cryptic>
}

module BrokenExample1 {
  type Confuse<A> = [A] & A
  
  interface B<T> extends A {
    mustBeZero: IsCryptic<Confuse<T>>
  }
  
  // The above extension is allowed yet B<T> is not assignable to A for some T:
  const incorrect: A = 0 as any as B<Cryptic>
}

module BrokenExample2 {
  type SomeOtherType = { value: number }

  interface B<T extends SomeOtherType> extends A {
    mustBeZero: IsCryptic<T>
  }

  // The above extension is allowed yet B<SomeOtherType & T> is not assignable to A for some T:
  const incorrect: A = 0 as any as B<SomeOtherType & Cryptic>
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
                ? IsCryptic<T7> 
                : 0 : 0 : 0 : 0
  }

  // The above extension is allowed and the type RecurseToWhat<Cryptic> appear to be assignable to RecurseToZero<Cryptic>:
  let a: RecurseToZero<Cryptic> = 0 as any
  let b: RecurseToWhat<Cryptic> = 0 as any
  a = b

  // Yet the above should not be allowed beacuse the type RecurseToWhat<Cryptic> is not structuraly assignable to RecurseToZero<Cryptic>:
  a.recurse.recurse.recurse.recurse.mustBeZero = b.recurse.recurse.recurse.recurse.mustBeZero
  
  // This is because on the certain depths of recursion the type of "mustBeZero" is 1
  type Zero = RecurseToZero<Cryptic>["recurse"]["recurse"]["recurse"]["recurse"]["mustBeZero"]
  type What = RecurseToWhat<Cryptic>["recurse"]["recurse"]["recurse"]["recurse"]["mustBeZero"]
  const incorect: Zero = 0 as any as What
}
