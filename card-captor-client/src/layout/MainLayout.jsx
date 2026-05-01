import { Navigate, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import Header from '../shared/components/Header/Header.jsx';
import Footer from '../shared/components/Footer/Footer.jsx';
export default function MainLayout(){
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}
        </>
    )
}