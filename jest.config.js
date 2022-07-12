// arquivo de configuração do just para falar com TS

const { resolve } = require("path");
// busca o path para acessar os arquivos
const root = resolve(__dirname);
// busca o diretorio do arquivo

module.exports = {
    rootDir: root,
    // aponta para o diretorio do arquivo
    displayName: "root-tests",
    // nome que aparecera do lado em testes
    // se esse arquivo for utilizado
    // importante para separar qual teste está sendo 
    // executado, exemplo Esse é o arquivo global
    // caso exista uma configuração local 
    //  o nome do display será outro
    testMatch: ['<rootDir>/src/**/*.test.js'],
    //
    testEnvironment: "node",
    clearMocks: true,
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
        '@test/(.*)': '<rootDir>/test/$1',
    },
};