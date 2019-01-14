// OPTIMIZING THE IMMUTABLE.JS TYPES WITH THE REPARAM TRICK
// The reparametrization trick is borrowed from here:
// https://github.com/Microsoft/TypeScript/issues/25947#issuecomment-407929455

interface Iterable<C> {}

const unrelated = Symbol()
type unrelated = typeof unrelated
interface Collections<K,V> {
  [unrelated]: V[]
}

interface ZipConcatMixin<T,SelfIdentifier extends keyof Collections<any,any>> {
  zip<U>(other: Collection<any, U>): Collections<number, [T,U]>[SelfIdentifier];
  zip<U,V>(other: Collection<any, U>, other2: Collection<any,V>): Collections<number, [T,U,V]>[SelfIdentifier];
  //zip<U,V,M>(other: Collection<any, U>, other2: Collection<any,V>, other3: Collection<any,M>): Collections<[T,U,V,M]>[SelfIdentifier];
  zip(...collections: Array<Collection<any, any>>): Collections<number,any>[SelfIdentifier];

  concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Collections<number,T | C>[SelfIdentifier];
}

interface MapFilterMixin<K,V,SelfIdentifier extends keyof Collections<any,any>> {
  map<M>(
    mapper: (value: V, key: K, iter: this) => M,
    context?: any
  ): Collections<K,M>[SelfIdentifier];
  // flatMap<M>(
  //   mapper: (value: V, key: K, iter: this) => Iterable<M>,
  //   context?: any
  // ): Collections<K,M>[SelfIdentifier];
  filter<F extends V>(
    predicate: (value: V, index: K, iter: this) => value is F,
    context?: any
  ): Collections<K,F>[SelfIdentifier];
  filter(
    predicate: (value: V, index: K, iter: this) => any,
    context?: any
  ): this;
}

export interface List<T> extends CollectionIndexed<T, ListSelf> {
}
const ListSelf = Symbol()
type ListSelf = typeof ListSelf
interface Collections<K,V> {
  [ListSelf]: List<V>
}

export interface SeqIndexed<T> extends CollectionIndexed<T, SeqIndexedSelf> {
  toSeq(): this

  zipAll(...collections: Array<Collection<any, any>>): SeqIndexed<any>;
}
const SeqIndexedSelf = Symbol()
type SeqIndexedSelf = typeof SeqIndexedSelf
interface Collections<K,V> {
  [SeqIndexedSelf]: SeqIndexed<V>
}

export interface CollectionIndexed<T, SelfIdentifier extends keyof Collections<any, any> = CollectionIndexedSelf> extends Collection<number, T, SelfIdentifier>, ZipConcatMixin<T, SelfIdentifier> {
  interpose(separator: T): this;
}
const CollectionIndexedSelf = Symbol()
type CollectionIndexedSelf = typeof CollectionIndexedSelf
interface Collections<K,V> {
  [CollectionIndexedSelf]: CollectionIndexed<V>
}

export interface Collection<K, V, SelfIdentifier extends keyof Collections<any,any> = CollectionSelf> extends MapFilterMixin<K,V,SelfIdentifier> {

  // Conversion to JavaScript types

  toJS(): Array<any> | { [key: string]: any };
  toJSON(): Array<V> | { [key: string]: V };

  // Conversion to Collections

  toMap(): Collection<K, V>;
  toOrderedMap(): Collection<K, V>;
  toSet(): Collection<V,V>;
  toOrderedSet(): Collection<V,V>;
  toList(): List<V>;
  toStack(): Collection<V,V>;

  // Conversion to Seq

  toSeq(): Collection<K, V>;
  toKeyedSeq(): Collection<K, V>;
  toIndexedSeq(): SeqIndexed<V>;

  // Sequence algorithms

