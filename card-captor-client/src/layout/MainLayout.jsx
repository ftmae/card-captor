import { Navigate, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import Header from '../shared/components/Header/Header.jsx';
import Footer from '../shared/components/Footer/Footer.jsx';
import { useLoaderData } from 'react-router';

export default function MainLayout(){
    const user = useLoaderData();
    return (
        <div className='flex-column min-height-100vh'>
            <Header user={user}/>
            <main className='flex-grow-1'>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}