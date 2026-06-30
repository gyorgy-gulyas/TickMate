const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Windows + bare RN has no Watchman, so Metro's fallback watcher walks the
    // whole tree — including the transient CMake temp dirs Gradle creates and
    // deletes mid-build (android/app/.cxx/…). That race crashes Metro with
    // `ENOENT: watch …CMakeTmp…`. Keep Metro out of the native build outputs.
    blockList: [
      /android[\\/]app[\\/]\.cxx[\\/].*/,
      /android[\\/]\.gradle[\\/].*/,
      /android[\\/]app[\\/]build[\\/].*/,
      /android[\\/]build[\\/].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
