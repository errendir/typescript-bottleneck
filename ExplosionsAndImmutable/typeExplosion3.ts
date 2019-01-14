export interface SubType<A, B, D1, D2, D3, D4, D5, RESULT> {
  duplicate1: SubType<A,B,A,A,A,A,A, this>;
  duplicate2: SubType<A,B,A,A,A,A,B, this>;
  duplicate3: SubType<A,B,A,A,A,B,A, this>;
  duplicate4: SubType<A,B,A,A,A,B,B, this>;
  duplicate5: SubType<A,B,A,A,B,A,A, this>;
  duplicate6: SubType<A,B,A,A,B,A,B, this>;
  duplicate7: SubType<A,B,A,A,B,B,A, this>;
  duplicate8: SubType<A,B,A,A,B,B,B, this>;
  duplicate9: SubType<A,B,A,B,A,A,A, this>;
  duplicate10: SubType<A,B,A,B,A,A,B, this>;
  duplicate11: SubType<A,B,A,B,A,B,A, this>;
  duplicate12: SubType<A,B,A,B,A,B,B, this>;
  //duplicate13: SubType<A,B,A,B,B,A,A, this>;
  // Keep adding those, for an exponentially growing compile time
}

export interface SuperType<A, B, D1, D2, D3, D4, D5, RESULT> extends SubType<A, B, D1, D2, D3, D4, D5, RESULT> {
  duplicate1: SuperType<A,B,A,A,A,A,A, this>;
  duplicate2: SuperType<A,B,A,A,A,A,B, this>;
  duplicate3: SuperType<A,B,A,A,A,B,A, this>;
  duplicate4: SuperType<A,B,A,A,A,B,B, this>;
  duplicate5: SuperType<A,B,A,A,B,A,A, this>;
  duplicate6: SuperType<A,B,A,A,B,A,B, this>;
  duplicate7: SuperType<A,B,A,A,B,B,A, this>;
  duplicate8: SuperType<A,B,A,A,B,B,B, this>;
  duplicate9: SuperType<A,B,A,B,A,A,A, this>;
  duplicate10: SuperType<A,B,A,B,A,A,B, this>;
  duplicate11: SuperType<A,B,A,B,A,B,A, this>;
  duplicate12: SuperType<A,B,A,B,A,B,B, this>;
  //duplicate13: SuperType<A,B,A,B,B,A,A, this>;
  // Keep adding those, for an exponentially growing compile time
}