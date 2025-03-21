
export default function DashboardLayout({ 
  children,
  apiKeys,
  apiPlans,
  docs
}: { 
  children: React.ReactNode, 
  apiKeys: React.ReactNode, 
  apiPlans: React.ReactNode, 
  docs: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}

      <div className="container mx-auto px-4 py-8">
        {apiPlans}
        {/* API Keys Section */}
        <div className="mb-8">
          {apiKeys}
        </div>

        {docs}
      </div>
    </div>
  )
}