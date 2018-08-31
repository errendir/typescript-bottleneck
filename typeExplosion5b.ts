declare const SubTypeID: "typeof SubTypeID" //unique symbol
type SubTypeID = typeof SubTypeID
declare const SuperTypeID: "typeof SuperTypeID" //unique symbol
type SuperTypeID = typeof SuperTypeID

declare const IrrelevantTypeID: "typeof IrrelevantTypeID" //unique symbol
type IrrelevantTypeID = typeof IrrelevantTypeID

type Reparametrize<Marker,X> = Marker extends Q
  ? SuperType<X>
  : SubType<X>

enum Z { zero = "zero" }
enum O { one = "one" }
enum INCORRECT { incorrect = "incorrect" }

interface P { p: "p" }
interface Q extends P { q: "q" }

declare const marker: unique symbol
type marker = typeof marker

export class SubType<Number> {
  oneMoreThing: Number
  [marker]: P

  duplicate1: Reparametrize<this[marker],[Number, Z, Z, Z, Z]>;
  duplicate2: Reparametrize<this[marker],[Number, O, Z, Z, Z]>;
  duplicate3: Reparametrize<this[marker],[Number, Z, O, Z, Z]>;
  duplicate4: Reparametrize<this[marker],[Number, O, O, Z, Z]>;
  duplicate5: Reparametrize<this[marker],[Number, Z, Z, O, Z]>;
  duplicate6: Reparametrize<this[marker],[Number, O, Z, O, Z]>;
  // duplicate7: Reparametrize<this[marker],[Number, Z, O, O, Z]>;
  // duplicate8: Reparametrize<this[marker],[Number, O, O, O, Z]>;
  // duplicate9: Reparametrize<this[marker],[Number, Z, Z, Z, O]>;

  // duplicate10: Reparametrize<this[marker],[Number, O, Z, Z, O]>;
  // duplicate11: Reparametrize<this[marker],[Number, Z, O, Z, O]>;
  // duplicate12: Reparametrize<this[marker],[Number, O, O, Z, O]>;
  // duplicate13: Reparametrize<this[marker],[Number, Z, Z, O, O]>;
  // duplicate14: Reparametrize<this[marker],[Number, O, Z, O, O]>;
  // duplicate15: Reparametrize<this[marker],[Number, Z, O, O, O]>;
  // duplicate16: Reparametrize<this[marker],[Number, O, O, O, O]>;
  // Keep adding those, for an exponentially growing compile time
}

export class SuperType<Number> extends SubType<Number> {
  oneMoreThing: Number
  [marker]: Q

  // duplicate5: TypeID extends Defuse1TypeID ? any : TypeID extends Defuse2TypeID ? any : Reparametrize<[Number, Z, Z, O, INCORRECT]>[TypeID];
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