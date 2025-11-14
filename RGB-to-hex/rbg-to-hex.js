/**
 * Convert RGB(A) to hex string.
 *
 * Supports:
 * - rgbToHex(r, g, b)
 * - rgbToHex(r, g, b, a) where a is 0..1, 0..100% or 0..255
 * - rgbToHex([r,g,b]) or rgbToHex([r,g,b,a])
 * - rgbToHex({ r, g, b }) or rgbToHex({ r, g, b, a })
 * - Each channel may be a number (0-255), a float (0-255), or a percent string like "50%".
 *
 * Returns uppercase "#RRGGBB" or "#RRGGBBAA".
 */
function rgbToHex(a, b, c, d) {
  const parseChannel = (v, allowFloat01 = false) => {
    if (v === undefined || v === null) return undefined;
    if (typeof v === 'string' && v.trim().endsWith('%')) {
      const p = parseFloat(v);
      if (!Number.isFinite(p)) throw new TypeError(`Invalid percent channel: ${v}`);
      return Math.round(Math.min(100, Math.max(0, p)) / 100 * 255);
    }
    const n = Number(v);
    if (!Number.isFinite(n)) throw new TypeError(`Invalid numeric channel: ${v}`);
    // When allowFloat01 is true, accept 0..1 floats as alpha (or normal channel if intended)
    if (allowFloat01 && n >= 0 && n <= 1) return Math.round(n * 255);
    return Math.round(Math.min(255, Math.max(0, n)));
  };

  // Normalize arguments: support object/array single arg
  let r, g, b, alpha;
  if (arguments.length === 1) {
    const arg = a;
    if (Array.isArray(arg)) {
      [r, g, b, alpha] = arg;
    } else if (arg && typeof arg === 'object') {
      ({ r, g, b, a: alpha, alpha } = arg); // accept r,g,b and a or alpha keys
    } else {
      throw new TypeError('Single argument must be an array or object');
    }
  } else {
    r = a; g = b; b = c; alpha = d;
  }

  const R = parseChannel(r);
  const G = parseChannel(g);
  const B = parseChannel(b);
  if (R === undefined || G === undefined || B === undefined) {
    throw new TypeError('r, g and b channels are required');
  }

  const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();

  let hex = `#${toHex(R)}${toHex(G)}${toHex(B)}`;

  if (alpha !== undefined) {
    // Alpha can be 0..1 float, percent string, or 0..255
    let A;
    if (typeof alpha === 'string' && alpha.trim().endsWith('%')) {
      A = Math.round(Math.min(100, Math.max(0, parseFloat(alpha))) / 100 * 255);
    } else {
      const an = Number(alpha);
      if (!Number.isFinite(an)) throw new TypeError(`Invalid alpha: ${alpha}`);
      if (an >= 0 && an <= 1) A = Math.round(an * 255);
      else A = Math.round(Math.min(255, Math.max(0, an)));
    }
    hex += toHex(A);
  }

  return hex;
}
