const parent = (i: number) => ((i + 1) >>> 1) - 1;
const left = (i: number) => (i << 1) + 1;
const right = (i: number) => (i + 1) << 1;

export default class PriorityQueue<T> {
    private heap: T[];
    private comparator: (a: T, b: T) => boolean; // a > b for maxheap, a < b for minheap

    public constructor(comparator: (a: T, b: T) => boolean) {
        this.comparator = comparator;
        this.heap = [];
    }

    public size = () => this.heap.length;

    public peek = () => this.heap[0];

    public pop = () => {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > 0) {
            this.swap(bottom, 0);
        }
        this.heap.pop();
        this.siftDown();
        return poppedValue;
    };

    public push = (...values: T[]) => {
        values.forEach((value) => {
            this.heap.push(value);
            this.siftUp();
        });
    };

    private swap = (a: number, b: number) => {
        [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
    }

    private compare = (a: number, b: number) => this.comparator(this.heap[a], this.heap[b]);

    private siftUp() {
        let node = this.size() - 1;
        while (node > 0 && this.compare(node, parent(node))) {
            this.swap(node, parent(node));
            node = parent(node);
        }
    }

    siftDown() {
        let node = 0;
        while (
            (left(node) < this.size() && this.compare(left(node), node)) ||
            (right(node) < this.size() && this.compare(right(node), node))
        ) {
            let maxChild =
                right(node) < this.size() &&
                this.compare(right(node), left(node))
                    ? right(node)
                    : left(node);
            this.swap(node, maxChild);
            node = maxChild;
        }
    }
}
