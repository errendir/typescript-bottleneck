export interface SuperType<RESULT, A, B, C, D, E, F, G, H, I> extends SubType<RESULT, A, B, C, D, E, F, G, H, I> {
  duplicateA: SuperType<[A, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateB: SuperType<[B, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateC: SuperType<[C, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateD: SuperType<[D, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateE: SuperType<[E, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateF: SuperType<[F, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateG: SuperType<[G, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateH: SuperType<[H, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateI: SuperType<[I, RESULT], A, B, C, D, E, F, G, H, I>;
  hey: A
  // Keep adding those, for an exponentially growing compile time
}

export interface SubType<RESULT, A, B, C, D, E, F, G, H, I> {
  duplicateA: SubType<[A, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateB: SubType<[B, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateC: SubType<[C, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateD: SubType<[D, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateE: SubType<[E, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateF: SubType<[F, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateG: SubType<[G, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateH: SubType<[H, RESULT], A, B, C, D, E, F, G, H, I>;
  duplicateI: SubType<[I, RESULT], A, B, C, D, E, F, G, H, I>;
  hey: A
  // Keep adding those, for an exponentially growing compile time
}