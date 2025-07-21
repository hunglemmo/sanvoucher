import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Giữ nguyên mã định danh mới này, đây là phần quan trọng nhất
  appId: 'com.hunglemmo.sanvoucher.rewards',
  
  // Sử dụng tên mới rõ ràng hơn để gửi cho Google Play
  appName: 'Săn Voucher - Đổi Thưởng',
  
  // Thư mục chứa code web đã được build
  webDir: 'build',
  
  // Cấu hình này quan trọng để Capacitor hoạt động đúng trên Android
  server: {
    androidScheme: 'https'
  },

  // Giữ nguyên cấu hình plugin GoogleAuth vì bạn vẫn dùng chung một dự án Google Cloud
  plugins: {
    GoogleAuth: {
      scopes: [ "profile", "email" ],
      serverClientId: "991037706084-dhjn52nv5tpjnsesjhnd2th22guppopb.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
