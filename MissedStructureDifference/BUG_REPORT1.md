Filed here: https://github.com/Microsoft/TypeScript/issues/25344

Conditional types can cause TS to miss incorrect interface extensions

**TypeScript Version:** 2.9.2, 3.0.0-dev.20180630

**Search Terms:** conditional types, interfaces, extensions, assignability, substitutability, recursive types

**Introduction:**

I really appreciate the introduction of conditional types in TypeScript. They solve many problems that couldn't be solved before. Just the `ReturnType<T>` alone is priceless.

Unfortunately I think there is a new class of issues introduced by the presence of conditional types. Those issues relate to the verification whether an interface properly `extends` another interface.

When interface `B<T>` is declared as extending interface `A` (`interface B<T> extends A { ... }`) and no error is reported in such interface declaration, I expect that for every type `T`, `A<T>` will be assignable (substitutable) for `B`. I don't know if this property of the type system has a name, but it's listed in the language spec (https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#71-interface-declarations) as:
> The this-type (section 3.6.3) of the declared interface must be assignable (section 3.11.4) to each of the base type references.

It appears that when verifying if `A<T>` is assignable to `B` TypeScript replaces the type of members with conditional type following the pattern `X extends Y ? A : B` with `A | B`. This ensures that only if either type is assignable to the type of the corresponding member of `A`, `B<T>` will be assignable to `A`. However this replacement can be avoided with certain tricks (see the code below). This leads to a situation where the `B<T> extends A` declaration is verified yet for certain types `T` the type `B<T>` is not assignable to `A`.

**Code**

```ts
type Cryptic = { cryptic: "cryptic" }
type IsCryptic<MaybeCryptic> = MaybeCryptic extends Cryptic ? 1 : 0
const any: any = 0

interface A {
  mustBeZero: 0
}

type Confuse<A> = [A] & A

// This should report the "Interface 'B<T>' incorrectly extends interface 'A'." error
interface B<T> extends A {
  mustBeZero: IsCryptic<Confuse<T>>
}

// The above extension is allowed yet B<T> is not assignable to A for some T:
const incorrect: A = any as B<Cryptic>
```

In the above example inlining `IsCryptic<MaybeCryptic>` solves the problem (the expected error is returned by `tsc`).

A different version of the same issue can be encountered when the type parameter `T` is constrained in the extending interface.

```ts
type Cryptic = { cryptic: "cryptic" }
type IsCryptic<MaybeCryptic> = MaybeCryptic extends Cryptic ? 1 : 0
const any: any = 0

interface A {
  mustBeZero: 0
}

type SomeOtherType = { value: number }

interface B<T extends SomeOtherType> extends A {
  mustBeZero: IsCryptic<T>
}

// The above extension is allowed yet B<SomeOtherType & T> is not assignable to A for some T:
const incorrect: A = any as B<SomeOtherType & Cryptic>
```

In the above example inlining `IsCryptic<MaybeCryptic>` does *not* help.

Here is yet another way to force an interface extension to pass. In this example even the concrete types of the incompatible interfaces are allowed to be assigned. Only the attempt to assign the right members of both types result in an eventual error:

```ts
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
```

I believe this particular problem is caused by the way TypeScript compiler avoids infinite assignability checks on recursive types. As far as I could deduce from the code, type checker will avoid verifying the assignability of the same members of the same interfaces more than once. The type arguments of the interfaces will be ignored in order not to loop forever through the ever-growing type argument.

Verifying if `RecurseToWhat<T>` is assignable to `RecurseToZero<T>` required verifying if `RecurseToWhat<[T,T]>` is assignable to `RecurseToZero<[T,T]>` which in turn requires trying with the `[[T,T],[T,T]]` type argument and so on. To avoid endless computations TypeScript allows for at most only one level of recursion per member of the interface. This however is not enough now, because due to the conditional types it is possible to make the assignability of `RecurseToWhat<T>` to `RecurseToZero<T>` fail only for an arbitrarily complex `T`.

This particular issue can also be replicated without the use of extending interfaces:
```ts
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
```

**Expected behavior:**

The declarations `interface B<T> extends A { ... }`, `interface B<T extends SomeOtherType> extends A { ... }` and `interface RecurseToWhat<T> extends RecurseToZero<T> { ... }` should fail with the appropriate error listing the correct path through incompatible members, for example:
```
Interface 'B<T>' incorrectly extends interface 'A'.
  Types of property 'mustBeZero' are incompatible.
    Type 'IsCryptic<Confuse<T>>' is not assignable to type '0'.
      Type '0 | 1' is not assignable to type '0'.
        Type '1' is not assignable to type '0'.
```

The last code example should fail on the `a = b` assignment.

**Actual behavior:**

All of the interface declarations are parsed without the compile-time error. Only the attempts to actually assign a variable of a certain concrete type of the interface `B<T>` to `A` will fail.

In the example 4, the problem goes even further. The two created types (`RecurseToZero` and `RecurseToWhat`) seemingly appear to be assignable (`RecurseToWhat` to `RecurseToZero`). Only the attempt to assign certain nested members of the corresponding types reveals the error.

**Playground Link:** [link](https://www.typescriptlang.org/play/#src=type%20Cryptic%20%3D%20%7B%20cryptic%3A%20%22cryptic%22%20%7D%0D%0Atype%20IsCryptic%3CMaybeCryptic%3E%20%3D%20MaybeCryptic%20extends%20Cryptic%20%3F%201%20%3A%200%0D%0Aconst%20any%3A%20any%20%3D%200%0D%0A%0D%0Ainterface%20A%20%7B%0D%0A%20%20mustBeZero%3A%200%0D%0A%7D%0D%0A%0D%0Amodule%20CorrectExample%20%7B%0D%0A%20%20%2F%2F%20This%20interface%20declaration%20will%20correctly%20cause%20a%20compile-time%20error%0D%0A%20%20interface%20B%3CT%3E%20extends%20A%20%7B%0D%0A%20%20%20%20mustBeZero%3A%20IsCryptic%3CT%3E%0D%0A%20%20%7D%0D%0A%20%20%0D%0A%20%20const%20incorrect%3A%20A%20%3D%20any%20as%20B%3CCryptic%3E%0D%0A%7D%0D%0A%0D%0Amodule%20BrokenExample1%20%7B%0D%0A%20%20type%20Confuse%3CA%3E%20%3D%20%5BA%5D%20%26%20A%0D%0A%0D%0A%20%20%2F%2F%20This%20should%20report%20the%20%22Interface%20'B%3CT%3E'%20incorrectly%20extends%20interface%20'A'.%22%20error%0D%0A%20%20interface%20B%3CT%3E%20extends%20A%20%7B%0D%0A%20%20%20%20mustBeZero%3A%20IsCryptic%3CConfuse%3CT%3E%3E%0D%0A%20%20%7D%0D%0A%20%20%0D%0A%20%20%2F%2F%20The%20above%20extension%20is%20allowed%20yet%20B%3CT%3E%20is%20not%20assignable%20to%20A%20for%20some%20T%3A%0D%0A%20%20const%20incorrect%3A%20A%20%3D%20any%20as%20B%3CCryptic%3E%0D%0A%7D%0D%0A%0D%0Amodule%20BrokenExample2%20%7B%0D%0A%20%20type%20SomeOtherType%20%3D%20%7B%20value%3A%20number%20%7D%0D%0A%0D%0A%20%20interface%20B%3CT%20extends%20SomeOtherType%3E%20extends%20A%20%7B%0D%0A%20%20%20%20mustBeZero%3A%20IsCryptic%3CT%3E%0D%0A%20%20%7D%0D%0A%0D%0A%20%20%2F%2F%20The%20above%20extension%20is%20allowed%20yet%20B%3CSomeOtherType%20%26%20T%3E%20is%20not%20assignable%20to%20A%20for%20some%20T%3A%0D%0A%20%20const%20incorrect%3A%20A%20%3D%20any%20as%20B%3CSomeOtherType%20%26%20Cryptic%3E%0D%0A%7D%0D%0A%0D%0Amodule%20BrokenExample3%20%7B%0D%0A%20%20interface%20RecurseToZero%3CT%3E%20%7B%0D%0A%20%20%20%20recurse%3A%20RecurseToZero%3C%5BT%2CT%5D%3E%0D%0A%20%20%20%20mustBeZero%3A%200%0D%0A%20%20%7D%0D%0A%0D%0A%20%20interface%20RecurseToWhat%3CT%3E%20extends%20RecurseToZero%3CT%3E%20%7B%0D%0A%20%20%20%20recurse%3A%20RecurseToWhat%3C%5BT%2CT%5D%3E%0D%0A%20%20%20%20%2F%2F%20The%20type%20of%20%22mustBeZero%22%20member%20will%20be%20different%20from%200%20only%20on%20a%20certain%20recursion%20depth%0D%0A%20%20%20%20mustBeZero%3A%20T%20extends%20%5Binfer%20T1%2C%20infer%20T2%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T1%20extends%20%5Binfer%20T3%2C%20infer%20T4%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T3%20extends%20%5Binfer%20T5%2C%20infer%20T6%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T5%20extends%20%5Binfer%20T7%2C%20infer%20T8%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T7%20extends%20%5Binfer%20T9%2C%20infer%20T10%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%201%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%200%20%3A%200%20%3A%200%20%3A%200%20%3A%200%0D%0A%20%20%7D%0D%0A%0D%0A%20%20%2F%2F%20The%20above%20extension%20is%20allowed%20and%20the%20type%20RecurseToWhat%3Cnull%3E%20appears%20to%20be%20assignable%20to%20RecurseToZero%3Cnull%3E%3A%0D%0A%20%20declare%20let%20a%3A%20RecurseToZero%3Cnull%3E%0D%0A%20%20declare%20let%20b%3A%20RecurseToWhat%3Cnull%3E%0D%0A%20%20a%20%3D%20b%0D%0A%0D%0A%20%20%2F%2F%20Yet%20the%20above%20should%20not%20be%20allowed%20because%20the%20type%20RecurseToWhat%3Cnull%3E%20is%20not%20structurally%20assignable%20to%20RecurseToZero%3Cnull%3E%3A%0D%0A%20%20a.recurse.recurse.recurse.recurse.mustBeZero%20%3D%20b.recurse.recurse.recurse.recurse.mustBeZero%0D%0A%20%20%0D%0A%20%20%2F%2F%20This%20is%20because%20on%20the%20certain%20depths%20of%20recursion%20of%20the%20RecurseToWhat%3CT%3E%20the%20type%20of%20%22mustBeZero%22%20is%201%3A%0D%0A%20%20type%20Zero%20%3D%20RecurseToZero%3Cnull%3E%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22mustBeZero%22%5D%0D%0A%20%20type%20What%20%3D%20RecurseToWhat%3Cnull%3E%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22mustBeZero%22%5D%0D%0A%20%20const%20incorect%3A%20Zero%20%3D%20any%20as%20What%0D%0A%7D%0D%0A%0D%0Amodule%20BrokenExample4%20%7B%0D%0A%20%20interface%20RecurseToZeroP%3CT%3E%20%7B%0D%0A%20%20%20%20recurse%3A%20RecurseToZeroP%3C%5BT%2CT%5D%3E%0D%0A%20%20%20%20mustBeZero%3A%200%0D%0A%20%20%7D%0D%0A%0D%0A%20%20type%20RecurseToZero%20%3D%20RecurseToZeroP%3Cnull%3E%0D%0A%0D%0A%20%20interface%20RecurseToWhatP%3CT%3E%20%7B%0D%0A%20%20%20%20recurse%3A%20RecurseToWhatP%3C%5BT%2CT%5D%3E%0D%0A%20%20%20%20%2F%2F%20The%20type%20of%20%22mustBeZero%22%20member%20will%20be%20different%20from%200%20only%20on%20a%20certain%20recursion%20depth%0D%0A%20%20%20%20mustBeZero%3A%20T%20extends%20%5Binfer%20T1%2C%20infer%20T2%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T1%20extends%20%5Binfer%20T3%2C%20infer%20T4%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T3%20extends%20%5Binfer%20T5%2C%20infer%20T6%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T5%20extends%20%5Binfer%20T7%2C%20infer%20T8%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20T7%20extends%20%5Binfer%20T9%2C%20infer%20T10%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%201%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%200%20%3A%200%20%3A%200%20%3A%200%20%3A%200%0D%0A%20%20%7D%0D%0A%0D%0A%20%20type%20RecurseToWhat%20%3D%20RecurseToWhatP%3Cnull%3E%0D%0A%0D%0A%20%20%2F%2F%20The%20type%20RecurseToWhat%20appears%20to%20be%20assignable%20to%20RecurseToZero%3A%0D%0A%20%20declare%20let%20a%3A%20RecurseToZero%0D%0A%20%20declare%20let%20b%3A%20RecurseToWhat%0D%0A%20%20a%20%3D%20b%0D%0A%0D%0A%20%20%2F%2F%20Yet%20the%20above%20should%20not%20be%20allowed%20because%20the%20type%20RecurseToWhat%20is%20not%20structurally%20assignable%20to%20RecurseToZero%3A%0D%0A%20%20a.recurse.recurse.recurse.recurse.mustBeZero%20%3D%20b.recurse.recurse.recurse.recurse.mustBeZero%0D%0A%20%20%0D%0A%20%20%2F%2F%20This%20is%20because%20on%20the%20certain%20depths%20of%20recursion%20the%20type%20of%20%22mustBeZero%22%20is%201%0D%0A%20%20type%20Zero%20%3D%20RecurseToZero%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22mustBeZero%22%5D%0D%0A%20%20type%20What%20%3D%20RecurseToWhat%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22recurse%22%5D%5B%22mustBeZero%22%5D%0D%0A%20%20const%20incorect%3A%20Zero%20%3D%20any%20as%20What%0D%0A%7D%0D%0A%0D%0Amodule%20BrokenExample5%20%7B%0D%0A%20%20enum%20True%20%7B%20true%20%3D%20%22true%22%20%7D%0D%0A%20%20enum%20False%20%7B%20false%20%3D%20%22false%22%20%7D%0D%0A%0D%0A%20%20type%20And%3CBool1%2CBool2%3E%20%3D%20Bool1%20extends%20True%20%3F%20Bool2%20extends%20True%20%3F%20True%20%3A%20False%20%3A%20False%0D%0A%20%20type%20Or%3CBool1%2C%20Bool2%3E%20%3D%20Bool1%20extends%20True%20%3F%20True%20%3A%20Bool2%20extends%20True%20%3F%20True%20%3A%20False%0D%0A%20%20type%20Not%3CBool%3E%20%3D%20Bool%20extends%20False%20%3F%20True%20%3A%20Bool%20extends%20True%20%3F%20False%20%3A%20never%0D%0A%0D%0A%20%20interface%20RecurseToFalseP%3CT%3E%20%7B%0D%0A%20%20%20%20recurseWithTrue%3A%20RecurseToFalseP%3C%5BT%2CTrue%5D%3E%0D%0A%20%20%20%20recurseWithFalse%3A%20RecurseToFalseP%3C%5BT%2CFalse%5D%3E%0D%0A%20%20%20%20mustBeFalse%3A%20False%0D%0A%20%20%7D%0D%0A%0D%0A%20%20type%20RecurseToFalse%20%3D%20RecurseToFalseP%3Cnull%3E%0D%0A%0D%0A%20%20interface%20RecurseToPropsitionP%3CT%3E%20%7B%0D%0A%20%20%20%20recurseWithTrue%3A%20RecurseToPropsitionP%3C%5BT%2CTrue%5D%3E%0D%0A%20%20%20%20recurseWithFalse%3A%20RecurseToPropsitionP%3C%5BT%2CFalse%5D%3E%0D%0A%20%20%20%20%2F%2F%20The%20type%20of%20%22mustBeFalse%22%20member%20will%20be%20different%20from%20False%20only%20when%20T%20represents%20the%20assignment%20satisfying%20propositional%20logic%20statement%20hardcoded%20below%0D%0A%20%20%20%20mustBeFalse%3A%20T%20extends%20%5Binfer%20R6%2C%20infer%20T7%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20R6%20extends%20%5Binfer%20R5%2C%20infer%20T6%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20R5%20extends%20%5Binfer%20R4%2C%20infer%20T5%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20R4%20extends%20%5Binfer%20R3%2C%20infer%20T4%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20R3%20extends%20%5Binfer%20R2%2C%20infer%20T3%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20R2%20extends%20%5Binfer%20R1%2C%20infer%20T2%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20R1%20extends%20%5Bnull%2C%20infer%20T1%5D%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20And%3CAnd%3CAnd%3COr%3CAnd%3CT1%2CT2%3E%2CNot%3COr%3CT3%2CT4%3E%3E%3E%2CT5%3E%2CT6%3E%2CT7%3E%20%2F%2F%20propsitional%20logic%20with%20T1%2C%20...%2C%20TK%20variables%20goes%20here%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20False%20%3A%20False%20%3A%20False%20%3A%20False%20%3A%20False%20%3A%20False%20%3A%20False%0D%0A%20%20%7D%0D%0A%0D%0A%20%20type%20RecurseToPropsition%20%3D%20RecurseToPropsitionP%3Cnull%3E%0D%0A%0D%0A%20%20%2F%2F%20The%20type%20RecurseToPropsition%20appears%20to%20be%20assignable%20to%20RecurseToZero%3A%0D%0A%20%20declare%20let%20a%3A%20RecurseToFalse%0D%0A%20%20declare%20let%20b%3A%20RecurseToPropsition%0D%0A%20%20a%20%3D%20b%0D%0A%0D%0A%20%20%2F%2F%20In%20order%20for%20the%20TypeScript%20to%20find%20the%20member%20breaking%20the%20structural%20assignability%20it%20needs%20to%20solve%20the%20satisfiability%20problem%20for%20the%20propsition%20hardcoded%20in%20RecurseToPropsitionP%3CT%3E%3A%0D%0A%20%20a%0D%0A%20%20%20%20.recurseWithTrue.recurseWithTrue%0D%0A%20%20%20%20.recurseWithFalse.recurseWithFalse%0D%0A%20%20%20%20.recurseWithTrue.recurseWithTrue.recurseWithTrue%0D%0A%20%20%20%20.mustBeFalse%20%0D%0A%20%20%20%20%3D%0D%0A%20%20b%0D%0A%20%20%20%20.recurseWithTrue.recurseWithTrue%0D%0A%20%20%20%20.recurseWithFalse.recurseWithFalse%0D%0A%20%20%20%20.recurseWithTrue.recurseWithTrue.recurseWithTrue%0D%0A%20%20%20%20.mustBeFalse%0D%0A%7D)

**Related Issues:** None to my knowledge. Please link to some if you find them.

**Fully structural assignability**

Things get more interesting if we change the example 4 to allow two separate paths on each recursion level. In such a situation it seems that the work TypeScript would need to perform in order to find whether the types are actually structurally equivalent could be equivalent to solving a propositional logic satisfiability problem:

```ts
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

// In order for the TypeScript to find the member path breaking the structural assignability it needs to solve the satisfiability problem for the propsition hardcoded in RecurseToPropsitionP<T>:
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
```

This is a famously NP-complete problem. So if `P != NP` there is no polynomial way to decide whether two types are structurally equivalent.