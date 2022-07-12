const {
    resolve
} = require("path");
const root = resolve(__dirname, "..");
// busca o diretorio padrão do sistema
const rootConfig = require(`${root}/jest.config.js`);
// busca a configuração global dos testes

module.exports = {
    ...rootConfig,
    ...{
        rootDir: root,
        display: "end2end-tests",
        // essa categoria de testes tera esse nome 
        setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
        testMatch: ["<rootDir>/test/**/*.test.ts"]
    },
};