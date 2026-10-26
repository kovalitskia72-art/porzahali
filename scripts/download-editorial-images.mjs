import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Pexels Free License: https://www.pexels.com/license/
// Assets are cached into the deployed site during the Pages build so runtime
// does not depend on a third-party CDN. Each photo id corresponds to a
// separately themed editorial cover. Original author pages are linked in
// docs/editorial-photo-sources.md.
const photoIds = new Map([
  ['1', 6943426], ['3', 36713437], ['4', 10274668],
  ['5', 7108956], ['6', 18888665], ['7', 11589676],
  ['9', 4975666], ['10', 22046204], ['11', 4266936],
  ['12', 19773931], ['13', 11368690], ['14', 19773939],
  ['16', 9301305], ['17', 8374286], ['18', 1440387],
  ['19', 8486922], ['20', 9461645], ['21', 6075559],
  ['22', 6248439], ['24', 8815842], ['25', 3760538],
  ['26', 5212329], ['27', 12673783], ['28', 4031636],
  ['29', 15167698],
]);

const folder = join(process.cwd(), 'public', 'images', 'editorial');
await mkdir(folder, { recursive: true });

const images = [...photoIds.entries()];
let nextIndex = 0;
let failures = 0;
let successes = 0;

async function downloadOne([postId, photoId]) {
  const url = 'https://images.pexels.com/photos/' + photoId
    + '/pexels-photo-' + photoId + '.jpeg'
    + '?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop';

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'image/jpeg,image/*;q=0.9' },
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
        throw new Error('Unexpected photo response ' + response.status);
      }
      const data = Buffer.from(await response.arrayBuffer());
      if (data.length < 2000 || data.length > 2_000_000) {
        throw new Error('Unexpected image size: ' + data.length);
      }
      await writeFile(join(folder, 'post-' + postId + '.jpg'), data);
      successes++;
      console.log('Downloaded editorial photo ' + postId + ': ' + Math.round(data.length/1024) + ' KiB');
      return;
    } catch (error) {
      if (attempt === 3) {
        failures++;
        console.warn('Could not cache editorial photo ' + postId + ': ' + String(error));
      } else {
        await new Promise(resolve => setTimeout(resolve, attempt * 350));
      }
    }
  }
}

async function worker() {
  while (nextIndex < images.length) {
    const index = nextIndex++;
    await downloadOne(images[index]);
  }
}
await Promise.all(Array.from({ length: 5 }, () => worker()));

console.log('Editorial photos: ' + successes + ' downloaded, ' + failures + ' failed.');
// A complete CDN outage should not replace the working website with broken images.
if (failures > 0) {
  throw new Error('At least one editorial photo could not be cached; deployment stopped.');
}
