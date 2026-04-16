import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { authPageRouteOptions } from '../lib/auth-guards'
import { useLoginMutation } from '../lib/auth-queries'

export const Route = createFileRoute('/login')({
  ...authPageRouteOptions,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/',
  }),
  component: LoginPage,
})

const loginSchema = z.object({
  email: z.email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginMutation.mutateAsync(values)
      await navigate({ to: search.redirect || '/' })
    } catch {
      /* surfaced via loginMutation */
    }
  }

  const highlights = ['Tarifs grossiste', 'Commandes', 'Devis']

  return (
    <main className="bg-(--surface) text-(--on-surface) min-h-screen font-sans">
      <div className="flex min-h-screen flex-col md:flex-row">
        <section className="tonal-layering bg-(--primary-container) relative w-full overflow-hidden p-12 md:w-[45%] md:p-20">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <span className="text-(--on-primary) font-headline text-3xl font-black tracking-tight italic">
                Fast-Agros
              </span>
            </div>

            <div className="mt-12 space-y-12">
              <h1 className="font-headline text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl">
                Votre plateforme d&apos;approvisionnement professionnel
              </h1>

              <ul className="m-0 list-none space-y-6 p-0">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-white/90">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <span className="text-(--primary-fixed)">✓</span>
                    </div>
                    <span className="font-headline text-lg font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-12 h-48 overflow-hidden rounded-xl shadow-2xl md:h-64">
              <img
                alt="Wholesale Agriculture Warehouse"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQpulU6SMlExHqNilwbu8s1dWyBbOXU9OvBJ0TpFqopyae7MM_BW-PeVDRrKCnVY7wECtfdjhp5z-mCPhd5JOjnC5J6BgeeyHmVIVogWygAEvUqCtZEy_74VApJo-AzXD-bvmfBUKWJTG60sUPJ4S2OAIxYsW9Bd-56QFmLov_xS8ppyFkwU5a8bzVfedQlzWkc8ZvmvSkGreHGdh4qiWJSc0x-svTQGFAmD9owgilFDItvSGey1gwpiFObWGiAvf4wwtZ0QYLHrI"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent" />
            </div>
          </div>
        </section>

        <section className="bg-(--surface) flex w-full items-center justify-center p-8 md:w-[55%] md:p-24">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-3">
              <h2 className="text-(--on-surface) font-headline text-3xl font-bold tracking-tight">
                Connexion a votre compte
              </h2>
              <p className="text-(--on-surface-variant) font-medium">
                Nouveau client?
                <Link to="/register" className="text-(--primary-container) ml-1 font-bold hover:underline">
                  Creez votre compte professionnel →
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              {loginMutation.isError ? (
                <p className="text-(--error) rounded-lg bg-(--error-container) px-4 py-3 text-sm">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : 'Échec de la connexion.'}
                </p>
              ) : null}

              <div className="space-y-2">
                <label
                  className="text-(--on-surface-variant) block text-xs font-bold tracking-[0.12em] uppercase"
                  htmlFor="email"
                >
                  Email professionnel
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nom@entreprise.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email')}
                  className="bg-(--surface-container-lowest) ring-(--outline-variant) focus:ring-(--primary-container) h-11 w-full rounded-lg border-none px-4 text-sm ring-1 ring-inset focus:ring-2 focus:outline-none"
                />
                {errors.email ? (
                  <p className="text-(--error) text-xs">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-(--on-surface-variant) block text-xs font-bold tracking-[0.12em] uppercase"
                    htmlFor="password"
                  >
                    Mot de passe
                  </label>
                  <a className="text-(--primary-container) text-xs font-bold hover:underline" href="#">
                    Mot de passe oublie?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  {...register('password')}
                  className="bg-(--surface-container-lowest) ring-(--outline-variant) focus:ring-(--primary-container) h-11 w-full rounded-lg border-none px-4 text-sm ring-1 ring-inset focus:ring-2 focus:outline-none"
                />
                {errors.password ? (
                  <p className="text-(--error) text-xs">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="bg-(--secondary-container) text-(--on-secondary-container) flex h-12 w-full items-center justify-center gap-2 rounded-lg font-headline font-bold shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60"
                >
                  {loginMutation.isPending ? 'Connexion…' : 'Se connecter'}
                  <span aria-hidden="true">→</span>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="grow border-t border-(--outline-variant)" />
                  <span className="text-(--outline) mx-4 shrink-0 text-xs font-bold tracking-[0.12em] uppercase">
                    OU
                  </span>
                  <div className="grow border-t border-(--outline-variant)" />
                </div>

                <button
                  type="button"
                  className="border-(--outline-variant) bg-(--surface-container-lowest) text-(--on-surface) hover:bg-(--surface-container-low) flex h-12 w-full items-center justify-center gap-3 rounded-lg border font-headline font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                  <img
                    alt="Google Logo"
                    className="h-5 w-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-UljQTPWcqcbghNvDmaSonxIAPhcZOQL-86mAUwAoXep-gNoatScx0CY8_yDMcfNzJB413VujuRoaswWbR93JMke2ToL46F4AjDAk8PWTd4Ug70lv7Ckdo2uUOyiOK31C2b5MJpAGomWkhPgDvcXUqUoLiDBeABR_LfRwfpLoWljQ3HP_ZC5M0Iucgu07Y9S-okwxttNG7EjtUeXNuI3oIgj9h2flntcgKlYRBXBJu9N_4CBYDM_DPQZf8HK5dbVrmmztNPyFkvM"
                  />
                  Continuer avec Google
                </button>
              </div>
            </form>

            <p className="text-(--on-surface-variant) text-center text-[10px] leading-relaxed tracking-[0.15em] uppercase">
              En vous connectant, vous acceptez nos <br />
              <a className="text-(--on-surface) font-bold underline" href="#">
                Conditions Generales d&apos;Utilisation
              </a>{' '}
              &amp;{' '}
              <a className="text-(--on-surface) font-bold underline" href="#">
                Politique de Confidentialite
              </a>
              .
            </p>

            <p className="text-(--on-surface-variant) text-center text-sm">
              <Link to="/" className="text-primary font-semibold hover:underline">
                Retour a l&apos;accueil
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
