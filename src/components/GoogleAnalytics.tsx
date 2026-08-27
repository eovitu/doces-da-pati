import Script from "next/script";
import { GA_ID, analyticsHabilitado } from "@/lib/analytics";
import { CHAVE_CONSENTIMENTO } from "./ConsentBanner";

/**
 * Sem NEXT_PUBLIC_GA_ID configurado, nada é renderizado — nenhum ID é
 * inventado. Também não carrega em desenvolvimento, só em produção.
 *
 * O Consent Mode v2 é resolvido dentro do próprio script inline, antes do
 * gtag.js carregar: lê a escolha salva (se houver) e só concede
 * analytics_storage quando a cliente já tiver aceitado antes. Sem escolha
 * salva, o padrão é sempre negado.
 */
export function GoogleAnalytics() {
  if (!analyticsHabilitado || !GA_ID) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          var consentimentoSalvo = null;
          try { consentimentoSalvo = window.localStorage.getItem("${CHAVE_CONSENTIMENTO}"); } catch (e) {}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: consentimentoSalvo === 'granted' ? 'granted' : 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
