interface SubType<T> {
  normalProperty: T
  propBreakingUnionCollapse: SubType<T>
}
interface SuperType<T> extends SubType<T> {
  // Commenting either of the the following lines has strange effects on the type of x2
  unrelatedProperty: string
  propBreakingUnionCollapse: any
}

interface A<T> {
  value: T
}
interface B<T> extends A<T> {
  value: T & { oneMoreThing: string }
}


declare const any: any

function wrapWithGeneric<T>() {
  // WHY is the type of x1 reduced but the type of x2 is not?
  let x1 = !true ? (any as A<T>) : (any as B<T>);  // Collapses correctly to A<T>
  let x2 = !true ? (any as SubType<T>) : (any as SuperType<T>)
}

// X1 is the type of x1
let x1 = !true ? (any as A<number>) : (any as B<number>);  // A
type X1 = CollapseUnion<A<number>, B<number>>

// X2 is *NOT* the type of x2
let x2 = !true ? (any as SubType<number>) : (any as SuperType<number>)
type X2 = CollapseUnion<SubType<number>, SuperType<number>>

type CollapseUnion<A,B> =
    A extends B
      ? B
  : B extends A
      ? A
  : A | B


// Test distributive conditional types if they exhibit any of the union collapse

type Distribute<T> = T extends never ? T : T

type K = Distribute<A<number> | B<number>>

