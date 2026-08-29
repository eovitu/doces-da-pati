"use client";

import Link from "next/link";
import styled from "styled-components";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { theme, media } from "@/styles/theme";

const Page = styled.main`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  position: relative;
  padding: 8.5rem ${theme.spacing.md} ${theme.spacing.lg};

  ${media.tablet} {
    justify-content: center;
    overflow: hidden;
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const Header = styled.div`
  position: absolute;
  top: ${theme.spacing.lg};
  left: ${theme.spacing.md};
  right: ${theme.spacing.md};

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.sm};

  ${media.tablet} {
    top: ${theme.spacing.xl};
    left: ${theme.spacing.lg};
    right: ${theme.spacing.lg};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;

  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.produto};
  letter-spacing: -0.02em;
  color: ${theme.colors.ink};

  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.accent};
  }
`;

const SmallLabel = styled.span`
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.colors.inkMuted};
`;

const Content = styled.div`
  width: 100%;
  max-width: ${theme.maxWidth};
  margin: 0 auto;

  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: ${theme.spacing.md};

  ${media.tablet} {
    gap: ${theme.spacing.xl};
  }

  ${media.desktop} {
    grid-template-columns: 1.15fr 0.85fr;
    gap: ${theme.spacing.xxxl};
  }
`;

const Copy = styled.div`
  position: relative;
  z-index: 2;
`;

const Eyebrow = styled.p`
  margin-bottom: ${theme.spacing.sm};

  font-size: ${theme.fontSize.micro};
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${theme.colors.accent};

  ${media.tablet} {
    margin-bottom: ${theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: clamp(4.5rem, 25vw, 7rem);
  line-height: 0.82;
  letter-spacing: -0.065em;
  color: ${theme.colors.ink};

  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 96;

  span {
    color: ${theme.colors.accent};
  }

  ${media.tablet} {
    font-size: clamp(4.5rem, 19vw, 13rem);
    line-height: 0.78;
  }

  ${media.desktop} {
    font-size: clamp(7rem, 12vw, 12rem);
  }
`;

const Heading = styled.h2`
  max-width: 11ch;
  margin-top: ${theme.spacing.md};

  font-size: clamp(1.75rem, 8.5vw, 2.25rem);
  letter-spacing: -0.035em;

  ${media.tablet} {
    margin-top: ${theme.spacing.lg};
    font-size: clamp(2rem, 5vw, 4rem);
  }
`;

const Description = styled.p`
  max-width: 38ch;
  margin-top: ${theme.spacing.md};

  font-size: ${theme.fontSize.body};
  line-height: 1.5;
  color: ${theme.colors.inkSoft};

  ${media.tablet} {
    font-size: ${theme.fontSize.lead};
    line-height: normal;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: ${theme.spacing.md};
  padding: 0.875rem 1.5rem;

  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #fff;

  font-size: ${theme.fontSize.small};
  font-weight: 600;
  letter-spacing: 0.02em;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${theme.colors.accentHover};
    transform: translateY(-2px);
  }

  ${media.tablet} {
    margin-top: ${theme.spacing.lg};
  }
`;

const Illustration = styled.div`
  position: relative;
  width: min(68vw, 230px);
  aspect-ratio: 1;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  ${media.tablet} {
    width: min(100%, 440px);
  }

  ${media.desktop} {
    width: min(100%, 500px);
  }
`;

const Orb = styled.div`
  position: absolute;
  width: 72%;
  aspect-ratio: 1;

  border-radius: 50%;
  background: ${theme.colors.accentSoft};

  transform: translate(5%, -2%);
`;

const Plate = styled.div`
  position: absolute;
  width: 68%;
  aspect-ratio: 1;

  border-radius: 50%;

  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.line};

  box-shadow:
    0 20px 50px rgba(46, 30, 26, 0.08),
    0 4px 12px rgba(46, 30, 26, 0.05);

  transform: rotate(-7deg);
`;

const Cake = styled.div`
  position: relative;
  z-index: 2;

  width: 42%;
  aspect-ratio: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #fff;
  border: 1px solid ${theme.colors.line};

  box-shadow:
    0 18px 40px rgba(46, 30, 26, 0.12),
    0 4px 10px rgba(46, 30, 26, 0.06);

  transform: translateY(-3%);
`;

const CakeInner = styled.div`
  width: 72%;
  aspect-ratio: 1;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 35% 30%,
      #fff 0%,
      #f9e9df 38%,
      #e9c3b3 100%
    );

  border: 1px solid #e2c4b7;

  position: relative;

  &::before {
    content: "";
    position: absolute;

    width: 25%;
    aspect-ratio: 1;

    top: 18%;
    left: 24%;

    border-radius: 50%;

    background: ${theme.colors.accent};

    box-shadow:
      38px 18px 0 -3px #d94172,
      16px 43px 0 -5px #a91052;
  }
