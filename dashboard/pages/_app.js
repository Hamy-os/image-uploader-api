import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import AuthContextProvider from "./context/AuthContext";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
config.autoAddCss = false;

library.add(fab, fas)

function MyApp({ Component, pageProps }) {

  return (
    <div>
    <AuthContextProvider>
      <ToastContainer />
      <Component {...pageProps} />
    </AuthContextProvider>
    </div>
  )
}

export default MyApp
