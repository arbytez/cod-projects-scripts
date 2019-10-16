module.exports = {
  theme: {
    extend: {},
    customForms: theme => ({
      error: {
        input: {
          borderColor: theme('colors.red.600')
        }
      },
      default: {
        input: {
          backgroundColor: theme('colors.gray.200')
        }
      }
    })
  },
  variants: {},
  plugins: [require('@tailwindcss/custom-forms')]
};
