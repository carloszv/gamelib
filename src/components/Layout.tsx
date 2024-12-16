import Head from 'next/head';

type LayoutProps = {
    title: string
    children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
    return (
        <>
            <Head>
                <title>{props.title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {props.children}
        </>
    );
};

export default Layout;