enum Z { zero = "zero" }
enum O { one = "one" }

export class SubType<Number> {
  duplicate1: SubType<[Number, Z, Z, Z, Z]>;
  duplicate2: SubType<[Number, O, Z, Z, Z]>;
  duplicate3: SubType<[Number, Z, O, Z, Z]>;
  duplicate4: SubType<[Number, O, O, Z, Z]>;
  duplicate5: SubType<[Number, Z, Z, O, Z]>;
  duplicate6: SubType<[Number, O, Z, O, Z]>;
  // duplicate7: SubType<[Number, Z, O, O, Z]>;
  // duplicate8: SubType<[Number, O, O, O, Z]>;
  // duplicate9: SubType<[Number, Z, Z, Z, O]>;

  // duplicate10: SubType<[Number, O, Z, Z, O]>;
  // duplicate11: SubType<[Number, Z, O, Z, O]>;
  // duplicate12: SubType<[Number, O, O, Z, O]>;
  // duplicate13: SubType<[Number, Z, Z, O, O]>;
  // duplicate14: SubType<[Number, O, Z, O, O]>;
  // duplicate15: SubType<[Number, Z, O, O, O]>;
  // duplicate16: SubType<[Number, O, O, O, O]>;
  // Keep adding those, for an exponentially growing compile time
}

export class SuperType<Number> extends SubType<Number> {
  duplicate1: SuperType<[Number, Z, Z, Z, Z]>;
  duplicate2: SuperType<[Number, O, Z, Z, Z]>;
  duplicate3: SuperType<[Number, Z, O, Z, Z]>;
  duplicate4: SuperType<[Number, O, O, Z, Z]>;
  duplicate5: SuperType<[Number, Z, Z, O, Z]>;
  duplicate6: SuperType<[Number, O, Z, O, Z]>;
  // duplicate7: SuperType<[Number, Z, O, O, Z]>;
  // duplicate8: SuperType<[Number, O, O, O, Z]>;
  // duplicate9: SuperType<[Number, Z, Z, O, O]>;

  // duplicate10: SuperType<[Number, O, Z, Z, O]>;
  // duplicate11: SuperType<[Number, Z, O, Z, O]>;
  // duplicate12: SuperType<[Number, O, O, Z, O]>;
  // duplicate13: SuperType<[Number, Z, Z, O, O]>;
  // duplicate14: SuperType<[Number, O, Z, O, O]>;
  // duplicate15: SuperType<[Number, Z, O, O, O]>;
  // duplicate16: SuperType<[Number, O, O, O, O]>;
  // Keep adding those, for an exponentially growing compile time
}

// The following two interface trigger the assignment checking of SuperType<T> to SubType<T>
// The code in index.ts serves the same purpose
// export interface B<T> {
//   l: SubType<T>
// }

// export interface A<T> extends B<T> {
//   l: SuperType<T>
// }