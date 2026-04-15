import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const accountTypes = [
    { value: 'grossiste', label: 'Grossiste', subtitle: 'Volume industriel' },
    { value: 'detailant', label: 'Detailant', subtitle: 'Commerce local' },
    { value: 'chr', label: 'CHR', subtitle: 'Hotellerie / Resto' },
    { value: 'export', label: 'Export', subtitle: 'International' },
  ] as const

  const steps = [
    { number: 1, label: 'Entreprise' },
    { number: 2, label: 'Compte' },
    { number: 3, label: 'Verification' },
  ] as const

  const [currentStep, setCurrentStep] = useState<number>(1)

  const registerSchema = z.object({
    companyName: z.string().trim().min(2, 'Raison sociale requise'),
    accountType: z.enum(['grossiste', 'detailant', 'chr', 'export'], {
      error: 'Selectionnez un type de compte',
    }),
    rcNumber: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || (value.length >= 5 && /^[A-Za-z0-9/\-\s]+$/.test(value)),
        'Numero RC invalide',
      ),
    nif: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || (value.length >= 8 && /^[0-9\s]+$/.test(value)),
        'NIF invalide',
      ),
    wilaya: z.string().trim().min(2, 'Wilaya requise'),
    address: z.string().trim().min(5, 'Adresse requise'),
    fullName: z.string().trim().min(2, 'Nom complet requis'),
    email: z.email('Email invalide'),
    phone: z
      .string()
      .trim()
      .min(8, 'Telephone invalide')
      .regex(/^[0-9+\s()-]+$/, 'Telephone invalide'),
    password: z.string().min(8, 'Mot de passe: minimum 8 caracteres'),
    confirmPassword: z.string().min(8, 'Confirmation requise'),
    acceptTerms: z.boolean().refine((value) => value, 'Vous devez accepter les conditions'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  })

  type RegisterFormValues = z.infer<typeof registerSchema>

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      companyName: '',
      accountType: undefined,
      rcNumber: '',
      nif: '',
      wilaya: '16 Alger',
      address: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    watch,
  } = form

  const selectedAccountType = watch('accountType')

  function onSubmit(data: RegisterFormValues) {
    console.log('Register step 1 payload', data)
  }

  async function goToNextStep() {
    if (currentStep === 1) {
      const valid = await trigger([
        'companyName',
        'accountType',
        'rcNumber',
        'nif',
        'wilaya',
        'address',
      ])
      if (!valid) return
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      const valid = await trigger([
        'fullName',
        'email',
        'phone',
        'password',
        'confirmPassword',
      ])
      if (!valid) return
      setCurrentStep(3)
    }
  }

  return (
    <main className="bg-(--surface) text-(--on-surface) min-h-screen selection:bg-(--secondary-container) selection:text-(--on-secondary-container)">
      <header className="bg-(--surface) sticky top-0 z-50 w-full px-8 py-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex w-full max-w-[1536px] items-center justify-center">
          <span className="font-headline text-2xl font-black tracking-tight text-[#1B5E20] italic">
            Fast-Agros
          </span>
        </div>
      </header>

      <section className="flex min-h-screen flex-col items-center px-6 py-12">
        <div className="mb-12 w-full max-w-[560px]">
          <div className="relative flex items-center justify-between">
            <div className="bg-(--surface-container-highest) absolute top-1/2 left-0 -z-10 h-0.5 w-full -translate-y-1/2" />
            {steps.map((step) => {
              const isActive = step.number === currentStep
              const isCompleted = step.number < currentStep
              return (
                <div key={step.label} className="bg-(--surface) flex flex-col items-center gap-2 px-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.number)}
                    aria-current={isActive ? 'step' : undefined}
                    className={[
                      'ring-(--surface) flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg font-bold ring-4 transition-colors',
                      isActive || isCompleted
                        ? 'bg-[#1B5E20] text-(--on-primary) shadow-lg'
                        : 'bg-(--surface-container-highest) text-(--on-surface-variant)',
                    ].join(' ')}
                  >
                    {step.number}
                  </button>
                  <span
                    className={[
                      'text-xs font-bold tracking-[0.14em] uppercase',
                      isActive || isCompleted
                        ? 'text-[#1B5E20]'
                        : 'text-(--on-surface-variant)',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full max-w-[560px] rounded-xl bg-(--surface-container-lowest) p-8 shadow-[0_32px_64px_-12px_rgba(27,94,32,0.06)] md:p-12">
          <header className="mb-10">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-(--on-surface)">
              Creez votre compte professionnel
            </h1>
            <p className="leading-relaxed text-(--on-surface-variant)">
              Remplissez les details de votre etablissement pour acceder aux tarifs
              de gros industriels.
            </p>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
            {currentStep === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                  Raison sociale
                </label>
                <input
                  type="text"
                  placeholder="ex: SARL Agri-Logistics"
                  aria-invalid={errors.companyName ? 'true' : 'false'}
                  {...register('companyName')}
                  className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                />
                {errors.companyName ? (
                  <p className="text-(--error) mt-1 text-xs">{errors.companyName.message}</p>
                ) : null}
              </div>

              <div>
                <label className="text-secondary mb-3 block text-xs font-bold tracking-[0.14em] uppercase">
                  Type de compte
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {accountTypes.map((type) => (
                    <label
                      key={type.value}
                      className="bg-(--surface-container-low) hover:bg-(--surface-container-highest) relative flex cursor-pointer items-center rounded-lg p-4 transition-colors"
                    >
                      <input
                        type="radio"
                        value={type.value}
                        className="peer hidden"
                        {...register('accountType')}
                      />
                      <div
                        className={[
                          'absolute inset-0 rounded-lg border-2 border-transparent transition-all',
                          selectedAccountType === type.value ? 'border-primary' : '',
                        ].join(' ')}
                      />
                      <div className="flex flex-col">
                        <span className="font-headline text-sm font-bold">{type.label}</span>
                        <span className="text-(--on-surface-variant) text-[10px] tracking-tight uppercase">
                          {type.subtitle}
                        </span>
                      </div>
                      <span
                        className={[
                          'text-primary ml-auto opacity-0',
                          selectedAccountType === type.value ? 'opacity-100' : '',
                        ].join(' ')}
                      >
                        ✓
                      </span>
                    </label>
                  ))}
                </div>
                {errors.accountType ? (
                  <p className="text-(--error) mt-1 text-xs">{errors.accountType.message}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Numero RC
                  </label>
                  <input
                    type="text"
                    placeholder="00/00-0000000-B-00"
                    aria-invalid={errors.rcNumber ? 'true' : 'false'}
                    {...register('rcNumber')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.rcNumber ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.rcNumber.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    NIF
                  </label>
                  <input
                    type="text"
                    placeholder="000 000 000 000 000"
                    aria-invalid={errors.nif ? 'true' : 'false'}
                    {...register('nif')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.nif ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.nif.message}</p>
                  ) : null}
                </div>
              </div>
            </div>
            ) : null}

            {currentStep === 2 ? (
            <div className="space-y-6">
              <h2 className="font-headline text-xl font-bold text-(--on-surface)">
                Informations du compte
              </h2>
              <div>
                <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                  Nom complet
                </label>
                <input
                  type="text"
                  placeholder="Nom et prenom"
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                  {...register('fullName')}
                  className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                />
                {errors.fullName ? (
                  <p className="text-(--error) mt-1 text-xs">{errors.fullName.message}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    placeholder="nom@entreprise.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.email ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.email.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Telephone
                  </label>
                  <input
                    type="text"
                    placeholder="+213 ..."
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    {...register('phone')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.phone ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.phone.message}</p>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    {...register('password')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.password ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.password.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Confirmer mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    {...register('confirmPassword')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.confirmPassword ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.confirmPassword.message}</p>
                  ) : null}
                </div>
              </div>
            </div>
            ) : null}

            {currentStep === 3 ? (
            <div className="space-y-6">
              <h2 className="font-headline text-xl font-bold text-(--on-surface)">
                Verification finale
              </h2>
              <p className="text-(--on-surface-variant) text-sm">
                Verifiez vos informations avant de terminer votre inscription.
              </p>
              <label className="bg-(--surface-container-low) flex items-start gap-3 rounded-lg p-4">
                <input type="checkbox" className="mt-0.5" {...register('acceptTerms')} />
                <span className="text-sm text-(--on-surface-variant)">
                  J&apos;accepte les conditions generales d&apos;utilisation et la politique
                  de confidentialite.
                </span>
              </label>
              {errors.acceptTerms ? (
                <p className="text-(--error) mt-1 text-xs">{errors.acceptTerms.message}</p>
              ) : null}
            </div>
            ) : null}

            {currentStep === 1 ? (
            <div className="space-y-6 pt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Wilaya
                  </label>
                  <select
                    {...register('wilaya')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full appearance-none rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  >
                    <option>01 Adrar</option>
                    <option>02 Chlef</option>
                    <option>06 Bejaia</option>
                    <option>16 Alger</option>
                    <option>31 Oran</option>
                  </select>
                  {errors.wilaya ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.wilaya.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-secondary mb-2 block text-xs font-bold tracking-[0.14em] uppercase">
                    Adresse
                  </label>
                  <input
                    type="text"
                    placeholder="Zone industrielle, Lot..."
                    aria-invalid={errors.address ? 'true' : 'false'}
                    {...register('address')}
                    className="bg-(--surface-container-low) focus:bg-(--surface-container-highest) focus:border-primary h-11 w-full rounded-lg border-0 border-b-2 border-transparent px-4 text-(--on-surface) transition-all focus:outline-none"
                  />
                  {errors.address ? (
                    <p className="text-(--error) mt-1 text-xs">{errors.address.message}</p>
                  ) : null}
                </div>
              </div>
            </div>
            ) : null}

            <div className="pt-8">
              <div className="flex items-center gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    className="bg-(--surface-container-high) text-(--on-surface) h-14 rounded-lg px-6 font-bold transition-all hover:opacity-90"
                  >
                    Retour
                  </button>
                ) : null}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-(--secondary-container) text-(--on-secondary-container) flex h-14 flex-1 items-center justify-center gap-2 rounded-lg text-lg font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Continuer
                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-(--secondary-container) text-(--on-secondary-container) flex h-14 flex-1 items-center justify-center gap-2 rounded-lg text-lg font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    {isSubmitting ? 'Validation...' : 'Terminer'}
                    <span aria-hidden="true">✓</span>
                  </button>
                )}
              </div>
              <p className="mt-6 text-center text-sm text-(--on-surface-variant)">
                Deja un compte?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="pointer-events-none mt-12 w-full max-w-[560px] select-none opacity-40 grayscale">
          <div className="rounded-xl bg-(--surface-container-high) p-8">
            <div className="mb-4 h-4 w-32 rounded bg-(--on-surface-variant)" />
            <div className="space-y-4">
              <div className="bg-(--surface) h-10 w-full rounded" />
              <div className="bg-(--surface) h-10 w-full rounded" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
