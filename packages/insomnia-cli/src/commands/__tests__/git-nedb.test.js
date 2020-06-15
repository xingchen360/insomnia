// @flow
import path from 'path';
import * as db from '../git-nedb';
import { globalBeforeEach } from '../../__jest__/before-each';

describe('git-nedb', () => {
  beforeEach(globalBeforeEach);

  describe('seedGitDataDir()', () => {
    const fixturesPath = 'src/commands/__fixtures__';

    it('should seed with git-repo directory', async () => {
      const dir = path.join(fixturesPath, 'git-repo');
      await db.seedGitDataDir(dir);

      expect(await db.all('ApiSpec')).toHaveLength(1);
      expect(await db.all('Environment')).toHaveLength(2);
      expect(await db.all('Request')).toHaveLength(2);
      expect(await db.all('RequestGroup')).toHaveLength(1);
      expect(await db.all('Workspace')).toHaveLength(1);
    });

    it('should throw error if .insomnia directory is not found', async () => {
      const dir = path.join(fixturesPath, 'git-repo-without-insomnia');
      const action = () => db.seedGitDataDir(dir);
      expect(action).rejects.toThrowError(`Directory not found: ${path.join(dir, '.insomnia')}`);
    });

    it('should ignore unexpected type directories', async () => {
      const dir = path.join(fixturesPath, 'git-repo-malformed-insomnia');
      await db.seedGitDataDir(dir);

      expect(await db.all('Workspace')).toHaveLength(1);
      expect(() => db.all('Malformed')).rejects.toThrowError();
    });
  });
});
