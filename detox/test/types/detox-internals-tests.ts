import { Event } from 'trace-event-lib';

declare function random<T>(): T
declare function assert<T>(x: T): void;

import {
  cleanup,
  config,
  init,
  installWorker,
  log,
  onHookFailure,
  onHookStart,
  onHookSuccess,
  onRunDescribeFinish,
  onRunDescribeStart,
  onRunFinish,
  onRunStart,
  onTestDone,
  onTestFnFailure,
  onTestFnStart,
  onTestFnSuccess,
  onTestStart,
  reportTestResults,
  resolveConfig,
  session,
  tracing,
  uninstallWorker,
  worker,
} from 'detox/internals';

declare var anyOf: AnyOf; // for testing purposes
interface AnyOf {
  <A>(a: A): A;
  <A, B>(a: A, b: B): A | B;
  <A, B, C>(a: A, b: B, c: C): A | B | C;
  <A, B, C, D>(a: A, b: B, c: C, d: D): A | B | C | D;
}

function getInitOptions(): DetoxInternals.DetoxInitOptions {
  return {
    cwd: __dirname,
    argv: {
      configuration: 'android.debug',
    },
    testRunnerArgv: {
      bail: true
    },
    override: {
      extends: '@my-org/detox-preset/prod-e2e',
      testRunner: {
        args: {
          $0: 'nyc jest',
          config: 'e2e/config.js',
          debug: true,
          testTimeout: 50000,
          _: ['e2e/*.test.js'],
        },
        forwardEnv: false,
        retries: 1,
        inspectBrk: (config) => {
          if (config.args) {
            config.args.$0 = 'jest';
          }
        },
      },
      behavior: {
        init: {
          reinstallApp: true,
          exposeGlobals: true,
          keepLockFile: true,
        },
        launchApp: 'auto',
        cleanup: {
          shutdownDevice: false,
        },
      },
      artifacts: {
        rootDir: 'artifacts',
        pathBuilder: 'e2e/pathbuilder.js',
        plugins: {
          log: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: false,
          },
          screenshot: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: false,
            shouldTakeAutomaticSnapshots: true,
            takeWhen: {
              testStart: false,
              testFailure: true,
              testDone: false,
              appNotReady: true,
            },
          },
          video: {
            enabled: true,
            keepOnlyFailedTestsArtifacts: false,
          },
          instruments: {
            enabled: true,
          },
          timeline: {
            enabled: true,
          },
          uiHierarchy: {
            enabled: true,
          },
        },
      },
      devices: {
        ios: {
          type: 'ios.simulator',
          device: {
            name: 'iPhone 12-Detox',
            os: 'iOS 100.500',
          },
        },
        android: {
          type: 'android.emulator',
          device: {
            avdName: 'Pixel_200',
          },
          utilBinaryPaths: ['testButler.apk'],
        },
      },
      apps: {
        ios: {
          type: 'ios.app',
          bundleId: 'com.example',
          binaryPath: 'path/to/app',
          build: 'echo IOS',
          launchArgs: {
            some: 1,
            arg: '2',
            obj: {},
          },
        },
        android: {
          type: 'android.apk',
          bundleId: 'com.example',
          binaryPath: 'path/to/app',
          testBinaryPath: 'path/to/test-app',
          build: 'echo IOS',
          launchArgs: {
            some: 1,
            arg: '2',
            obj: {},
          },
        },
      },
      configurations: {
        'ios.sim.debug': {
          device: {
            type: 'ios.simulator',
            device: 'iPhone 12 Pro Max'
          },
          app: {
            type: 'ios.app',
            binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/example.app',
            build: 'some build command',
          },
        },
        'ios.sim.release': {
          device: {
            type: 'ios.simulator',
            device: anyOf({ id: 'GUID-GUID-GUID-GUID' }, { type: 'iPad Mini' }, { name: 'iPad Mini-Detox' }, { os: 'iOS 9.3.6' }),
          },
          apps: [],
        },
        'android.attached': {
          device: {
            type: 'android.attached',
            device: {
              adbName: 'emulator-5554',
            },
          },
          app: {
            type: 'android.apk',
            binaryPath: 'android/app/build/outputs/apk/fromBin/release/app-fromBin-release.apk',
            build: 'some command',
          },
        },
        'android.genycloud.uuid': {
          device: {
            type: 'android.genycloud',
            device: {
              recipeUUID: 'a50a71d6-da90-4c67-bdfa-5b602b0bbd15',
            },
          },
          apps: [],
        },
        'android.genycloud.release2': {
          device: {
            type: 'android.genycloud',
            device: {
              recipeName: 'Detox_Pixel_API_29',
            },
          },
          apps: [],
        },
        stub: {
          device: {
            type: './integration/stub',
            name: 'integration-stub',
            integ: 'stub',
          },
          apps: [],
        },
        'aliased.ios': {
          device: 'ios',
          app: 'ios',
          session: {
            debugSynchronization: 0,
          },
          artifacts: {
            plugins: {
              log: anyOf('none', 'failing', 'all'),
              screenshot: anyOf('none', 'manual', 'failing', 'all'),
              video: anyOf('none', 'failing', 'all'),
              instruments: anyOf('none', 'all'),
              timeline: anyOf('none', 'all'),
              uiHierarchy: anyOf('disabled', 'enabled'),
            },
          },
        },
        'aliased.android': {
          device: 'android',
          app: 'android',
          artifacts: {
            plugins: {
              log: 'all',
            },
          },
        },
      },
    },
    global,
    workerId: Math.random() > 0.5 ? null : 'worker-1',
  };
}

