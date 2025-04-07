import esbuild from 'esbuild';
import { exec } from 'node:child_process';

const options = {
  bundle: true,
  entryPoints: ['./main.mjs'],
  format: 'esm',
  outfile: 'public/main.mjs',
  outExtension: {'.js': '.mjs'},
  plugins: [
    {
      name: 'noop-plugin',
      setup(build) {
        build.onResolve({ filter: /.*/ }, args => {
          console.log('[onResolve]', args.path);
          return;
        });

        build.onLoad({ filter: /.*/ }, args => {
          console.log('[onLoad]', args.path);
          return;
        });

        build.onEnd(args => {
          console.log(`[onEnd] - ${Date.now()}`);
        });
      },
    }
  ],
};

try {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { hosts, port } = await ctx.serve({
    port: 80,
    servedir: 'public',
    disableRebuildOnRequest: true,
    // onRequest: (args) => { console.dir(args) }
  });
  exec(`open http://localhost`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
