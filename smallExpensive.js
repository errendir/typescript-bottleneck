"use strict";
// <reference path="Immutable.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// export interface IRepresentANumber<Held, Zero, One> {
//   addOneAndShift(): IRepresentANumber<[Held, One], Zero, One>;
//   addZeroAndShift(): IRepresentANumber<[Held, Zero], Zero, One>;
// }
// type Start = {}
// const zero: IRepresentANumber<[Start], { zero: boolean }, { one: boolean }> = "hey" as any
// const Thirty = zero.addOneAndShift().addOneAndShift().addOneAndShift().addOneAndShift().addZeroAndShift()
// type Z<K> = { z: K }
// interface A extends Z<A> {
//   get(): Z<A>
// }
// const t: A = 0 as any
// t.get().z
// export interface SuperType<A, B, D1, D2, D3, D4, D5, RESULT> extends SubType<A, B, D1, D2, D3, D4, D5, RESULT> {
//   duplicate1: SuperType<A,B,A,A,A,A,A, this>;
//   duplicate2: SuperType<A,B,A,A,A,A,B, this>;
//   duplicate3: SuperType<A,B,A,A,A,B,A, this>;
//   duplicate4: SuperType<A,B,A,A,A,B,B, this>;
//   duplicate5: SuperType<A,B,A,A,B,A,A, this>;
//   duplicate6: SuperType<A,B,A,A,B,A,B, this>;
//   duplicate7: SuperType<A,B,A,A,B,B,A, this>;
//   duplicate8: SuperType<A,B,A,A,B,B,B, this>;
//   duplicate9: SuperType<A,B,A,B,A,A,A, this>;
//   duplicate10: SuperType<A,B,A,B,A,A,B, this>;
//   //duplicate11: SuperType<A,B,A,B,A,B,A, this>;
//   //duplicate12: SuperType<A,B,A,B,A,B,B, this>;
//   //duplicate13: SuperType<A,B,A,B,B,A,A, this>;
//   // Keep adding those, for an exponentially growing compile time
// }
// export interface SubType<A, B, D1, D2, D3, D4, D5, RESULT> {
//   duplicate1: SubType<A,B,A,A,A,A,A, this>;
//   duplicate2: SubType<A,B,A,A,A,A,B, this>;
//   duplicate3: SubType<A,B,A,A,A,B,A, this>;
//   duplicate4: SubType<A,B,A,A,A,B,B, this>;
//   duplicate5: SubType<A,B,A,A,B,A,A, this>;
//   duplicate6: SubType<A,B,A,A,B,A,B, this>;
//   duplicate7: SubType<A,B,A,A,B,B,A, this>;
//   duplicate8: SubType<A,B,A,A,B,B,B, this>;
//   duplicate9: SubType<A,B,A,B,A,A,A, this>;
//   duplicate10: SubType<A,B,A,B,A,A,B, this>;
//   //duplicate11: SubType<A,B,A,B,A,B,A, this>;
//   //duplicate12: SubType<A,B,A,B,A,B,B, this>;
//   //duplicate13: SubType<A,B,A,B,B,A,A, this>;
//   // Keep adding those, for an exponentially growing compile time
// }
// export interface SuperType<RESULT, A, B, C, D, E, F, G, H, I> extends SubType<RESULT, A, B, C, D, E, F, G, H, I> {
//   duplicateA: SuperType<[A, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateB: SuperType<[B, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateC: SuperType<[C, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateD: SuperType<[D, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateE: SuperType<[E, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateF: SuperType<[F, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateG: SuperType<[G, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateH: SuperType<[H, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateI: SuperType<[I, RESULT], A, B, C, D, E, F, G, H, I>;
//   hey: A
//   // Keep adding those, for an exponentially growing compile time
// }
// export interface SubType<RESULT, A, B, C, D, E, F, G, H, I> {
//   duplicateA: SubType<[A, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateB: SubType<[B, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateC: SubType<[C, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateD: SubType<[D, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateE: SubType<[E, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateF: SubType<[F, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateG: SubType<[G, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateH: SubType<[H, RESULT], A, B, C, D, E, F, G, H, I>;
//   duplicateI: SubType<[I, RESULT], A, B, C, D, E, F, G, H, I>;
//   hey: A
//   // Keep adding those, for an exponentially growing compile time
// }
// export interface MapTypeArgs<A> extends SimpleType<A> {
//   perm: MapTypeArgs<[A, A]>
// }
// // MapTypeArgs<C, A, B> must be assignable to SimpleType<{ k: A }, B & { x: string }, C | number>
// // MapTypeArgs<C, A, B> extends SimpleType<F1(B), F2(C), F3(A)>
// interface SimpleType<X> {
//   prop1: X
//   perm: SimpleType<[X, X]>
// }
var SubType = /** @class */ (function () {
    function SubType() {
    }
    return SubType;
}());
exports.SubType = SubType;
// // Comment out the "extends SubType<T>" for the typechecking time exponential in number of duplicateX functions
var SuperType = /** @class */ (function (_super) {
    __extends(SuperType, _super);
    function SuperType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SuperType;
}(SubType));
exports.SuperType = SuperType;
