module.exports = {
	apps: [
		{
			name: "SkeletonM",
			script: "src/index.js",
			instances: "1", // Adjust as needed
			exec_mode: "cluster", // Use clustering for multiple instances
			env: {
				NODE_ENV: "production",
				PORT: 3000,
			},
		},
	],
};
