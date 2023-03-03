interface INode<T> {
  value: T;
  next: INode<T> | null;
}

export class Node<T> implements INode<T> {
  value: T;
  next: Node<T> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

interface ILinkedList<T> {
  append: (element: T) => void;
  prepend: (element: T) => void;
  insertAt: (element: T, index: number) => void;
  removeFromTail: () => void;
  removeFromHead: () => void;
  removeAt: (index: number) => void;
}

export class LinkedList<T> implements ILinkedList<T> {
  public head: Node<T> | null;
  public size: number;
  constructor() {
    this.head = null;
    this.size = 0;
  }

  prepend(element: T) {
    const node = new Node(element);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  append(element: T) {
    const node = new Node(element);
    let current;

    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }
    this.size++;
  }

  removeFromTail() {
    if (!this.head) {
      return;
    }

    if (!this.head.next) {
      this.head = null;
      this.size--;
      return;
    }

    let tempNode: Node<T> = this.head;
    let beforeTail: Node<T> | null = null;

    while (tempNode.next) {
      beforeTail = tempNode;
      tempNode = tempNode.next;
    }

    (beforeTail as Node<T>).next = null;

    this.size--;
  }

  removeFromHead() {
    if (!this.head) {
      return;
    }

    const oldHead = this.head;
    this.head = this.head.next;
    oldHead.next = null;
    this.size--;
  }

  removeAt(index: number) {
    if (index < 0 || index >= this.size) {
      return;
    }

    if (index === 0) {
      this.removeFromHead();
      return;
    }

    let prev = null;
    let curr = this.head;

    for (let i = 0; i < index; i++) {
      prev = curr;
      curr = curr!.next;
    }

    prev!.next = curr!.next;
    curr!.next = null;
    this.size--;
  }

  insertAt(element: T, index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      const node = new Node(element);

      if (index === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        let curr = this.head;

        for (let currIndex = 0; index - currIndex !== 1; currIndex++) {
          curr = (curr as Node<T>).next;
        }
        if (curr?.next) {
          const temp = curr.next;
          curr.next = node;
          node.next = temp;
        } else {
          (curr as Node<T>).next = node;
        }
      }

      this.size++;
    }
  }
}
