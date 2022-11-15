export default function getStyleByKey(style: any, key: any) {
    var obj = new Array<string>();
    var stylesArr = style.split(";");
    stylesArr.forEach((v: any) => {
        let [key, value] = v.split("=");
        obj[key] = value;
    });

    return obj[key];
}