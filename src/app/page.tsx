export default function HomePage() {
  return (
    <main>
      <h1>SaaS Starter prêt</h1>
      <p>Stack: Next.js 15 + Prisma + PostgreSQL (Neon) + Vercel.</p>

      <div className="card">
        <h2>Endpoints</h2>
        <ul>
          <li>GET /api/health</li>
          <li>POST /api/orders</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Commande locale</h2>
        <pre>{`npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev`}</pre>
      </div>
    </main>
  );
}
