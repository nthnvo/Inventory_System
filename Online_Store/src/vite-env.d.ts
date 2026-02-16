interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // เพิ่มตัวแปรอื่นถ้ามี เช่น:
  // readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
