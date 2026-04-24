import { CurriculumFile } from './types';
import { LayoutData } from './types';
import { RouteData } from './types';
import { RenderOptions } from './types';
import { renderHtml } from './templates/matrix.html';

// ─── Ponto de entrada ─────────────────────────────────────────────────────────

export function generate(
  data: CurriculumFile,
  layout: LayoutData,
  routes: RouteData,
  options: RenderOptions = { linkStyle: 'paths' }
): string {
  return renderHtml(data, layout, routes, options);
}
