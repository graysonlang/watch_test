import { parseArgs } from 'node:util';
import esbuild from 'esbuild';
import { openOrReuseChromeTab } from './helpers.mjs';

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
    // build.onEnd(async () => {
    //   console.log(`✅ Build done`);
    //   return;
    // });
  },
};

async function main() {
  const args = parseArgs({
    allowNegative: true,
    options: {
      verbose: { type: 'boolean', short: 'v', default: false },
      watch: { type: 'boolean', short: 'w', default: true },
    },
  });

  const verbose = args.values.verbose;

  const userPort = 80;

  const bannerScript = `(() => {
    const s = new EventSource('/esbuild');
    s.addEventListener('change', () => location.reload());
    s.addEventListener('error', () => s.close());
    })();`;

  const options = {
    assetNames: '[name]', //'assets/[name]-[hash]',
    banner: { js: bannerScript },
    bundle: true,
    entryPoints: ['./main.mjs'],
    format: 'esm',
    loader: {
      '.css': 'file',
      '.html': 'file',
      '.png': 'file',
    },
    outdir: 'dist',
    outExtension: {'.js': '.mjs'},
    plugins: [
      noopPlugin,
      // {
      //   name: 'build-complete',
      //   setup(build) {
      //     build.onEnd(async () => {
      //       console.log(`✅ Build done`);
      //     });
      //   },
      // },
    ],
  };

  try {
    const ctx = await esbuild.context(options);
    if (args.values.watch) {
      await ctx.watch();
      console.log('Watching for changes...');
    }

    const { hosts, port } = await ctx.serve({
      port: userPort,
      servedir: options.outdir || path.dirname(options.outfile),
    });

    const portString = (userPort == 80 ? '' : (':' + userPort));
    openOrReuseChromeTab(`http://localhost${portString}`, { verbose });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
