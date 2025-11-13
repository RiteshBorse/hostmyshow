export default {
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    transform: {},
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
    collectCoverageFrom: [
        "**/*.js",
        "!**/node_modules/**",
        "!**/tests/**"
    ],
    moduleFileExtensions: ["js", "json"]
};
