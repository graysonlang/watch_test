import path from 'node:path';
import esbuild from 'esbuild';

const noopPlugin = {
  name: 'noop-plugin',
  setup(build) {
    build.onResolve({ filter: /.*/ }, args => {
      console.log('[onResolve]', args.path);
      return; // Let esbuild handle it
    });

    build.onLoad({ filter: /.*/ }, args => {
      console.log('[onLoad]', args.path);
      return; // Let esbuild handle it
    });

    build.onEnd(args => {
      console.log(`[onEnd] - ${Date.now()}`);
    });
  },
};

const userPort = 80;

const options = {
  assetNames: '[name]',
  bundle: true,
  entryPoints: ['./main.mjs'],
  format: 'esm',
  loader: {
    '.html': 'file',
    '.png': 'file',
  },
  outfile: 'dist/main.mjs',
  outExtension: {'.js': '.mjs'},
  plugins: [noopPlugin],
};

try {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { hosts, port } = await ctx.serve({
    port: 80,
    servedir: options.outdir || path.dirname(options.outfile),
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
