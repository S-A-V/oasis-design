declare class Node<K = any, V = any> {
  key: K;
  value: V;
  prev: Node<K, V> | null;
  next: Node<K, V> | null;
  constructor(key: K, value: V);
}

export declare class LRUCache<K = any, V = any> {
  private capacity: number;
  private map: Map<K, Node<K, V>>;
  private head: Node<K, V> | null;
  private tail: Node<K, V> | null;

  constructor(capacity: number);

  private _moveToHead(node: Node<K, V>): void;
  private _removeTail(): void;
  get(key: K): V | -1;
  put(key: K, value: V): void;
}
