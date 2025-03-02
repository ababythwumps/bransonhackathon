import Head from 'next/head';

const CustomHead = () => {
  return (
    <Head>
      <link
        rel="preload"
        href="/CaskaydiaMonoNerdFont-ExtraLight.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
    </Head>
  );
};

export default CustomHead;