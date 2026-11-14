/* dds.mjs - a DDS texture's header, by the upload server's rules.
 *
 * A port of the registry's parseDDS and decodeDDS
 * (the game's server), which read
 * the header the way the engine's pc_texderive_dds_format does. The game page
 * (mods.js readMod) does not open textures, so `playac-mod check` reports these
 * as warnings: the mod installs from a file, but the mod list refuses it when
 * it is uploaded. The reasons are the Go wording without the leading quoted
 * name, so they match the errors catalogue's texture-* entries. */

export const DDS_MAX_SIDE = 16384; /* MaxSide, TD_DDS_MAX_SIDE */
const DDS_MAGIC = 0x20534444; /* "DDS " */
const DDPF_FOURCC = 0x04;
const DDSD_MIPMAPCOUNT = 0x20000;
const HEADER = 128;
const DX10 = 20;
const DXGI = { 28: ['RGBA', 0], 71: ['DXT1', 8], 77: ['DXT5', 16], 87: ['BGRA', 0], 98: ['BC7', 16] };
const fourCC = (s) => s.charCodeAt(0) | (s.charCodeAt(1) << 8) | (s.charCodeAt(2) << 16) | ((s.charCodeAt(3) << 24) >>> 0);

function printable(b) {
  let s = '';
  for (const c of b) s += c >= 0x20 && c < 0x7f ? String.fromCharCode(c) : `\\x${c.toString(16).padStart(2, '0')}`;
  return s;
}

/* bytes: the whole file. Returns { w, h, format, levels, error } where error
 * is '' for a DDS the registry accepts, else its reason (w and h are set
 * whenever the header gave them). */
export function readDds(bytes) {
  const b = bytes || new Uint8Array(0);
  const le = (o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
  const out = (error, extra = {}) => ({ w: 0, h: 0, format: '', levels: 1, error, ...extra });
  if (b.length < HEADER) {
    /* decodeDDS: a short header is "not a DDS" when its magic is wrong, else "cut short" */
    return out(b.length >= 4 && le(0) !== DDS_MAGIC ? 'is not a DDS file.' : 'is cut short.');
  }
  if (le(0) !== DDS_MAGIC) return out('is not a DDS file.');
  const h = le(12), w = le(16);
  if (w === 0 || h === 0 || w > DDS_MAX_SIDE || h > DDS_MAX_SIDE) {
    return out(`is ${w}x${h}. A texture is 1 to ${DDS_MAX_SIDE} pixels a side.`);
  }
  const levels = (le(8) & DDSD_MIPMAPCOUNT) !== 0 && le(28) > 1 ? le(28) : 1;
  const flags = le(80), cc = le(84);
  let offset = HEADER, format, block;
  if ((flags & DDPF_FOURCC) !== 0 && cc === fourCC('DX10')) {
    if (b.length < HEADER + DX10) return out('is cut short.', { w, h });
    offset = HEADER + DX10;
    const dx = le(128);
    if (!DXGI[dx]) return out(`is a DDS format the game can't load (DXGI format ${dx}). Save it as BC7, DXT1, DXT5 or uncompressed 32-bit RGBA.`, { w, h });
    [format, block] = DXGI[dx];
  } else if ((flags & DDPF_FOURCC) !== 0) {
    if (cc === fourCC('DXT1')) [format, block] = ['DXT1', 8];
    else if (cc === fourCC('DXT5')) [format, block] = ['DXT5', 16];
    else return out(`is a DDS format the game can't load (${printable(b.subarray(84, 88))}). Save it as BC7, DXT1, DXT5 or uncompressed 32-bit RGBA.`, { w, h });
  } else {
    const bpp = le(88);
    if (bpp !== 32) return out(`is an uncompressed DDS of ${bpp} bits a pixel. The game loads 32-bit RGBA, BC7, DXT1 or DXT5.`, { w, h });
    [format, block] = ['RGBA', 0];
  }
  const data = block === 0 ? w * h * 4 : Math.ceil(w / 4) * Math.ceil(h / 4) * block;
  const want = offset + data;
  const r = { w, h, format, levels, error: '' };
  if (b.length < want) {
    r.error = `is cut short: a ${w}x${h} ${format} image needs ${want} bytes, the file has ${b.length}.`;
  } else if (b.length > want) {
    r.error = levels > 1
      ? `stores ${levels} mip levels. Save it with one level (no mipmaps): the game reads only the first.`
      : `has ${b.length - want} bytes after its image. Save it with one level (no mipmaps) and nothing else.`;
  }
  return r;
}
