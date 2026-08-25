import styled from "styled-components";
import { getProdutos } from "@/lib/produtos";
import { lojaInfoMock } from "@/data/produtos-mock";
import { ProdutoCard } from "@/components/ProdutoCard";
import { linkContatoWhatsapp } from "@/lib/whatsapp";
import { theme, media } from "@/styles/theme";

const Page = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
`;

const Header = styled.header`
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
`;

const HeaderInner = styled.div`
  margin: 0 auto;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  text-align: center;

  ${media.desktop} {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  }
`;

const Titulo = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${theme.colors.textPrimary};

  ${media.desktop} {
    font-size: 2.25rem;
  }
`;

const Descricao = styled.p`
  max-width: 32rem;
  color: ${theme.colors.textSecondary};
`;

const InfoLoja = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textMuted};
`;

const BotaoWhatsapp = styled.a`
  margin-top: ${theme.spacing.xs};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.accent};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  transition: background-color 0.15s ease;

  &:hover {
    background: ${theme.colors.accentHover};
  }
`;

const Main = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1440px;
  padding: ${theme.spacing.lg} ${theme.spacing.md};

  ${media.desktop} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const SecaoTitulo = styled.h2`
  margin-bottom: ${theme.spacing.md};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing.lg};
  }

  ${media.desktopLarge} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const Footer = styled.footer`
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg} 0;
  text-align: center;
  font-size: 0.875rem;
  color: ${theme.colors.textMuted};
`;

export default async function Home() {
  const produtos = await getProdutos();
  const loja = lojaInfoMock; // trocar por dados vindos do Firebase quando existir a coleção "loja"

  return (
    <Page>
      <Header>
        <HeaderInner>
          <Titulo>{loja.nome}</Titulo>
          <Descricao>{loja.descricaoCurta}</Descricao>
          <InfoLoja>
            {loja.cidade} · {loja.horarios}
          </InfoLoja>
          <BotaoWhatsapp
            href={linkContatoWhatsapp(loja.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </BotaoWhatsapp>
        </HeaderInner>
      </Header>

      <Main>
        <SecaoTitulo>Nossos produtos</SecaoTitulo>
        <Grid>
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} whatsapp={loja.whatsapp} />
          ))}
        </Grid>
      </Main>

      <Footer>{loja.nome} · Pedidos pelo WhatsApp</Footer>
    </Page>
  );
}
