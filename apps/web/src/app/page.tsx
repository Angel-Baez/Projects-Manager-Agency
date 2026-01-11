export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Projects Manager <span className="text-indigo-600">Agency</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Multi-tenant project management platform designed for agencies.
            Manage clients, projects, teams, and billing in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            title="Multi-Client"
            description="Manage multiple clients and their projects seamlessly"
            icon="👥"
          />
          <FeatureCard
            title="Real-time Collaboration"
            description="Team collaboration with live updates and notifications"
            icon="⚡"
          />
          <FeatureCard
            title="Integrated Billing"
            description="Stripe integration for invoices and payments"
            icon="💳"
          />
        </div>

        <div className="mt-12 space-y-4">
          <div className="text-sm text-gray-500">
            <p className="font-semibold mb-2">Tech Stack:</p>
            <p>
              Next.js 15 • NestJS • GraphQL • PostgreSQL • Drizzle ORM • Redis •
              Inngest • Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
