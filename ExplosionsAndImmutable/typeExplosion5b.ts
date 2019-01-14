// THIS IS THE PROMISING DEFUSAL STRATEGY
// 1. Use the reparametrization trick (https://github.com/Microsoft/TypeScript/issues/25947#issuecomment-407929455)
// 2. Force the supertype to subtype assignability check within the extension verification ([myOwnIdentity] property)
// 3. Force the union consolidation attempts within the extension verification ([myMergedIdentity] property)

enum Z { zero = "zero" }
enum O { one = "one" }

interface SubTypeDelegate { readonly subType: unique symbol }
interface SuperTypeDelegate extends SubTypeDelegate { readonly superType: unique symbol }

type Reparametrize<Marker,X> = Marker extends SuperTypeDelegate
  ? SuperType<X>
  : SubType<X>

declare const marker: unique symbol
type marker = typeof marker

declare const myOwnIdentity: unique symbol
type myOwnIdentity = typeof myOwnIdentity

declare const myMergedIdentity: unique symbol
type myMergedIdentity = typeof myMergedIdentity

class SubType<Number> {
  oneMoreThing: Number
  [marker]: SubTypeDelegate

  duplicate01: Reparametrize<this[marker],[Number, Z, Z, Z, Z]>;
  duplicate02: Reparametrize<this[marker],[Number, O, Z, Z, Z]>;
  duplicate03: Reparametrize<this[marker],[Number, Z, O, Z, Z]>;
  duplicate04: Reparametrize<this[marker],[Number, O, O, Z, Z]>;
  duplicate05: Reparametrize<this[marker],[Number, Z, Z, O, Z]>;
  duplicate06: Reparametrize<this[marker],[Number, O, Z, O, Z]>;
  duplicate07: Reparametrize<this[marker],[Number, Z, O, O, Z]>;
  duplicate08: Reparametrize<this[marker],[Number, O, O, O, Z]>;
  duplicate09: Reparametrize<this[marker],[Number, Z, Z, Z, O]>;
  duplicate10: Reparametrize<this[marker],[Number, O, Z, Z, O]>;
  // duplicate11: Reparametrize<this[marker],[Number, Z, O, Z, O]>;
  // duplicate12: Reparametrize<this[marker],[Number, O, O, Z, O]>;
  // duplicate13: Reparametrize<this[marker],[Number, Z, Z, O, O]>;
  // duplicate14: Reparametrize<this[marker],[Number, O, Z, O, O]>;
  // duplicate15: Reparametrize<this[marker],[Number, Z, O, O, O]>;
  // duplicate16: Reparametrize<this[marker],[Number, O, O, O, O]>;
  // Keep adding those, for an exponentially growing compile time

  // This property defuses the first trigger in a<T>
  [myOwnIdentity]: SubType<Number>
  // This property defuses the second trigger in a<T>
  [myMergedIdentity]: SubType<Number>
}

class SuperType<Number> extends SubType<Number> {
  // oneMoreThing: string
  [marker]: SuperTypeDelegate

  // duplicate01: Reparametrize<this[marker],[Number, Z, Z, Z, Z]>;
  // duplicate02: Reparametrize<this[marker],[Number, O, Z, Z, Z]>;
  // duplicate03: Reparametrize<this[marker],[Number, Z, O, Z, Z]>;
  // duplicate04: Reparametrize<this[marker],[Number, O, O, Z, Z]>;
  // duplicate05: Reparametrize<this[marker],[Number, Z, Z, O, Z]>;
  // duplicate06: Reparametrize<this[marker],[Number, O, Z, O, Z]>;
  // duplicate07: Reparametrize<this[marker],[Number, Z, O, O, Z]>;
  // duplicate08: Reparametrize<this[marker],[Number, O, O, O, Z]>;
  // duplicate09: Reparametrize<this[marker],[Number, Z, Z, Z, O]>;
  // duplicate10: Reparametrize<this[marker],[Number, O, Z, Z, O]>;
  // duplicate11: Reparametrize<this[marker],[Number, Z, O, Z, O]>;
  // duplicate12: Reparametrize<this[marker],[Number, O, O, Z, O]>;
  // duplicate13: Reparametrize<this[marker],[Number, Z, Z, O, O]>;
  // duplicate14: Reparametrize<this[marker],[Number, O, Z, O, O]>;
  // duplicate15: Reparametrize<this[marker],[Number, Z, O, O, O]>;
  // duplicate16: Reparametrize<this[marker],[Number, O, O, O, O]>;
  // Keep adding those, for an exponentially growing compile time

  // This property defuses the first trigger in a<T>
  [myOwnIdentity]: SuperType<Number>
  // This property defuses the second trigger in a<T>
  [myMergedIdentity] = !true ? 0 as any as SubType<Number> : 0 as any as SuperType<Number>
}

function a<T>() {
  // Either of the two following lines brings the performance back to the typeExplosion5.ts level
  // First of those lines can be defused by adding the myOwnIdentity property on SubType and SuperType
  // Second of those lines can be defused by adding the myMergedIdentity property on SubType and SuperType
  const a: SubType<T> = 0 as any as SuperType<T>
  let x = !true ? 0 as any as SubType<T> : 0 as any as SuperType<T>

  // The following assignment destroys performance even better than the previous
  // const b: SubType<T> = 0 as any as SubType<T, SuperTypeID>
  // const c: SubType<T> = 0 as any as SubType<T, Defuse3TypeID>
  // const d: SubType<T> = 0 as any as SubType<T, IrrelevantTypeID>
}

export const thisIsHereToForceModules = 11