import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
 root:'web-client',base:'/xiyue-food/',publicDir:'../public',plugins:[react()],
 define:{'import.meta.env.VITE_KITCHEN_API_URL':JSON.stringify('https://xiyue-family-kitchen.pureturaco.chatgpt.site')},
 build:{outDir:'../docs',emptyOutDir:true},
});
