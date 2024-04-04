module.exports = {
	apps: [
		{
			name: 'kruuu-core-local',
			script: './api.sh',
			watch: true,
			watch: ['./src/app', './src/lib'],
		},
	],
};
