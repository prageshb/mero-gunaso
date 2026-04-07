import { PublicLayout } from '@/components/layout/PublicLayout';
import { ComplaintForm } from '@/components/complaints/ComplaintForm';
const SubmitComplaint = () => {
  return (
    <PublicLayout>
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto animate-fade-in px-4">
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Register a Concern</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Your report helps local authorities improve our community. All reports are handled securely and distributed to Relevant Departments.
            </p>
          </div>
          <ComplaintForm />
        </div>
      </div>
    </PublicLayout>
  );
};
export default SubmitComplaint;