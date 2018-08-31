declare const SubTypeID: "typeof SubTypeID" //unique symbol
type SubTypeID = typeof SubTypeID
declare const SuperTypeID: "typeof SuperTypeID" //unique symbol
type SuperTypeID = typeof SuperTypeID

declare const Defuse1TypeID: "typeof Defuse1TypeID" //unique symbol
type Defuse1TypeID = typeof Defuse1TypeID
declare const Defuse2TypeID: "typeof Defuse2TypeID" //unique symbol
type Defuse2TypeID = typeof Defuse2TypeID
declare const Defuse3TypeID: "typeof Defuse3TypeID" //unique symbol
type Defuse3TypeID = typeof Defuse3TypeID
declare const Defuse4TypeID: "typeof Defuse4TypeID" //unique symbol
type Defuse4TypeID = typeof Defuse4TypeID

declare const IrrelevantTypeID: "typeof IrrelevantTypeID" //unique symbol
type IrrelevantTypeID = typeof IrrelevantTypeID

interface Reparametrize<X> {
  [SubTypeID]: SubType<X>
  [SuperTypeID]: SuperType<X>
  [Defuse1TypeID]: any
  [Defuse2TypeID]: any
  [Defuse3TypeID]: any
  [Defuse4TypeID]: any
  [IrrelevantTypeID]: {}
}

enum Z { zero = "zero" }
enum O { one = "one" }
enum INCORRECT { incorrect = "incorrect" }

export class SubType<Number, TypeID extends keyof Reparametrize<any> = SubTypeID> {
  oneMoreThing: Number

  duplicate1: TypeID extends (Defuse1TypeID | Defuse2TypeID | Defuse3TypeID | Defuse4TypeID) ? any : Reparametrize<[Number, Z, Z, Z, Z]>[TypeID];
  duplicate2: TypeID extends (Defuse1TypeID | Defuse2TypeID | Defuse3TypeID | Defuse4TypeID) ? any : Reparametrize<[Number, O, Z, Z, Z]>[TypeID];
  duplicate3: TypeID extends (Defuse1TypeID | Defuse2TypeID | Defuse3TypeID | Defuse4TypeID) ? any : Reparametrize<[Number, Z, O, Z, Z]>[TypeID];
  duplicate4: TypeID extends (Defuse1TypeID | Defuse2TypeID | Defuse3TypeID | Defuse4TypeID) ? any : Reparametrize<[Number, O, O, Z, Z]>[TypeID];
  duplicate5: TypeID extends (Defuse1TypeID | Defuse2TypeID | Defuse3TypeID | Defuse4TypeID) ? any : Reparametrize<[Number, Z, Z, O, Z]>[TypeID];
  duplicate6: TypeID extends (Defuse1TypeID | Defuse2TypeID | Defuse3TypeID | Defuse4TypeID) ? any : Reparametrize<[Number, O, Z, O, Z]>[TypeID];
  // duplicate7: Reparametrize<[Number, Z, O, O, Z]>[TypeID];
  // duplicate8: Reparametrize<[Number, O, O, O, Z]>[TypeID];
  // duplicate9: Reparametrize<[Number, Z, Z, Z, O]>[TypeID];

  // duplicate10: Reparametrize<[Number, O, Z, Z, O]>[TypeID];
  // duplicate11: Reparametrize<[Number, Z, O, Z, O]>[TypeID];
  // duplicate12: Reparametrize<[Number, O, O, Z, O]>[TypeID];
  // duplicate13: Reparametrize<[Number, Z, Z, O, O]>[TypeID];
  // duplicate14: Reparametrize<[Number, O, Z, O, O]>[TypeID];
  // duplicate15: Reparametrize<[Number, Z, O, O, O]>[TypeID];
  // duplicate16: Reparametrize<[Number, O, O, O, O]>[TypeID];
  // Keep adding those, for an exponentially growing compile time

  _theRealCheckInCaseOfDefuse:
      TypeID extends Defuse4TypeID
        ? SubType<Number, Defuse3TypeID>
    : TypeID extends Defuse3TypeID
      ? SubType<Number, Defuse2TypeID>
    : TypeID extends Defuse2TypeID
      ? SubType<Number, Defuse1TypeID>
    : TypeID extends Defuse1TypeID
        ? SubType<Number, SuperTypeID>
        : SubType<Number, TypeID>

}

export class SuperType<Number, TypeID extends keyof Reparametrize<any> = SuperTypeID> extends SubType<Number, TypeID> {
  // oneMoreThing: string

  // duplicate5: TypeID extends Defuse1TypeID ? any : TypeID extends Defuse2TypeID ? any : Reparametrize<[Number, Z, Z, O, INCORRECT]>[TypeID];

  _theRealCheckInCaseOfDefuse:
      TypeID extends Defuse4TypeID
        ? SuperType<Number, Defuse3TypeID>
    : TypeID extends Defuse3TypeID
      ? SuperType<Number, Defuse2TypeID>
    : TypeID extends Defuse2TypeID
      ? SuperType<Number, Defuse1TypeID>
    : TypeID extends Defuse1TypeID
        ? SuperType<Number>
        : any
}

// export class SuperType2<Number, TypeID extends keyof Reparametrize<any> = SuperTypeID> extends SuperType<Number, TypeID> {
//   //oneMoreThing: Number
// }

interface Test { "eleven": number, "twelve": string }

interface A<T,K extends keyof Test> { 
  value: T
  key: K 
}
interface B<T,K extends keyof Test = "twelve"> extends A<T,K> {
  value: T & { oneMoreThing: string }
}


function a<T>() {
  const any: any = 0
  // WHY is the type of x2 reduced but the type of x1 is not? 
  let x1 = !true ? (any as SubType<T, SuperTypeID>) : (any as SuperType<T>)
  let x2 = !true ? (any as A<T,"twelve">) : (any as B<T>);  // A
  
  type T1 = SuperType<T, SuperTypeID> | SubType<T, SuperTypeID>
  type T2 = A<T,"twelve"> | B<T>
  
  // The following brings the performance back to the typeExplosion5.ts level
  // const a: SubType<T> = 0 as any as SuperType<T>

  // The following assignment destroys performance even better than the previous
  const a: SubType<T> = 0 as any as SuperType<T>
  // const b: SubType<T> = 0 as any as SubType<T, SuperTypeID>
  // const c: SubType<T> = 0 as any as SubType<T, Defuse3TypeID>
  // const d: SubType<T> = 0 as any as SubType<T, IrrelevantTypeID>
}