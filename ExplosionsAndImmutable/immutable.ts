/// <reference path="../../immutable-js/type-definitions/Immutable.d.ts" />

// Force explicit assignability test for all extending interfaces
function a<K,V>() {
  let ICKV: Immutable.Collection<K, V> = 0 as any
  let ICNV: Immutable.Collection<number, V> = 0 as any
  let ICVV: Immutable.Collection<V, V> = 0 as any

  let ICIV: Immutable.Collection.Indexed<V> = 0 as any
  let ICKKV: Immutable.Collection.Keyed<K, V> = 0 as any
  let ICSV: Immutable.Collection.Set<V> = 0 as any

  ICKV = ICKKV
  ICNV = ICIV
  ICVV = ICSV
  ICIV = 0 as any as Immutable.List<V>
  ICNV = 0 as any as Immutable.List<V>
  ICKKV = 0 as any as Immutable.Map<K, V>
  ICKV = 0 as any as Immutable.Map<K, V>
  const _08 : Immutable.Map<K, V> = 0 as any as Immutable.OrderedMap<K, V>
  ICKKV = 0 as any as Immutable.OrderedMap<K, V>
  ICKV = 0 as any as Immutable.OrderedMap<K, V>
  ICSV = 0 as any as Immutable.Set<V>
  ICVV = 0 as any as Immutable.Set<V>
  const _11 : Immutable.Set<V> = 0 as any as Immutable.OrderedSet<V>
  ICSV = 0 as any as Immutable.OrderedSet<V>
  ICVV = 0 as any as Immutable.OrderedSet<V>
  ICIV = 0 as any as Immutable.Stack<V>
  ICNV = 0 as any as Immutable.Stack<V>
  const _16 : Immutable.Seq<K, V> = 0 as any as Immutable.Seq.Keyed<K, V>
  ICKV = 0 as any as Immutable.Seq.Keyed<K, V>
  ICKKV = 0 as any as Immutable.Seq.Keyed<K, V>
  const _19 : Immutable.Seq<number, V> = 0 as any as Immutable.Seq.Indexed<V>
  ICNV = 0 as any as Immutable.Seq.Indexed<V>
  ICIV = 0 as any as Immutable.Seq.Indexed<V>
  const _22 : Immutable.Seq<V, V> = 0 as any as Immutable.Seq.Set<V>
  ICSV = 0 as any as Immutable.Seq.Set<V>
  ICVV = 0 as any as Immutable.Seq.Set<V>
  ICKV = 0 as any as Immutable.Seq<K, V>

  const trans1 = (0 as any as Immutable.OrderedSet<V>).map((v) => ([v,v]))

  const a: Immutable.Set<V, Immutable.SetID> = 0 as any as Immutable.Set<V, Immutable.OrderedSetID>
}


//const a: Immutable.Map<number, string> = 0 as any
//const b: Immutable.Collection<number, string> = a
//const c = b.flatMap<11>((t, k) => ([11, 11]))