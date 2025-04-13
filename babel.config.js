module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "~/assets": "./assets",
            "@/api": "./src/api",
            "@/components": "./src/components",
            "@/config": "./src/config",
            "@/libs": "./src/libs",
            "@/navigation": "./src/navigation",
            "@/screens": "./src/screens",
            "@/services": "./src/services",
            "@/store": "./src/store",
            "@/theme": "./src/theme",
            "@/types": "./src/types",
            "@/utilities": "./src/utilities",
          },
        },
      ],

      "nativewind/babel",
    ],
  };
};
