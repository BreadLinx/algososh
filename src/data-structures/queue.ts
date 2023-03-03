interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
}

export class Queue<T> implements IQueue<T> {
  public container: (T | null)[] = [];
  public head = 0;
  public tail = 0;

  private readonly size: number = 0;
  public length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }
    this.container[this.tail] = item;
    if (this.tail + 1 === this.size) {
      this.tail = 0;
    } else {
      this.tail++;
    }
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    this.container[this.head] = null;
    if (this.head + 1 === this.size) {
      this.head = 0;
    } else {
      this.head++;
    }
    this.length--;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    return this.container[this.head];
  };

  isEmpty = () => this.length === 0;

  resetQueue = () => {
    this.length = 0;
    this.head = 0;
    this.tail = 0;
    this.container = Array(this.size);
  };
}
