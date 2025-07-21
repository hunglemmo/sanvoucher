import React, { useState, useEffect } from 'react';

// THÊM MỚI: Import thư viện AdMob
import { AdMob } from '@capacitor-community/admob';

// Import các thư viện Google Auth và Capacitor
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
// SỬA LẠI: Dùng thư viện GoogleSignIn mới
import { GoogleSignIn } from '@capacitor-community/google-sign-in';

// --- Helper Functions & SVG Icons ---
const formatCurrency = (number) => {
    if (isNaN(number) || number <= 0) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015.255-2.193.5.5 0 00.49 0A3 3 0 0115 5v1.455a3.504 3.504 0 01-2.363 3.265l-2.559.927a.5.5 0 00-.156 0l-2.559-.927A3.504 3.504 0 015 6.455V5zm-2.293 6.118a.5.5 0 00-.447.276l-1.5 3A.5.5 0 001 15h18a.5.5 0 00.24-.906l-1.5-3a.5.5 0 00-.447-.276H2.707z" clipRule="evenodd" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-2 9A1 1 0 003 18h14a1 1 0 00.994-1.11l-2-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" /></svg>;

// --- Các Component con (giữ nguyên, không thay đổi) ---

const ToastNotification = ({ message, type, show }) => {
    if (!show) return null;
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    return (<div className={`fixed top-5 right-5 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50`}>{message}</div>);
};

const ProductCard = ({ product }) => {
    const salePrice = Number(product.price) || 0;
    const originalPrice = Number(product.price_old) || (salePrice > 0 ? salePrice * 1.25 : 0);
    const discountPercentage = originalPrice > 0 && salePrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
    const commissionRate = parseFloat(product.commission) / 100 || 0.02;
    const coinReward = Math.floor((salePrice * commissionRate) / 10); // Tỷ lệ đổi xu mới
    let platformName = 'Khác';
    if (product.domain) {
        if (product.domain.includes('shopee')) platformName = 'Shopee';
        else if (product.domain.includes('lazada')) platformName = 'Lazada';
        else if (product.domain.includes('tiki')) platformName = 'Tiki';
    }
    const mappedProduct = {
        name: product.content || product.name,
        imageUrl: product.image || product.imageUrl,
        salePrice: salePrice,
        affiliateUrl: product.link || product.affiliateUrl,
        soldCount: product.sold_count || Math.floor(Math.random() * 1000) + 50,
        platform: platformName,
    };
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative border border-gray-100 transition-shadow hover:shadow-lg">
            {discountPercentage > 0 && (
                <div className="absolute top-0 right-0 bg-yellow-300 text-yellow-800 text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
                    - {discountPercentage}%
                </div>
            )}
            <a href={mappedProduct.affiliateUrl} target="_blank" rel="noopener noreferrer">
                <img src={mappedProduct.imageUrl} alt={mappedProduct.name} className="w-full h-40 object-cover" />
            </a>
            <div className="p-2 flex flex-col flex-grow">
                <p className="text-sm text-gray-800 flex-grow mb-2 h-14 overflow-hidden" title={mappedProduct.name}>
                    {mappedProduct.name}
                </p>
                <div className="mt-auto">
                    <p className="text-lg font-bold text-red-600 h-7">{formatCurrency(mappedProduct.salePrice)}</p>
                    {coinReward > 0 && (
                        <p className="text-xs text-green-600 font-semibold my-1">✨ Nhận đến {coinReward} xu</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>Đã bán {mappedProduct.soldCount > 1000 ? (mappedProduct.soldCount / 1000).toFixed(1) + 'k' : mappedProduct.soldCount}</span>
                        <span className="font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded">{mappedProduct.platform}</span>
                    </div>
                    <a href={mappedProduct.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-center text-sm font-bold py-2 px-4 rounded-lg transition">
                        Mua Ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

const RedemptionModal = ({ onClose, userCoins, showNotification, onRedemptionSuccess, backendUrl }) => {
    // ... nội dung không đổi
    const [cardType, setCardType] = useState('Viettel');
    const [amount, setAmount] = useState(10000);
    const [isLoading, setIsLoading] = useState(false);
    const cardOptions = [{ value: 10000, label: '10,000đ', coins: 1000 }, { value: 20000, label: '20,000đ', coins: 2000 }, { value: 50000, label: '50,000đ', coins: 5000 }, { value: 100000, label: '100,000đ', coins: 10000 },];
    const handleSubmit = async (e) => { e.preventDefault(); const requiredCoins = cardOptions.find(opt => opt.value === amount)?.coins || 0; if (userCoins < requiredCoins) { showNotification("Số xu của bạn không đủ.", 'error'); return; } setIsLoading(true); try { const token = localStorage.getItem('authToken'); if (!token) throw new Error("Vui lòng đăng nhập lại."); const response = await fetch(`${backendUrl}/api/redeem-card`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ cardType, amount }), }); const result = await response.json(); if (!response.ok || !result.success) { throw new Error(result.message || 'Có lỗi xảy ra.'); } showNotification(result.message, 'success'); onRedemptionSuccess(result.newCoins); onClose(); } catch (error) { showNotification(error.message, 'error'); } finally { setIsLoading(false); } };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}><div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-center mb-4">Đổi Thẻ Cào</h3><p className="text-center text-sm text-gray-600 mb-4">Thẻ sẽ được trả trong mục "Lịch sử" trong vòng 24 giờ.</p><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700">Chọn nhà mạng</label><select value={cardType} onChange={e => setCardType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"><option>Viettel</option><option>MobiFone</option><option>VinaPhone</option><option>Vietnamobile</option></select></div><div><label className="block text-sm font-medium text-gray-700">Chọn mệnh giá</label><select value={amount} onChange={e => setAmount(Number(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">{cardOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label} (Cần {opt.coins} xu)</option>))}</select></div><p className="text-xs text-gray-500 mt-1">Số dư của bạn: {userCoins} xu</p><button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition disabled:bg-gray-400" disabled={isLoading}>{isLoading ? 'Đang gửi...' : 'Xác nhận đổi'}</button></form></div></div>);
};

