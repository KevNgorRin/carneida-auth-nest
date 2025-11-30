import typescript from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
        ignores: ['/dist', '/node_modules', '/build', '/test'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
                sourceType: 'module',
            },
        },
        plugins: {
            import: importPlugin,
            '@typescript-eslint': typescript,
            prettier: prettier,
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],
            'prettier/prettier': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin', // fs, path, etc.
                        'external', // npm packages
                        'internal', // @/ or alias
                        ['parent', 'sibling', 'index'],
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    'newlines-between': 'always',
                },
            ],
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
])
