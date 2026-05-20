const errorMessage = "node:fs/promises is unavailable in the browser workbench";

async function unavailable() {
  throw new Error(errorMessage);
}

const fsShim = {
  readFile: unavailable,
  readdir: unavailable,
  stat: unavailable,
  access: unavailable,
  writeFile: unavailable
};

export default fsShim;
export const readFile = unavailable;
export const readdir = unavailable;
export const stat = unavailable;
export const access = unavailable;
export const writeFile = unavailable;
