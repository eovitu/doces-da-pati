import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Comprime a foto no navegador antes de subir — sem isso, uma foto de
 * celular (3-8 MB) consome cota de banda a cada visita e deixa o site lento
 * no 4G, que é como a maioria dos clientes acessa (ver docs/ESPECIFICACAO.md
 * §7). Mira ~1600px no lado maior e ~250 KB em WebP.
 */
async function comprimir(arquivo: File): Promise<File> {
  return imageCompression(arquivo, {
    maxSizeMB: 0.25,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: "image/webp",
  });
}

/**
 * Sobe a foto de um produto pro Storage e devolve a URL pública. O nome do
 * arquivo inclui um timestamp para não colidir com o cache do navegador
 * quando a Patricia troca a foto do mesmo produto.
 */
export async function uploadFotoProduto(
  slug: string,
  arquivo: File
): Promise<{ url: string; path: string }> {
  const comprimida = await comprimir(arquivo);
  const path = `produtos/${slug}-${Date.now()}.webp`;
  const referencia = ref(storage, path);
  await uploadBytes(referencia, comprimida, { contentType: "image/webp" });
  const url = await getDownloadURL(referencia);
  return { url, path };
}
