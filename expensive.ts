interface Iterable<C> {}

export interface List<T> extends CollectionIndexed<T> {
  concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): List<T | C>;
  map<M>(
    mapper: (value: T, key: number, iter: this) => M,
    context?: any
  ): List<M>;
  // Comment this one out for very slow compile!
  filter<F extends T>(
    predicate: (value: T, index: number, iter: this) => value is F,
    context?: any
  ): List<F>;
  filter(
    predicate: (value: T, index: number, iter: this) => any,
    context?: any
  ): this;
  zip<U>(other: Collection<any, U>): List<[T,U]>;
  zip<U,V>(other: Collection<any, U>, other2: Collection<any,V>): List<[T,U,V]>;
  zip(...collections: Array<Collection<any, any>>): List<any>;
}

export interface SeqIndexed<T> extends CollectionIndexed<T> {
  toSeq(): this

  concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): SeqIndexed<T | C>;
  map<M>(
    mapper: (value: T, key: number, iter: this) => M,
    context?: any
  ): SeqIndexed<M>;
  flatMap<M>(
    mapper: (value: T, key: number, iter: this) => Iterable<M>,
    context?: any
  ): SeqIndexed<M>;
  filter<F extends T>(
    predicate: (value: T, index: number, iter: this) => value is F,
    context?: any
  ): SeqIndexed<F>;
  filter(
    predicate: (value: T, index: number, iter: this) => any,
    context?: any
  ): this;
  zip<U>(other: Collection<any, U>): SeqIndexed<[T,U]>;
  zip<U,V>(other: Collection<any, U>, other2: Collection<any, V>): SeqIndexed<[T,U,V]>;
  zip(...collections: Array<Collection<any, any>>): SeqIndexed<any>;
  zipAll(...collections: Array<Collection<any, any>>): SeqIndexed<any>;
}

export interface CollectionIndexed<T> extends Collection<number, T> {
  interpose(separator: T): this;
  
  zip<U>(other: Collection<any, U>): CollectionIndexed<[T,U]>;
  zip<U,V>(other: Collection<any, U>, other2: Collection<any, V>): CollectionIndexed<[T,U,V]>;
  zip(...collections: Array<Collection<any, any>>): CollectionIndexed<any>;

  // Sequence algorithms
  concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): CollectionIndexed<T | C>;
  map<M>(
    mapper: (value: T, key: number, iter: this) => M,
    context?: any
  ): CollectionIndexed<M>;
}

export interface Collection<K, V> {

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

  map<M>(
    mapper: (value: V, key: K, iter: this) => M,
    context?: any
  ): Collection<K, M>;
  filter<F extends V>(
    predicate: (value: V, key: K, iter: this) => value is F,
    context?: any
  ): Collection<K, F>;
  filter(
    predicate: (value: V, key: K, iter: this) => any,
    context?: any
  ): this;
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
}