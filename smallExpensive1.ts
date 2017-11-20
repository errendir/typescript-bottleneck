export class SubType<T> {
  duplicate1: SubType<[T,T]>;
  duplicate2: SubType<[T,T,T]>;
  duplicate3: SubType<[T,T,T,T]>;
  duplicate4: SubType<[T,T,T,T,T]>;
  duplicate5: SubType<[T,T,T,T,T,T]>;
  duplicate6: SubType<[T,T,T,T,T,T,T]>;
  duplicate7: SubType<[T,T,T,T,T,T,T,T]>;
  duplicate8: SubType<[T,T,T,T,T,T,T,T,T]>;
  duplicate9: SubType<[T,T,T,T,T,T,T,T,T,T]>;

  // duplicate10: SubType<[T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate11: SubType<[T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate12: SubType<[T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate13: SubType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate14: SubType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate15: SubType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate16: SubType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate17: SubType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // Keep adding those, for an exponentially growing compile time
}

// // Comment out the "extends SubType<T>" for the typechecking time exponential in number of duplicateX functions
export class SuperType<T> extends SubType<T> {
  duplicate1: SuperType<[T,T]>;
  duplicate2: SuperType<[T,T,T]>;
  duplicate3: SuperType<[T,T,T,T]>;
  duplicate4: SuperType<[T,T,T,T,T]>;
  duplicate5: SuperType<[T,T,T,T,T,T]>;
  duplicate6: SuperType<[T,T,T,T,T,T,T]>;
  duplicate7: SuperType<[T,T,T,T,T,T,T,T]>;
  duplicate8: SuperType<[T,T,T,T,T,T,T,T,T]>;
  duplicate9: SuperType<[T,T,T,T,T,T,T,T,T,T]>;
  //duplicate9: boolean;

  // duplicate10: SuperType<[T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate11: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate12: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate13: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate14: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate15: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate16: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // duplicate17: SuperType<[T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]>;
  // Keep adding those, for an exponentially growing compile time
}

// The following two interface trigger the assignment checking of SuperType<T> to SubType<T>
// The code in index.ts serves the same purpose
export interface B<T> {
  l: SubType<T>
}

export interface A<T> extends B<T> {
  l: SuperType<T>
}