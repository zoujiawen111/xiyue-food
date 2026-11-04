# 玺月餐厅 UI v2 — Design QA

final result: passed

## Design target and intentional adaptation

Source: user-provided `/var/folders/tv/vmzjjh4n4wj4gwytd3h12l4m0000gn/T/codex-clipboard-feb1c0cd-d3ae-44e7-9129-8c7ea3438a96.png` (658×2239 native). The user requested a new mother-and-baby recipe UI inspired by its design style, not a pixel clone of the food-subscription product. We preserve pastel green/apricot card groups, bright food imagery, bold rounded visual hierarchy and generous rounded corners, while retaining this product's daily meals and family recipes. Subscription copy, third-party brand logos and device status bars are intentionally not reproduced.

## Evidence

- CSS viewport: 390×844. Captured with Codex in-app Browser.
- Initial rendered capture: `work/ui-initial.png`.
- Final full rendered capture: `work/ui-final-full.png` (390×1262, CSS pixel density 1).
- Final viewport capture: `outputs/xiyue-ui-v2.png` in the parent chat output directory.
- Initial comparison: `work/ui-comparison.png`.
- Final joint comparison: `work/ui-comparison-final.png`, source on left and implementation on right; source normalized to width390 (390×1327), implementation at width390, without stretching either image.
- State: real local test family with one saved recipe arranged for breakfast; other meals empty. Test records were not published or inserted into any user's family.
- Full-page capture includes the persistent navigation at the browser viewport position; normal scrolling makes the final dinner card accessible. The viewport capture is the correct representation of the first screen.
- Focused regions checked in browser: hero image, calendar, meal selection, editor, recipe detail and export preview. Text and controls inspected at native 390px viewport, not only in the scaled comparison board.

## Findings and iteration history

1. P2: Some original secondary labels used 9px and overly pale colors. Increased all 9–11px styles by one pixel and darkened calendar and meal helper text. Post-fix evidence in final captures. Heading contrast and hierarchy remain stronger than captions.
2. P1 observed during rebuild: hero image temporarily rendered as broken after the built preview's asset mapping became stale. Source and built PNG existed, but local asset response had an empty body. Restarted the preview on the unchanged final build. Re-captured and verified naturalWidth1391 with the image visibly restored. No application workaround or weaker checks added.
3. No remaining actionable P0/P1/P2 visual defects in this scoped redesign.

## Required fidelity surfaces

- Typography: system Chinese sans-serif for crisp native mobile text; heavier 27px page heading, 17px meal titles, readable secondary hierarchy. Product-specific copy now addresses the mother arranging baby's meals. Fonts intentionally do not mimic the source's promotional display headline exactly.
- Spacing/layout: 20px mobile page padding, 22–26px card corners, separate weekly date selector and three clear meal groups. No horizontal overflow (document scrollWidth390, viewport390). Fixed navigation remains visible and content has bottom padding.
- Colors: pale fresh green, creamy apricot and soft lavender distinguish meal groups; green selected date and actions; no green health claims or nutrition recommendations.
- Imagery: newly generated transparent baby bowl asset, mint bowl with vegetables/rice/egg and peach spoon; 1391×1131 PNG displayed with contain, no upscaling or text baked in. Existing recipe photos remain user-provided. Empty unphotographed recipes use an honest upload/recipe icon state, not fabricated food photos.
- Copy: “宝宝今天吃什么”, “宝宝的三餐”, “今日菜单”, “宝宝菜谱”, “家人共厨” establish intended audience. No copied restaurant subscription content or unrelated new features.

## Interaction verification

- Created an isolated local family via normal UI.
- Switched into recipe library, opened editor and saved a recipe.
- Selected the saved recipe for breakfast and confirmed the meal counter and row update.
- Opened recipe detail and exported PNG; natural dimensions verified780×1560 (390×780 logical one-screen ratio).
- Switched to next week and confirmed date2026-11-11 from2026-11-04.
- Checked browser console error logs: none at final verification.
- TypeScript and both production builds passed.

## Scope and known pre-existing gap

This is a UI redesign, not a repair of the known Cloudflare edge block on the hosted cloud API. Local storage/API integration was verified locally. The previously published GitHub frontend may still fail cloud requests on the user's network until that separate deployment issue is resolved. No weakening of invite protection, backend isolation, or replacement with browser-only persistence.

## Follow-up polish (P3)

Consider testing real recipe photos of several aspect ratios with the family after the cloud connection is restored. User photo cropping uses the existing cover behavior.