const RedemptionHistoryPage = ({ showNotification, backendUrl }) => {
    // ... nội dung không đổi
    const [history, setHistory] = useState([]); const [isLoading, setIsLoading] = useState(true); useEffect(() => { const fetchHistory = async () => { setIsLoading(true); try { const token = localStorage.getItem('authToken'); if (!token) throw new Error("Vui lòng đăng nhập lại."); const response = await fetch(`${backendUrl}/api/redemption-history`, { headers: { 'Authorization': `Bearer ${token}` } }); const result = await response.json(); if (!result.success) throw new Error(result.message); setHistory(result.data); } catch (error) { showNotification(error.message, 'error'); } finally { setIsLoading(false); } }; fetchHistory(); }, [showNotification, backendUrl]); const copyToClipboard = (text) => { navigator.clipboard.writeText(text); showNotification('Đã sao chép!', 'success'); };
    return (<div className="p-4"><h2 className="text-2xl font-bold mb-4 text-center">Lịch sử đổi thưởng</h2>{isLoading ? <p className="text-center">Đang tải...</p> : (<div className="space-y-4">{history.length === 0 ? <p className="text-center text-gray-500">Bạn chưa có lịch sử đổi thưởng nào.</p> : history.map(item => (<div key={item._id} className="bg-white p-4 rounded-lg shadow"><div className="flex justify-between items-center mb-2"><span className="font-bold">{item.cardType} - {formatCurrency(item.amount)}</span><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status === 'pending' ? 'Đang xử lý' : 'Thành công'}</span></div><p className="text-sm text-gray-500 mb-2">Ngày: {new Date(item.createdAt).toLocaleString('vi-VN')}</p>{item.status === 'completed' && item.cardCode && (<div className="bg-gray-100 p-2 rounded mt-2"><p className="text-sm">Mã thẻ: <strong className="font-mono">{item.cardCode}</strong> <button onClick={() => copyToClipboard(item.cardCode)} className="text-blue-500 text-xs ml-2">[SAO CHÉP]</button></p><p className="text-sm">Seri: <strong className="font-mono">{item.cardSerial}</strong> <button onClick={() => copyToClipboard(item.cardSerial)} className="text-blue-500 text-xs ml-2">[SAO CHÉP]</button></p></div>)}</div>))}</div>)}</div>);
};


