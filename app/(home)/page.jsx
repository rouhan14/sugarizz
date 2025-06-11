import React from 'react'
import CookieHero from '@/components/cookie'
import data from '@/data'

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>

            <div className='flex flex-col items-center justify-center w-full px-4 py-8 space-y-8'>
                {data.map((cookie, index) => (
                    <CookieHero
                        key={index}
                        title={cookie.title}
                        description={cookie.description}
                        price={cookie.price}
                        image={cookie.image}
                        bgColor={cookie.bgColor}
                        flip={index % 2 === 1} // alternate layout
                    />
                ))}

            </div>
        </div>
    )
}

export default Home