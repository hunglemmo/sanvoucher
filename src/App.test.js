import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Functions & Components ---

const formatCurrency = (number) => {
    if (isNaN(number) || number <= 0) return ''; // Return empty string if price is invalid or zero
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

// SVG Icons for self-containment
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015.255-2.193.5.5 0 00.49 0A3 3 0 0115 5v1.455a3.504 3.504 0 01-2.363 3.265l-2.559.927a.5.5 0 00-.156 0l-2.559-.927A3.504 3.504 0 015 6.455V5zm-2.293 6.118a.5.5 0 00-.447.276l-1.5 3A.5.5 0 001 15h18a.5.5 0 00.24-.906l-1.5-3a.5.5 0 00-.447-.276H2.707z" clipRule="evenodd" /></svg>;
const BankIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-2 9A1 1 0 003 18h14a1 1 0 00.994-1.11l-2-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" /></svg>;

// --- UI Components ---

const Notification = ({ message, type, show }) => {
    if (!show) return null;
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    return (
        <div className={`fixed top-5 right-5 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50`}>
            {message}
        </div>
    );
};

const ProductCard = ({ product }) => {
    const salePrice = Number(product.price) || 0;
    const originalPrice = Number(product.price_old) || (salePrice > 0 ? salePrice * 1.25 : 0);
    const discountPercentage = originalPrice > 0 && salePrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
    
    const commissionRate = parseFloat(product.commission) / 100 || 0.02;
    const coinReward = Math.floor((salePrice * commissionRate) / 100);

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
                <p className="text-sm text-gray-800 flex-grow mb-2 h-10 overflow-hidden">{mappedProduct.name}</p>
                <div className="mt-auto">
                    <p className="text-lg font-bold text-red-600 h-7">{formatCurrency(mappedProduct.salePrice)}</p>
                    {coinReward > 0 && (
                        <p className="text-xs text-green-600 font-semibold my-1">✨ Nhận đến {coinReward} xu</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>Đã bán {mappedProduct.soldCount > 1000 ? (mappedProduct.soldCount/1000).toFixed(1) + 'k' : mappedProduct.soldCount}</span>
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

// --- Modal Components (giữ nguyên) ---
const AdSimulationModal = ({ onReward, onClose }) => {
    const [countdown, setCountdown] = useState(15);
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else { onReward(); }
    }, [countdown, onReward]);
    return (<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"><div className="bg-black p-4 rounded-lg text-white w-full max-w-md mx-4 text-center"><p className="text-sm text-gray-400">Quảng cáo của đối tác</p><div className="my-8"><h3 className="text-2xl font-bold">Nhận ngay Voucher 50%</h3><p>Áp dụng cho mọi đơn hàng!</p></div><button onClick={onClose} disabled={countdown > 0} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed">{countdown > 0 ? `Bỏ qua trong ${countdown}s` : 'Cảm ơn!'}</button></div></div>);
};
const WithdrawalModal = ({ onClose, userCoins, showNotification }) => {
    const [amount, setAmount] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || parseInt(amount) <= 0) { showNotification("Vui lòng nhập số xu hợp lệ.", 'error'); return; }
        if (parseInt(amount) > userCoins) { showNotification("Số xu không đủ để rút!", 'error'); return; }
        if (parseInt(amount) < 2000) { showNotification("Số tiền rút tối thiểu là 2,000 xu.", 'error'); return; }
        showNotification("Yêu cầu rút tiền đã được gửi!", 'success');
        onClose();
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}><div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-center mb-4">Rút tiền</h3><div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm text-gray-700"><h4 className="font-bold mb-2">Thể lệ rút tiền:</h4><ul className="list-disc list-inside space-y-1"><li>Số xu rút tối thiểu: <span className="font-bold">2,000 xu</span>.</li><li>Tỷ giá quy đổi: <span className="font-bold">100 xu = 1,000đ</span>.</li><li>Thời gian xử lý: <span className="font-bold">1-3 ngày</span> làm việc.</li><li>Vui lòng đảm bảo thông tin tài khoản chính xác.</li></ul></div><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="Ngân hàng (VD: Vietcombank)" className="w-full p-2 border rounded" required /><input type="text" placeholder="Số tài khoản" className="w-full p-2 border rounded" required /><input type="text" placeholder="Tên chủ tài khoản" className="w-full p-2 border rounded" required /><div><input type="number" placeholder="Số xu muốn rút" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded" required /><p className="text-xs text-gray-500 mt-1">Số dư của bạn: {userCoins} xu</p></div><button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition">Xác nhận rút tiền</button></form></div></div>);
};

