import { PublicLayout } from '@/components/layout/PublicLayout';
import { ComplaintForm } from '@/components/complaints/ComplaintForm';
const SubmitComplaint = () => {
  return (
    <PublicLayout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Submit a Complaint</h1>
            <p className="text-muted-foreground">
              Help us improve public services by reporting issues in your community.
            </p>
          </div>
          <ComplaintForm />
        </div>
      </div>
    </PublicLayout>
  );
};
export default SubmitComplaint;