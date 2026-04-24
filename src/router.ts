import { CurriculumFile, RequirementInput, Point, ArrowRoute, RouteData, LayoutData, CardRect } from './types';
import { findCard, COL_GAP, ROW_GAP } from './layout';

// ─── Ponto de entrada ─────────────────────────────────────────────────────────

export function computeRoutes(data: CurriculumFile, layout: LayoutData): RouteData {
  const arrows: ArrowRoute[] = [];

  const outgoingByFrom = new Map<string, number[]>();
  const incomingByTo = new Map<string, number[]>();

  data.requirements.forEach((req, index) => {
    if (req.type === 'credit_requirement') return;
    if (!req.from) return;

    const out = outgoingByFrom.get(req.from) ?? [];
    out.push(index);
    outgoingByFrom.set(req.from, out);

    const incoming = incomingByTo.get(req.to) ?? [];
    incoming.push(index);
    incomingByTo.set(req.to, incoming);
  });

  // Ordena os "irmãos" por posição vertical para reduzir cruzamentos.
  for (const [fromCode, siblings] of outgoingByFrom.entries()) {
    siblings.sort((a, b) => {
      const reqA = data.requirements[a];
      const reqB = data.requirements[b];
      const toYA = courseCenterY(layout, reqA.to);
      const toYB = courseCenterY(layout, reqB.to);
      if (toYA !== toYB) return toYA - toYB;
      return a - b;
    });
    outgoingByFrom.set(fromCode, siblings);
  }

  for (const [toCode, siblings] of incomingByTo.entries()) {
    siblings.sort((a, b) => {
      const reqA = data.requirements[a];
      const reqB = data.requirements[b];
      const fromYA = reqA.from ? courseCenterY(layout, reqA.from) : Number.POSITIVE_INFINITY;
      const fromYB = reqB.from ? courseCenterY(layout, reqB.from) : Number.POSITIVE_INFINITY;
      if (fromYA !== fromYB) return fromYA - fromYB;
      return a - b;
    });
    incomingByTo.set(toCode, siblings);
  }

  data.requirements.forEach((req, index) => {
    if (req.type === 'credit_requirement') return;
    if (!req.from) return;

    const fromCard = findCard(layout, req.from);
    const toCard   = findCard(layout, req.to);
    if (!fromCard || !toCard) return;

    const laneOffsets = {
      source: laneOffset(index, outgoingByFrom.get(req.from) ?? []),
      target: laneOffset(index, incomingByTo.get(req.to) ?? []),
    };

    const points = routeArrow(fromCard, toCard, req, layout, laneOffsets);
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
  layout: LayoutData,
  laneOffsets: { source: number; target: number }
): Point[] {
  if (req.type === 'corequisite') {
    return routeCorequisite(from, to, laneOffsets);
  }
  return routeForwardArrow(from, to, layout, laneOffsets);
}

function routeForwardArrow(
  from: CardRect,
  to: CardRect,
  layout: LayoutData,
  laneOffsets: { source: number; target: number }
): Point[] {
  const startX = from.x + from.width;
  const startY = clamp(
    from.y + from.height / 2 + laneOffsets.source,
    from.y + 8,
    from.y + from.height - 8
  );

  const endX = to.x;
  const endY = clamp(
    to.y + to.height / 2 + laneOffsets.target,
    to.y + 8,
    to.y + to.height - 8
  );

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

function routeCorequisite(
  from: CardRect,
  to: CardRect,
  laneOffsets: { source: number; target: number }
): Point[] {
  // Seta vertical: da borda inferior da origem até a borda superior do destino
  const startX = clamp(
    from.x + from.width / 2 + laneOffsets.source,
    from.x + 8,
    from.x + from.width - 8
  );
  const startY = from.y + from.height;

  const endX = clamp(
    to.x + to.width / 2 + laneOffsets.target,
    to.x + 8,
    to.x + to.width - 8
  );
  const endY = to.y;

  const midY = startY + ROW_GAP / 2 + (laneOffsets.source - laneOffsets.target) * 0.35;

  return [
    { x: startX, y: startY },
    { x: startX, y: midY   },
    { x: endX,   y: midY   },
    { x: endX,   y: endY   },
  ];
}

function laneOffset(index: number, siblings: number[]): number {
  if (siblings.length <= 1) return 0;

  const pos = siblings.indexOf(index);
  if (pos === -1) return 0;

  const spacing = 8;
  const center = (siblings.length - 1) / 2;
  return (pos - center) * spacing;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function courseCenterY(layout: LayoutData, courseCode: string): number {
  const card = findCard(layout, courseCode);
  if (!card) return Number.POSITIVE_INFINITY;
  return card.y + card.height / 2;
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
