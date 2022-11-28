Pulsar.registerFunction("getRemFromPx", function (measure) {
  return measure / 16;
});

/**
 * Convert group name, token name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction(
  "readableVariableName",
  function (token, tokenGroup, prefix) {
    // Create array with all path segments and token name at the end
    const segments = [...tokenGroup.path];
    if (!tokenGroup.isRoot) {
      segments.push(tokenGroup.name);
    }
    segments.push(token.name);

    if (prefix && prefix.length > 0) {
      segments.unshift(prefix);
    }

    // Create "sentence" separated by spaces so we can camelcase it all
    let sentence = segments.join(" ");

    // Return camelcased string from all segments
    sentence = sentence
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

    // only allow letters, digits, underscore
    sentence = sentence.replace(/[^a-zA-Z0-9_]/g, "_");

    // prepend underscore if it starts with digit
    if (/^\d/.test(sentence)) {
      sentence = "_" + sentence;
    }

    return sentence;
  }
);

/**
 * Convert group name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction("shortVariableName", function (token, prefix) {
  // Separate camelCase into words so we don't lose it
  const separatedCamelCase = token.name.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Create array with all path segments and token name at the end
  const segments = [separatedCamelCase];

  if (prefix && prefix.length > 0) {
    segments.unshift(prefix);
  }

  // Create "sentence" separated by spaces so we can camelcase it all
  let sentence = segments.join(" ");

  // Return camelcased string from all segments
  sentence = sentence
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  // only allow letters, digits, underscore
  sentence = sentence.replace(/[^a-zA-Z0-9_]/g, "_");

  // prepend underscore if it starts with digit
  if (/^\d/.test(sentence)) {
    sentence = "_" + sentence;
  }

  return sentence;
});

/**
 * Behavior configuration of the exporter
 * Prefixes: Add prefix for each category of the tokens. For example, all colors can start with "color, if needed"
 */
const BEHAVIOR = {
  color: {
    fileName: "colors", // this should be somehow synced with output.json contents
    varName: "colors",
    itemTypeName: "ColorTokenType",
    typeName: "ColorsType",
    themeProperty: "colors",
    tokenType: "Color",
    tokenPrefix: "",
  },
  border: {
    fileName: "borders", // this should be somehow synced with output.json contents
    varName: "borders",
    itemTypeName: "BorderTokenType",
    typeName: "BordersType",
    themeProperty: "borders",
    tokenType: "Border",
    tokenPrefix: "",
  },
  gradient: {
    fileName: "gradients", // this should be somehow synced with output.json contents
    varName: "gradients",
    itemTypeName: "GradientTokenType",
    typeName: "GradientsType",
    themeProperty: "gradients",
    tokenType: "Gradient",
    tokenPrefix: "",
  },
  measure: {
    fileName: "measures", // this should be somehow synced with output.json contents
    varName: "measures",
    itemTypeName: "MeasureTokenType",
    typeName: "MeasuresType",
    themeProperty: "measures",
    tokenType: "Measure",
    tokenPrefix: "",
  },

  shadow: {
    fileName: "shadows", // this should be somehow synced with output.json contents
    varName: "shadows",
    itemTypeName: "ShadowTokenType",
    typeName: "ShadowsType",
    themeProperty: "shadows",
    tokenType: "Shadow",
    tokenPrefix: "",
  },
  typography: {
    fileName: "typographies", // this should be somehow synced with output.json contents
    varName: "typographies",
    itemTypeName: "TypographyTokenType",
    typeName: "TypographiesType",
    themeProperty: "typographies",
    tokenType: "Typography",
    tokenPrefix: "",
  },
  radius: {
    fileName: "radii", // this should be somehow synced with output.json contents
    varName: "raddii",
    itemTypeName: "RadiusTokenType",
    typeName: "RadiiType",
    themeProperty: "radii",
    tokenType: "Radius",
    tokenPrefix: "",
  },
  unknown: {
    fileName: "uknown",
    varName: "unknowns",
    itemTypeName: "any",
    typeName: "UnknownsType",
    themeProperty: "unknowns",
    tokenType: "Unknown",
    tokenPrefix: "",
  },
};

Pulsar.registerFunction("getBehavior", function (tokenType) {
  return BEHAVIOR[tokenType.toLowerCase()] || BEHAVIOR["unknown"];
});

Pulsar.registerFunction("buildReferenceMeta", function (tokenType, tokenValue) {
  return {
    tokenType,
    referencedToken: tokenValue.referencedToken,
  };
});
