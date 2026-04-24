import { getGoogleAuthStartUrl } from '../lib/api'

type GoogleSignInButtonProps = {
  /** In-app path after successful OAuth (e.g. `/` or `/checkout`). */
  redirectAfterLogin: string
}

export function GoogleSignInButton({ redirectAfterLogin }: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = getGoogleAuthStartUrl(redirectAfterLogin)
      }}
      className="border-(--outline-variant) bg-(--surface-container-lowest) text-(--on-surface) hover:bg-(--surface-container-low) flex h-12 w-full items-center justify-center gap-3 rounded-lg border font-headline font-bold shadow-sm transition-all active:scale-[0.98]"
    >
      <img
        alt="Google"
        className="h-5 w-5"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-UljQTPWcqcbghNvDmaSonxIAPhcZOQL-86mAUwAoXep-gNoatScx0CY8_yDMcfNzJB413VujuRoaswWbR93JMke2ToL46F4AjDAk8PWTd4Ug70lv7Ckdo2uUOyiOK31C2b5MJpAGomWkhPgDvcXUqUoLiDBeABR_LfRwfpLoWljQ3HP_ZC5M0Iucgu07Y9S-okwxttNG7EjtUeXNuI3oIgj9h2flntcgKlYRBXBJu9N_4CBYDM_DPQZf8HK5dbVrmmztNPyFkvM"
      />
      Continuer avec Google
    </button>
  )
}
