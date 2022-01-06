import { getProviders, signIn } from 'next-auth/react';

const Login = ({ providers }) => {

    return (
        <div className='flex justify-center flex-col items-center min-h-screen bg-black w-full'>
            <img
                className="w-52 mb-5"
                src="/logo.png"
                alt="Spotify Clone Logo" />

            {  Object.values( providers ).map( provider => (
                <div key={ provider.name }>
                    <button
                        className='bg-[#18D860] text-white p-5 rounded-full hover:scale-110 transition-transform'
                        onClick={() => signIn( provider.id, { callbackUrl: "/" } )}>
                        Login with { provider.name }
                    </button>
                </div>
            ) )  }
        </div>
    )
}

export default Login;

export const getServerSideProps = async () => {
    const providers = await getProviders();
    // get all the Providers we specified in [...nextAuth].js

    return {
        props: {
            providers
        }
    }
}