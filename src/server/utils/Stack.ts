// There are probably libraries for this, but I wanted to see if I could do this myself

export default class Stack<T> {
    private stack: T[] = [];
    constructor(){}
    
    public push: (item: T) => void = (item) => {
        this.stack.push(item);
    }

    public pop: () => T = () => {
        if(this.stack.length === 0){
            throw new Error("no elements to pop");
        }
        const toReturn = this.stack[this.stack.length - 1];
        this.stack = this.stack.slice(0,this.stack.length - 1);
        return toReturn;
    }

    public peek: () => T | null = () => {
        if (this.stack.length === 0) {
            return null;
        }
        return this.stack[this.stack.length - 1]
    }
}