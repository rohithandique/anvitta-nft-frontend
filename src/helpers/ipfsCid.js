const IPFS = require("ipfs-core");

export async function ipfsCid(file) {
  if (!file) return;

  const ipfs = await IPFS.create({
    offline: true,
    start: false,
    repo: 'ok' + Math.random()
  });

  const { cid } = await ipfs.add(file, {
    onlyHash: true,
    cidVersion: 1
  });

  return cid;
}