`;

const Cherry = styled.div`
  position: absolute;
  z-index: 4;

  width: 12%;
  aspect-ratio: 1;

  border-radius: 50%;

  background: ${theme.colors.accent};

  top: 20%;
  right: 25%;

  box-shadow: inset -3px -3px 5px rgba(46, 30, 26, 0.18);

  &::after {
    content: "";

    position: absolute;
    width: 70%;
    height: 45%;

    border-top: 2px solid ${theme.colors.inkSoft};
    border-radius: 50%;

    top: -25%;
    left: 50%;

    transform: rotate(-35deg);
    transform-origin: left center;
  }
`;

const Crumb = styled.span`
  position: absolute;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: ${theme.colors.accent};

  opacity: 0.7;

  &:nth-child(1) {
    top: 16%;
    left: 12%;
  }

  &:nth-child(2) {
    top: 70%;
    left: 10%;
    width: 5px;
    height: 5px;
  }

  &:nth-child(3) {
    top: 78%;
    right: 12%;
    width: 9px;
    height: 9px;
  }

  &:nth-child(4) {
    top: 12%;
    right: 10%;
    width: 5px;
    height: 5px;
  }
`;

const FooterNote = styled.p`
  margin-top: ${theme.spacing.lg};

  font-size: ${theme.fontSize.micro};
  color: ${theme.colors.inkMuted};

  ${media.tablet} {
    position: absolute;
    left: ${theme.spacing.lg};
    bottom: ${theme.spacing.xl};
    margin-top: 0;
  }
`;

export default function NotFound() {
  const pageRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLHeadingElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    const number = numberRef.current;
    const illustration = illustrationRef.current;

    if (!page || !number || !illustration) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .fromTo(
          number,
          {
            opacity: 0,
            y: 35,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
          }
        )
        .fromTo(
          illustration,
          {
            opacity: 0,
            scale: 0.92,
            rotate: 3,
          },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
          },
          "-=0.55"
        );

      gsap.to(illustration, {
        y: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <Page ref={pageRef}>
      <Header>
        <Logo href="/">Os Doces da Pati</Logo>
        <SmallLabel>404 · Página não encontrada</SmallLabel>
      </Header>

      <Content>
        <Copy>
          <Eyebrow>Ops... esse doce sumiu</Eyebrow>

          <Title ref={numberRef} aria-label="Erro 404">
            4<span>0</span>4
          </Title>

          <Heading>
            Essa página não está na vitrine.
          </Heading>

          <Description>
            Parece que o endereço que você procurou não existe mais ou foi
            digitado de um jeitinho diferente.
          </Description>

          <BackButton href="/">Voltar para a vitrine</BackButton>
        </Copy>

        <Illustration ref={illustrationRef} aria-hidden="true">
          <Orb />
          <Plate />

          <Cake>
            <CakeInner />
          </Cake>

          <Cherry />

          <Crumb />
          <Crumb />
          <Crumb />
          <Crumb />
        </Illustration>
      </Content>

      <FooterNote>
        Feito com carinho · Os Doces da Pati
      </FooterNote>
    </Page>
  );
}
