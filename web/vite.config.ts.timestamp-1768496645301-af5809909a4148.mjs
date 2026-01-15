// vite.config.ts
import { defineConfig } from "file:///C:/Users/sebas/OneDrive/Desktop/Programacion/Software%20Miticultor/web/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/sebas/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/lineas": "http://localhost:8080",
      "/semillas": "http://localhost:8080",
      "/compras-semilla": "http://localhost:8080",
      "/cosechas": "http://localhost:8080",
      "/ventas": "http://localhost:8080",
      "/medidas": "http://localhost:8080",
      "/api/status": "http://localhost:8080",
      "/reportes": "http://localhost:8080",
      "/comparativo-nota": "http://localhost:8080",
      "/export": "http://localhost:8080"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzZWJhc1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFByb2dyYW1hY2lvblxcXFxTb2Z0d2FyZSBNaXRpY3VsdG9yXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc2ViYXNcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxQcm9ncmFtYWNpb25cXFxcU29mdHdhcmUgTWl0aWN1bHRvclxcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3NlYmFzL09uZURyaXZlL0Rlc2t0b3AvUHJvZ3JhbWFjaW9uL1NvZnR3YXJlJTIwTWl0aWN1bHRvci93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2xpbmVhcyc6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICAnL3NlbWlsbGFzJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICcvY29tcHJhcy1zZW1pbGxhJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICcvY29zZWNoYXMnOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICAgICAgJy92ZW50YXMnOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICAgICAgJy9tZWRpZGFzJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICcvYXBpL3N0YXR1cyc6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICAnL3JlcG9ydGVzJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICcvY29tcGFyYXRpdm8tbm90YSc6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICAnL2V4cG9ydCc6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdaLFNBQVMsb0JBQW9CO0FBQzdhLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBLE1BQ1gsYUFBYTtBQUFBLE1BQ2Isb0JBQW9CO0FBQUEsTUFDcEIsYUFBYTtBQUFBLE1BQ2IsV0FBVztBQUFBLE1BQ1gsWUFBWTtBQUFBLE1BQ1osZUFBZTtBQUFBLE1BQ2YsYUFBYTtBQUFBLE1BQ2IscUJBQXFCO0FBQUEsTUFDckIsV0FBVztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
