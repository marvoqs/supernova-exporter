Pulsar.registerFunction("getRemFromPx", function (measure) {
  return measure / 16;
});

function getVariableName(name, prefix) {
  // Separate camelCase into words so we don't lose it
  const separatedCamelCase = name.replace(/([a-z])([A-Z])/g, "$1 $2");

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
}

/**
 * Convert group name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction("getVariableName", getVariableName);

Pulsar.registerFunction("isLightToken", function (tokenName) {
  return tokenName.startsWith("light");
});

Pulsar.registerFunction("isDesktopToken", function (tokenName) {
  return tokenName.endsWith("desktop");
});

Pulsar.registerFunction("isMobileToken", function (tokenName) {
  return tokenName.endsWith("mobile");
});

Pulsar.registerFunction("getColorVariableName", function (tokenName) {
  return tokenName.replace(/(^light.)/gi, "");
});

Pulsar.registerFunction(
  "getResponsiveTypographyVariableName",
  function (tokenName) {
    return tokenName.replace(/(.desktop$)/gi, "");
  }
);

/**
 * Convert group name, token name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction("getTokenPath", function (token, tokenGroup, prefix) {
  // Create array with all path segments and token name at the end
  const segments = [
    ...tokenGroup.path.map((segment) => getVariableName(segment)),
  ];
  if (!tokenGroup.isRoot) {
    segments.push(getVariableName(tokenGroup.name));
  }
  segments.push(getVariableName(token.name));

  if (prefix && prefix.length > 0) {
    segments.unshift(prefix);
  }

  // Create "sentence" separated by spaces so we can camelcase it all
  let sentence = segments.join(" ");

  // Return camelcased string from all segments
  // sentence = sentence.toLowerCase();
  // .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  // only allow letters, digits, underscore
  sentence = sentence.replace(/[^a-zA-Z0-9_]/g, ".");

  // prepend underscore if it starts with digit
  if (/^\d/.test(sentence)) {
    sentence = "_" + sentence;
  }

  return sentence;
});

/**
 * Decides whether is group a responsive token or not.
 */
Pulsar.registerFunction("includesReponsiveTokens", function (tokens) {
  return (
    tokens.some((token) => token.name === "Desktop") &&
    tokens.some((token) => token.name === "Mobile")
  );
});

Pulsar.registerFunction("findDesktopTypographyToken", function (tokens) {
  return tokens.find((token) => token.name === "Desktop");
});

Pulsar.registerFunction("findMobileTypographyToken", function (tokens) {
  return tokens.find((token) => token.name === "Mobile");
});

Pulsar.registerFunction("findLightColorsGroup", function (groups) {
  return groups.find((group) => group.name === "Light");
});

Pulsar.registerFunction("findDarkColorsGroup", function (groups) {
  return groups.find((group) => group.name === "Dark");
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

Pulsar.registerFunction("getObjectKeys", function (object, previousPath = "") {
  // Step 1- Go through all the keys of the object
  Object.keys(object).forEach((key) => {
    // Get the current path and concat the previous path if necessary
    const currentPath = previousPath ? `${previousPath}.${key}` : key;
    // Step 2- If the value is a string, then add it to the keys array
    if (typeof object[key] !== "object") {
      objectKeys.push(currentPath);
    } else {
      objectKeys.push(currentPath);
      // Step 3- If the value is an object, then recursively call the function
      getObjectKeys(object[key], currentPath);
    }
  });
});
