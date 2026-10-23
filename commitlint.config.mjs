export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix']],
    'header-max-length': [2, 'always', 40],
  },
};
