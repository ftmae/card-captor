const isProduction = process.env.NODE_ENV === 'production';

export function setCookie(res, name, maxAge, token){
    res.cookie(name, token, {
        maxAge: maxAge,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'Lax'
    });
}

export function clearCookie(res, name, maxAge){
    res.clearCookie(name, {
        maxAge: maxAge,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'Lax'
    });
}