// Page: Login
const LoginPage = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [referralCode, setReferralCode] = useState('');
    const DEMO_REFERRAL_CODE = "SANDEAL123";
    const handleAuthAction = () => { if (!isLoginView && referralCode === DEMO_REFERRAL_CODE) { localStorage.setItem('referral_success', 'true'); } onLogin(); };
    return (<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4"><div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center"><h1 className="text-3xl font-bold text-gray-800 mb-2">{isLoginView ? 'Chào mừng!' : 'Tạo tài khoản'}</h1><p className="text-gray-500 mb-8">{isLoginView ? 'Đăng nhập để săn sale và tích xu.' : 'Điền thông tin để bắt đầu.'}</p><form onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }}><div className="space-y-4"><input type="text" placeholder="Tên đăng nhập" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/><input type="password" placeholder="Mật khẩu" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>{!isLoginView && (<><input type="password" placeholder="Nhập lại mật khẩu" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/><input type="text" placeholder="Mã giới thiệu (nếu có)" value={referralCode} onChange={e => setReferralCode(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}</div><button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">{isLoginView ? 'Đăng nhập' : 'Đăng ký'}</button></form><div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-400">Hoặc</span><div className="flex-grow border-t border-gray-300"></div></div><button onClick={handleAuthAction} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition"><GoogleIcon />{isLoginView ? 'Đăng nhập với Google' : 'Đăng ký với Google'}</button><p className="mt-8 text-sm">{isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}<button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-500 hover:underline">{isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}</button></p></div></div>);
};

// Page: Home
const HomePage = ({ products, isLoading, error, platformFilter, setPlatformFilter }) => {
    const [visibleProductCount, setVisibleProductCount] = useState(10);

    if (isLoading) {
        return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
    }
    if (error) {
        return <div className="p-4 text-center text-red-500">Lỗi: {error}. Hãy đảm bảo backend của bạn đang chạy.</div>;
    }
    
    const displayProducts = platformFilter 
        ? products.filter(p => p.domain && p.domain.includes(platformFilter))
        : products;

    if (platformFilter && displayProducts.length === 0) {
        return (
             <div className="bg-gray-100">
                <div className="p-3 bg-blue-100 text-blue-800 flex justify-between items-center">
                    <span className="font-semibold">Đang hiển thị deal từ: <span className="capitalize">{platformFilter}</span></span>
                    <button onClick={() => setPlatformFilter(null)} className="font-bold text-sm">Bỏ lọc</button>
                </div>
                <p className="text-center text-gray-500 mt-10">Không tìm thấy sản phẩm nào cho nền tảng này.</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-100">
            {platformFilter && (
                <div className="p-3 bg-blue-100 text-blue-800 flex justify-between items-center">
                    <span className="font-semibold">Đang hiển thị deal từ: <span className="capitalize">{platformFilter}</span></span>
                    <button onClick={() => setPlatformFilter(null)} className="font-bold text-sm">Bỏ lọc</button>
                </div>
            )}
            
            <div className="p-3 mt-4">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Gợi Ý Cho Bạn</h2>
                <div className="grid grid-cols-2 gap-3">
                    {displayProducts.slice(0, visibleProductCount).map(p => <ProductCard key={p.id || p.link} product={p} />)}
                </div>
                {visibleProductCount < displayProducts.length && (
                    <div className="text-center mt-6">
                        <button 
                            onClick={() => setVisibleProductCount(prev => prev + 10)} 
                            className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full shadow-sm hover:bg-gray-50 transition"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Page: Category
const CategoryPage = ({ availablePlatforms, setPlatformFilter, setCurrentPage }) => {
    const allPlatforms = [
        { name: 'Shopee', logo: 'https://placehold.co/200x100/ee4d2d/ffffff?text=Shopee', filter: 'shopee' },
        { name: 'Lazada', logo: 'https://placehold.co/200x100/0f146d/ffffff?text=Lazada', filter: 'lazada' },
        { name: 'Tiki', logo: 'https://placehold.co/200x100/1a94ff/ffffff?text=Tiki', filter: 'tiki' },
        { name: 'Sendo', logo: 'https://placehold.co/200x100/e31f26/ffffff?text=Sendo', filter: 'sendo' },
    ];

    const displayPlatforms = allPlatforms.filter(p => availablePlatforms.includes(p.filter));

    const handlePlatformClick = (filter) => {
        setPlatformFilter(filter);
        setCurrentPage('home');
    };

    return (
        <div className="p-3">
            <h2 className="text-2xl font-bold mb-4 text-center">Danh mục nền tảng</h2>
            <div className="grid grid-cols-2 gap-4">
                {displayPlatforms.length > 0 ? (
                    displayPlatforms.map(platform => (
                        <button key={platform.name} onClick={() => handlePlatformClick(platform.filter)} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                            <img src={platform.logo} alt={platform.name} className="w-full h-auto rounded-md" />
                        </button>
                    ))
                ) : (
                    <p className="col-span-2 text-center text-gray-500">Không có sản phẩm từ nền tảng nào.</p>
                )}
            </div>
        </div>
    );
};

// Page: Profile
const ProfilePage = ({ coins, onDailyLogin, onWatchAd, onLogout, canClaimDailyBonus, onWithdraw, onShareReferral }) => {
    const referralCode = "SANDEAL123";
    return (
        <div className="p-3 text-center">
            <h2 className="text-2xl font-bold mb-2">Tài khoản của bạn</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <p className="text-lg text-gray-600">Số xu hiện có:</p>
                <p className="text-5xl font-bold text-yellow-500 my-2 flex items-center justify-center gap-2"><CoinIcon /> {coins}</p>
            </div>
            <div className="space-y-3">
                <button onClick={onDailyLogin} disabled={!canClaimDailyBonus} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">{canClaimDailyBonus ? "Nhận thưởng đăng nhập (+10 xu)" : "Đã nhận thưởng hôm nay"}</button>
                <button onClick={onWatchAd} className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg">Xem quảng cáo (+5 xu)</button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mt-6 text-left">
                <h3 className="font-bold mb-3 text-lg flex items-center"><ShoppingBagIcon /> Thưởng Mua Hàng</h3>
                <p className="text-sm text-gray-600 mb-3">
                    Khi mua hàng thành công qua các liên kết trong app, bạn sẽ nhận được số xu thưởng tương ứng với từng sản phẩm. Số xu được tính dựa trên giá trị đơn hàng và tỷ lệ hoa hồng từ nhà bán hàng.
                </p>
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
                 <h3 className="font-bold mb-3 text-lg flex items-center"><BankIcon /> Rút tiền</h3>
                 <p className="text-sm text-gray-600 mb-3">Bạn có thể rút tiền về tài khoản ngân hàng khi có đủ 2,000 xu.</p>
                 <button onClick={onWithdraw} className="w-full bg-green-500 text-white font-bold py-2 rounded-lg">YÊU CẦU RÚT TIỀN</button>
            </div>

            <button onClick={onLogout} className="w-full mt-8 bg-red-500 text-white font-bold py-3 rounded-lg">Đăng xuất</button>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [products, setProducts] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [coins, setCoins] = useState(100);
    const [notification, setNotification] = useState({ message: '', show: false, type: 'info' });
    const [lastClaimed, setLastClaimed] = useState(localStorage.getItem('lastClaimedDate') || '');
    const [isAdVisible, setIsAdVisible] = useState(false);
    const [isWithdrawalVisible, setIsWithdrawalVisible] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [platformFilter, setPlatformFilter] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const backendUrl = 'https://affiliate-backend-gilt.vercel.app';
                const productsResponse = await fetch(`${backendUrl}/api/offers?limit=100`);
                if (!productsResponse.ok) throw new Error('Không thể kết nối đến backend.');
                const productsData = await productsResponse.json();
                const fetchedProducts = productsData.data || [];
                setProducts(fetchedProducts);

                const platformDomains = new Set(fetchedProducts.map(p => {
                    if (p.domain && p.domain.includes('shopee')) return 'shopee';
                    if (p.domain && p.domain.includes('lazada')) return 'lazada';
                    if (p.domain && p.domain.includes('tiki')) return 'tiki';
                    return null;
                }).filter(Boolean));
                setAvailablePlatforms([...platformDomains]);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const showNotification = (message, type = 'info') => {
        setNotification({ message, show: true, type });
        setTimeout(() => setNotification({ message: '', show: false, type: 'info' }), 2500);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        if (localStorage.getItem('referral_success') === 'true') {
            setCoins(c => c + 100);
            showNotification("Bạn nhận được 100 xu từ giới thiệu bạn bè!", 'success');
            localStorage.removeItem('referral_success');
        }
    };
    const handleLogout = () => setIsAuthenticated(false);

    const handleDailyLogin = () => {
        const canClaimDailyBonus = new Date().toLocaleDateString('vi-VN') !== lastClaimed;
        if (canClaimDailyBonus) {
            const today = new Date().toLocaleDateString('vi-VN');
            setCoins(c => c + 10);
            setLastClaimed(today);
            localStorage.setItem('lastClaimedDate', today);
            showNotification("Bạn nhận được 10 xu!", 'success');
        }
    };

    const handleWatchAd = () => setIsAdVisible(true);
    const handleAdReward = () => {
        setCoins(c => c + 5);
        showNotification("Cảm ơn đã xem! +5 xu", 'success');
        setIsAdVisible(false);
    };

    const handleShareReferral = async (code) => {
        const shareData = {
            title: "Mời bạn săn sale",
            text: `Nhận ngàn deal hot và tích xu đổi quà. Nhập mã giới thiệu của mình: ${code}`,
            url: window.location.href,
        };
        try {
            await navigator.share(shareData);
            showNotification("Đã chia sẻ!", 'info');
        } catch (err) {
            navigator.clipboard.writeText(`Tải app Săn Sale và nhập mã ${code} nhé!`);
            showNotification("Đã sao chép link giới thiệu!", 'info');
        }
    };

    const renderPage = () => {
        if (isLoading) {
            return <div className="p-4 text-center">Đang tải dữ liệu ứng dụng...</div>;
        }
        if (error) {
            return <div className="p-4 text-center text-red-500">Lỗi: {error}. Hãy đảm bảo backend của bạn đang chạy.</div>;
        }
        
        if (currentPage === 'profile' && !isAuthenticated) {
            return <LoginPage onLogin={handleLogin} />;
        }

        switch (currentPage) {
            case 'category':
                return <CategoryPage availablePlatforms={availablePlatforms} setPlatformFilter={setPlatformFilter} setCurrentPage={setCurrentPage} />;
            case 'profile':
                const canClaimDailyBonus = new Date().toLocaleDateString('vi-VN') !== lastClaimed;
                return <ProfilePage coins={coins} onDailyLogin={handleDailyLogin} onWatchAd={handleWatchAd} onLogout={handleLogout} canClaimDailyBonus={canClaimDailyBonus} onWithdraw={() => setIsWithdrawalVisible(true)} onShareReferral={handleShareReferral}/>;
            case 'home':
            default:
                return <HomePage products={products} isLoading={isLoading} error={error} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Notification message={notification.message} type={notification.type} show={notification.show} />
            {isAdVisible && <AdSimulationModal onReward={handleAdReward} onClose={() => setIsAdVisible(false)} />}
            {isWithdrawalVisible && <WithdrawalModal onClose={() => setIsWithdrawalVisible(false)} userCoins={coins} showNotification={showNotification}/>}

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
    );
}
