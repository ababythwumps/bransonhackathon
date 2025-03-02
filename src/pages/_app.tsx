import { type AppType } from "next/dist/shared/lib/utils";
import CustomHead from "../components/CustomHead";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <CustomHead />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
