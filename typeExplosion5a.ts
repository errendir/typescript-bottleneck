declare const SubTypeID: "typeof SubTypeID" //unique symbol
type SubTypeID = typeof SubTypeID
declare const SuperTypeID: "typeof SuperTypeID" //unique symbol
type SuperTypeID = typeof SuperTypeID

declare const IrrelevantTypeID: "typeof IrrelevantTypeID" //unique symbol
type IrrelevantTypeID = typeof IrrelevantTypeID

interface Reparametrize<X> {
  [SubTypeID]: SubType<X>
  [SuperTypeID]: SuperType<X>
  [IrrelevantTypeID]: {}
}

enum Z { zero = "zero" }
enum O { one = "one" }
enum INCORRECT { incorrect = "incorrect" }

export class SubType<Number, TypeID extends keyof Reparametrize<any> = SubTypeID> {
  oneMoreThing: Number

  duplicate1: Reparametrize<[Number, Z, Z, Z, Z]>[TypeID];
  duplicate2: Reparametrize<[Number, O, Z, Z, Z]>[TypeID];
  duplicate3: Reparametrize<[Number, Z, O, Z, Z]>[TypeID];
  duplicate4: Reparametrize<[Number, O, O, Z, Z]>[TypeID];
  duplicate5: Reparametrize<[Number, Z, Z, O, Z]>[TypeID];
  duplicate6: Reparametrize<[Number, O, Z, O, Z]>[TypeID];
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
}

export class SuperType<Number, TypeID extends keyof Reparametrize<any> = SuperTypeID> extends SubType<Number, TypeID> {
  // oneMoreThing: string

  // duplicate5: Reparametrize<[Number, Z, Z, O, INCORRECT]>[TypeID];
}

// export class SuperType2<Number, TypeID extends keyof Reparametrize<any> = SuperTypeID> extends SuperType<Number, TypeID> {
//   //oneMoreThing: Number
// }


function a<T>() {  
  // The following brings the performance back to the typeExplosion5.ts level
  const a: SubType<T> = 0 as any as SuperType<T>

  // The following assignment destroys performance even better than the previous
  // const b: SubType<T> = 0 as any as SubType<T, SuperTypeID>
  // const c: SubType<T> = 0 as any as SubType<T, Defuse3TypeID>
  // const d: SubType<T> = 0 as any as SubType<T, IrrelevantTypeID>
}