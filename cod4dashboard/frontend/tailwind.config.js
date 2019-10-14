module.exports = {
  theme: {
    extend: {},
    customForms: theme => ({
      default: {
        input: {
          backgroundColor: theme('colors.gray.100'),
          borderColor: theme('colors.gray.800')
        }
      }
    })
  },
  variants: {},
  plugins: [require('@tailwindcss/custom-forms')]
};
