enum CellTypes {
    "CLOSED" = 0,
    "UP" = 1,
    "RIGHT" = 2,
    "DOWN" = 4,
    "LEFT" = 8
}

export default CellTypes;

export const isOpenUp: (celltype: CellTypes) => boolean = (cellType) => CellTypes.UP === (CellTypes.UP & cellType);
export const isOpenDown: (celltype: CellTypes) => boolean = (cellType) => CellTypes.DOWN === (CellTypes.DOWN & cellType);
export const isOpenLeft: (celltype: CellTypes) => boolean = (cellType) => CellTypes.LEFT === (CellTypes.LEFT & cellType);
export const isOpenRight: (celltype: CellTypes) => boolean = (cellType) => CellTypes.RIGHT === (CellTypes.RIGHT & cellType);

export const getString: (cellType: CellTypes) => string = (cellType) => {
    let out = "";
    if (cellType === CellTypes.CLOSED){
        return "CLOSED";
    }
    if (isOpenUp(cellType)){
        out += "UP ";
    }
    if (isOpenDown(cellType)){
        out += "DOWN ";
    }
    if (isOpenLeft(cellType)){
        out += "LEFT ";
    }
    if (isOpenRight(cellType)){
        out += "RIGHT ";
    }
    return out.trim();
};