const LoginPage = ({ onLogin, showNotification, backendUrl }) => {
    // ... nội dung không đổi
    const [isLoginView, setIsLoginView] = useState(true); const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [referralCode, setReferralCode] = useState(''); const [isLoading, setIsLoading] = useState(false); const handleAuthAction = async () => { setIsLoading(true); try { let response; let result; if (isLoginView) { response = await fetch(`${backendUrl}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), }); result = await response.json(); if (!response.ok || !result.success) { throw new Error(result.message || 'Đăng nhập thất bại.'); } showNotification(result.message, 'success'); onLogin(result); } else { if (password !== confirmPassword) { throw new Error('Mật khẩu nhập lại không khớp.'); } response = await fetch(`${backendUrl}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, referralCode }), }); result = await response.json(); if (!response.ok || !result.success) { throw new Error(result.message || 'Đăng ký thất bại.'); } showNotification(result.message, 'success'); setIsLoginView(true); } } catch (error) { showNotification(error.message, 'error'); } finally { setIsLoading(false); } }; const handleGoogleSuccess = async (token) => { setIsLoading(true); try { const res = await fetch(`${backendUrl}/api/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token }), }); const data = await res.json(); if (!res.ok || !data.success) { throw new Error(data.message || 'Đăng nhập Google thất bại'); } showNotification('Đăng nhập Google thành công!', 'success'); onLogin(data); } catch (err) { showNotification(err.message, 'error'); } finally { setIsLoading(false); } };
    
    // SỬA LẠI: handleNativeGoogleLogin để dùng GoogleSignIn
    const handleNativeGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const googleUser = await GoogleSignIn.signIn();
            if (googleUser && googleUser.idToken) {
                handleGoogleSuccess(googleUser.idToken);
            } else {
                throw new Error("Không nhận được thông tin người dùng từ Google.");
            }
        } catch (err) {
            showNotification('Đăng nhập Google thất bại.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4"><div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center"><h1 className="text-3xl font-bold text-gray-800 mb-2">{isLoginView ? 'Chào mừng!' : 'Tạo tài khoản'}</h1><p className="text-gray-500 mb-8">{isLoginView ? 'Đăng nhập để săn sale và tích xu.' : 'Điền thông tin để bắt đầu.'}</p><form onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }}><div className="space-y-4"><input type="text" placeholder="Tên đăng nhập" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={username} onChange={e => setUsername(e.target.value)} required /><input type="password" placeholder="Mật khẩu" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} required />{!isLoginView && (<><input type="password" placeholder="Nhập lại mật khẩu" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /><input type="text" placeholder="Mã giới thiệu (nếu có)" value={referralCode} onChange={e => setReferralCode(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></>)}</div><button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400" disabled={isLoading}>{isLoading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký')}</button></form><div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-400">Hoặc</span><div className="flex-grow border-t border-gray-300"></div></div><div className="flex justify-center">{Capacitor.isNativePlatform() ? (<button type="button" onClick={handleNativeGoogleLogin} disabled={isLoading} className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"><GoogleIcon /><span className="ml-3">Đăng nhập với Google</span></button>) : (<GoogleLogin onSuccess={credentialResponse => handleGoogleSuccess(credentialResponse.credential)} onError={() => { showNotification('Đăng nhập Google thất bại.', 'error'); }} useOneTap />)}</div><p className="mt-8 text-sm">{isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}<button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-500 hover:underline">{isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}</button></p></div></div>);
};

const CategoryPage = ({ availablePlatforms, setPlatformFilter, setCurrentPage }) => {
    // ... nội dung không đổi
    const allPlatforms = [ { name: 'Shopee', logo: 'https://placehold.co/400x200/EE4D2D/FFFFFF?text=Shopee', filter: 'shopee' }, { name: 'Lazada', logo: 'https://placehold.co/400x200/0F146D/FFFFFF?text=Lazada', filter: 'lazada' }, { name: 'Tiki', logo: 'https://placehold.co/400x200/1A94FF/FFFFFF?text=Tiki', filter: 'tiki' }, ]; const displayPlatforms = allPlatforms.filter(p => availablePlatforms.includes(p.filter)); const handlePlatformClick = (filter) => { setPlatformFilter(filter); setCurrentPage('home'); };
    return (<div className="p-3"><h2 className="text-2xl font-bold mb-4 text-center">Danh mục nền tảng</h2><div className="grid grid-cols-2 gap-4">{displayPlatforms.length > 0 ? (displayPlatforms.map(platform => (<button key={platform.name} onClick={() => handlePlatformClick(platform.filter)} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"><img src={platform.logo} alt={platform.name} className="w-full h-auto rounded-md object-contain aspect-[2/1]" /></button>))) : (<p className="col-span-2 text-center text-gray-500">Không có chiến dịch nào từ các nền tảng.</p>)}</div></div>);
};

const ProfilePage = ({ user, coins, onDailyLogin, onWatchAd, onLogout, canClaimDailyBonus, onRedeem, onShowHistory, onShareReferral, isAdLoading }) => {
    const referralCode = user ? user.referralCode : 'Đang tải...';
    return (
        <div className="p-3 text-center">
            <h2 className="text-2xl font-bold mb-2">Tài khoản của bạn</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <p className="text-lg text-gray-600">Số xu hiện có:</p>
                <p className="text-5xl font-bold text-yellow-500 my-2 flex items-center justify-center gap-2"><CoinIcon /> {coins}</p>
            </div>
            <div className="space-y-3">
                <button onClick={onDailyLogin} disabled={!canClaimDailyBonus} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">{canClaimDailyBonus ? "Nhận thưởng đăng nhập (+10 xu)" : "Đã nhận thưởng hôm nay"}</button>
                <button onClick={onWatchAd} disabled={isAdLoading} className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isAdLoading ? 'Đang tải quảng cáo...' : 'Xem quảng cáo (+5 xu)'}
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm mt-6 text-left">
                <h3 className="font-bold mb-3 text-lg flex items-center"><ShoppingBagIcon /> Thưởng Mua Hàng</h3>
                <p className="text-sm text-gray-600 mb-3">Khi mua hàng thành công qua các liên kết trong app, bạn sẽ nhận được số xu thưởng tương ứng với từng sản phẩm.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm mt-3 text-left">
                <h3 className="font-bold mb-3 text-lg flex items-center"><GiftIcon /> Mời bạn bè</h3>
                <p className="text-sm text-gray-600 mb-3">Mời bạn bè tải app và nhập mã của bạn để cả hai cùng nhận 100 xu!</p>
                <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between">
                    <span className="font-mono text-gray-700">{referralCode}</span>
                    <button onClick={() => onShareReferral(referralCode)} className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded">CHIA SẺ</button>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm mt-3 text-left">
                <h3 className="font-bold mb-3 text-lg flex items-center"><GiftIcon /> Đổi Thưởng</h3>
                <p className="text-sm text-gray-600 mb-3">Bạn có thể dùng xu để đổi lấy các phần quà hấp dẫn như thẻ cào điện thoại.</p>
                <button onClick={onRedeem} className="w-full bg-green-500 text-white font-bold py-2 rounded-lg">ĐỔI THƯỞNG NGAY</button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm mt-3 text-left">
                <h3 className="font-bold mb-3 text-lg flex items-center"><HistoryIcon /> Lịch sử</h3>
                <p className="text-sm text-gray-600 mb-3">Xem lại lịch sử các lần đổi thưởng của bạn.</p>
                <button onClick={onShowHistory} className="w-full bg-cyan-500 text-white font-bold py-2 rounded-lg">XEM LỊCH SỬ</button>
            </div>
            <button onClick={onLogout} className="w-full mt-8 bg-red-500 text-white font-bold py-3 rounded-lg">Đăng xuất</button>
        </div>
    );
};

const HomePage = ({ products, isLoading, error, platformFilter, setPlatformFilter, loadMore, hasMore, isLoadingMore }) => {
    // ... nội dung không đổi
    if (isLoading) { return <div className="p-4 text-center">Đang tải sản phẩm...</div>; } if (error) { return <div className="p-4 text-center text-red-500">{`Lỗi: ${error}. Hãy đảm bảo backend của bạn đang chạy.`}</div>; } const displayProducts = platformFilter ? products.filter(p => p.domain && p.domain.includes(platformFilter)) : products; if (displayProducts.length === 0 && !isLoading) { return (<div className="p-4 text-center text-gray-500 mt-10"><p>Không tìm thấy sản phẩm nào.</p><p className="text-sm mt-2">Có thể API của AccessTrade tạm thời không có dữ liệu hoặc API key của bạn chưa có chiến dịch nào được duyệt.</p>{platformFilter && <button onClick={() => setPlatformFilter(null)} className="mt-4 text-blue-500 font-semibold">Bỏ lọc</button>}</div>); }
    return (<div className="bg-gray-100">{platformFilter && (<div className="p-3 bg-blue-100 text-blue-800 flex justify-between items-center"><span className="font-semibold">Đang hiển thị deal từ: <span className="capitalize">{platformFilter}</span></span><button onClick={() => setPlatformFilter(null)} className="font-bold text-sm">Bỏ lọc</button></div>)}<div className="p-3 mt-4"><h2 className="text-xl font-bold mb-3 text-gray-800">Gợi Ý Cho Bạn</h2><div className="grid grid-cols-2 gap-3">{displayProducts.map(p => <ProductCard key={p.id || p.link} product={p} />)}</div><div className="text-center mt-6">{isLoadingMore && <p>Đang tải thêm...</p>}{!isLoadingMore && hasMore && (<button onClick={loadMore} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full shadow-sm hover:bg-gray-50 transition">Xem thêm</button>)}{!hasMore && <p className="text-gray-500">Bạn đã xem hết sản phẩm.</p>}</div></div></div>);
};


// --- Component App chính ---
export default function App() {
    const backendUrl = 'https://affiliate-backend-v2.vercel.app';
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [products, setProducts] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [coins, setCoins] = useState(0);
    const [notification, setNotification] = useState({ message: '', show: false, type: 'info' });
    const [canClaimBonus, setCanClaimBonus] = useState(false);
    // XÓA BỎ: isAdVisible
    // const [isAdVisible, setIsAdVisible] = useState(false);
    const [isRedemptionVisible, setIsRedemptionVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [platformFilter, setPlatformFilter] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isAdLoading, setIsAdLoading] = useState(false);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            // SỬA LẠI: Dùng GoogleSignIn
            GoogleSignIn.initialize();
            // THÊM MỚI: Khởi tạo AdMob
            AdMob.initialize({ requestTrackingAuthorization: true });
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    fetch(`${backendUrl}/api/offers?limit=20&page=1`),
                    fetch(`${backendUrl}/api/categories`)
                ]);

                if (!productsResponse.ok || !categoriesResponse.ok) {
                    throw new Error('Không thể tải dữ liệu ban đầu từ server.');
                }

                const productsData = await productsResponse.json();
                const categoriesData = await categoriesResponse.json();
                const fetchedProducts = productsData.data || [];
                setProducts(fetchedProducts);
                if (fetchedProducts.length < 20) { setHasMore(false); }
                setAvailablePlatforms(categoriesData.platforms || []);
            } catch (err) {
                setError(err.message);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [backendUrl]);

    const loadMoreProducts = async () => {
        // ... nội dung không đổi
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        const nextPage = page + 1;
        try {
            const response = await fetch(`${backendUrl}/api/offers?limit=20&page=${nextPage}`);
            const data = await response.json();
            const newProducts = data.data || [];
            setProducts(prevProducts => [...prevProducts, ...newProducts]);
            setPage(nextPage);
            if (newProducts.length < 20) { setHasMore(false); }
        } catch (err) {
            showNotification("Lỗi khi tải thêm sản phẩm", "error");
        } finally {
            setIsLoadingMore(false);
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, show: true, type });
        setTimeout(() => setNotification({ message: '', show: false, type: 'info' }), 3000);
    };

    const handleLogin = (data) => {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setCoins(data.user.coins);
        setCanClaimBonus(data.user.canClaimBonus);
        setCurrentPage('profile');
    };

    const handleLogout = () => {
        if (Capacitor.isNativePlatform()) {
            // SỬA LẠI: Dùng GoogleSignIn
            GoogleSignIn.signOut();
        }
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCoins(0);
        setCanClaimBonus(false);
        setCurrentPage('home');
    };

    const handleDailyLogin = async () => {
        // ... nội dung không đổi
        if (!canClaimBonus || !currentUser) return;
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("Vui lòng đăng nhập lại.");
            const response = await fetch(`${backendUrl}/api/user/claim-daily`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({}), });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            setCoins(result.newCoins);
            setCanClaimBonus(false);
            showNotification("Bạn nhận được 10 xu!", 'success');
        } catch (error) {
            showNotification(error.message || "Có lỗi xảy ra", 'error');
        }
    };

    // --- THÊM MỚI / SỬA LẠI TOÀN BỘ LOGIC QUẢNG CÁO ---

    const grantAdReward = async (amount) => {
        try {
            if (!currentUser) throw new Error("Bạn cần đăng nhập để thực hiện.");
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("Vui lòng đăng nhập lại.");
            
            const response = await fetch(`${backendUrl}/api/user/add-coins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amountToAdd: amount }),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Lỗi khi cộng xu.');
            }

            setCoins(result.newCoins);
            showNotification(`Bạn đã được cộng ${amount} xu!`, 'success');

        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleShowRewardedAd = async () => {
        if (isAdLoading) return;
        setIsAdLoading(true);

        const options = {
            adId: 'ca-app-pub-3940256099942544/5224354917', 
            isTesting: true,
        };

        try {
            AdMob.removeAllListeners();
            AdMob.addListener('onRewarded', (reward) => {
                console.log('Ad reward received:', reward);
                grantAdReward(5);
            });
            AdMob.addListener('onAdDismissed', () => {
                setIsAdLoading(false);
            });
            AdMob.addListener('onAdFailedToLoad', (error) => {
                showNotification('Không thể tải quảng cáo lúc này.', 'error');
                setIsAdLoading(false);
            });
            await AdMob.prepareRewarded(options);
            await AdMob.showRewarded();
        } catch (e) {
            console.error("Lỗi hiển thị quảng cáo:", e);
            showNotification('Không thể hiển thị quảng cáo.', 'error');
            setIsAdLoading(false);
        }
    };
    
    const handleShareReferral = async (code) => {
        // ... nội dung không đổi
        const shareData = { title: "Mời bạn săn sale", text: `Nhận ngàn deal hot và tích xu đổi quà. Nhập mã giới thiệu của mình: ${code}`, url: "https://play.google.com/store/apps/details?id=com.hunglemmo.sanvoucher.rewards", };
        try {
            if (navigator.share) { await navigator.share(shareData); } else { throw new Error('Web Share API not supported.'); }
        } catch (err) {
            navigator.clipboard.writeText(`Tải app Săn Voucher - Đổi Thưởng và nhập mã ${code} nhé! Link: ${shareData.url}`);
            showNotification("Đã sao chép link giới thiệu!", 'info');
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'category':
                return <CategoryPage availablePlatforms={availablePlatforms} setPlatformFilter={setPlatformFilter} setCurrentPage={setCurrentPage} />;
            case 'history':
                if (!isAuthenticated) return <LoginPage onLogin={handleLogin} showNotification={showNotification} backendUrl={backendUrl} />;
                return <RedemptionHistoryPage showNotification={showNotification} backendUrl={backendUrl} />;
            case 'profile':
                if (!isAuthenticated) {
                    return <LoginPage onLogin={handleLogin} showNotification={showNotification} backendUrl={backendUrl} />;
                }
                return <ProfilePage 
                    user={currentUser} 
                    coins={coins} 
                    onDailyLogin={handleDailyLogin} 
                    onWatchAd={handleShowRewardedAd} // SỬA LẠI: Gắn hàm mới
                    isAdLoading={isAdLoading}
                    onLogout={handleLogout} 
                    canClaimBonus={canClaimBonus}
                    onRedeem={() => setIsRedemptionVisible(true)}
                    onShowHistory={() => setCurrentPage('history')}
                    onShareReferral={handleShareReferral} 
                />;
            case 'home':
            default:
                return <HomePage 
                    products={products} 
                    isLoading={isLoading && products.length === 0}
                    error={error} 
                    platformFilter={platformFilter} 
                    setPlatformFilter={setPlatformFilter}
                    loadMore={loadMoreProducts}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                />;
        }
    };

    const GOOGLE_CLIENT_ID = "991037706084-dhjn52nv5tpjnsesjhnd2th22guppopb.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="bg-gray-100 min-h-screen font-sans">
                <ToastNotification message={notification.message} type={notification.type} show={notification.show} />
                
                {/* XÓA BỎ: Component quảng cáo giả lập */}
                {/* {isAdVisible && <AdSimulationModal onReward={handleAdReward} onClose={handleAdClose} />} */}
                
                {isRedemptionVisible && <RedemptionModal 
                    onClose={() => setIsRedemptionVisible(false)} 
                    userCoins={coins} 
                    showNotification={showNotification} 
                    onRedemptionSuccess={(newCoinTotal) => setCoins(newCoinTotal)} 
                    backendUrl={backendUrl}
                />}
                
                <main className="pb-20">
                    {renderPage()}
                </main>
                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md flex justify-around border-t">
                    {['home', 'category', 'profile'].map(page => {
                        const isActive = currentPage === page;
                        return (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`flex-1 py-2 px-1 flex flex-col items-center justify-center text-sm transition-colors ${isActive ? 'text-blue-500' : 'text-gray-600'}`}>
                                {page === 'home' && <HomeIcon />}
                                {page === 'category' && <CategoryIcon />}
                                {page === 'profile' && <UserIcon />}
                                <span className="mt-1">{page.charAt(0).toUpperCase() + page.slice(1)}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </GoogleOAuthProvider>
    );
}