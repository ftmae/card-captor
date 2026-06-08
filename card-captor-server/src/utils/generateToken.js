import crypto from 'crypto';

export function generateRandomToken(){
    return new Promise(resolve => {
        crypto.randomBytes(21, (err, buffer)=>{
            if(err) throw err;
            const bufferHex = buffer.toString('hex');
            resolve(bufferHex);
        });
    });
}

export function hashToken(token){
    return crypto.createHash('sha256').update(token).digest('hex');
}