module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'], // Your TypeScript files extension

            // As mentioned in the comments, you should extend TypeScript plugins here,
            // instead of extending them outside the `overrides`.
            // If you don't want to extend any rules, you don't need an `extends` attribute.
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            rules: {
                "import/extensions": 0,
                "import/no-extraneous-dependencies":0,
                "semi": ["error", "always"],
                "quotes": [2, "single", { "avoidEscape": true }],
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/no-unsafe-argument": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unsafe-call": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/indent": 0,
                "@typescript-eslint/no-inferrable-types": [
                    "warn", {
                        "ignoreParameters": true
                    }
                ],
                "@typescript-eslint/no-unused-vars": "warn"
            },

            parserOptions: {
                project: ['./tsconfig.json'], // Specify it only for TypeScript files
            },
        },
    ],
    rules: {
        "import/extensions": 0,
        "import/no-extraneous-dependencies":0,
        "semi": ["error", "always"],
        "quotes": [2, "single", { "avoidEscape": true }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/indent": 0,
        "@typescript-eslint/no-inferrable-types": [
            "warn", {
                "ignoreParameters": true
            }
        ],
        "@typescript-eslint/no-unused-vars": "warn"
    },
    settings: {
        'jest': {
            globalAliases: {
                describe: ["context"],
                fdescribe: ["fcontext"],
                xdescribe: ["xcontext"]
            }
        }
    }
};
