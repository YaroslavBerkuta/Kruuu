module.exports = {
	root: true,
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	extends: ['lisk-base/ts'],
	ignorePatterns: ['ecosystem.config.js'],
	rules: {
		'@typescript-eslint/no-unsafe-assignment': ['off'],
		'@typescript-eslint/no-unsafe-member-access': ['off'],
		'@typescript-eslint/no-unsafe-call': ['off'],
		'@typescript-eslint/no-unsafe-return': ['off'],
		'@typescript-eslint/no-extraneous-class': ['off'],
		'@typescript-eslint/member-ordering': ['off'],
		'@typescript-eslint/explicit-member-accessibility': ['off'],
		'@typescript-eslint/no-namespace': ['off'],
		'@typescript-eslint/no-non-null-assertion': ['off'],
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/prefer-nullish-coalescing': ['off'],
		'@typescript-eslint/unbound-method': ['off'],
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/prefer-readonly': 'off',
		'@typescript-eslint/no-shadow': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/await-thenable': 'off',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/prefer-readonly': 'off',
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/prefer-optional-chain': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'prefer-promise-reject-errors': ['off'],
		'no-useless-constructor': ['off'],
		'import/no-unresolved': ['off'],
		'import/extensions': ['off'],
		'prefer-template': 'off',
		'import/order': 'off',
		'no-var': 'off',
		camelcase: 'off',
		'no-console': ['off'],
		'dot-notation': 'off',
		'max-classes-per-file': 'off',
		'no-param-reassign': 'off',
		'arrow-body-style': 'off',
		'default-case': 'off',
		'no-return-await': 'off',
		'array-callback-return': 'off',
		'prefer-const': 'off',
		'no-unneeded-ternary': 'off',
		'no-else-return': 'off',
		'spaced-comment': 'off',
		'no-return-assign': 'off',
		'object-shorthand': 'off',
		'import/no-duplicates': 'off',
		'no-empty': 'off',
		'import/no-cycle': 'off',
		'import/newline-after-import': 'off',
		'no-useless-return': 'off',
		eqeqeq: 'off',
		'import/no-extraneous-dependencies': 'off',
		'no-useless-escape': 'off',
		'no-plusplus': 'off',
		'prefer-destructuring': 'off',
		'guard-for-in': 'off',
		'no-restricted-syntax': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
	},
};
