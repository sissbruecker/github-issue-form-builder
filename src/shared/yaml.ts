function isObject(value: any) {
  return !!value && value.constructor === Object;
}

function isArray(value: any) {
  return !!value && value.constructor === Array;
}

const indentation = '  ';
const itemIndentation = '- ';
function indent(text: string, listItem: boolean = false) {
  return text
    .split('\n')
    .map(
      (line, index) =>
        (index === 0 && listItem ? itemIndentation : indentation) + line
    )
    .join('\n');
}

export function yaml(value: any): string {
  // Object
  if (isObject(value)) {
    return Object.keys(value)
      .map(key => {
        // Ignore IDs
        if (key === 'id') return;
        // Ignore empty properties
        const propertyValue = value[key];
        if (propertyValue !== false && !propertyValue) return;
        // Object property
        if (isObject(propertyValue)) {
          const objectYaml = indent(yaml(propertyValue));
          return `${key}:\n${objectYaml}`;
        }
        // Array property
        if (isArray(propertyValue)) {
          const itemsYaml = yaml(propertyValue);
          return `${key}:\n${itemsYaml}`;
        }
        // Simple property
        return `${key}: ${yaml(propertyValue)}`;
      })
      .filter(property => !!property)
      .join('\n');
  }
  // Array
  if (isArray(value)) {
    return (value as any[]).map(item => indent(yaml(item), true)).join('\n');
  }
  // Simple value
  return JSON.stringify(value);
}
