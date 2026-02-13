class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = null;
    this.tail = null;
  }

  // 将节点移动到头部，表示最近使用
  _moveToHead(node) {
    if (node === this.head) return;

    // 断开当前节点
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    // 更新 tail 指针
    if (node === this.tail) this.tail = node.prev;

    // 插入到链表头部
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;

    // 如果链表只有一个节点时，更新 tail
    if (!this.tail) this.tail = node;
  }

  // 移除尾部节点
  _removeTail() {
    if (!this.tail) return;

    const oldTail = this.tail;
    if (this.tail.prev) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      this.head = this.tail = null;
    }

    this.map.delete(oldTail.key);
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;

    this._moveToHead(node);
    return node.value;
  }

  put(key, value) {
    const node = this.map.get(key);

    if (node) {
      // 更新节点值并移动到头部
      node.value = value;
      this._moveToHead(node);
    } else {
      // 创建新节点
      const newNode = new Node(key, value);
      this.map.set(key, newNode);

      // 插入到头部
      if (this.head) {
        newNode.next = this.head;
        this.head.prev = newNode;
      }
      this.head = newNode;

      // 如果 tail 为空，更新 tail
      if (!this.tail) this.tail = newNode;

      // 如果超出容量，移除最久未使用的节点
      if (this.map.size > this.capacity) {
        this._removeTail();
      }
    }
  }
}
