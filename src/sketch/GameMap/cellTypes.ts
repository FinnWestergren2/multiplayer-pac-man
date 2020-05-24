enum CellTypes {
    "CLOSED" = 0,
    "UP" = 1,
    "RIGHT" = 2,
    "DOWN" = 4,
    "LEFT" = 8
};

export default CellTypes;

export const getString: (cellType: CellTypes) => string = (cellType) => {
    var out = "";
    if (cellType === CellTypes.CLOSED){
        return "CLOSED";
    }
    if (CellTypes.UP === (CellTypes.UP & cellType)){
        out += "UP ";
    }
    if (CellTypes.DOWN === (CellTypes.DOWN & cellType)){
        out += "DOWN ";
    }
    if (CellTypes.LEFT === (CellTypes.LEFT & cellType)){
        out += "LEFT ";
    }
    if (CellTypes.RIGHT === (CellTypes.RIGHT & cellType)){
        out += "RIGHT ";
    }
    return out.trim();
}