async function internalsTest() {
  const globalOptions = getInitOptions();

  await resolveConfig();
  await resolveConfig({});
  await resolveConfig(globalOptions);

  await init();
  await init({});
  await init(globalOptions);

  await installWorker();
  await installWorker({});
  await installWorker({
    global,
    workerId: 'worker-1',
  });

  assert<DetoxInternals.Worker>(worker);

  await uninstallWorker();
  await cleanup();
}

async function logTest() {
  switch (log.level) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      break;
  }

  log.trace('msg');
  log.trace({ event: 'EVENT' }, 'msg');

  log.trace.begin('Outer section');
  log.debug.begin({ arg: 'value' }, 'Inner section');

  log.info.complete('Sync section', () => 'sync').toUpperCase();
  log.warn.complete('Async section', async () => 42).then(() => 84);
  log.error.complete('Promise section', Promise.resolve(42)).finally(() => {});
  log.fatal.complete('Value section', 42).toFixed(1);

  log.warn.end({ extra: 'data' });
  log.info.end();

  log.debug('msg');
  log.debug({ event: 'EVENT' }, 'msg');
  log.info('msg');
  log.info({ event: 'EVENT' }, 'msg');
  log.warn('msg');
  log.warn({ event: 'EVENT' }, 'msg');
  log.error('msg');
  log.error({ event: 'EVENT' }, 'msg');
  log.fatal('msg');
  log.fatal({ event: 'EVENT' }, 'msg');

  log.child().info('msg');
  log.child({ anything: 'value' }).trace('msg');

  const serverLogger = log.child({ cat: 'server', id: 4333 });
  serverLogger.info.begin({}, 'Starting server...');
  await serverLogger.trace.complete('something', async () => {
    // ... do something ...
  });

  serverLogger.trace.end();
}

function tracingTest() {
  return new Promise((resolve, reject) => {
    tracing.createEventStream()
      .on('data', function (e: Event) {
        console.log(e.ph, e.name);
      })
      .on('error', reject)
      .on('end', resolve)
  });
}

function configTest() {
  assert<number>(session.workersCount);
  assert<string>(config.configurationName);
  assert<Record<string, Detox.DetoxAppConfig>>(config.apps);
  assert<Detox.DetoxArtifactsConfig>(config.artifacts);
  assert<Detox.DetoxBehaviorConfig>(config.behavior);
  assert<DetoxInternals.CLIConfig>(config.cli);
  assert<Detox.DetoxDeviceConfig>(config.device);
  assert<Detox.DetoxLoggerConfig>(config.logger);
  assert<Detox.DetoxSessionConfig>(config.session);
  assert<Detox.DetoxTestRunnerConfig>(config.testRunner);
}

async function lifecycleTest() {
  await onHookFailure({
    error: new Error('Hook failure'),
    hook: random<'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll'>(),
  });

  await onHookStart({
    hook: random<'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll'>(),
  });

  await onHookSuccess({
    hook: random<'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll'>(),
  });

  await onRunDescribeFinish({
    name: 'Test suite',
  });

  await onRunDescribeStart({
    name: 'Test suite',
  });

  await onRunFinish({

  });

  await onRunStart({
    title: 'Some test',
    fullName: 'Test suite > Some test',
    status: 'running',
    invocations: 0,
  });

  await onTestDone({
    title: 'Some test',
    fullName: 'Test suite > Some test',
    status: Math.random() < 0.5 ? 'failed' : 'passed',
    invocations: 1,
    timedOut: false,
  });

  await onTestFnFailure({
    error: new Error('Test fn failure'),
  });

  await onTestFnStart({

  });

  await onTestFnSuccess({

  });

  await onTestStart({

  });

  await reportTestResults([
    {
      testFilePath: 'test1',
      success: true,
    },
    {
      testFilePath: 'test2',
      success: false,
    },
    {
      testFilePath: 'test1',
      success: false,
      testExecError: new Error('Generic test suite failure'),
      isPermanentFailure: true,
    },
  ]);
}

Promise.all([
  internalsTest() ,
  lifecycleTest(),
  logTest(),
  Promise.resolve().then(configTest),
]).catch(() => {});
