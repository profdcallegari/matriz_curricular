import { CurriculumFile, RequirementInput, Point, ArrowRoute, RouteData, LayoutData, CardRect } from './types';
import { findCard, COL_GAP, ROW_GAP } from './layout';

// ─── Ponto de entrada ─────────────────────────────────────────────────────────

export function computeRoutes(data: CurriculumFile, layout: LayoutData): RouteData {
  const arrows: ArrowRoute[] = [];

  data.requirements.forEach((req, index) => {
    if (req.type === 'credit_requirement') return;
    if (!req.from) return;

    const fromCard = findCard(layout, req.from);
    const toCard   = findCard(layout, req.to);
    if (!fromCard || !toCard) return;

    const points = routeArrow(fromCard, toCard, req, layout);
    arrows.push({
      requirementIndex: index,
      type: req.type,
      points,
      label: req.type === 'special' ? (req.description ?? 'RE') : undefined,
    });
  });

  return { arrows };
}

// ─── Roteamento ortogonal ────────────────────────────────────────────────────
//
// Estratégia:
//   1. Sair pela borda direita do cartão de origem.
//   2. Percorrer o canal horizontal entre as colunas envolvidas.
//   3. Ajustar verticalmente no canal entre os cartões, se necessário.
//   4. Entrar pela borda esquerda do cartão de destino.
//
// Para co-requisitos (mesmo nível), sair pela borda inferior da origem
// e entrar pela borda superior do destino, usando o canal vertical entre eles.

function routeArrow(
  from: CardRect,
  to: CardRect,
  req: RequirementInput,
  layout: LayoutData
): Point[] {
  if (req.type === 'corequisite') {
    return routeCorequisite(from, to);
  }
  return routeForwardArrow(from, to, layout);
}

function routeForwardArrow(from: CardRect, to: CardRect, layout: LayoutData): Point[] {
  const startX = from.x + from.width;
  const startY = from.y + from.height / 2;

  const endX = to.x;
  const endY = to.y + to.height / 2;

  // Canal horizontal: meio do espaço entre as duas colunas
  const midX = findMidChannel(from, to, layout);

  if (startY === endY) {
    // Mesma altura: linha reta
    return [
      { x: startX, y: startY },
      { x: endX,   y: endY   },
    ];
  }

  // Rota em formato Z: saída → canal vertical → canal horizontal → entrada
  return [
    { x: startX, y: startY },
    { x: midX,   y: startY },
    { x: midX,   y: endY   },
    { x: endX,   y: endY   },
  ];
}

function routeCorequisite(from: CardRect, to: CardRect): Point[] {
  // Seta vertical: da borda inferior da origem até a borda superior do destino
  const startX = from.x + from.width / 2;
  const startY = from.y + from.height;

  const endX = to.x + to.width / 2;
  const endY = to.y;

  const midY = startY + ROW_GAP / 2;

  return [
    { x: startX, y: startY },
    { x: startX, y: midY   },
    { x: endX,   y: midY   },
    { x: endX,   y: endY   },
  ];
}

// Encontra o centro do canal horizontal entre a coluna de 'from' e a de 'to'.
function findMidChannel(from: CardRect, to: CardRect, layout: LayoutData): number {
  // Borda direita da coluna de origem
  const fromRight = from.x + from.width;
  // Borda esquerda da coluna de destino
  const toLeft = to.x;

  // O canal fica entre as duas borders; usamos o ponto médio.
  // Se houver colunas intermediárias, o ponto médio ainda é válido para uma
  // rota simples; roteamento mais sofisticado pode ser implementado aqui.
  const _ = layout; // referência mantida para uso futuro
  return fromRight + (toLeft - fromRight) / 2;
}
