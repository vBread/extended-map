import { Config } from '@jest/types';

export default <Config.InitialOptions>{
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['jest-extended']
};
