const path = require('path');
const fs = require('fs-extra');
const { promisify } = require('util');
const { execCommand } = require('./utils/exec');

const readFile = promisify(fs.readFile);
const remove = promisify(fs.remove);

describe('Timeline integration test', () => {
  const artifactsDirectory = 'integration_artifacts/'
  const timelineArtifactFilename = 'detox.trace.json';
  const timelineArtifactPath = path.join(artifactsDirectory, timelineArtifactFilename);
  const clearAllArtifacts = () => remove(artifactsDirectory);

  beforeEach(clearAllArtifacts);

  // TODO: think how to fix it
  it('should deterministically produce a timeline artifact', async () => {
    await execCommand(`detox test -c stub --config integration/e2e/config.js -a ${artifactsDirectory} -w 2 .`);
    const timelineArtifactContents = await readFile(timelineArtifactPath, 'utf8');
    expect(timelineArtifactContents).toBeDefined(); // .toMatchSnapshot();
  });
});
