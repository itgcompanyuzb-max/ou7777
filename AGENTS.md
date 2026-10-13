<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- All displayed dates and times are derived from a fixed UTC+5 (Uzbekistan) offset using UTC getters in `src/lib/finance.ts`, and numbers are grouped by hand instead of `Intl.NumberFormat`. Why: SSR and the browser run in different timezones/locales, and any locale- or timezone-dependent formatting produces hydration mismatches.
- Route boundary components (`errorComponent`, `notFoundComponent`) must be typed with the router's own prop types (`ErrorComponentProps`, `NotFoundRouteProps`) rather than hand-written prop shapes. Why: the router declares these as async components with contravariant `error: unknown` props, and a narrower `error: Error` signature fails typecheck.
