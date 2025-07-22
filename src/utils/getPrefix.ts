export const prefix = "rkk";

export const withPrefix = (string: string | string[], separator = " ") => {
  if (Array.isArray(string))
    return string.map((item) => `${prefix}-${item}`).join(separator);
  return `${prefix}-${string}`;
};
