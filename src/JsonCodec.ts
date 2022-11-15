import mxHelper from './_helpers/mxgraph';                       // <- import values from factory()

class JsonCodec extends mxHelper.mxObjectCodec {
    constructor() {
      super((value: any) => {});
    }
    encode(value: any) {
      const xmlDoc = mxHelper.mxUtils.createXmlDocument();
      const newObject = xmlDoc.createElement("TaskObject");
      for (let prop in value) {
        newObject.setAttribute(prop, value[prop]);
      }
      return newObject;
    }
    decode(model: any) {
      return Object.keys(model.cells)
        .map(iCell => {
          const currentCell = model.getCell(iCell);
          return currentCell.value !== undefined ? currentCell : null;
        })
        .filter(item => item !== null);
    }
  }

  export default JsonCodec;