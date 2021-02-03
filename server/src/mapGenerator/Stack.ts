// There are probably libraries for this, but I wanted to do this myself for fun

export default class Stack<T> {
    private stack: T[] = [];
    constructor(){}
    
    public push: (item: T) => void = (item) => {
        this.stack.push(item);
    }

    public size = () => this.stack.length;

    public pop: () => T = () => {
        if(this.size() === 0){
            throw new Error("no elements to pop");
        }
        const toReturn = this.stack[this.size() - 1];
        this.stack = this.stack.slice(0,this.size() - 1);
        return toReturn;
    }

    public peek: () => T = () => {
        return this.stack[this.size() - 1]
    }
    
    public isEmpty = () => this.size() === 0;
}