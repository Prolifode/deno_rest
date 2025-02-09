import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from '@std/expect';
import { withTestServer } from '../utils/utils.ts';

describe('App Health endpoint', () => {
  it('should support the Oak framework', async () => {
    await withTestServer(async (port: number) => {
      const response = await fetch(`http://localhost:${port}/`);
      const body = await response.text();
      expect(body).toBe('ready');
    });
  });
});
