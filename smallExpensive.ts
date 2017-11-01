export interface SuperType<T> extends SubType<T> {
  duplicate1(): SuperType<[T,T]>;
  duplicate2(): SuperType<[T,T,T]>;
  duplicate3(): SuperType<[T,T,T,T]>;
  duplicate4(): SuperType<[T,T,T,T,T]>;
  duplicate5(): SuperType<[T,T,T,T,T,T]>;
  duplicate6(): SuperType<[T,T,T,T,T,T,T]>;
  duplicate7(): SuperType<[T,T,T,T,T,T,T,T]>;
  duplicate8(): SuperType<[T,T,T,T,T,T,T,T,T]>;
  //duplicate9(): SuperType<[T,T,T,T,T,T,T,T,T,T]>;
  // Keep adding those, for an exponentially growing compile time
}

export interface SubType<T> {
  duplicate1(): SubType<[T,T]>;
  duplicate2(): SubType<[T,T,T]>;
  duplicate3(): SubType<[T,T,T,T]>;
  duplicate4(): SubType<[T,T,T,T,T]>;
  duplicate5(): SubType<[T,T,T,T,T,T]>;
  duplicate6(): SubType<[T,T,T,T,T,T,T]>;
  duplicate7(): SubType<[T,T,T,T,T,T,T,T]>;
  duplicate8(): SubType<[T,T,T,T,T,T,T,T,T]>;
  //duplicate9(): SubType<[T,T,T,T,T,T,T,T,T,T]>;
  // Keep adding those, for an exponentially growing compile time
}