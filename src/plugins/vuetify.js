// Styles
import "@mdi/font/css/materialdesignicons.min.css";
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
  {
    icons: {
      iconFont: "mdi",
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#82b1ff',
            secondary: '#82b1ff',
            accent: '#b6e3ff',
            error: '#ff8a65',
          }
        }
      }
    }
  }
)
