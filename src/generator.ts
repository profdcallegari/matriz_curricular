import { CurriculumFile } from './types';
import { LayoutData } from './types';
import { RouteData } from './types';
import { renderHtml } from './templates/matrix.html';

// ─── Ponto de entrada ─────────────────────────────────────────────────────────

export function generate(
  data: CurriculumFile,
  layout: LayoutData,
  routes: RouteData
): string {
  return renderHtml(data, layout, routes);
}
