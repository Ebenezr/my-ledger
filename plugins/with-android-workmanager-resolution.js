const { withProjectBuildGradle } = require('expo/config-plugins');

const WORKMANAGER_RESOLUTION = `
allprojects {
  configurations.configureEach {
    resolutionStrategy {
      force "androidx.work:work-runtime:2.8.1"
      force "androidx.work:work-runtime-ktx:2.8.1"
    }
  }
}
`;

module.exports = function withAndroidWorkManagerResolution(config) {
  return withProjectBuildGradle(config, (projectConfig) => {
    if (projectConfig.modResults.language !== 'groovy') {
      throw new Error(
        'with-android-workmanager-resolution only supports Groovy build.gradle files.',
      );
    }

    if (!projectConfig.modResults.contents.includes(WORKMANAGER_RESOLUTION.trim())) {
      projectConfig.modResults.contents = `${projectConfig.modResults.contents.trim()}\n${WORKMANAGER_RESOLUTION}`;
    }

    return projectConfig;
  });
};
