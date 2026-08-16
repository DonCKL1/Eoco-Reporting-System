export default function TermsPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          By accessing and using the EOCO Reporting Portal, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          This portal is provided by the Economic and Organised Crime Office (EOCO) of Ghana. Your use of this service constitutes agreement to these terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Proper Use</h2>
        <p>
          You agree to use this portal solely for its intended purpose: reporting suspected economic and organised crimes. You must not submit false, malicious, or intentionally misleading information. Doing so may constitute an offense under Ghanaian law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Responsibility</h2>
        <p>
          If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Disclaimer</h2>
        <p>
          While EOCO strives to investigate all legitimate reports, submission of a report does not guarantee immediate action or a specific outcome. EOCO reserves the right to prioritize cases based on available resources and statutory mandates.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Modifications</h2>
        <p>
          EOCO reserves the right to modify these terms at any time. Continued use of the portal after changes are posted constitutes acceptance of the modified terms.
        </p>
      </div>
    </div>
  )
}
