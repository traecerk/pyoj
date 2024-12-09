module.exports = {
  parser: "@typescript-eslint/parser", // 如果你使用 TypeScript, 否则可以删除这行
  extends: [
    "eslint:recommended", // 基本的 ESLint 推荐规则
    "plugin:react/recommended", // React 推荐规则（如果是 React 项目）
    "plugin:@typescript-eslint/recommended", // TypeScript 推荐规则（如果使用 TS）
    "plugin:prettier/recommended", // 使用 prettier 插件配置规则
  ],
  plugins: [
    "react", // React 插件（如果是 React 项目）
    "@typescript-eslint", // TypeScript 插件（如果使用 TS）
    "prettier", // Prettier 插件
  ],
  rules: {
    "prettier/prettier": "error", // Prettier 错误时会在 ESLint 中报错
    "react/react-in-jsx-scope": "off", // React 17+ 中不再需要该规则
    "@typescript-eslint/no-unused-vars": "warn", // 示例规则
    // 你可以根据需要在这里配置 ESLint 规则
  },
  env: {
    browser: true, // 如果是浏览器环境
    node: true, // 如果是 Node.js 环境
  },
  settings: {
    react: {
      version: "detect", // 自动检测 React 版本
    },
  },
  extends: [
    "plugin:prettier/recommended", // 将 Prettier 集成到 ESLint 配置中
  ],
};