  // map<M>(
  //   mapper: (value: V, key: K, iter: this) => M,
  //   context?: any
  // ): Collection<K, M>;
  // filter<F extends V>(
  //   predicate: (value: V, key: K, iter: this) => value is F,
  //   context?: any
  // ): Collection<K, F>;
  // filter(
  //   predicate: (value: V, key: K, iter: this) => any,
  //   context?: any
  // ): this;
  filterNot(
    predicate: (value: V, key: K, iter: this) => boolean,
    context?: any
  ): this;
  sort(comparator?: (valueA: V, valueB: V) => number): this;
  sortBy<C>(
    comparatorValueMapper: (value: V, key: K, iter: this) => C,
    comparator?: (valueA: C, valueB: C) => number
  ): this;
  groupBy<G>(
    grouper: (value: V, key: K, iter: this) => G,
    context?: any
  ): /*Map*/Collection<G, /*this*/Collection<K, V>>;

  // Padding
  takeUntil0(predicate: (iter: this) => boolean): this;
  takeUntil1(predicate: (iter: this) => boolean): this;
  takeUntil2(predicate: (iter: this) => boolean): this;
  takeUntil3(predicate: (iter: this) => boolean): this;
  takeUntil4(predicate: (iter: this) => boolean): this;
  takeUntil5(predicate: (iter: this) => boolean): this;
  takeUntil6(predicate: (iter: this) => boolean): this;
  ttakeUntil0(predicate: (iter: this) => boolean): this;
  ttakeUntil1(predicate: (iter: this) => boolean): this;
  ttakeUntil2(predicate: (iter: this) => boolean): this;
  ttakeUntil3(predicate: (iter: this) => boolean): this;
  ttakeUntil4(predicate: (iter: this) => boolean): this;
  ttakeUntil5(predicate: (iter: this) => boolean): this;
  ttakeUntil6(predicate: (iter: this) => boolean): this;
  tttakeUntil0(predicate: (iter: this) => boolean): this;
  tttakeUntil1(predicate: (iter: this) => boolean): this;
  tttakeUntil2(predicate: (iter: this) => boolean): this;
  tttakeUntil3(predicate: (iter: this) => boolean): this;
  tttakeUntil4(predicate: (iter: this) => boolean): this;
  tttakeUntil5(predicate: (iter: this) => boolean): this;
  tttakeUntil6(predicate: (iter: this) => boolean): this;
  ttttakeUntil0(predicate: (iter: this) => boolean): this;
  ttttakeUntil1(predicate: (iter: this) => boolean): this;
  ttttakeUntil2(predicate: (iter: this) => boolean): this;
  ttttakeUntil3(predicate: (iter: this) => boolean): this;
  ttttakeUntil4(predicate: (iter: this) => boolean): this;
  ttttakeUntil5(predicate: (iter: this) => boolean): this;
  ttttakeUntil6(predicate: (iter: this) => boolean): this;

  tttttakeUntil0(predicate: (iter: this) => boolean): this;
  tttttakeUntil1(predicate: (iter: this) => boolean): this;
  tttttakeUntil2(predicate: (iter: this) => boolean): this;
  tttttakeUntil3(predicate: (iter: this) => boolean): this;
  tttttakeUntil4(predicate: (iter: this) => boolean): this;
  tttttakeUntil5(predicate: (iter: this) => boolean): this;
  tttttakeUntil6(predicate: (iter: this) => boolean): this;
}
const CollectionSelf = Symbol()
type CollectionSelf = typeof CollectionSelf
interface Collections<K,V> {
  [CollectionSelf]: Collection<K,V>
}

function a<T> () {
  const a: SeqIndexed<T> = 0 as any
  const b: CollectionIndexed<T> = a

  const c: CollectionIndexed<T, SeqIndexedSelf> = 0 as any
  c.zip(0 as any as Collection<any, T>)
  const d: CollectionIndexed<T, CollectionIndexedSelf> = c
  d.zip(0 as any as Collection<any, T>)

  return b
}

const b: SeqIndexed<(number | string)> = 0 as any
const c = b.filter((v): v is number => typeof v !== "string")