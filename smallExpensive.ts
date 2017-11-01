export interface List<T> extends CollectionIndexed<T> {
  concat<C>(...valuesOrCollections: Array<Array<C> | C>): List<T | C>;

  zip<U>(other: Collection<any, U>): List<[T,U]>;
  zip<U,V>(other: Collection<any, U>, other2: Collection<any,V>): List<[T,U,V]>;
  zip(...collections: Array<Collection<any, any>>): List<any>;
}

export interface SeqIndexed<T> extends CollectionIndexed<T> {

}

export interface CollectionIndexed<T> extends Collection<number, T> {
  zip<U>(other: Collection<any, U>): CollectionIndexed<[T,U]>;
  zip<U,V>(other: Collection<any, U>, other2: Collection<any, V>): CollectionIndexed<[T,U,V]>;
  zip(...collections: Array<Collection<any, any>>): CollectionIndexed<any>;

  // Sequence algorithms
  concat<C>(...valuesOrCollections: Array<Array<C> | C>): CollectionIndexed<T | C>;
}

export interface Collection<K, V> {
  // Comment the following for the super long compile time
  toJSON(): Array<V> | { [key: string]: V };

  // Conversion to Collections
  toList0(): List<V>;
  toList1(): List<V>;
  toList2(): List<V>;
  toList3(): List<V>;
  toList4(): List<V>;

  // Conversion to Seq

  toSeq0(): Collection<K, V>;
  toSeq1(): Collection<K, V>;
  toSeq2(): Collection<K, V>;
  toSeq3(): Collection<K, V>;
  toSeq4(): Collection<K, V>;
  toSeq5(): Collection<K, V>;
  toSeq6(): Collection<K, V>;

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