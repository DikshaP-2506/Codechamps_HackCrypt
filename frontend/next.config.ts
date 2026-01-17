import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Proxy mental health API to backend
        {
          source: '/api/mental-health/:path*',
          destination: 'http://localhost:5000/api/mental-health/:path*',
        },
        // Proxy physical vitals to backend
        {
          source: '/api/physical-vitals/:path*',
          destination: 'http://localhost:5000/api/physical-vitals/:path*',
        },
        // Proxy prescriptions to backend
        {
          source: '/api/prescriptions/:path*',
          destination: 'http://localhost:5000/api/prescriptions/:path*',
        },
        // Proxy appointments to backend
        {
          source: '/api/appointments/:path*',
          destination: 'http://localhost:5000/api/appointments/:path*',
        },
        // Proxy notifications to backend
        {
          source: '/api/notifications/:path*',
          destination: 'http://localhost:5000/api/notifications/:path*',
        },
        // Proxy patients to backend
        {
          source: '/api/patients/:path*',
          destination: 'http://localhost:5000/api/patients/:path*',
        },
        // Proxy medical documents to backend
        {
          source: '/api/medical-documents/:path*',
          destination: 'http://localhost:5000/api/medical-documents/:path*',
        },
        // Proxy community to backend
        {
          source: '/api/community/:path*',
          destination: 'http://localhost:5000/api/community/:path*',
        },
        // Proxy users to backend
        {
          source: '/api/users/:path*',
          destination: 'http://localhost:5000/api/users/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
