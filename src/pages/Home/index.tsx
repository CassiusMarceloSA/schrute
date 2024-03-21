import React from 'react'

const Home = () => (
    <div className='p-2 h-screen w-screen color text-red-700 grid grid-cols-10 gap-2 grid-rows-12'>
        <nav className='rounded-lg flex items-center justify-center col-start-1 col-end-3 bg-cyan-700 row-start-1 row-end-10' >
            Aside Here
        </nav>
        <main className='rounded-lg flex items-center justify-center bg-green-600 col-start-3 col-end-13 row-start-1 row-end-10 ' >
            Main content here
        </main>
        <footer className='rounded-lg flex items-center justify-center row-start-10 row-end-13 col-start-1 col-end-13 bg-slate-500' >Footer here</footer>
    </div>

)

export default Home
