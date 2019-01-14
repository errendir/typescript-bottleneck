// typeExplosion5b.ts contains the more complete defusal strategy

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

export class SubType<Number, TypeID extends keyof Reparametrize<any> = SubTypeID> {
  oneMoreThing: Number

  duplicate01: Reparametrize<[Number, Z, Z, Z, Z]>[TypeID];
  duplicate02: Reparametrize<[Number, O, Z, Z, Z]>[TypeID];
  duplicate03: Reparametrize<[Number, Z, O, Z, Z]>[TypeID];
  duplicate04: Reparametrize<[Number, O, O, Z, Z]>[TypeID];
  duplicate05: Reparametrize<[Number, Z, Z, O, Z]>[TypeID];
  duplicate06: Reparametrize<[Number, O, Z, O, Z]>[TypeID];
  duplicate07: Reparametrize<[Number, Z, O, O, Z]>[TypeID];
  duplicate08: Reparametrize<[Number, O, O, O, Z]>[TypeID];
  duplicate09: Reparametrize<[Number, Z, Z, Z, O]>[TypeID];
  duplicate10: Reparametrize<[Number, O, Z, Z, O]>[TypeID];
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
  // Either of the two following lines brings the performance back to the typeExplosion5.ts level
  // First of those lines can be defused by adding the myOwnIdentity property on SubType and SuperType
  // Second of those lines can be defused by adding the myMergedIdentity property on SubType and SuperType
  const a: SubType<T> = 0 as any as SuperType<T>
  // let x = !true ? 0 as any as SubType<T> : 0 as any as SuperType<T>

  // The following assignment destroys performance even better than the previous
  // const b: SubType<T> = 0 as any as SubType<T, SuperTypeID>
  // const c: SubType<T> = 0 as any as SubType<T, Defuse3TypeID>
  // const d: SubType<T> = 0 as any as SubType<T, IrrelevantTypeID>
}