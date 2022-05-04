
export function findValueByPrefix(object, prefix) {
    for (var property in object) {
        if (object.hasOwnProperty(property) && 
            property.toString().startsWith(prefix)) {
            return {value: object[property], key: property};
        }
    }
}